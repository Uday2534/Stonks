import { NextFunction, Request, Response } from 'express';

import AppError from '../utils/AppError';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    message: 'Internal server error',
  });
};
