import User from '../../models/User';
import { RegisterDto, LoginDto } from './auth.types';
import { generateToken } from '../../services/jwt.service';
import { ERROR_MESSAGES, HTTP_STATUS, USER_ROLES } from '../../shared/constants';
import logger from '../../shared/utils/logger';
import securityLogger from '../../shared/utils/security-logger';
import { ServiceResponse } from '../../shared/types';

/**
 * Register a new user
 */
export const registerUser = async (data: RegisterDto): Promise<ServiceResponse> => {
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

    // Create user
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || USER_ROLES.USER,
    });

    // Generate token
    const token = generateToken(user._id.toString());

    logger.info(`New user registered: ${data.email}`);

    return {
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      statusCode: HTTP_STATUS.CREATED,
    };
  } catch (error: any) {
    logger.error('Error in registerUser service:', error);
    return {
      success: false,
      error: error.message || 'Failed to register user',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }
};

/**
 * Login user
 * OWASP A07:2021 - Identification and Authentication Failures
 * Includes account lockout protection
 */
export const loginUser = async (
  data: LoginDto,
  ip?: string,
  userAgent?: string
): Promise<ServiceResponse> => {
  try {
    // Find user and include password
    const user = await User.findOne({ email: data.email }).select('+password');

    if (!user) {
      // Log failed login attempt
      if (ip) {
        securityLogger.logAuthFailure(data.email, ip, userAgent);
      }
      return {
        success: false,
        error: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        statusCode: HTTP_STATUS.UNAUTHORIZED,
      };
    }

    // Check if account is locked
    // OWASP A07:2021 - Account lockout after failed attempts
    if (user.isLocked()) {
      if (ip) {
        securityLogger.logAccountLocked(data.email, ip, userAgent);
      }
      return {
        success: false,
        error: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
        statusCode: HTTP_STATUS.FORBIDDEN,
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        error: ERROR_MESSAGES.AUTH.ACCOUNT_INACTIVE,
        statusCode: HTTP_STATUS.FORBIDDEN,
      };
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(data.password);

    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      // Reload user to get updated lock status
      await user.save();
      
      // Log failed login attempt
      if (ip) {
        securityLogger.logAuthFailure(data.email, ip, userAgent, {
          attempts: user.loginAttempts,
        });
      }

      return {
        success: false,
        error: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        statusCode: HTTP_STATUS.UNAUTHORIZED,
      };
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate token
    const token = generateToken(user._id.toString());

    // Log successful login
    if (ip) {
      securityLogger.logAuthSuccess(user._id.toString(), data.email, ip, userAgent);
    }

    logger.info(`User logged in: ${data.email}`);

    return {
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      statusCode: HTTP_STATUS.OK,
    };
  } catch (error: any) {
    logger.error('Error in loginUser service:', error);
    return {
      success: false,
      error: error.message || 'Failed to login user',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }
};

/**
 * Get user by ID (for /me endpoint)
 */
export const getCurrentUser = async (userId: string): Promise<ServiceResponse> => {
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
      statusCode: HTTP_STATUS.OK,
    };
  } catch (error: any) {
    logger.error('Error in getCurrentUser service:', error);
    return {
      success: false,
      error: error.message || 'Failed to get user',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }
};

