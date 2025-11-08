import { Request } from 'express';
import { IUser } from '../../models/User';

// Extended Request with User
export interface AuthRequest extends Request {
  user?: IUser;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Pagination Query
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

// Note: Module-specific DTOs are now in their respective modules
// (e.g., auth.types.ts, user.types.ts)

// JWT Payload
export interface JwtPayload {
  userId: string;
}

// Service Response Types
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

