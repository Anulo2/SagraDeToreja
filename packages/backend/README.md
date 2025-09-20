# Backend - Better Auth + Elysia + Drizzle

A modern authentication backend using Better Auth, Elysia, and Drizzle ORM.

## Setup

### Environment Variables

Create a `.env` file in the root with the following variables:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production
BETTER_AUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/sagratorreglia

# Optional: Social Providers (uncomment and configure as needed)
# GITHUB_CLIENT_ID=your_github_client_id
# GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

### Database

```bash
# Generate migrations
bun run db:generate

# Push schema to database
bun run db:push

# Open Drizzle Studio
bun run db:studio
```

## API Endpoints

All authentication endpoints are available at `/api/auth/*`:

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session
- `GET /api/auth/user` - Get current user

Additional endpoints:

- `GET /` - Health check
- `GET /health` - Detailed health status

## Frontend Integration

For frontend integration, use the Better Auth client:

```typescript
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

// Sign up
await authClient.signUp.email({
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
});

// Sign in
await authClient.signIn.email({
  email: "user@example.com",
  password: "password123",
});

// Get session
await authClient.getSession();
```
