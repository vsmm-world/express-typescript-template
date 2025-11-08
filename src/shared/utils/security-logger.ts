import logger from './logger';

export interface SecurityEvent {
  type: 'AUTH_FAILURE' | 'AUTH_SUCCESS' | 'AUTH_LOCKED' | 'SUSPICIOUS_ACTIVITY' | 'RATE_LIMIT' | 'INVALID_TOKEN' | 'UNAUTHORIZED_ACCESS';
  userId?: string;
  email?: string;
  ip: string;
  userAgent?: string;
  path: string;
  method: string;
  details?: any;
  timestamp: Date;
}

/**
 * Security event logger
 * OWASP A09:2021 - Security Logging and Monitoring Failures
 */
class SecurityLogger {
  /**
   * Log security events
   */
  logEvent(event: SecurityEvent): void {
    const logMessage = `[SECURITY] ${event.type} - ${event.method} ${event.path}`;
    const logData = {
      type: event.type,
      userId: event.userId,
      email: event.email,
      ip: event.ip,
      userAgent: event.userAgent,
      path: event.path,
      method: event.method,
      details: event.details,
      timestamp: event.timestamp.toISOString(),
    };

    // Use appropriate log level based on event type
    switch (event.type) {
      case 'AUTH_FAILURE':
      case 'AUTH_LOCKED':
      case 'SUSPICIOUS_ACTIVITY':
      case 'UNAUTHORIZED_ACCESS':
        logger.warn(logMessage, logData);
        break;
      case 'AUTH_SUCCESS':
        logger.info(logMessage, logData);
        break;
      default:
        logger.warn(logMessage, logData);
    }
  }

  /**
   * Log authentication failure
   */
  logAuthFailure(email: string, ip: string, userAgent?: string, details?: any): void {
    this.logEvent({
      type: 'AUTH_FAILURE',
      email,
      ip,
      userAgent,
      path: '/api/auth/login',
      method: 'POST',
      details,
      timestamp: new Date(),
    });
  }

  /**
   * Log authentication success
   */
  logAuthSuccess(userId: string, email: string, ip: string, userAgent?: string): void {
    this.logEvent({
      type: 'AUTH_SUCCESS',
      userId,
      email,
      ip,
      userAgent,
      path: '/api/auth/login',
      method: 'POST',
      timestamp: new Date(),
    });
  }

  /**
   * Log account lockout
   */
  logAccountLocked(email: string, ip: string, userAgent?: string): void {
    this.logEvent({
      type: 'AUTH_LOCKED',
      email,
      ip,
      userAgent,
      path: '/api/auth/login',
      method: 'POST',
      timestamp: new Date(),
    });
  }

  /**
   * Log suspicious activity
   */
  logSuspiciousActivity(ip: string, path: string, method: string, details?: any, userAgent?: string): void {
    this.logEvent({
      type: 'SUSPICIOUS_ACTIVITY',
      ip,
      userAgent,
      path,
      method,
      details,
      timestamp: new Date(),
    });
  }

  /**
   * Log unauthorized access attempt
   */
  logUnauthorizedAccess(userId: string, path: string, method: string, ip: string, userAgent?: string): void {
    this.logEvent({
      type: 'UNAUTHORIZED_ACCESS',
      userId,
      ip,
      userAgent,
      path,
      method,
      timestamp: new Date(),
    });
  }

  /**
   * Log rate limit exceeded
   */
  logRateLimit(ip: string, path: string, method: string, userAgent?: string): void {
    this.logEvent({
      type: 'RATE_LIMIT',
      ip,
      userAgent,
      path,
      method,
      timestamp: new Date(),
    });
  }
}

const securityLogger = new SecurityLogger();
export default securityLogger;

