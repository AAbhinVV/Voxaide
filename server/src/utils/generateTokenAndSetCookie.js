import jwt from "jsonwebtoken";
import constants from "../config/constant.js";
import { redisClient } from "../server.js";

export const generateTokenAndSetCookie = async (res, userId) => {
	const accessToken = jwt.sign({ userId }, constants.access_token, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, constants.refresh_token, {
		expiresIn: "7d",
	});

	const refreshTokenKey = `refreshToken:${userId}`;

	await redisClient.set(
		refreshTokenKey,
		{ EX: 7 * 24 * 60 * 60 },
		refreshToken,
	);

	if (!accessToken || !refreshToken) {
		throw new Error("No tokens generated");
	}

	res.json({ accessToken });

	res.cookie("refreshToken", refreshToken, {
		signed: true,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 7 * 24 * 60 * 60 * 1000,
		sameSite: "strict",
		path: "http://localhost:5173",
	});

	return { accessToken, refreshToken };
};

export const verifyRefreshToken = async (token) => {
	try {
		const decoded = jwt.verify(token, constants.refresh_token);

		const storedToken = await redisClient.get(`refreshToken:${decoded.userId}`);

		if (storedToken === token) {
			return decoded;
		}
		return null;
	} catch (err) {
		return null;
	}
};

export const generateAccessToken = (userId, res) => {
	const accessToken = jwt.sign({ userId }, constants.access_token, {
		expiresIn: "15m",
	});

	res.json({ accessToken });
};

export const revokeRefreshToken = async (userId) => {
	await redisClient.del(`refreshToken:${userId}`);
};
