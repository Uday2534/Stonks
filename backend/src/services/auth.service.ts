import bcrypt from 'bcryptjs';

import prisma from '../prisma/client';
import AppError from '../utils/AppError';
import { signAccessToken } from '../utils/jwt';
import { LoginInput, RegisterInput } from '../validators/auth.validator';

export interface UserDto {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponseDto> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return {
      token: signAccessToken({ sub: user.id, email: user.email }),
      user: this.toUserDto(user),
    };
  }

  async login(input: LoginInput): Promise<AuthResponseDto> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    return {
      token: signAccessToken({ sub: user.id, email: user.email }),
      user: this.toUserDto(user),
    };
  }

  async getCurrentUser(userId: string): Promise<UserDto> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  private toUserDto(user: { id: string; email: string; createdAt: Date; updatedAt: Date }): UserDto {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
