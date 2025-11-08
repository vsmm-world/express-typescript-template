import { Router } from 'express';
import {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
} from './user.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import {
  createUserValidation,
  updateUserValidation,
  mongoIdValidation,
} from './user.validations';
import { USER_ROLES } from '../../shared/constants';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllUsersController);
router.get('/:id', mongoIdValidation, validateRequest, getUserByIdController);
router.post(
  '/',
  authorize(USER_ROLES.ADMIN),
  createUserValidation,
  validateRequest,
  createUserController
);
router.put(
  '/:id',
  mongoIdValidation,
  updateUserValidation,
  validateRequest,
  updateUserController
);
router.delete(
  '/:id',
  mongoIdValidation,
  authorize(USER_ROLES.ADMIN),
  validateRequest,
  deleteUserController
);

export default router;

