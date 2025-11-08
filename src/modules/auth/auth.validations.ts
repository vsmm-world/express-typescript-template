import { ValidationChain, body } from 'express-validator';
import { ERROR_MESSAGES } from '../../shared/constants';

/**
 * Validation rules for user registration
 */
export const registerValidation: ValidationChain[] = [
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
 * Validation rules for user login
 */
export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  body('password')
    .notEmpty()
    .withMessage(ERROR_MESSAGES.VALIDATION.REQUIRED),
];

