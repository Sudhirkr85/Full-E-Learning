# E-Learning Platform — LMS + Digital Store (Premium Futuristic AI EdTech)

A production-grade, highly scalable, and SEO-optimized Learning Management System (LMS) combined with an integrated Digital & Physical Products Store. Built on Next.js 15 App Router, TypeScript, PostgreSQL, Prisma, Razorpay, Cloudflare R2, Brevo Email, and Firebase FCM, this platform features an immersive cinematic dark visual architecture tailored for Indian software engineering students and career-oriented learners.

---

## 1. Project Overview

This platform represents a modern fusion of an advanced Educational portal and a transactional Digital Store. Designed to help software developers and tech students bridge the gap between academic theory and real-world system engineering, the application provides:

*   **Advanced LMS Ecosystem**: Student dashboards, lesson player modules, interactive assessments, real-world coding sandboxes, automatic course progress trackers, and public blockchain-verified digital certificates.
*   **Digital & Physical Products Store**: A built-in storefront catalog capable of processing independent digital downloads (PDF playbooks, code repositories), physical merchandise (vouchers, dashboard UI kits), course access keys, and complex product bundles.
*   **Indian Career Integration**: Immersive visual interfaces highlighting salary outcome statistics (₹45 LPA highest package, ₹12.4 LPA average package), live placement tickers, and simulated tech interviewer panels.

---

## 2. Tech Stack

The architecture leverages modern, industry-standard technologies selected for performance, type-safety, and production scalability:

*   **Next.js 15 (App Router)**: Powers hybrid static/dynamic page compilers, React Server Components (RSC) for instantaneous page loading, Route Groups to organize dashboard boundaries, and highly secure Server Actions for data writes.
*   **TypeScript**: Complete compile-time type-safety and auto-completion across all backend services, database clients, and UI component models.
*   **Tailwind CSS**: Custom HSL color schemes, dynamic `.bg-grid-cyber` mesh layouts, translucent glassmorphism overlays, and hardware-accelerated animations.
*   **shadcn/ui**: Accessible, customizable layout components built on top of Radix UI primitives.
*   **PostgreSQL & Prisma ORM**: Robust, production-grade relational database layout utilizing UUID primary keys, indexed foreign relationships, and transaction-safe schema migrations.
*   **Razorpay**: Integrated payment gateway execution. Leverages server-side HMAC-SHA256 signature checking for webhooks to automatically activate student licenses upon successful sandbox checkouts.
*   **Cloudflare R2**: Standard S3-compatible object storage used to host course files, downloadable source-code archives, and static images.
*   **Firebase FCM (Cloud Messaging)**: Exposes real-time background and foreground push notifications to keep students informed of active tickets and orders.
*   **Brevo Email Service**: Reusable fetch-based REST mailing client. Dispatches visually stunning HTML transactional notifications for student registrations, payment receipts, and security link changes.
*   **Auth.js (v5)**: Credentials provider login featuring secure JWT session encryption, role-based route middleware protection, and strict layout guards.

---

## 3. Core Features

The application contains the following fully implemented production modules:

*   **Navbar & Navigation**:
    *   **Role-Based Navigation**: Public, Student, Teacher, and Admin navbar states with dynamic link rendering based on Auth.js session role.
    *   **Mobile Responsive Drawer**: Hamburger menu with full side drawer on screens below 768px.
    *   **Notification Bell**: Real-time unread badge for logged-in users.
    *   **Avatar Dropdown**: Role-specific menu with profile, dashboard, and logout actions.
