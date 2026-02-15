import jwt from "jsonwebtoken";
import env from "../config/env.js";
import {redisClient} from "../../server.js"

export const generateTokenAndSetCookie = async (res, userId) => {
	const accessToken = jwt.sign({ userId }, env.access_token, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, env.refresh_token, {
		expiresIn: "7d",
	});

	const refreshTokenKey = `refreshToken:${userId}`;

	await redisClient.set(
		refreshTokenKey,
		refreshToken,
		{ EX: 7 * 24 * 60 * 60 },
	);

	if (!accessToken || !refreshToken) {
		throw new Error("No tokens generated");
	}

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 15 * 60 * 1000, // 15 minutes
		sameSite: "strict",
		path: "/",
	});

	res.cookie("refreshToken", refreshToken, {
		signed: true,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 7 * 24 * 60 * 60 * 1000,
		sameSite: "strict",
		path: "/",
	});

	return { accessToken, refreshToken };
};

export const verifyRefreshToken = async (token) => {
	try {
		const decoded = jwt.verify(token, env.refresh_token);

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
	const accessToken = jwt.sign({ userId }, env.access_token, {
		expiresIn: "15m",
	});

	return accessToken
};

export const revokeRefreshToken = async (userId) => {
	await redisClient.del(`refreshToken:${userId}`);
};
