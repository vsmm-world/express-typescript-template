import User from '../../models/User';
import { CreateUserDto, UpdateUserDto } from './user.types';
import { ERROR_MESSAGES, HTTP_STATUS, USER_ROLES, SUCCESS_MESSAGES } from '../../shared/constants';
import logger from '../../shared/utils/logger';
import { ServiceResponse } from '../../shared/types';

/**
 * Get all users with pagination
 */
export const getAllUsers = async (
  page: number,
  limit: number
): Promise<ServiceResponse> => {
  try {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({ isActive: true })
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments({ isActive: true }),
    ]);

    return {
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      statusCode: HTTP_STATUS.OK,
    };
  } catch (error: any) {
    logger.error('Error in getAllUsers service:', error);
    return {
      success: false,
      error: error.message || 'Failed to get users',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<ServiceResponse> => {
  try {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER.NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      };
    }

    return {
      success: true,
      data: { user },
      statusCode: HTTP_STATUS.OK,
    };
  } catch (error: any) {
    logger.error('Error in getUserById service:', error);
    return {
      success: false,
      error: error.message || 'Failed to get user',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }
};

/**
 * Create a new user
 */
export const createUser = async (data: CreateUserDto): Promise<ServiceResponse> => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER.EMAIL_EXISTS,
        statusCode: HTTP_STATUS.CONFLICT,
      };
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || USER_ROLES.USER,
    });

    logger.info(`New user created by admin: ${data.email}`);

    return {
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      },
      statusCode: HTTP_STATUS.CREATED,
    };
  } catch (error: any) {
    logger.error('Error in createUser service:', error);
    return {
      success: false,
      error: error.message || 'Failed to create user',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }
};

/**
 * Update user
 */
export const updateUser = async (
  userId: string,
  data: UpdateUserDto,
  currentUserRole?: string
): Promise<ServiceResponse> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER.NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      };
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        return {
          success: false,
          error: ERROR_MESSAGES.USER.EMAIL_IN_USE,
          statusCode: HTTP_STATUS.CONFLICT,
        };
      }
    }

    // Update user fields
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.password) user.password = data.password;
    
    // Only admins can change role and isActive
    if (currentUserRole === 'admin') {
      if (data.role) user.role = data.role;
      if (typeof data.isActive === 'boolean') user.isActive = data.isActive;
    }

    await user.save();

    logger.info(`User updated: ${user.email}`);

    return {
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          updatedAt: user.updatedAt,
        },
      },
      statusCode: HTTP_STATUS.OK,
    };
  } catch (error: any) {
    logger.error('Error in updateUser service:', error);
    return {
      success: false,
      error: error.message || 'Failed to update user',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }
};

/**
 * Delete user (soft delete)
 */
export const deleteUser = async (
  userId: string,
  currentUserId: string
): Promise<ServiceResponse> => {
  try {
    // Prevent self-deletion
    if (currentUserId === userId) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER.CANNOT_DELETE_SELF,
        statusCode: HTTP_STATUS.BAD_REQUEST,
      };
    }

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER.NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      };
    }

    // Soft delete by setting isActive to false
    user.isActive = false;
    await user.save();

    logger.info(`User deactivated: ${user.email}`);

    return {
      success: true,
      data: { message: SUCCESS_MESSAGES.USER.DELETED },
      statusCode: HTTP_STATUS.OK,
    };
  } catch (error: any) {
    logger.error('Error in deleteUser service:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete user',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }
};