*   **Authentication & Role Isolation**: Custom Auth.js engine enforcing STUDENT, TEACHER, and ADMIN credentials. Includes automatic redirection gates via Next.js Middleware, alongside a secure, transaction-safe **forgot password & reset password** flow utilizing JSON-metadata storage and Brevo SMTP email links.
*   **Admin**: Full admin dashboard with real-time platform stats (students, teachers, courses, revenue), user management with role promotion, complete course oversight, category management, CRM support desk, change password, and platform configuration.
*   **Courses & Lesson Navigation**: Dynamic public course catalogs, preview lessons, locked learning modules, and protected lesson resources. Course listing page shows responsive grid (1/2/3/4 columns), thumbnail banners with category gradients, Free badge or ₹ INR pricing, original-price strike-through with calculated discount % OFF, hover animations, and teacher/section metadata.
*   **Lesson Player & Progress Tracking**: Immersive video/article lesson interface that registers completed and paused states, updating course progress percentages instantly.
*   **Tests & Quizzes (Assessments)**: Graded exams, practice tests, and quizzes. Supports single-choice, multiple-choice, true/false, and short-answer questions with auto-grading scripts.
*   **Blockchain-Verified Certificates**: Automatic 100% progress verification, average score calculation, cryptographically signed `CERT-[YEAR]-[HEX]` verification codes, public canonical verification pages, and print layouts.
*   **Store & Coupon System**: Transaction-safe catalog supporting `COURSE_ACCESS`, `DIGITAL_RESOURCE`, `BUNDLE`, and `MEMBERSHIP` product types. Includes percentage and flat-rate coupon processors (e.g. `SUPER90`, `WELCOME10`).
*   **Razorpay Integration**: Server-side checkout order APIs, sandbox payment interfaces, signature-validated webhook endpoints, and a local offline simulator for risk-free developer testing.
*   **Shipping & Manual Dispatch Desk**: Admin tools to collect physical shipping addresses, update courier tracking numbers, and send tracking links to students.
*   **In-App Notification Hub**: Real-time sidebar tray displaying alerts for new enrollments, coupon usages, support ticket replies, and completed checkouts.
*   **CRM Support Desk**: Ticket submission desks for students and an advanced split-pane ticket workspace for administrators, using JSON array fields for fast serialized message storage.
*   **Student Profile Management**: Premium profile page where students can view and edit their personal information (display name, first/last name, email, mobile number) with view/edit toggle, animated status feedback, and secure server-side validation via the `/api/profile` route.
*   **Centralized Audit Logs**: Comprehensive auditing of security-critical actions (manual course updates, certificate generation, test releases) storing before/after states.
*   **Email System**: REST email client utilizing Brevo's API. Dispatches fully responsive welcome letters, order invoices, and password reset codes.
*   **SEO Optimization Engine**: Dynamically compiled robots.ts, sitemap.ts, semantic HTML5, and unique browser tags.

---

## 4. Visual Design System

The visual identity is based on the **"Premium Futuristic AI EdTech"** aesthetic to captivate ambitious developer students:

*   **Cinematic Dark Atmosphere**: Deep space-mesh backgrounds combined with radial glow overlays utilizing smooth blue, indigo, and violet accents.
*   **Sleek Glassmorphism**: Translucent `.glass-card-premium` containers pairing `backdrop-filter: blur(16px)` with delicate white border strokes and high-contrast typography.
*   **Soft 3D Cards**: An optimized, hardware-accelerated CSS hover transformer (`.soft-3d-card`) that provides dynamic 3D tilt adjustments, vertical translation, and custom shadow offsets. Highly responsive on mid-range Android viewports.
*   **Cyber Blueprint Grids**: Tech-themed background mesh grids (`.bg-grid-cyber`) emulating compiler sandboxes and programming terminals.
*   **Indian Student UX Focus**: Bright outcome-driven statistics, outcome packages, and clean dark scrollbars that foster deep programmer focus.
*   **Split-Screen Responsive Auth**: High-conversion double-column layouts on desktop. The left side is a branding panel showing outcome-driven benefits with floating micro-animations, while the right side centers a premium glassmorphic credentials card. Stacks form-first on mobile (360px+) for instant tap access.
*   **Twinkling Night Sky & Interactive Fireflies Canvas**: An interactive, high-performance Canvas 2D system (`StarFireflyCanvas.tsx`) mounted inside the landing page hero section. Draws 70% twinkling dots and 30% sparkling 4-point cross stars utilizing sine phases, alongside floating violet fireflies with fading position trails. Employs spring physics (base coordinate restoration), cursor attraction/repulsion bounds, custom glowing mouse pointers, and click blast shockwaves. Built with a parent-event bridge that preserves canvas `pointer-events: none` to keep all underlying buttons fully clickable.

---

## 5. Architecture Overview

The system architecture focuses on modular decoupling, type safety, and fast dynamic rendering:

```mermaid
graph TD
    A[Client Browser] -->|Auth.js Credentials| B(Next.js Middleware Route Guards)
    B -->|STUDENT / TEACHER / ADMIN| C{Route Group Isolation}
    C -->|Public Routes| D[src/app/\(public\)]
    C -->|Student Routes| E[src/app/\(student\)]
    C -->|Teacher Routes| F[src/app/\(teacher\)]
    C -->|Admin Routes| G[src/app/\(admin\)]
    
    H[Server Actions / API Routes] -->|Zod Parsing| I[Prisma Client Layer]
    I -->|UUID Indexes| J[(PostgreSQL Database)]
    H -->|Brevo HTTP REST API| K[Brevo Email Service]
    H -->|HMAC-SHA256 Validation| L[Razorpay Sandbox Gate]
```

