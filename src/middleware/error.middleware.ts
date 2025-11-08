import { Request, Response, NextFunction } from 'express';
import logger from '../shared/utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../shared/constants';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  
  // OWASP A05:2021 - Security Misconfiguration
  // Don't expose internal error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const message = isDevelopment 
    ? (err.message || ERROR_MESSAGES.SERVER.INTERNAL_ERROR)
    : statusCode >= 500
    ? ERROR_MESSAGES.SERVER.INTERNAL_ERROR
    : err.message || ERROR_MESSAGES.SERVER.INTERNAL_ERROR;

  // Log error
  logger.error(`Error ${statusCode}: ${message}`, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: isDevelopment ? err.stack : undefined,
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(isDevelopment && { stack: err.stack }),
    },
  });
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new CustomError(
    `${ERROR_MESSAGES.SERVER.ROUTE_NOT_FOUND}: ${req.originalUrl}`,
    HTTP_STATUS.NOT_FOUND
  );
  next(error);
};

