import jwt from 'jsonwebtoken';
import { redisClient } from '../server';

export const generateTokenAndSetCookie = async (res, userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  const refreshTokenKey = `refreshToken:${userId}`; 

  await redisClient.set(refreshTokenKey, { EX: 7 * 24 * 60 * 60 }, refreshToken);

  if (!accessToken || !refreshToken) {
    throw new Error('No tokens generated');
  }

  res.json({accessToken});

  res.cookie('refreshToken',refreshToken, {
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7*24*60*60*1000,
    sameSite: 'strict',
    path: "http://localhost:5173",
  });

  return { accessToken, refreshToken };
}