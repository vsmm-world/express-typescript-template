import { Request, Response, NextFunction } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './user.service';
import { sendSuccess, sendSuccessWithPagination, sendError } from '../../shared/helpers/response.helper';
import { getPaginationParams } from '../../shared/helpers/pagination.helper';
import { UpdateUserDto, CreateUserDto } from './user.types';
import { AuthRequest } from '../../shared/types';

/**
 * Get all users with pagination
 */
export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = getPaginationParams(req);
    const result = await getAllUsers(page, limit);

    if (!result.success) {
      sendError(res, result.error!, result.statusCode!);
      return;
    }

    sendSuccessWithPagination(
      res,
      result.data!.users,
      result.data!.pagination,
      result.statusCode!
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await getUserById(id);

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
 * Create a new user
 */
export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: CreateUserDto = req.body;
    const result = await createUser(data);

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
 * Update user
 */
export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data: UpdateUserDto = req.body;
    const authReq = req as AuthRequest;
    const currentUserRole = authReq.user?.role;

    const result = await updateUser(id, data, currentUserRole);

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
 * Delete user (soft delete)
 */
export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const currentUserId = authReq.user?._id.toString() || '';

    const result = await deleteUser(id, currentUserId);

    if (!result.success) {
      sendError(res, result.error!, result.statusCode!);
      return;
    }

    sendSuccess(res, result.data, result.statusCode!);
  } catch (error) {
    next(error);
  }
};

