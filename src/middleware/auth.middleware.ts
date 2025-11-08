import { Response, NextFunction } from 'express';
import { verifyToken } from '../services/jwt.service';
import { CustomError } from './error.middleware';
import User from '../models/User';
import { AuthRequest } from '../shared/types';
import { ERROR_MESSAGES, HTTP_STATUS } from '../shared/constants';

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError(ERROR_MESSAGES.AUTH.REQUIRED, HTTP_STATUS.UNAUTHORIZED);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new CustomError(ERROR_MESSAGES.AUTH.REQUIRED, HTTP_STATUS.UNAUTHORIZED);
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw new CustomError(ERROR_MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (!user.isActive) {
      throw new CustomError(ERROR_MESSAGES.AUTH.ACCOUNT_INACTIVE, HTTP_STATUS.FORBIDDEN);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new CustomError(ERROR_MESSAGES.AUTH.REQUIRED, HTTP_STATUS.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError(
          `Access denied. Required role: ${roles.join(' or ')}`,
          HTTP_STATUS.FORBIDDEN
        )
      );
    }

    next();
  };
};