*   **Route Groups Isolation**: The Next.js folder structure segregates public access areas (`(public)`), protected course rooms (`(protected)`), student workspaces (`(student)`), teacher dashboards (`(teacher)`), and admin operations (`(admin)`).
*   **Zod Schema Parsing**: Every Server Action validates parameters utilizing robust, type-safe Zod parsing libraries before invoking database operations, blocking malicious or malformed injections.
*   **Resilient Static Compilation**: Build-time database queries are wrapped in fail-soft mechanisms so that Next.js static prerendering compiles successfully even when the local PostgreSQL container is offline.
*   **Dynamic Caching Control**: Dynamic endpoints that handle dynamic route parameters (like `/checkout/[orderId]`) are declared with `export const dynamic = "force-dynamic"` to bypass build-time static generation checks and avoid dynamic parameter crashes.

---

## 6. Folder Structure

The project layout maps directly to Next.js App Router and Prisma modular standards:

```text
prisma/
  migrations/                # Relational database schema migrations
  schema.prisma              # Production relational data model
                             # PlatformConfig model added for singleton platform settings storage.
  seed.ts                    # Upsert-driven store catalog seeder
src/
  app/
  ├── api/
  │   ├── auth/              # Auth.js core credential controllers
  │   ├── dev/test-email/    # Developer-only visual email preview and test playground
  │   ├── payments/razorpay/ # Razorpay server order initialization route
  │   └── webhooks/razorpay/ # HMAC-signature webhook callback listener
  ├── (admin)/
  │   └── admin/
  │       ├── dashboard/                  # Real-time platform stats overview
  │       ├── users/                      # User list, search, role promotion
  │       ├── courses/                    # Course list, status management
  │       ├── courses/[courseId]/         # Course detail, sections, lessons
  │       ├── categories/                 # Category CRUD management
  │       ├── support/                    # CRM ticket moderation desk
  │       └── settings/
  │           ├── change-password/        # Admin secure password update
  │           └── platform/               # Site config singleton settings
  ├── (protected)/
  │   ├── courses/           # Locked classroom lesson player
  │   └── profile/           # User account preferences portal
  ├── (public)/
  │   ├── certificates/      # Certificate catalog & canonical verification gateway
  │   ├── checkout/          # Order checkout & simulation screen
  │   ├── courses/           # Public catalog and syllabus detail viewports
  │   ├── store/             # Digital products catalog shop
  │   ├── login/             # Secure login server actions
  │   ├── logout/            # Secure session signout actions
  │   ├── register/          # Student registration server actions
  │   ├── forgot-password/   # Secure forgot-password token request and email actions
  │   ├── reset-password/    # Secure password update actions with token expiration validation
  │   └── page.tsx           # Immersive high-conversion landing page with cursor HeroGlow
  ├── dashboard/             # Role-based landing router
  ├── globals.css            # Cinematic HSL variables, cyber grids, & 3D tilt styles
  ├── layout.tsx             # Theme and Font loaders
  ├── robots.ts              # Dynamic robots file
  └── sitemap.ts             # Dynamic sitemap indexer
  components/
  ├── auth/                  # Premium interactive auth client forms (login-form.tsx, register-form.tsx, logout-form.tsx, forgot-password-form.tsx, reset-password-form.tsx)
  ├── hero/                  # Premium custom landing animations (StarFireflyCanvas.tsx)
  ├── navbar/
  │   ├── mobile-drawer.tsx      # Mobile side drawer with all nav links
  │   ├── avatar-dropdown.tsx    # User avatar with role-based dropdown
  │   └── notification-bell.tsx  # Bell icon with unread count badge
  ├── ui/                    # Reusable components & glow effect controls (hero-glow.tsx, button, card)
  ├── site-header.tsx        # Role-based responsive header bar
  ├── site-footer.tsx        # Unified brand outcomes footer
  └── dashboard-shell.tsx    # Sidebar layout shell for dashboards
  lib/
  ├── audit/                 # compliance logger actions
  ├── certificates/          # Certificate generation and logic helpers
  ├── courses/               # Access checking, course actions, and progress calculations
  ├── email/                 # Brevo REST API service client and 7 email templates
  ├── notifications/         # Push notification triggers
  ├── store/                 # Product purchasing, coupon applying, and checkout simulation
  ├── support/               # Support ticket creation and reply workflows
  ├── tests/                 # Quiz compiler and grading actions
  ├── admin-config.ts            # Super admin email constant & platform-wide admin guard config
  ├── auth.ts                # Auth.js credentials login verification
  ├── auth-schemas.ts        # Authentication input validation schemas
  ├── db.ts                  # Neon PostgreSQL connection drop retry helper (withRetry)
  ├── password.ts            # Salted bcryptjs hasher
  ├── prisma.ts              # Prisma Database client singleton helper (hot-reload safe)
  ├── razorpay.ts            # Razorpay sandbox client wrapper
  ├── site.ts                # Shared SEO keywords and metadata configurations
  └── utils.ts               # Class merger utility
```

