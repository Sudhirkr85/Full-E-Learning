# LMS + Digital Store Platform — Final Build Plan

## 1) Project Goal
Build a scalable, production-ready, SEO-friendly web platform that combines:

- LMS for courses, lessons, tests, progress tracking, certificates
- Digital product selling for PDFs, notes, books, files
- Simple online store with checkout, payments, shipping tracking
- Role-based dashboards for student, teacher, and admin
- Reusable APIs for future mobile app support

---

## 2) Tech Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- PostgreSQL
- Prisma ORM
- Razorpay
- Cloudflare R2
- Firebase FCM

---

## 3) Core Storage Rules
- Videos: YouTube unlisted only
- PDFs/images/files: Cloudflare R2 only
- PostgreSQL: metadata, relations, URLs, statuses only
- No heavy file storage inside database

---

## 4) Roles
### student
- Browse courses/products
- Buy/enroll
- Learn lessons
- Take tests
- Track progress
- View certificates
- Track orders

### teacher
- Create/manage courses
- Add sections, lessons, resources, tests
- View enrolled students
- Manage course content

### admin
- Full control
- User/content/order/payment/shipping moderation
- Notifications and support handling
- Audit and system oversight

---

## 5) Main Database Model
Final DB structure should be centered around these entities:

- users
- categories
- courses
- course_categories
- course_teachers
- course_sections
- lessons
- lesson_resources
- enrollments
- course_progress
- course_reviews
- wishlists
- tests
- questions
- options
- attempts
- attempt_answers
- products
- coupons
- orders
- order_items
- payments
- notifications
- support_tickets
- certificates
- audit_logs

---

## 6) Relationship Rules
- one course → many teachers
- one course → many sections
- one section → many lessons
- one lesson → many resources
- one course → many tests
- one test → many questions
- one question → many options
- one order → many items
- one order → one payment

---

## 7) Platform Architecture Rules
- Keep App Router modular and clean
- Use server-side validation for all writes
- Build reusable APIs for web and future mobile app
- Keep SEO intact for public course/product pages
- Separate public, student, teacher, admin route groups
- Use consistent service/repository patterns for Prisma access
- Avoid DB redesign by planning relations now
- Keep business logic out of UI components
- Use server actions only where appropriate
- Prefer API route handlers for reusable client/mobile access

---

## 8) Completed Parts
### Part 1 — Foundation
- Next.js App Router setup
- Tailwind + shadcn/ui
- public/teacher/student/admin route groups
- reusable UI components
- dark/light mode
- SEO metadata
- sitemap + robots
- dashboard shells
- responsive layouts

### Part 2 — Prisma + PostgreSQL
- Prisma configured
- PostgreSQL connected
- migrations working
- Prisma client generated
- production-ready schema
- enums + relations + indexes
- migration-ready structure

### Part 3 — Authentication + Roles
- Auth.js authentication
- bcrypt password hashing
- JWT/session auth
- login/register/logout
- middleware route protection
- role-aware dashboards
- protected routes
- Prisma auth integration
- server-side auth helpers
- profile support

### Part 4 — Course System
- course CRUD
- category CRUD
- course sections/modules
- lessons system
- lesson resources system
- teacher assignment system
- slug generation
- SEO-friendly course pages
- public course catalog
- public course detail page
- teacher course dashboard
- publish/unpublish flow
- lesson ordering
- server actions
- dynamic Prisma-backed routes
- build-safe query handling

---

## 9) Next Part to Build
# Part 5 — Enrollment + Protected Learning Access

### Features
- enrollments
- protected lesson access
- my courses
- course progress tracking
- continue learning
- lesson completion
- lesson player
- free lesson support
- next/previous lesson navigation
- teacher/admin bypass access

### Business Rules
- Enrolled students can access paid/protected lessons
- Free lessons can be public
- Teachers and admins can bypass access checks
- Progress should update only when valid lesson completion happens
- Continue learning should open the last unfinished lesson
- Navigation should move through section/lesson order safely

---

