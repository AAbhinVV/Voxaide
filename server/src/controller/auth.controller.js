import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sanitize from "mongo-sanitize";
import { getVerifyEmailHtml } from "../../config/html.js";
import sendMail from "../../config/sendMail.js";
import { loginSchema, registerSchema } from "../../config/zod.js";
import User from "../../models/user.model.js";
import { redisClient } from "../../server.js";
import {
	generateAccessToken,
	generateTokenAndSetCookie,
	revokeRefreshToken,
	verifyRefreshToken,
} from "../../utils/generateTokenAndSetCookie.js";
import { generateVerificationToken } from "../../utils/generateVerificationToken.js";

const register = async (req, res) => {
	const sanitizedBody = sanitize(req.body);

	const validation = registerSchema.safeParse(sanitizedBody);

	if (!validation.success) {
		const zodErrors = validation.error;

		let firstErrorMessage = "Validation failed";
		let allError = [];

		if (zodErrors?.issues && Array.isArray(zodErrors.issues)) {
			allError = zodErrors.issues.map((issue) => ({
				field: issue.path ? issue.path.join(".") : "unknown",
				message: issue.message || "validation Error",
				code: issue.code,
			}));

			firstErrorMessage = allError[0]?.message || "Validation Error";
		}
		return res.status(400).json({ success: false, message: firstErrorMessage });
	}

	const { email, username, password, role } = validation.data;

	const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

	if (await redisClient.get(rateLimitKey)) {
		return res
			.status(429)
			.json({
				success: false,
				message: "Too many registration attempts. Please try again later.",
			});
	}

	await redisClient.set(rateLimitKey, "true", { EX: 60 });

	try {
		if (!username || !email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		const normalizedEmail = email.toLowerCase().trim();

		console.log("Normalized Email:", normalizedEmail); // Debugging line

		const userAlreadyExists = await User.findOne({ email: normalizedEmail });

		if (userAlreadyExists) {
			return res
				.status(400)
				.json({
					success: false,
					message: "User already exists",
					found: userAlreadyExists,
				});
		}

		const hashedpassword = bcrypt.hashSync(password, 10);
		const verificationToken = generateVerificationToken();
		const verifyKey = `verify-token:${verificationToken}`;

		const dataStore = JSON.stringify({
			email: normalizedEmail,
			username,
			role,
		});

		await redisClient.set(verifyKey, dataStore, { EX: 300 });

		// const subject = "Verify your email for account creation"
		// const html = getVerifyEmailHtml({email, verificationToken})

		// await sendMail({email, subject, html})

		const user = new User({
			email: normalizedEmail,
			passwordHash: hashedpassword,
			username,
			role,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 1 day
		});

		await user.save();

		//jwt
		const { accessToken, refreshToken } = generateTokenAndSetCookie(
			res,
			user._id,
		);

		res.status(201).json({
			success: true,
			user: {
				...user._doc,
				passwordHash: undefined,
			},
			access_token: accessToken,
			refresh_token: refreshToken,
			message: "Registration Successful",
		});
	} catch (error) {
		res.status(503).json({ success: false, message: error.message });
	}
};

const verifyUser = async (req, res) => {
	try {
		const { token } = req.params;

		if (!token) {
			return res
				.status(400)
				.json({ success: false, message: "Verification token is required" });
		}

		const verifyKey = `verify-token:${token}`;

		const userDataJson = await redisClient.get(verifyKey);

		if (!userDataJson) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Invalid or expired verification token",
				});
		}

		await redisClient.del(verifyKey);

		const userData = JSON.parse(userDataJson);

		const existingUser = await User.findOne({ email: userData.email });

		if (!existingUser) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		if (existingUser.isverified) {
			return res
				.status(200)
				.json({ success: true, message: "User already verified" });
		}

		existingUser.isVerified = true;
		existingUser.verifiedAt = new Date();

		await existingUser.save();

		return res
			.status(200)
			.json({ success: true, message: "Account verified successfully" });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const login = async (req, res) => {
	const sanitizedBody = sanitize(req.body);

	const validation = loginSchema.safeParse(sanitizedBody);

	if (!validation.success) {
		const zodErrors = validation.error;

		let firstErrorMessage = "Validation failed";
		let allError = [];

		if (zodErrors?.issues && Array.isArray(zodErrors.issues)) {
			allError = zodErrors.issues.map((issue) => ({
				field: issue.path ? issue.path.join(".") : "unknown",
				message: issue.message || "validation Error",
				code: issue.code,
			}));

			firstErrorMessage = allError[0]?.message || "Validation Error";
		}
		return res
			.status(400)
			.json({ success: false, message: "validation error" });
	}

	const { email, password } = validation.data;

	const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;

	// if(await redisClient.get(rateLimitKey)){
	//     return res.status(429).json({success: false, message: "Too many login attempts. Please try again later."})
	// }

	// await redisClient.set(rateLimitKey, 'true', {EX: 60});

	const attempts = await redisClient.get(rateLimitKey);

	if (attempts && Number(attempts) >= 5) {
		return res
			.status(429)
			.json({
				success: false,
				messsage: "Too many login attempts. Please try again in 10 minutes.",
			});
	}

	try {
		if (!email) {
			return res.status(400).json({ message: "Email is required" });
		}
		if (!password) {
			return res.status(400).json({ message: "Password is required" });
		}

		const normalizedEmail = email.toLowerCase().trim();

		const user = await User.findOne({ normalizedEmail });

		if (!user) {
			await redisClient
				.multi()
				.incr(rateLimitKey)
				.expire(rateLimitKey, 600) // 10 minutes
				.exec();
			return res.status(404).send({ message: "Invalid credentials" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

		if (!isPasswordValid) {
			return res.status(401).send({ message: "Invalid credentials" });
		}

		/***********OTP LOGIC*************/
		// const otp = Math.floor(100000 + Math.random() * 900000).toString();
		// const otpKey = `otp:${email}`;
		// await redisClient.set(otpKey, otp, {EX: 300}); // OTP valid for 5 minutes
		// const subject = 'OTP for verification';
		// const html = getOtpHtml({email, otp})
		// await sendMail({email, subject, html});

		// await redisClient.set(rateLimitKey, 'true', {EX: 60});

		// res.json({message: "OTP sent to your email. Please verify to complete login."});

		await redisClient.del(rateLimitKey); // Clear login attempts on successful login

		const { accessToken, refreshToken } = generateTokenAndSetCookie(
			res,
			user._id,
		);

		if (!accessToken || !refreshToken)
			throw new ExpressError(500, "No tokens generated");

		res.status(201).json({
			success: true,
			user: {
				...user._doc,
				passwordHash: undefined,
			},
			access_token: accessToken,
			refreshToken: refreshToken,
			message: "Login Successful",
		});
	} catch (error) {
		console.log(error.message);
		res.sendStatus(503);
	}
};

// const verifyOTP = async (req, res) => {
//     try {
//         const {email, otp} = req.body;

//         if(!email || !otp){
//             return res.status(400).json({success: false, message: "Please provide all details"});
//         }

//         const otpKey = `otp:${email}`;

//         const storedOtpString = await redisClient.get(otpKey);

//         if(!storedOtpString){
//             return res.status(400).json({success: false, message: "OTP expired"});
//         }

//         const storedOTP = JSON.parse(storedOtpString);

//         if(storedOTP !== otp){
//             return res.status(400).json({success: false, message: "Invalid OTP"});
//         }

//         await redisClient.del(otpKey);

//         let user = await User.findOne({email});

//         const tokenData = await generateTokenAndSetCookie(res, user._id);

//         res.status(200).json({
//             message: `Welcome`,
//             ...user._doc})
//     } catch (error) {
//         console.log(error.message)
//         res.sendStatus(503)
//     }
// }

const myProfile = async (req, res) => {
	try {
		const user = req.user;
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const logout = async (req, res) => {
	try {
		const userId = req.user._id;

		await revokeRefreshToken(userId);
		const cookies = req.signedCookies;
		if (!cookies?.refreshToken) return res.sendStatus(204);
		res.clearCookie("refreshToken", {
			signed: true,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			path: "http://localhost:5173",
		});

		res.clearCookie("accessToken");

		res.json({ message: "Logged out successfully" });
	} catch (error) {
		return res.status(503).json({ message: error.message });
	}
};

const refreshToken = async (req, res) => {
	try {
		const refreshToken =
			req.signedCookies?.refreshToken || req.cookies?.refreshToken;
		if (!refreshToken) {
			res.status(403).json({ message: "Forbidden" });
		}

		const decoded = await verifyRefreshToken(refreshToken);

		if (!decoded) {
			return res
				.status(403)
				.json({ message: "Forbidden: Invalid refresh token" });
		}

		generateAccessToken(decoded.userId, res);

		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, user) => {
				if (err) {
					return res
						.status(403)
						.json({ message: "Forbidden: Unauthorized refresh token" });
				}

				const founduser = await User.findOne({
					username: user.username,
					refreshToken: refreshToken,
				});

				if (!founduser) {
					return res
						.status(403)
						.json({ message: "Forbidden: Refresh token not found" });
				}

				const accessToken = jwt.sign(
					{ userId: user.userId, username: user.username },
					process.env.ACCESS_TOKEN_SECRET,
					{ expiresIn: "15m" },
				);

				res.json({ accessToken });

				return res.status(200).json({ message: "token generated succesfully" });
			},
		);
	} catch (error) {
		res.status(503).send(error.message);
	}
};

export default {
	register,
	login,
	logout,
	refreshToken,
	verifyUser,
	verifyOTP,
	myProfile,
};
