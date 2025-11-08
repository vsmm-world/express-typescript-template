import jwt from 'jsonwebtoken';
import { JwtPayload } from '../shared/types';
import { CustomError } from '../middleware/error.middleware';
import { ERROR_MESSAGES, DEFAULTS } from '../shared/constants';

/**
 * Generate JWT token
 */
export const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new CustomError(ERROR_MESSAGES.AUTH.JWT_SECRET_MISSING, 500);
  }

  const payload: JwtPayload = { userId };
  const expiresIn = process.env.JWT_EXPIRES_IN || DEFAULTS.JWT_EXPIRES_IN;

  return jwt.sign(payload, jwtSecret, { expiresIn } as jwt.SignOptions) as string;
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new CustomError(ERROR_MESSAGES.AUTH.JWT_SECRET_MISSING, 500);
  }

  try {
    return jwt.verify(token, jwtSecret) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new CustomError(ERROR_MESSAGES.AUTH.INVALID_TOKEN, 401);
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new CustomError(ERROR_MESSAGES.AUTH.TOKEN_EXPIRED, 401);
    }
    throw error;
  }
};

