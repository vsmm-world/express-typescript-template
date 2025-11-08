import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getCurrentUser } from './auth.service';
import { sendSuccess, sendError } from '../../shared/helpers/response.helper';
import { RegisterDto, LoginDto } from './auth.types';
import { AuthRequest } from '../../shared/types';

/**
 * Register a new user
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: RegisterDto = req.body;
    const result = await registerUser(data);

    if (!result.success) {
      sendError(res, result.error!, result.statusCode!);
      return;
    }

    sendSuccess(res, result.data, result.statusCode!);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: LoginDto = req.body;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent');
    
    const result = await loginUser(data, ip, userAgent);

    if (!result.success) {
      sendError(res, result.error!, result.statusCode!);
      return;
    }

    sendSuccess(res, result.data, result.statusCode!);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      sendError(res, 'User not found', 404);
      return;
    }

    const result = await getCurrentUser(authReq.user._id.toString());

    if (!result.success) {
      sendError(res, result.error!, result.statusCode!);
      return;
    }

    sendSuccess(res, result.data, result.statusCode!);
  } catch (error) {
    next(error);
  }
};

