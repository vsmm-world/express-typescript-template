import { ValidationChain, body, param } from 'express-validator';
import { ERROR_MESSAGES } from '../../shared/constants';

/**
 * Validation rules for creating a user
 */
export const createUserValidation: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(ERROR_MESSAGES.VALIDATION.NAME_TOO_SHORT),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  body('password')
    .isLength({ min: 6 })
    .withMessage(ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(ERROR_MESSAGES.VALIDATION.PASSWORD_WEAK),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage(ERROR_MESSAGES.VALIDATION.INVALID_ROLE),
];

/**
 * Validation rules for updating a user
 */
export const updateUserValidation: ValidationChain[] = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(ERROR_MESSAGES.VALIDATION.NAME_TOO_SHORT),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage(ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(ERROR_MESSAGES.VALIDATION.PASSWORD_WEAK),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage(ERROR_MESSAGES.VALIDATION.INVALID_ROLE),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

/**
 * Validation rule for MongoDB ID parameter
 */
export const mongoIdValidation = param('id')
  .isMongoId()
  .withMessage(ERROR_MESSAGES.VALIDATION.INVALID_USER_ID);

