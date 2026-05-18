# E-Learning Platform Foundation

Project scaffold for the LMS platform using Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui-style components.

## What is included

- Root app layout with shared theme provider, fonts, and global styling.
- Responsive public header and footer.
- Reusable dashboard shell with sidebar navigation for student, teacher, and admin areas.
- Route groups for public, student, teacher, and admin sections.
- Placeholder pages for home, courses, course details, store, login, register, and the three dashboards.
- SEO metadata helpers plus page-level metadata, sitemap, and robots setup.
- Reusable UI primitives for button, card, input, badge, and container.

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
```

## Next step

Install dependencies and run the app with `npm install` followed by `npm run dev`.