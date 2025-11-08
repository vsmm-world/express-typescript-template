// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

// Default Values
export const DEFAULTS = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
  },
  JWT_EXPIRES_IN: '7d',
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTH: {
    REQUIRED: 'Authentication required. Please provide a valid token.',
    INVALID_TOKEN: 'Invalid token',
    TOKEN_EXPIRED: 'Token expired',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_INACTIVE: 'Account is inactive. Please contact administrator.',
    JWT_SECRET_MISSING: 'JWT secret not configured',
  },
  USER: {
    NOT_FOUND: 'User not found',
    EMAIL_EXISTS: 'User with this email already exists',
    EMAIL_IN_USE: 'Email already in use',
    CANNOT_DELETE_SELF: 'You cannot delete your own account',
  },
  VALIDATION: {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please provide a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
    PASSWORD_WEAK: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    NAME_TOO_SHORT: 'Name must be between 2 and 50 characters',
    INVALID_ROLE: 'Role must be either "user" or "admin"',
    INVALID_USER_ID: 'Invalid user ID format',
  },
  SERVER: {
    INTERNAL_ERROR: 'Internal Server Error',
    ROUTE_NOT_FOUND: 'Route not found',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER: {
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deactivated successfully',
  },
} as const;

