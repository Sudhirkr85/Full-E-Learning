# E-Learning Platform Foundation

Project scaffold for the LMS platform using Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and shadcn/ui-style components.

## What is included

- Root app layout with shared theme provider, fonts, and global styling.
- Responsive public header and footer.
- Reusable dashboard shell with sidebar navigation for student, teacher, and admin areas.
- Route groups for public, student, teacher, admin, and protected areas.
- Public course catalog pages backed by Prisma, including category filtering and course detail SEO.
- Teacher course management pages for course creation, editing, section management, and category CRUD.
- Student enrollment flows, protected lesson access, progress tracking, and continue-learning dashboards.
- SEO metadata helpers plus page-level metadata, sitemap, and robots setup.
- Reusable UI primitives for button, card, input, badge, and container.
- Prisma schema and database client helper for the full LMS data model.
- Auth.js credential login with JWT sessions, Prisma-backed users, role-aware middleware, and protected dashboard/profile routes.
- Server actions and validation schemas for course, category, section, lesson, resource, enrollment, and teacher assignment workflows.

## Course system

- Public catalog pages read published courses from Prisma and support filtering by category.
- Course detail pages render the course overview, metadata, published sections, preview lessons, and protected enrollment entry points.
- Teachers can create and edit courses, assign co-teachers, attach categories, publish or unpublish courses, and delete courses.
- Teachers can manage section order, lessons, and lesson resources from the course section editor.
- Category management is available from the teacher area so catalog taxonomy can be maintained in-app.
- Build-time database reads now fail soft when the local workspace database is unavailable, which keeps static generation resilient.

## Enrollment and learning access

- `Enrollment` records track course membership, enrollment status, and last access time.
- `CourseProgress` stores course-level progress summaries, last lesson, completion counts, and completion percentage.
- `LessonProgress` stores per-lesson completion state with a unique enrollment-and-lesson pair so completion stays queryable and scalable.
- Public course pages now distinguish preview lessons from locked lessons and only surface protected resource links through server-validated routes.
- Students can enroll from the public course page, resume from the last lesson, and mark lessons complete or incomplete from the player page.
- Teachers and admins bypass lesson access checks while still using the same course and lesson data model.

## Student layer

- `/student/dashboard` now shows enrollment counts, completion counts, and the next lesson to resume.
- `/student/courses` shows every active, paused, and completed enrollment with continue-learning links.
- Protected lesson pages live under `/courses/[slug]/lessons/[lessonSlug]` and validate access on the server before exposing player content.
- Lesson resources are routed through a protected redirect endpoint so direct resource links are still permission checked.

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
    (public)/courses/
    (public)/courses/[slug]/
    (protected)/courses/[slug]/lessons/[lessonSlug]/
    (protected)/courses/[slug]/lessons/[lessonSlug]/resources/[resourceId]/
    (student)/student/courses/
    (teacher)/teacher/categories/
    (teacher)/teacher/courses/
    (teacher)/teacher/courses/[courseId]/
    (teacher)/teacher/courses/[courseId]/sections/
  components/
    ui/
  lib/
    auth.ts
    auth-schemas.ts
    courses/
        access.ts
      actions.ts
      queries.ts
      schemas.ts
      slug.ts
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
- Enrollment progress now adds a dedicated `lesson_progress` table alongside the existing `course_progress` summary model.
- Media and file references are stored as URLs and provider metadata only, so videos can point to YouTube and documents/images can point to Cloudflare R2 later.

## Authentication layer

- Credentials login is handled with Auth.js in App Router using JWT sessions and Prisma-backed password verification.
- Login and registration use server actions so the flow stays server-first and easy to extend.
- Middleware protects dashboard, profile, and role-specific routes by role and redirects authenticated users away from login/register.
- The generic `/dashboard` entry point redirects users to the correct role dashboard.
- User profile data is read from Prisma after session lookup so the current account record stays the source of truth.

## Course management layer

- Course data is modeled with courses, categories, sections, lessons, lesson resources, and teacher join tables.
- Course slugs are generated centrally so public URLs stay stable and unique.
- Validation is handled with Zod schemas before server actions write to Prisma.
- Public course queries and teacher dashboard queries reuse shared Prisma helpers for consistent select shapes.
- Route metadata stays dynamic where needed so the app router can render catalog and editor pages correctly.

## Learning access layer

- Shared course access helpers centralize enrollment checks, lesson navigation, course progress calculation, and resource authorization.
- Public course pages, student dashboard pages, and lesson player pages all resolve access on the server from the same Prisma data.
- Progress updates revalidate the public course page, student pages, and lesson pages so the UI reflects state changes immediately after completion actions.

## Next step

Copy `.env.example` to `.env`, set `DATABASE_URL` and `AUTH_SECRET`, then run `npm install` and `npm run db:migrate`.