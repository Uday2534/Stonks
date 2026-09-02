import jwt from 'jsonwebtoken';

import env from '../config/env';

export interface AuthTokenPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const signAccessToken = (payload: { sub: string; email: string }): string =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });

export const verifyAccessToken = (token: string): AuthTokenPayload =>
  jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
