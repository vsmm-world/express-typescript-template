import { Response } from 'express';
import { HTTP_STATUS } from '../constants';
import { ApiResponse } from '../types';

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = HTTP_STATUS.OK
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  res.status(statusCode).json(response);
};

/**
 * Send success response with pagination
 */
export const sendSuccessWithPagination = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  statusCode: number = HTTP_STATUS.OK
): void => {
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    pagination: {
      ...pagination,
      pages: Math.ceil(pagination.total / pagination.limit),
    },
  };
  res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  stack?: string
): void => {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && stack && { stack }),
    },
  };
  res.status(statusCode).json(response);
};

/**
 * Send validation error response
 */
export const sendValidationError = (
  res: Response,
  errors: Array<{ field?: string; message: string }>
): void => {
  const response: ApiResponse = {
    success: false,
    error: {
      message: 'Validation failed',
    },
    data: { errors },
  };
  res.status(HTTP_STATUS.BAD_REQUEST).json(response);
};

