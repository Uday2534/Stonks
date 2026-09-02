import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import AppError from '../utils/AppError';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsed = registerSchema.parse(req.body);

      const result = await this.authService.register(parsed);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new AppError(
            error.errors[0]?.message ?? 'Validation failed',
            400
          )
        );
        return;
      }

      if (error instanceof AppError) {
        next(error);
        return;
      }

      next(
        new AppError(
          'Failed to register user',
          500,
          error
        )
      );
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsed = loginSchema.parse(req.body);

      const result = await this.authService.login(parsed);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new AppError(
            error.errors[0]?.message ?? 'Validation failed',
            400
          )
        );
        return;
      }

      if (error instanceof AppError) {
        next(error);
        return;
      }

      next(
        new AppError(
          'Failed to login user',
          500,
          error
        )
      );
    }
  };

  me = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const user =
        await this.authService.getCurrentUser(
          userId
        );

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
        return;
      }

      next(
        new AppError(
          'Failed to fetch user profile',
          500,
          error
        )
      );
    }
  };
}