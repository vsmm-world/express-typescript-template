import { Response, NextFunction } from 'express';
import { CustomError } from './error.middleware';
import { AuthRequest } from '../shared/types';
import { ERROR_MESSAGES, HTTP_STATUS } from '../shared/constants';
import securityLogger from '../shared/utils/security-logger';

/**
 * Enhanced authorization middleware
 * OWASP A01:2021 - Broken Access Control
 * Ensures proper role-based access control
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new CustomError(ERROR_MESSAGES.AUTH.REQUIRED, HTTP_STATUS.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Log unauthorized access attempt
      securityLogger.logUnauthorizedAccess(
        req.user._id.toString(),
        req.path,
        req.method,
        req.ip || 'unknown',
        req.get('user-agent')
      );

      return next(
        new CustomError(
          `Access denied. Required role: ${allowedRoles.join(' or ')}`,
          HTTP_STATUS.FORBIDDEN
        )
      );
    }

    next();
  };
};

/**
 * Check if user owns the resource or is admin
 * OWASP A01:2021 - Broken Access Control
 */
export const requireOwnershipOrAdmin = (resourceUserId: string) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new CustomError(ERROR_MESSAGES.AUTH.REQUIRED, HTTP_STATUS.UNAUTHORIZED));
    }

    const isOwner = req.user._id.toString() === resourceUserId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      securityLogger.logUnauthorizedAccess(
        req.user._id.toString(),
        req.path,
        req.method,
        req.ip || 'unknown',
        req.get('user-agent')
      );

      return next(
        new CustomError('Access denied. You can only access your own resources.', HTTP_STATUS.FORBIDDEN)
      );
    }

    next();
  };
};