### Important Folders & Architectural Responsibilities

1.  **`src/app/` (Next.js Routing)**: Implements directory-based App Router groups. Route Groups like `(public)` keep URL routes clean, while dashboards enforce layouts specifically segmented for `(admin)`, `(teacher)`, and `(student)`.
2.  **`src/lib/` (Business Logic)**: All state changes, transactional DB interactions, external REST integrations, and Server Actions live inside dedicated directories within this folder. No raw Prisma database queries or third-party client drivers are instantiated directly inside UI components.
3.  **`src/components/` (Presentation)**: Built on top of `shadcn/ui`, utilizing Radix primitives. Contains only declarative, reusable component blocks.

---

## 7. Database Design

The schema leverages strong relational modeling with comprehensive indexes and cascading deletions:

```mermaid
erDiagram
    User ||--o{ Enrollment : creates
    User ||--o{ Order : places
    User ||--o{ SupportTicket : reports
    Course ||--|{ CourseSection : contains
    CourseSection ||--|{ Lesson : contains
    Lesson ||--o{ LessonResource : owns
    Enrollment ||--|| CourseProgress : tracks
    Enrollment ||--o| Certificate : generates
    Test ||--|{ Question : features
    Question ||--|{ Option : lists
    Attempt }|--|| Test : logs
    Attempt ||--|{ AttemptAnswer : records
    Order ||--|{ OrderItem : includes
    Order ||--|{ Payment : captures
```

### Core Relational Models

*   **`User`**: Core account model storing credentials, names, and profiles. Links directly to orders, enrollments, audit logs, and support desks.
*   **`Course`**: Relates learning modules, sections, tests, and storefront products. Includes statuses (`DRAFT`, `PUBLISHED`, `ARCHIVED`).
*   **`Enrollment`**: Junction table mapping `User` to `Course`. Owns a unique constraint (`@@unique([userId, courseId])`), direct completion states, and course review models.
*   **`CourseProgress`**: Maintains real-time tracking of finished lessons, remaining content counts, and completion percentages.
*   **`Test` & `Attempt`**: Tracks MCQ/assessment structures. An `Attempt` logs individual responses in an `AttemptAnswer` relationship and scores percentages.
*   **`Product`**: Product schema linking to `Course` or digital items. Differentiates `COURSE_ACCESS`, `DIGITAL_RESOURCE`, `BUNDLE`, and `MEMBERSHIP`.
*   **`Order` & `OrderItem`**: Captures invoice ledger entries, units, subtotal records, and applied coupon keys.
*   **`Payment`**: Connects directly to `Order`. Leverages status values (`PENDING`, `SUCCEEDED`, `FAILED`, `REFUNDED`) and provider identifiers.
*   **`SupportTicket`**: Tracks CRM messages. Utilizes JSON serialization for real-time thread updates.
*   **`Certificate`**: Represents cryptographic certificates (`CERT-[YEAR]-[HEX]`) mapping direct scores, issued dates, and verification routes.
*   **`AuditLog`**: Logs CREATE, UPDATE, DELETE, PUBLISH, and ARCHIVE events across entities.

### Neon PostgreSQL Auto-Pause & Connection Reliability Architecture
To prevent database connection drops and Neon free tier connection threshold limits (max 10 connections) in serverless/hot-reloaded Next.js environments, we implemented a robust, multi-layer database safety architecture:
1.  **Dual Connection Paths (pgbouncer vs. Direct)**:
    *   **Pooled connection (`DATABASE_URL`)**: Connects via Neon's `-pooler` subdomain using pgBouncer. Configured with query-string parameters `pgbouncer=true`, `connect_timeout=15`, and `pool_timeout=15` to manage high-concurrency runtime queries cleanly.
    *   **Direct connection (`DIRECT_URL`)**: Connects directly to the PostgreSQL node without a pooler, used strictly by Prisma to run schema migrations (`npx prisma migrate dev`) and schema introspections (`npx prisma db pull`).
