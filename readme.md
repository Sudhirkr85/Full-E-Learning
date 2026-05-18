# E-Learning Platform Foundation

Project scaffold for the LMS platform using Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and shadcn/ui-style components.

## What is included

- Root app layout with shared theme provider, fonts, and global styling.
- Responsive public header and footer.
- Reusable dashboard shell with sidebar navigation for student, teacher, and admin areas.
- Route groups for public, student, teacher, admin, and protected areas.
- Placeholder pages for home, courses, course details, store, login, register, the role dashboards, dashboard entry, and profile.
- SEO metadata helpers plus page-level metadata, sitemap, and robots setup.
- Reusable UI primitives for button, card, input, badge, and container.
- Prisma schema and database client helper for the full LMS data model.
- Auth.js credential login with JWT sessions, Prisma-backed users, role-aware middleware, and protected dashboard/profile routes.

## Folder structure

```text
middleware.ts
.env.example
src/
  app/
    api/auth/[...nextauth]/
    (admin)/
    (protected)/
    (public)/
    (student)/
    (teacher)/
    dashboard/
    globals.css
    layout.tsx
    robots.ts
    sitemap.ts
  components/
    ui/
  lib/
    auth.ts
    auth-schemas.ts
    password.ts
    prisma.ts
    site.ts
    utils.ts
prisma/
  schema.prisma
```

## Database layer

- PostgreSQL is configured through `DATABASE_URL` in `.env`.
- Prisma client access lives in `src/lib/prisma.ts`.
- The schema uses UUID primary keys, indexed foreign keys, timestamp fields, and explicit join models for course categories and teachers.
- Media and file references are stored as URLs and provider metadata only, so videos can point to YouTube and documents/images can point to Cloudflare R2 later.

## Authentication layer

- Credentials login is handled with Auth.js in App Router using JWT sessions and Prisma-backed password verification.
- Login and registration use server actions so the flow stays server-first and easy to extend.
- Middleware protects dashboard, profile, and role-specific routes by role and redirects authenticated users away from login/register.
- The generic `/dashboard` entry point redirects users to the correct role dashboard.
- User profile data is read from Prisma after session lookup so the current account record stays the source of truth.

## Next step

Copy `.env.example` to `.env`, set `DATABASE_URL` and `AUTH_SECRET`, then run `npm install` and `npm run db:migrate`.