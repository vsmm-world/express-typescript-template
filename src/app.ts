import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import connectDB from "./config/db";
import { authRoutes } from "./modules/auth";
import { userRoutes } from "./modules/user";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import {
  securityHeaders,
  removeSensitiveHeaders,
  securityLogger,
  requestSizeLimits,
} from "./middleware/security.middleware";
import { sanitizeInput } from "./middleware/sanitization.middleware";
import { apiLimiter } from "./middleware/rate-limit.middleware";
import logger from "./shared/utils/logger";
import { sendSuccess } from "./shared/helpers/response.helper";

// Load environment variables
dotenv.config();

const app: Application = express();

// Connect to database
connectDB();

// OWASP A05:2021 - Security Misconfiguration
// Enhanced security headers
app.use(securityHeaders);
app.use(removeSensitiveHeaders);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// OWASP A03:2021 - Injection
// Input sanitization (must be before body parser)
app.use(sanitizeInput);

// OWASP A09:2021 - Security Logging and Monitoring
// Security event logging
app.use(securityLogger);

// OWASP A03:2021 - Injection (prevent DoS via large payloads)
// Body parser with size limits
app.use(express.json(requestSizeLimits.json));
app.use(express.urlencoded(requestSizeLimits.urlencoded));

// OWASP A07:2021 - Identification and Authentication Failures
// Rate limiting
app.use("/api/", apiLimiter);

// Request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

// Root route - API information (HTML page)
app.get("/", (_req, res) => {
  // Handle path resolution for both local and Vercel environments
  let viewsPath: string;
  
  try {
    if (process.env.VERCEL) {
      // On Vercel, api/index.js is at the root, so we need to go up and into dist/src/views
      // __dirname in api/index.js points to /var/task/api
      viewsPath = path.join(process.cwd(), "dist", "src", "views", "index.html");
      
      // Alternative: try relative to __dirname
      const altPath = path.join(__dirname, "..", "..", "dist", "src", "views", "index.html");
      if (fs.existsSync(altPath)) {
        viewsPath = altPath;
      }
    } else {
      // Local development
      const isProduction = process.env.NODE_ENV === "production";
      if (isProduction) {
        viewsPath = path.join(process.cwd(), "dist", "src", "views", "index.html");
      } else {
        viewsPath = path.join(process.cwd(), "src", "views", "index.html");
      }
    }
    
    // Check if file exists before sending
    if (fs.existsSync(viewsPath)) {
      res.sendFile(viewsPath);
    } else {
      logger.warn("HTML file not found at:", viewsPath);
      logger.warn("Current working directory:", process.cwd());
      logger.warn("__dirname:", __dirname);
      
      // Try alternative paths
      const alternatives = [
        path.join(process.cwd(), "src", "views", "index.html"),
        path.join(__dirname, "views", "index.html"),
        path.join(__dirname, "..", "views", "index.html"),
        path.join(__dirname, "..", "src", "views", "index.html"),
      ];
      
      let found = false;
      for (const altPath of alternatives) {
        if (fs.existsSync(altPath)) {
          res.sendFile(altPath);
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Fallback to JSON response if HTML file not found
        sendSuccess(res, {
          message: "Express API Server",
          version: "1.0.0",
          timestamp: new Date().toISOString(),
          note: "HTML view not available, serving JSON instead",
        });
      }
    }
  } catch (error) {
    logger.error("Error in root route:", error);
    sendSuccess(res, {
      message: "Express API Server",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  }
});

// Health check route
app.get("/health", (_req, res) => {
  sendSuccess(res, {
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server (only if not in Vercel serverless environment)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

export default app;