## 10) Step-by-Step Build Order
### Step 1 — Enrollment Data Layer
- Create or verify enrollment model and indexes
- Add helper queries for checking access
- Add utilities for finding user course status
- Add access-control service functions

### Step 2 — Protected Lesson Access
- Build server-side access guard
- Allow access only if:
  - user is enrolled, or
  - lesson is free, or
  - user is teacher/admin
- Ensure private lesson routes are secured

### Step 3 — My Courses Page
- Show enrolled courses
- Show active/completed status
- Show continue-learning shortcut
- Show course progress percentage

### Step 4 — Lesson Player
- Build lesson detail page
- Show lesson content based on type
- Support YouTube embedded video
- Support R2 file/resource display
- Show resources list
- Show next and previous navigation

### Step 5 — Progress Tracking
- Create/update course_progress records
- Mark lessons completed
- Update course progress percentage
- Keep logic idempotent and safe

### Step 6 — Continue Learning
- Track last accessed lesson per user/course
- Open last incomplete lesson
- Fall back to first accessible lesson

### Step 7 — Course Navigation
- Fetch ordered sections and lessons
- Determine previous/next lesson
- Prevent broken navigation across unpublished content

### Step 8 — Free Lesson Support
- Mark lessons as free/public
- Allow preview without enrollment
- Keep locked lessons protected

### Step 9 — Teacher/Admin Overrides
- Teacher who owns course can preview/manage all lessons
- Admin can bypass all access restrictions
- Keep override logic centralized

### Step 10 — Testing and README
- Test all access scenarios manually
- Verify enrolled/unenrolled/free/teacher/admin states
- Update README after implementation
- Add notes for future mobile reuse

---

## 11) Future Build Phases
### Part 6 — Test System
- MCQ questions
- short answer questions
- options
- attempt creation
- scoring logic
- result review
- test availability rules

### Part 7 — Certificates
- issue certificate after completion rules
- certificate verification page
- certificate metadata and tracking

### Part 8 — Store + Payments
- products
- product detail pages
- checkout flow
- orders
- order items
- payments
- Razorpay integration
- payment verification
- invoice/order status

### Part 9 — Shipping Tracking
- address collection
- courierName
- trackingId
- trackingUrl
- manual tracking updates by admin/teacher
- student order tracking page

### Part 10 — Notifications + Support
- FCM notifications
- in-app notifications table
- support tickets
- admin responses
- event-based notifications

### Part 11 — Audit Logs
- track important admin/teacher actions
- store action type, actor, entity, timestamp, metadata

### Part 12 — UI Polish and Optimization
- improve dashboard UX
- loading states
- empty states
- error states
- better filters/search
- performance tuning
- caching where safe

---

## 12) Implementation Rules for the AI Agent
- Build one small system part at a time
- Do not jump ahead to large features
- Test after every major piece
- Fix issues immediately before continuing
- Keep README.md updated after each major milestone
- Preserve SEO in public pages
- Keep APIs reusable and versionable
- Use clean Prisma queries and typed helpers
- Prefer predictable folder structure
- Keep logic centralized and maintainable
- Avoid schema changes unless necessary and well justified

---

## 13) Folder Structure Intent
Use a modular structure like:

- app/
  - (public)/
  - (student)/
  - (teacher)/
  - (admin)/
  - api/
- components/
- lib/
- server/
- prisma/
- types/
- constants/
- hooks/
- services/

Keep:
- UI components reusable
- server logic separated
- access control centralized
- API handlers reusable for mobile later

---

## 14) Success Criteria
The platform is ready when:

- users can sign in and use correct dashboards
- teachers can manage course content safely
- students can enroll and access lessons properly
- progress tracking works reliably
- tests and certificates work cleanly
- products can be sold through Razorpay
- files are served from R2
- video lessons work through YouTube
- shipping tracking works manually
- notifications and support are ready
- architecture remains stable for mobile expansion

---

## 15) Final Build Principle
The system should always be built in this order:

**schema → auth → access control → learning flow → tests → store → notifications → polish**

Never add a large new feature before the previous part is tested and stable.