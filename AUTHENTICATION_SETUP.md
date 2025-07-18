# Better Auth Setup Documentation

## Overview

Your motorcycle tracking app now has comprehensive authentication using **Better Auth**, a modern TypeScript-first authentication library. The system includes:

- ✅ Email/password authentication
- ✅ Social login (Google, GitHub)
- ✅ Secure session management
- ✅ Protected routes
- ✅ User-linked motorcycle data
- ✅ Responsive UI components

## Features Added

### 1. Authentication Configuration

- **Location**: `src/lib/auth.ts`
- **Features**: Email/password auth, social providers, session management
- **Database**: Integrated with Drizzle ORM and PostgreSQL

### 2. Database Schema Updates

- **Location**: `src/lib/db/schema.ts`
- **New Tables**: `user`, `session`, `account`, `verification`
- **Updated**: `motorcycles` table now links to users

### 3. API Routes

- **Location**: `src/app/api/auth/[...all]/route.ts`
- **Handles**: All authentication endpoints automatically

### 4. Client-Side Authentication

- **Location**: `src/lib/auth-client.ts`
- **Exports**: `signIn`, `signUp`, `signOut`, `useSession`, `getSession`

### 5. UI Components

- **Location**: `src/components/auth/auth-form.tsx`
- **Features**: Login/signup forms with email and social providers
- **Pages**: `/signin` and `/signup` routes

### 6. Protected Routes

- **Middleware**: `src/middleware.ts`
- **Protection**: Routes like `/services`, `/events`, `/dashboard`
- **Auth Utils**: `src/lib/auth-utils.ts` for server-side protection

### 7. Updated Header

- **Location**: `src/components/layout/header.tsx`
- **Features**: User avatar, name, login/logout buttons, conditional navigation

### 8. Enhanced Homepage

- **Location**: `src/app/page.tsx`
- **Features**: Landing page for unauthenticated users, dashboard for authenticated users

## Environment Variables

Create a `.env.local` file with these variables:

```env
# Database
DATABASE_URL=your-database-url-here
NEON_DATABASE_URL=your-neon-database-url-here

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Social Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Generating Secrets

Generate a secure secret for `BETTER_AUTH_SECRET`:

```bash
openssl rand -hex 32
```

### Social Provider Setup

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## Database Migration

The auth tables have been added to your schema. To apply them:

```bash
# Generate migration
pnpm db:generate

# Apply to database (if migrations work)
pnpm db:migrate

# OR push directly (recommended for development)
pnpm db:push
```

## Usage Examples

### Client-Side Authentication

```typescript
import { useSession, signIn, signOut } from "@/lib/auth-client";

function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;

  if (!session) {
    return (
      <button
        onClick={() =>
          signIn.email({
            email: "user@example.com",
            password: "password",
          })
        }
      >
        Sign In
      </button>
    );
  }

  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Server-Side Authentication

```typescript
import { requireAuth, getOptionalAuth } from "@/lib/auth-utils";

// Require authentication
export default async function ProtectedPage() {
  const session = await requireAuth(); // Redirects to /signin if not authenticated

  return <div>Welcome, {session.user.name}!</div>;
}

// Optional authentication
export default async function OptionalPage() {
  const session = await getOptionalAuth(); // Returns null if not authenticated

  return (
    <div>{session ? `Welcome, ${session.user.name}!` : "Please sign in"}</div>
  );
}
```

### API Route Protection

```typescript
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Handle authenticated request
  return Response.json({ user: session.user });
}
```

## Security Features

1. **Secure Sessions**: JWT-based sessions with automatic refresh
2. **CSRF Protection**: Built-in CSRF protection for all auth endpoints
3. **Rate Limiting**: Built-in rate limiting for auth attempts
4. **Secure Cookies**: HTTPOnly, Secure, SameSite cookies
5. **Password Hashing**: Bcrypt with salt rounds
6. **SQL Injection Prevention**: Parameterized queries through Drizzle

## Customization

### Adding New Social Providers

Edit `src/lib/auth.ts`:

```typescript
export const auth = betterAuth({
  // ... existing config
  socialProviders: {
    google: {
      /* ... */
    },
    github: {
      /* ... */
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    },
  },
});
```

### Custom User Fields

Update the user table in `src/lib/db/schema.ts`:

```typescript
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  // Add custom fields
  role: text("role").default("user"),
  bio: text("bio"),
  // ... existing fields
});
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure `DATABASE_URL` is correct
2. **Social Login**: Check OAuth app settings and redirect URLs
3. **Session Issues**: Verify `BETTER_AUTH_SECRET` is set
4. **CORS Errors**: Ensure `BETTER_AUTH_URL` matches your domain

### Development vs Production

For production:

1. Set `requireEmailVerification: true` in auth config
2. Use HTTPS URLs in environment variables
3. Set secure cookie settings
4. Enable rate limiting

## Next Steps

Your authentication system is now complete! Consider adding:

1. **Email Verification**: Enable in auth config for production
2. **Password Reset**: Better Auth supports this out of the box
3. **Two-Factor Authentication**: Available as a Better Auth plugin
4. **Admin Panel**: Create admin-only routes using the auth system
5. **User Profiles**: Add user profile management pages

## Documentation

- [Better Auth Documentation](https://www.better-auth.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