2.  **Next.js Hot-Reload Safe Singleton (`prisma.ts`)**: Encapsulates the `PrismaClient` in a global object wrapper. This prevents Next.js from creating a new database connection instance on every dev-server hot-reload compilation, completely eliminating database connection exhaustion.
3.  **Linear Backoff Connection Retry Wrapper (`withRetry`)**: Creates a resilient query execution utility (`src/lib/db.ts`) that intercepts transient connection termination codes (like `57P01` or pgBouncer pool timeouts caused by Neon's cold-start wake-up latency) and automatically retries database queries with a linear backoff delay (`delay * (iteration + 1)`), restoring page loading continuity.

---

## 8. Authentication & Roles

Authentication is powered by **Auth.js (v5)**, **bcryptjs**, and **OAuth 2.0 Integration**, keeping all access controls strictly **email-only** to ensure stable production flows:

*   **Credentials Login (Email-Only)**: Secure, verified username/password authentication matching salted bcrypt hashes in the PostgreSQL database.
    *   *Hybrid Server/Client Layout*: Main parent `page.tsx` endpoints remain lightweight React Server Components for SEO and fast loading, while form rendering is handled by interactive Client Components (`LoginForm` and `RegisterForm`).
    *   *Interactive Form Controls*: 
        *   **Real-time Password Strength Meter**: Evaluates length, digit inclusion, casing variations, and special symbols to display a 4-stage visual color bar (Weak, Fair, Good, Strong) in real-time.
        *   **Passwords Match Visualizer**: Compares fields dynamically to prevent submissions when confirm password fails.
        *   **Plaintext Toggle Toggles**: Integrated show/hide eye icons on password inputs.
        *   **Isolated Transitions Hooks**: Utilizes React `useTransition` hooks to run login actions asynchronously, showing custom button loading spinners and disabling interactive elements to prevent multi-submit conflicts.
*   **Google & GitHub OAuth**: Fast, secure, one-click login utilizing Google and GitHub OAuth 2.0 credentials.
*   **Account Linking & Security**:
    *   Supports safe automatic account linking on matching verified email addresses (`allowDangerousEmailAccountLinking: true`), linking third-party logins with existing email/password records cleanly.
    *   OAuth callback URLs are configured as:
        *   **Google**: `http://localhost:3000/api/auth/callback/google` (production: `https://<your-domain>/api/auth/callback/google`)
        *   **GitHub**: `http://localhost:3000/api/auth/callback/github` (production: `https://<your-domain>/api/auth/callback/github`)
*   **User Provisioning**: New social login users are safely registered on first sign-in as active accounts defaulting to the `STUDENT` role with empty password hashes.
*   **JWT Sessions**: Encrypted client-side cookies storing active `userId`, `email`, and `role`.
*   **Next.js Middleware**: Intercepts requests to check authentication states. Automatically redirects unauthenticated users or restricts unauthorized routes:
    *   **STUDENT**: Can access `/student/*`, `/courses/*` (enrolled), and `/profile/*`. Blocked from `/teacher/*` and `/admin/*`.
    *   **TEACHER**: Can access `/teacher/*`, `/courses/*` (bypass enrollments), and `/profile/*`.
    *   **ADMIN**: Full platform access. Can manage all users, courses, categories, support tickets, and platform configurations. Admin stays on /admin/* routes always and does not redirect to /teacher/* routes. Can change password via /admin/settings/change-password. Can promote students to Teacher.
*   **Super Admin Protection**: A single permanent super admin account is seeded via `prisma/seed.ts` using an upsert strategy. The admin email is defined in `src/lib/admin-config.ts` as `SUPER_ADMIN_EMAIL`. This email is blocked from public registration. The admin account is protected at the Prisma middleware layer — `delete` and `deleteMany` operations on `ADMIN`-role users throw a hard error, preventing accidental removal from any admin UI or script.

---

## Admin Dashboard

Every admin page is protected — session and role === "ADMIN" verified on both page load and server actions.

| Page | URL | Function |
|------|-----|----------|
| Overview | /admin/dashboard | Real stats: students, teachers, courses, revenue |
| Users | /admin/users | View all users, search, filter, promote to Teacher |
| Courses | /admin/courses | All courses, publish/archive/delete |
| Course Detail | /admin/courses/[id] | Sections, lessons, enrollments |
| Categories | /admin/categories | Add, edit, delete categories |
| Support | /admin/support | Ticket list, reply, status update |
| Change Password | /admin/settings/change-password | Verify current, set new password |
| Platform Config | /admin/settings/platform | Site name, support email, maintenance mode |

---

## 9. Storage Strategy

To ensure unlimited architectural scalability while keeping the Postgres footprint light:

*   **Course Videos**: Stored on YouTube as unlisted videos. Course schemas store unlisted URLs only, preventing heavy video hosting costs.
*   **Digital Files / Course Materials**: Hosted in **Cloudflare R2** buckets. Files (such as PDFs, ZIP files, and project assets) are accessed via public CDN URLs with custom domains.
*   **PostgreSQL Metadata Approach**: The database stores file URLs, R2 asset keys, and size metadata only. No binary file content is directly committed into the PostgreSQL database, preserving lightning-fast query times.

---

## 10. Payments (Razorpay Integration)

The platform integrates a complete **Razorpay Transactional Workflow**:

1.  **Checkout Hook**: Clicking "Pay with Razorpay" triggers a POST request to `/api/payments/razorpay` to generate a secure Razorpay order.
2.  **Payment Dialog**: The client launches the Razorpay Checkout Modal (`https://checkout.razorpay.com/v1/checkout.js`). In sandbox development, standard test visas (e.g. `4111 1111 1111 1111`) are accepted.
3.  **Webhook Validation**: Upon a successful payment charge, Razorpay issues a secure callback to `/api/webhooks/razorpay`.
4.  **HMAC-SHA256 Signature Verification**: The server calculates the expected signature using `RAZORPAY_WEBHOOK_SECRET` and matches it against the header payload.
5.  **Activation**: Once verified, the server flags the `Order` as `PAID`, marks the associated `Payment` as `SUCCEEDED`, and executes background `Enrollment` creation to unlock access.
6.  **Offline Simulation**: A development-only server action `simulatePaymentSuccessAction` is available on the checkout page to simulate successful payment flows instantly without web tunnels.

---

## 11. Email System (Brevo Integration)

The platform is equipped with a server-side **Brevo Email Client** that utilizes Brevo's SMTP REST API for transactional notifications:

*   **Ultra-lightweight Client**: Native HTTP `fetch` integrations inside `src/lib/email/service.ts`. Avoids heavy library compilation issues.
*   **Fail-Soft Operation**: If `BREVO_API_KEY` is missing in the local environment, the client logs the payload to the developer terminal, preventing system crashes during local testing.
*   **Visual Layout Templates**: Full HTML and text-fallback formats styled with a custom responsive template layout:
    *   *Welcome Email*: Outlines the platform features upon new user registration.
    *   *Enrollment Confirmation*: Triggered immediately when a course enrollment activates.
    *   *Payment Receipt*: Displays transaction breakdowns in standard INR/USD currencies.
    *   *Order Confirmation*: Dispatched when an invoice ledger is created.
    *   *Certificate Issued*: Issued when a student completes all course lessons.
    *   *Support Ticket Reply*: Sends admin ticket resolutions directly to student inboxes.
    *   *Password Reset*: Sends time-bound secure reset links.

---

## 12. Notifications (FCM Integration)

*   **In-App Alerts Desk**: Mounted tray notification dropdown visible on student/teacher dashboards. Instantly alerts students on order completion, support updates, or certificate issuances.
*   **Firebase FCM Integration**: Uses Firebase Admin SDK server-side to dispatch real-time background and foreground push notifications to the student's browser.
*   **Silent Fallback**: Background processes check for registration tokens and proceed silently if browser notifications are disabled, preventing system stalls.

---

## 13. Environment Variables

Create a `.env` file in the root directory and configure the variables based on the template below:

```ini
# =========================================================================
# LMS + Digital Store Platform — Environment Variables Config
# =========================================================================

# -------------------------------------------------------------------------
# Core App & Database
# -------------------------------------------------------------------------
# PostgreSQL connection string for Prisma ORM
DATABASE_URL="postgresql://postgres:password@localhost:5432/e_learning?schema=public"

# Cryptographically random secret string to sign/encrypt NextAuth JWT cookies
AUTH_SECRET="replace-with-a-long-random-32-character-secret"

# Absolute base URL of the NextAuth handler (e.g. http://localhost:3000)
NEXTAUTH_URL="http://localhost:3000"

# Public domain of the web application for links and static paths
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth Client Credentials
GOOGLE_CLIENT_ID="replace-with-google-client-id"
GOOGLE_CLIENT_SECRET="replace-with-google-client-secret"

# GitHub OAuth Client Credentials
GITHUB_CLIENT_ID="replace-with-github-client-id"
GITHUB_CLIENT_SECRET="replace-with-github-client-secret"

# -------------------------------------------------------------------------
# Razorpay Payments Integration
# -------------------------------------------------------------------------
# Server-side merchant credentials
RAZORPAY_KEY_ID="rzp_test_placeholder_key_id"
RAZORPAY_KEY_SECRET="replace-with-your-razorpay-key-secret"

# Client-facing merchant key ID (must match RAZORPAY_KEY_ID)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_placeholder_key_id"

# Webhook signature validation secret
RAZORPAY_WEBHOOK_SECRET="replace-with-your-razorpay-webhook-secret"

# -------------------------------------------------------------------------
# Cloudflare R2 Storage (S3-Compatible API)
# -------------------------------------------------------------------------
# Cloudflare account dashboard identifier
R2_ACCOUNT_ID="replace-with-cloudflare-account-id"

# Access keys with read/write permissions for bucket uploads
R2_ACCESS_KEY_ID="replace-with-r2-access-key-id"
R2_SECRET_ACCESS_KEY="replace-with-r2-secret-access-key"

# Cloudflare R2 bucket name
R2_BUCKET="lms-digital-store-assets"

# Public CDN custom domain URL or dev subpath link
R2_PUBLIC_URL="https://pub-placeholder.r2.dev"

# Endpoint URL for standard S3 clients
R2_ENDPOINT="https://replace-with-cloudflare-account-id.r2.cloudflarestorage.com"

# -------------------------------------------------------------------------
# Firebase Cloud Messaging (FCM Push Notifications)
# -------------------------------------------------------------------------
# Server-side Firebase Admin SDK config credentials
FIREBASE_PROJECT_ID="lms-ai-notifications"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@lms-ai-notifications.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nreplace-with-private-key-lines\n-----END PRIVATE KEY-----\n"

# Client-side Firebase SDK configuration variables
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyPlaceholderApiKey"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="lms-ai-notifications.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="lms-ai-notifications"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="lms-ai-notifications.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"

# -------------------------------------------------------------------------
# Brevo Email System
# -------------------------------------------------------------------------
# Server-side API key for transactional emails
BREVO_API_KEY="replace-with-your-brevo-api-key"

# Outbound sender email address registered and verified in your Brevo console
BREVO_SENDER_EMAIL="noreply@e-learning.in"

# Display name of the sender
BREVO_SENDER_NAME="E-Learning Academy"

# -------------------------------------------------------------------------
# Optional Analytics Tracking
# -------------------------------------------------------------------------
# Google Analytics 4 Measurement ID (must start with G-)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

---

## 14. Local Development Setup

To run the application locally, follow these steps:

### 1. Install Dependencies
Ensure you have Node.js installed on your machine, then run:
```bash
npm install
```

### 2. Configure Local Database
Ensure PostgreSQL is running locally. Copy `.env.example` to `.env` and fill in your connection string:
```bash
cp .env.example .env
```

### 3. Run Database Migrations
Deploy the Prisma schema directly to your local database container:
```bash
npx prisma migrate dev
```

### 4. Seed Database Catalog
Populate your local store with digital playbooks, physical kits, bundles, and coupons:
```bash
npx tsx prisma/seed.ts
```

> **Note**: The seed also upserts a super admin account using the email defined in `src/lib/admin-config.ts`. Default seeded password is `Admin@123456` — **change this immediately after first login in production**.

### 5. Start Development Server
Start the local Next.js development engine:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 6. Verify Production Compilation & Type Checking
Verify the project compiles and checks type safety cleanly:
```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Compile production bundle output
npm run build
```

---

## 15. Deployment Guide

### Vercel Deployment (Frontend / Serverless)

1.  Connect your GitHub repository to **Vercel**.
2.  Set the Framework Preset to **Next.js**.
3.  Inject all keys detailed in `.env.example` into Vercel's **Environment Variables** dashboard.
4.  Add a Vercel deployment custom integration hook to run database migrations during build commands if desired, or run migrations manually before production builds.

### Database Hosting (PostgreSQL)

Ensure your PostgreSQL database is hosted on a high-availability cloud provider (such as Neon, Supabase, AWS RDS, or Aiven) with connection pooling enabled.
*   Append `?pgbouncer=true` or appropriate pooling configurations to your production `DATABASE_URL` string if using serverless environments like Vercel.

### Cloudflare R2 Bucket (Storage Setup)

1.  Create an R2 Bucket in your Cloudflare dashboard (e.g. `lms-digital-store-assets`).
2.  Configure CORS permissions to allow your web domain to request assets safely.
3.  Generate an **R2 API Token** with Edit/Read permissions to obtain access key identifiers.
4.  Add a custom domain or active subpath to retrieve static course images and PDFs via CDN.

### Brevo & Razorpay Production Keys

*   Swap your Razorpay API keys from `rzp_test_` to `rzp_live_` inside your environment variables.
*   Update `BREVO_SENDER_EMAIL` to match your registered, domain-validated sending address.

---

## 16. Production Readiness

The platform satisfies all criteria for a premium, stable production deployment:

*   **TypeScript Strict Safety**: The entire codebase compiles with zero TypeScript errors under strict type checking rules.
*   **Input Validation**: All forms, server actions, and endpoints enforce structured Zod parsing to prevent malicious inputs.
*   **Security Webhook Integrity**: Razorpay callback webhooks verify HMAC-SHA256 signature hashes, preventing fake orders or course activations.
*   **Complete Audit Logging**: Security-critical actions are auditable through database audit logs, logging states and actor credentials.
*   **Graceful Degrades**: System operations are designed to fail-soft (e.g. missing mail credentials or database static-compilations log warnings without crashing), ensuring high availability.

---

## 17. Screens / UX Overview

*   **Cinematic Homepage**: Features premium outcome-based cards, placement salary stats, live ticker banners, and an interactive coding terminal sandbox preview.
*   **Student Workspace Dashboard**: Progress trackers, continue-learning shortcuts, payment logs, support desks, and certificate generators.
*   **Teacher Management Area**: Layout editors to customize sections, publish lessons, upload R2 resources, manage categories, and audit tests.
*   **Zendesk-Inspired CRM Desk**: Admin split-pane support desk to read messages, categorize priorities, and resolve active tickets.
*   **Secure Checkout Drawer**: Premium invoice logs showcasing coupon updates, Razorpay gateways, and shipping address managers.
*   **Grading Test Engine**: Modern assessment screen showing time limits, question selectors, and auto-graded result summary charts.

---

## 18. Future Roadmap

Planned architecture and platform improvements include:

*   **Native Android/iOS Mobile Apps**: Exposing server-side actions as REST endpoints to power native mobile portals.
*   **Interactive AI Co-Pilot Support**: Integrating LLM agents inside coding lessons to help students debug logic in real time.
*   **Advanced Analytics Visualizer**: Canvas charts in the teacher workspace showing course completion percentages and quiz difficulty ratings.
*   **Live Stream Classes**: Scheduling live lectures with calendar synchronization.
*   **Outcome Recommendation Engine**: Dynamic student recommendation paths matching learning speeds to tech job openings.

---

## 19. Indian LMS UX & Admin Governance Updates

The platform has been enhanced with simplified, production-ready Indian student-focused LMS user experiences and hardened security policies:

### 1. Simplified Course Creation UX (Indian LMS First)
To remove confusing technical inputs for teachers and administrators, the course creation workflow now features streamlined controls:
*   **Searchable Category Dropdown**: Comma-separated category text inputs have been replaced with a real-time searchable dropdown. Available categories are loaded directly from the database and allow selecting an initial category.
*   **INR-Only Pricing**: The generic price in cents and currency selectors have been removed. Pricing is fixed to **INR (₹)** as the native currency. Admins enter normal rupee values (e.g. `499`, `999`, `4999`), which are automatically converted to cents (`* 100`) internally for transaction processors.
*   **YouTube Video ID Integration**: Full trailer URL inputs have been replaced with a simple **YouTube Video ID** input (e.g., `dQw4w9WgXcQ`). The platform automatically builds and stores the canonical watch URL (`https://www.youtube.com/watch?v=...`) internally.
*   **Direct Banner Upload Flow**: Manual cover image URL pasting has been eliminated. The form features a premium drag-and-drop / click-to-select local file uploader that performs automatic validation, uploads assets securely via `/api/courses/upload-banner` to Cloudflare R2, and displays an instant cover preview with removal controls.

### 2. Hardened Password Governance (Admin & Student Registrations)
The platform includes enhanced credential security controls for both administrators and public student registrations:
*   **5-Rule Strong Credentials Validation**: Passwords must strictly satisfy the following criteria:
    *   Minimum **8 characters** in length
    *   At least **one uppercase letter** (A-Z)
    *   At least **one lowercase letter** (a-z)
    *   At least **one number** (0-9)
    *   At least **one special character** (e.g., `@`, `$`, `!`, `%`, `*`, `?`, `&`)
*   **Interactive Password Strength Meter**: The `/admin/settings/change-password` viewport and the public `/register` viewport both embed a live, color-coded strength bar and a real-time criteria checklist that updates dynamically as the user types, displaying green checkmarks and matching validation.
*   **Secure Verification flow**: Administrative updates fully validate current passwords using `bcrypt` comparison matches before updates are committed, and public signups enforce these rules client-side.

### 3. Public Course Card Redesign & Custom Centered Confirmation Dialogs
*   **Public Course Listing Card**: Redesigned public course cards with modern visual architecture:
    *   **Immersive Thumbnail Hero Section**: 48px height with a custom dark gradient overlay (`bg-gradient-to-t from-black/80 via-black/20 to-transparent`) and top-left translucent category badges.
    *   **Aesthetic Typography Hierarchy**: Course titles overlaid directly on the banner with dual-line clamping, supported by flexible description bodies, dynamic section counts, and teacher names.
    *   **Advanced Rupee Price Row**: Visual logic distinguishing Free courses, regular Paid courses, and discounted paths (including strikethroughs and dynamic "% OFF" badges).
    *   **Hover-Lift Animation**: Standardized groups with dynamic `hover:-translate-y-1.5 hover:shadow-lg` for highly engaging micro-interactions.
    *   **Responsive Grid System**: Grid structure spanning 1, 2, 3, or 4 columns seamlessly across standard viewports.
*   **Custom Centered Confirmation Modals**: Replaced native browser `confirm()` alerts on the admin course management dashboard with beautiful custom glassmorphic modals, perfectly centered on the screen and optimized for both desktop and mobile viewports.
