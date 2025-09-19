import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
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

  if (!accessToken || !refreshToken) {
    throw new Error('No tokens generated');
  }

  res.cookie('accessToken', accessToken, {
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000,
    sameSite: 'Strict',
    path: "http://localhost:5173",
  });

  res.cookie('refreshToken',refreshToken, {
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7*24*60*60*1000,
    sameSite: 'Strict',
    path: "http://localhost:5173",
  });

  return { accessToken, refreshToken };
}