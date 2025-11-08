import rateLimit from 'express-rate-limit';
import { DEFAULTS } from '../shared/constants';

/**
 * General API rate limiter
 * OWASP A07:2021 - Identification and Authentication Failures
 */
export const apiLimiter = rateLimit({
  windowMs: DEFAULTS.RATE_LIMIT.WINDOW_MS,
  max: DEFAULTS.RATE_LIMIT.MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * OWASP A07:2021 - Identification and Authentication Failures
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Strict rate limiter for registration
 * OWASP A07:2021 - Identification and Authentication Failures
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registrations per hour
  message: 'Too many registration attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

