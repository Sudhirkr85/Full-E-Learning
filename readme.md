# E-Learning Platform Foundation

Project scaffold for the LMS platform using Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and shadcn/ui-style components.

## What is included

- Root app layout with shared theme provider, fonts, and global styling.
- Responsive public header and footer.
- Reusable dashboard shell with sidebar navigation for student, teacher, and admin areas.
- Route groups for public, student, teacher, and admin sections.
- Placeholder pages for home, courses, course details, store, login, register, and the three dashboards.
- SEO metadata helpers plus page-level metadata, sitemap, and robots setup.
- Reusable UI primitives for button, card, input, badge, and container.
- Prisma schema and database client helper for the full LMS data model.

## Folder structure

```text
src/
  app/
    (admin)/
    (public)/
    (student)/
    (teacher)/
    globals.css
    layout.tsx
    robots.ts
    sitemap.ts
  components/
    ui/
  lib/
    prisma.ts
    site.ts
    utils.ts
.env.example
prisma/
  schema.prisma
```

## Database layer

- PostgreSQL is configured through `DATABASE_URL` in `.env`.
- Prisma client access lives in `src/lib/prisma.ts`.
- The schema uses UUID primary keys, indexed foreign keys, timestamp fields, and explicit join models for course categories and teachers.
- Media and file references are stored as URLs and provider metadata only, so videos can point to YouTube and documents/images can point to Cloudflare R2 later.

## Next step

Copy `.env.example` to `.env`, set `DATABASE_URL`, then run `npm install` and `npm run db:migrate`.