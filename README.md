# Express Vercel API

A robust, scalable Express.js API with TypeScript, featuring a clean module-based architecture, user CRUD operations, and comprehensive authentication with validation.

## Features

- ✅ **Module-Based Architecture** - Clean, scalable, feature-based code organization
- ✅ **User CRUD Operations** - Create, Read, Update, Delete users
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - Bcrypt for secure password storage
- ✅ **Input Validation** - Express-validator for request validation
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Role-Based Access Control** - User and Admin roles
- ✅ **Rate Limiting** - Protection against brute force attacks
- ✅ **Security Headers** - Helmet.js for security
- ✅ **MongoDB Integration** - Mongoose ODM
- ✅ **TypeScript** - Full type safety
- ✅ **Vercel Ready** - Serverless function deployment

## Project Structure

```
express-api/
├─ api/
│  └─ index.ts                    # Vercel serverless entry point
├─ src/
│  ├─ modules/                    # Feature modules (self-contained)
│  │  ├─ auth/                    # Authentication module
│  │  │  ├─ auth.controller.ts    # Auth request handlers
│  │  │  ├─ auth.service.ts        # Auth business logic
│  │  │  ├─ auth.routes.ts         # Auth route definitions
│  │  │  ├─ auth.types.ts          # Auth-specific types/DTOs
│  │  │  ├─ auth.validations.ts    # Auth validation rules
│  │  │  └─ index.ts               # Module exports
│  │  │
│  │  └─ user/                     # User management module
│  │     ├─ user.controller.ts     # User request handlers
│  │     ├─ user.service.ts        # User business logic
│  │     ├─ user.routes.ts         # User route definitions
│  │     ├─ user.types.ts          # User-specific types/DTOs
│  │     ├─ user.validations.ts    # User validation rules
│  │     └─ index.ts               # Module exports
│  │
│  ├─ services/                    # Shared services
│  │  └─ jwt.service.ts            # JWT token operations
│  │
│  ├─ middleware/                  # Express middleware
│  │  ├─ auth.middleware.ts        # JWT authentication middleware
│  │  ├─ error.middleware.ts       # Error handling middleware
│  │  └─ validation.middleware.ts  # Request validation middleware
│  │
│  ├─ models/                      # Database models
│  │  └─ User.ts                   # User model/schema
│  │
│  ├─ config/                      # Configuration files
│  │  └─ db.ts                     # Database configuration
│  │
│  ├─ shared/                      # Shared utilities & constants
│  │  ├─ constants/
│  │  │  └─ index.ts              # All constants (HTTP status, errors, etc.)
│  │  ├─ types/
│  │  │  └─ index.ts              # Shared TypeScript types
│  │  ├─ helpers/
│  │  │  ├─ response.helper.ts    # API response helpers
│  │  │  └─ pagination.helper.ts   # Pagination utilities
│  │  └─ utils/
│  │     └─ logger.ts             # Logging utility
│  │
│  ├─ views/                       # HTML views
│  │  └─ index.html                # API documentation page
│  │
│  └─ app.ts                       # Express app setup
├─ scripts/
│  └─ copy-views.js                # Build script for copying views
├─ vercel.json                     # Vercel configuration
└─ package.json
```

## Architecture

### Module-Based Structure

The project follows a **module-based architecture** where each feature is self-contained in its own module. Each module includes:

- **Controller** - Handles HTTP requests and responses
- **Service** - Contains business logic
- **Routes** - Defines API endpoints
- **Types** - Module-specific TypeScript interfaces and DTOs
- **Validations** - Request validation rules
- **Index** - Centralized exports for clean imports

### Benefits

- 🎯 **Scalability** - Easy to add new features without affecting existing code
- 🔧 **Maintainability** - Related code is grouped together
- 🧪 **Testability** - Modules can be tested independently
- 📦 **Reusability** - Modules can be easily extracted or moved
- 🎨 **Clean Code** - Clear separation of concerns

### Adding a New Module

1. Create a new folder in `src/modules/[module-name]/`
2. Add the required files:
   - `[module].controller.ts`
   - `[module].service.ts`
   - `[module].routes.ts`
   - `[module].types.ts`
   - `[module].validations.ts`
   - `index.ts`
3. Import and use in `app.ts`:
   ```typescript
   import { moduleRoutes } from "./modules/[module-name]";
   app.use("/api/[module]", moduleRoutes);
   ```

## Prerequisites

- Node.js 18+
- Yarn (recommended package manager)
- MongoDB (local or cloud instance)

Install Yarn globally if you haven't already:
```bash
npm install -g yarn
# or
corepack enable
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a strong random string
   - Configure other environment variables as needed

## Development

Run the development server:
```bash
yarn dev
```

The server will start on `http://localhost:8080` (or the port specified in `.env`).

Visit `http://localhost:8080/` to see the beautiful API documentation page.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

### Users (All require authentication)

- `GET /api/users` - Get all users (paginated)
  - Query params: `?page=1&limit=10`
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only, soft delete)

### Health Check

- `GET /health` - Server health check
- `GET /` - API documentation page (HTML)

## Request/Response Examples

### Register User

**Request:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

**Request:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get All Users

**Request:**
```bash
GET /api/users?page=1&limit=10
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Validation Rules

### Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Email
- Must be a valid email format
- Automatically normalized (lowercase, trimmed)

### Name
- 2-50 characters
- Trimmed

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "message": "Error message here"
  }
}
```

Validation errors include field-specific information:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed"
  },
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "Please provide a valid email address"
      }
    ]
  }
}
```

## Deployment to Vercel

1. Install Vercel CLI:
```bash
yarn global add vercel
# or
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CORS_ORIGIN`
   - `JWT_EXPIRES_IN`

## Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production (compiles TypeScript and copies views)
- `yarn start` - Start production server
- `yarn vercel-build` - Build for Vercel deployment
- `yarn vercel-dev` - Run Vercel development server
- `yarn lint` - Run ESLint
- `yarn type-check` - Type check without building

## Why Yarn?

This project uses **Yarn** as the package manager for several advantages:

- ⚡ **Fast & Reliable** - Deterministic installs with lockfile
- 🔒 **Secure** - Better security auditing and vulnerability detection
- 📦 **Workspaces** - Excellent monorepo support
- 🎯 **Mature** - Stable and widely adopted in production environments
- 🔄 **Offline Mode** - Can work offline with cached packages

## Code Organization

### Shared Resources

The `shared/` folder contains reusable utilities:

- **constants/** - HTTP status codes, error messages, default values
- **types/** - Shared TypeScript interfaces and types
- **helpers/** - Response helpers, pagination utilities
- **utils/** - Logging and other utilities

### Services

The `services/` folder contains shared services used across modules:
- `jwt.service.ts` - JWT token generation and verification

### Middleware

The `middleware/` folder contains Express middleware:
- `auth.middleware.ts` - JWT authentication
- `error.middleware.ts` - Centralized error handling
- `validation.middleware.ts` - Request validation

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes per IP)
- Helmet.js security headers
- CORS configuration
- Input validation and sanitization
- Role-based access control
- Soft delete for users

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Security:** Helmet, bcryptjs, express-rate-limit
- **Deployment:** Vercel (Serverless)

## License

ISC
