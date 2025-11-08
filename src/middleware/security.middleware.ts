import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

/**
 * Enhanced security headers configuration
 * OWASP A05:2021 - Security Misconfiguration
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  frameguard: { action: 'deny' },
});

/**
 * Request size limits
 * OWASP A03:2021 - Injection (prevent DoS via large payloads)
 */
export const requestSizeLimits = {
  json: { limit: '10mb' },
  urlencoded: { limit: '10mb', extended: true },
};

/**
 * Remove sensitive headers from response
 * OWASP A05:2021 - Security Misconfiguration
 */
export const removeSensitiveHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Remove server information
  res.removeHeader('X-Powered-By');
  next();
};

/**
 * Security logging middleware
 * OWASP A09:2021 - Security Logging and Monitoring Failures
 */
export const securityLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Log security-relevant events
  const securityEvents: string[] = [];

  // Check for suspicious patterns
  if (req.body && typeof req.body === 'object') {
    const bodyStr = JSON.stringify(req.body).toLowerCase();
    const suspiciousPatterns = [
      '<script',
      'javascript:',
      'onerror=',
      'onload=',
      'eval(',
      'expression(',
    ];

    suspiciousPatterns.forEach((pattern) => {
      if (bodyStr.includes(pattern)) {
        securityEvents.push(`Suspicious pattern detected: ${pattern}`);
      }
    });
  }

  // Log if security events detected
  if (securityEvents.length > 0) {
    const logger = require('../shared/utils/logger').default;
    logger.warn('Security event detected', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      events: securityEvents,
      userAgent: req.get('user-agent'),
    });
  }

  next();
};

