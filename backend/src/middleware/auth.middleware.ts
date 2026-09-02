import { NextFunction, Request, Response } from 'express';

import AppError from '../utils/AppError';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('Unauthorized', 401));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};
