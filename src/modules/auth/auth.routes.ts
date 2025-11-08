import { Router } from 'express';
import { register, login, getMe } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { authLimiter, registerLimiter } from '../../middleware/rate-limit.middleware';
import { registerValidation, loginValidation } from './auth.validations';

const router = Router();

// Routes with OWASP A07:2021 - Stricter rate limiting for auth endpoints
router.post('/register', registerLimiter, registerValidation, validateRequest, register);
router.post('/login', authLimiter, loginValidation, validateRequest, login);
router.get('/me', authenticate, getMe);

export default router;

