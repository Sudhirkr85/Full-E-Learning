# E-Learning Platform — LMS + Digital Store (Premium Futuristic EdTech)

A production-grade, highly scalable, and SEO-optimized Learning Management System (LMS) combined with an integrated Digital & Physical Products Store. Built on Next.js 16 App Router, React 19, TypeScript, PostgreSQL, Prisma, Razorpay, Cloudflare R2, Brevo Email, Zustand, SWR, and Sonner, this platform features an immersive cinematic dark visual architecture for students, professionals, and career-oriented learners worldwide.

---

## 1. Project Overview

This platform represents a modern fusion of an advanced Educational portal and a transactional Digital Store. Designed to help software developers and tech students bridge the gap between academic theory and real-world system engineering, the application provides:

*   **Advanced LMS Ecosystem**: Student dashboards, lesson player modules, interactive assessments, real-world coding sandboxes, automatic course progress trackers, and public blockchain-verified digital certificates.
*   **Digital & Physical Products Store**: A built-in storefront catalog capable of processing independent digital downloads (PDF playbooks, code repositories), physical merchandise (vouchers, dashboard UI kits), course access keys, and complex product bundles.
*   **Platform Security & Architecture**: Strict separation of server-side logic using `server-only` and `"use server"` directives to prevent sensitive database logic (Prisma) from leaking into client bundles, ensuring high performance and secure production builds.
*   **Platform Metrics & Outcomes**: Immersive visual interfaces highlighting learner outcome statistics (completion rate, average rating, career growth, time-to-certificate), platform trust banners, and configurable social proof sections.

> **Homepage Content is Configurable**: All homepage text — hero headline, stats, feature highlights, skill tags, trust banner companies, outcome metrics, testimonials, certificate mockup, and CTA copy — is driven from a single central config file: [`src/lib/site.ts`](src/lib/site.ts). Edit the `siteConfig` object there to update the entire homepage without touching JSX.

---

## 2. Recent Improvements & Fixes (June 2026)

*   **LMS Classroom & Assessment Enhancements**:
    *   **Classroom Secure PDF Display**: Re-routed the playbook link in the classroom learning player to render PDF files directly in-page using the secure watermark-embedded `PdfReader` component instead of opening in external browser tabs.
    *   **Grades & Attempts Reset Actions**: Added student attempts reset triggers in both Admin and Teacher dashboards under the course detail "Students" tab to clear and reset quiz attempts, letting students retake quizzes if they failed and exhausted their attempts.
    *   **Mandatory Quiz Time Limit & Custom Attempt Limit**: Added mandatory quiz time limit checks and custom quiz attempt limit configuration fields during lesson creation in Admin and Teacher dashboards.
    *   **Distraction-Free MCQ & Centered Custom Dialogs**: Set MCQ options to default to 2 elements, hid raw alphabet/number option prefixes, and replaced all native browser `confirm` prompts in student quiz portals with premium, centered viewport-independent `<CustomPopup>` portals to ensure a premium UI experience.
    *   **Smooth Quiz Editing Experience**: Upgraded the quiz question builder in Admin and Teacher workspaces to perform client-safe updates (`router.refresh()`) rather than full-page reloads, ensuring the modal stays open for seamless addition of multiple questions.
    *   **Completion Guard**: Hidden the manual "Mark Complete" button for quiz lessons so that students can only pass and complete quiz lessons based on meeting the passing mark criteria.

*   **UI/UX Refinements**:
    *   **Admin Coupons Table Refinements**: Fixed a typographical error in the voucher campaigns table header (changing "Scope Scope" to "Scope") and styled all target scope badges to use high-contrast indigo colors (`text-indigo-300 bg-indigo-500/10`) for optimal readability against dark dashboard themes.
    *   **Selective Context-Aware Cart Visibility**: Integrated the `HeaderCartButton` component directly into the main navigation header. Enforced route-aware logic ensuring that the cart button is only rendered when there are items in the cart AND the user is browsing public storefront layouts (Home, Courses, Store, Cart), keeping the learning classroom dashboards completely distraction-free.
    *   **Homepage Cleanups**: Removed the duplicate "Featured Products" section markup from the homepage file.
    *   **Homepage Products Synchronization**: Synchronized the home page product query status filter from strictly checking for `"ACTIVE"` to matching both `"ACTIVE"` and `"PUBLISHED"` states. This ensures products successfully display on the homepage exactly as they do on the store catalog page.
    *   **Header Navigation Cleanup**: Removed the legacy, unused "About" link from both the desktop and mobile navigation headers.
    *   **Banner Upload Dimension Hints**: Added visual hints indicating recommended image dimensions (1280x720 pixels, 16:9 ratio) and maximum file size (5 MB) in course edit, course create, and store product creation fields to ensure uploaded banners fit properly in card boxes.
    *   **Homepage Course Card Thumbnail**: Rendered the course cover image/thumbnail at the top of the course card on the public homepage grid, matching the layout structure of the product cards.
    *   **Curriculum Lesson Detail Editor**: Added support for editing existing lessons (Video, Live Stream, Quiz, PDF Playbook) directly from the curriculum admin dashboard. Admins can update Titles, Descriptions, YouTube Video URLs, PDF materials, Live Scheduled Date/Time, and Free/Paid Preview flags.
    *   **Section Row Click Accordions**: Click anywhere on a section row header (except active action buttons) to toggle section expansion, instead of forcing users to click only on the tiny chevron/arrow.
    *   **Auto-Expanding Sections**: Automatically expand a section when clicking the "+ Content" button, allowing immediate and smooth entry of lesson details.
    *   **Interactive Certificates**: Added 3-step dynamic zoom (Off, 1.5x, 2.5x) and 2D overflow scrolling to the public certificate verification page for better mobile inspection.
    *   **Futuristic CTAs**: Redesigned "Buy Now" and "Add to Cart" buttons across the platform with a high-fidelity shimmer effect, interactive hover states, and premium gradients to drive conversion.
    *   **Classroom Navigation**: Added dedicated "Back to Courses" and "Home" navigation header in the lesson player for easy course navigation.
    *   **Mobile Experience**: Refined the wishlist count indicator in the mobile drawer with a vibrant pink-rose gradient badge and glow effect.
    *   **Navigation Synchronization**: Added the **"My Library"** link to the top-right profile avatar dropdown menu to perfectly align with the Student Sidebar navigation.
    *   **Professional Invoice Design**: Completely redesigned order confirmation invoices.

*   **Bug Fixes & System Stability**:
    *   **Dynamic Quiz MCQs**: Upgraded the Quiz builder options to support dynamic adding and deleting of options (starting with 2 empty options, placeholder-only labels, and a minimum of 2 choices).
    *   **Quiz Editor Visibilities**: Fixed the "Edit Question" buttons in the assessment builder list so they are fully visible with indigo accent styling, preventing white-on-white visual masking.
    *   **My Library Content Restrictions**: Restricted the student bookshelf query to strictly load `DIGITAL_RESOURCE` products, ensuring physical purchases do not mistakenly appear in the digital PDF library space.
    *   **Checkout Validation**: Fixed a logic error where the checkout API would reject valid items added from the homepage. The system now correctly validates both `PUBLISHED` and `ACTIVE` product states.
    *   **Guest Session Safety**: Implemented protective guards on the Cart and Checkout pages. Guests are now gracefully redirected to login with `callbackUrl` persistence instead of encountering "Unauthorized" errors.
    *   **Wishlist Logic**: Fixed the wishlist toggle behavior to correctly perform add/remove operations in a single click-cycle.
    *   **Link Integrity**: Removed dead support links (404) from the storefront.
    *   **YouTube Thumbnail Fallback**: Added robust fallback for YouTube video thumbnails to prevent 404 errors on missing maxresdefault images.
    *   **Fallback Product and Course Removal**: Cleaned the public landing page ([page.tsx](file:///d:/Work/E-Learning/src/app/(public)/page.tsx)) to stop rendering fallback items when no active courses or products exist in the database.
    *   **Coupon Discount Cap Enforcement**: Fixed a bug where coupon applications (e.g., `FLAT50` 50% discount coupon) ignored the configured maximum discount limit (`maxDiscountCents`). Enforced the cap in client-side recalculations on both the Cart Page and Store Drawer, as well as in the server-side `validateCouponAction` helper to ensure proper discounts are calculated everywhere.
    *   **Coupon Input Enter-Key Interception**: Intercepted the `Enter` keypress event inside coupon code input fields on the Cart Page and Store Drawer. This prevents the browser from automatically submitting the checkout payment form, and instead applies the coupon seamlessly.
    *   **Shipping Calculation Alignment**: Resolved an amount mismatch between client-side totals (which charged ₹40 under ₹499 subtotal) and server checkout calculations (which charged ₹50 under ₹500 subtotal) by standardizing all calculations to ₹40 shipping for physical orders under ₹499.
    *   **Post Office Default Courier Option**: Added "Post Office" (India Post) as the default courier partner option on the Admin Shipping Desk and Order Details desk by placing it at the top of the shared courier list configuration. Added full tracking support for Post Office shipments.
    *   **Automatic Shipping Status Initialization**: Configured order fulfillment logic across both Razorpay webhooks (captured/paid) and manual checkouts to automatically transition the shipping status of physical product orders to `"PROCESSING"` upon payment confirmation. This allows immediate shipping desk actions rather than leaving them in a static `"PENDING"` state.

## 2. Tech Stack

The architecture leverages modern, industry-standard technologies selected for performance, type-safety, and production scalability:

*   **Next.js 16 (App Router) & React 19**: Powers hybrid static/dynamic page compilers, React Server Components (RSC) for instantaneous page loading, Route Groups to organize dashboard boundaries, and highly secure Server Actions for data writes.
*   **TypeScript**: Complete compile-time type-safety and auto-completion across all backend services, database clients, and UI component models.
*   **Tailwind CSS**: Custom HSL color schemes, dynamic `.bg-grid-cyber` mesh layouts, translucent glassmorphism overlays, and hardware-accelerated animations.
*   **shadcn/ui**: Accessible, customizable layout components built on top of Radix UI primitives.
*   **PostgreSQL & Prisma ORM**: Robust, production-grade relational database layout utilizing UUID primary keys, indexed foreign relationships, and transaction-safe schema migrations.
*   **Razorpay**: Integrated payment gateway execution. Leverages server-side HMAC-SHA256 signature checking for webhooks and API verification to automatically activate student licenses/orders upon successful sandbox checkouts.
*   **Cloudflare R2**: Standard S3-compatible object storage used to host course files, downloadable source-code archives, student avatar uploads, and static images.
*   **Brevo Email Service**: Reusable fetch-based REST mailing client. Dispatches visually stunning HTML transactional notifications for student registrations, payment receipts, and security link changes.
*   **Auth.js (v5)**: Credentials provider login featuring secure JWT session encryption, role-based route middleware protection, and strict layout guards.
*   **Zustand (v5)**: State management for shopping cart synchronization, badge counts, and drawer toggles.
*   **SWR (v2)**: Client-side polling and validation for course enrollments, coupon validations, and payment status checks.
*   **Sonner (v2)**: Premium, self-dismissing toast alerts for feedback loop actions.

---

## 3. Core Features

The application contains the following fully implemented production modules:

### Navbar & Navigation
*   **Role-Based Navigation**: Public, Student, Teacher, and Admin navbar states with dynamic link rendering based on Auth.js session role.
*   **Mobile Responsive Drawer**: Hamburger menu with a full single unified left-aligned side drawer on viewports below 768px (`mobile-drawer.tsx`), featuring a premium user profile card at the absolute top and a Logout button at the bottom. Includes background body scroll-locks and Escape key listeners.
*   **Notification Bell**: Real-time unread badge for logged-in users.
*   **Avatar Dropdown**: Upgraded role-specific dropdown (Admin, Student, Teacher) matching the dashboard sidebar navigation links exactly, complete with an Identity Header, My Profile shortcut, and elegant low-opacity glass dividers.

### Authentication & Role Isolation
*   **Auth.js Engine**: Enforces STUDENT, TEACHER, and ADMIN credentials. Includes automatic redirection gates via Next.js Middleware.

### Store & Checkout
*   **Wishlist System**: Integrated wishlist management with persistent storage and instant toggle (Add/Remove) functionality across product cards and detail pages.
*   **Smart Storefront**: Unified product listing supporting "In Your Cart" status detection and interactive "Buy Now" triggers.
*   **Secure Checkout Pipeline**: Multi-stage order processor with client-side validation, server-side inventory checks (ACTIVE/PUBLISHED status), and Razorpay payment fulfillment. Supports role-based access for course specific links.

### Student Experience
*   **Certificate Mastery**: Advanced certificate previewer with multi-directional scroll, dynamic zoom levels, and authenticated verification links.
*   **Immersive Detail Designs**: Course and Store Detail pages featuring cinematic gradients, shimmer-effect CTA buttons, and high-conversion "Express Checkout" buttons.
*   **Role Redirect Protection**: Strict Middleware containment path routing. Students are isolated to `/student/*`, Teachers to `/teacher/*`, and Admins to `/admin/*`. Accessing incorrect portals triggers automatic redirection back to the user's correct home dashboard to avoid cross-workspace breaches.
*   **Credentials & OAuth 2.0**: Email-only credential accounts utilizing salted `bcryptjs` encryption, alongside Google and GitHub OAuth 2.0 logins with allowDangerousEmailAccountLinking support.
*   **Interactive Authentication UI**:
    *   *Real-time Password Strength Meter*: Evaluates length, digit inclusion, casing variations, and special symbols to display a 4-stage visual color bar (Weak, Fair, Good, Strong) in real-time.
    *   *Passwords Match Visualizer*: Compares fields dynamically to prevent submissions when confirm password fails.
    *   *Plaintext Toggle Toggles*: Integrated show/hide eye icons on password inputs.
    *   *Isolated Transitions Hooks*: Utilizes React `useTransition` hooks to run login actions asynchronously, showing custom button loading spinners and disabling interactive elements to prevent multi-submit conflicts.
*   **Forgot/Reset Password**: Transaction-safe flow utilizing secure server actions, JSON metadata token storage, and Brevo SMTP email links.
*   **Super Admin Protection**: A single permanent super admin account defined via `SUPER_ADMIN_EMAIL` in `src/lib/admin-config.ts` which is protected at the Prisma middleware layer (blocking `delete` and `deleteMany` operations).

### Admin Dashboard
*   **Overview Desk**: Full dashboard featuring SaaS aggregates (trend-indicating stat cards, dynamic Recharts Pie & Bar visualizations, and a live recent enrollments database table).
*   **Hardened Navigation**: Custom sidebar navigation with 'My Profile' and direct configuration shortcuts.
*   **User Desk**: View all users, search, filter, and execute promotions (promoting a student to the TEACHER role).
*   **Category Desk**: Complete CRUD panel to manage learning categories via interactive dropdowns.
*   **Enrollment & Orders Desk**: Full platform-wide student enrollment viewer with search, filter by status, progress bars, and metric cards. Features a **Total Platform Revenue** card tracking Course and Store sales together with clear sub-breakdowns (avoiding double-counting). Separate Store Orders tab showing only PDF, Physical, Bundle, and Membership purchases (strictly excluding `COURSE_ACCESS` orders) with payment status, product type icons, amount paid in ₹ INR, and dedicated empty states.
*   **Coupon Management Desk**: Robust admin dashboard at `/admin/coupons` with KPI metric counters (Total Coupons, Active Promos, Expired, Total Redemptions), full CRUD creation forms with alphanumeric sanitization, starts/ends date formatting wrappers, and usage tracking tables.
*   **Overview Metrics Upgrade**: Displays 'Wishlisted' total count cards for the specific course so admins can track learner interest metrics.
*   **Courier Mapping Dropdown**: Admin updates physical orders dispatch records selecting partner carriers directly from a secure standard `COURIER_LIST` drop-down (supporting custom fields fallback).

### Teacher Workspace
*   **Teacher Overview Dashboard**: Full Overview at `/teacher/dashboard` featuring welcome panels, aggregate metric charts (Total Courses, Students, Active Seats, Avg Completion), responsive Recharts visual Area/Donut timelines, tabbed live activity feeds, and owned course shell listings.
*   **My Students Directory**: Course-scoped enrollment viewer at `/teacher/enrollments` showing only students enrolled in the teacher's own courses (excluding payment/revenue data).
*   **Course Details Dashboard**: Teacher course details page (`/teacher/courses/[courseId]`) fully mirroring the Admin Workspace's cinematic Course Details tabbed UI (Overview, Curriculum, Students, Analytics, Settings) featuring the "Teacher Workspace Desk" badge label. Teachers can edit course metadata, configure curriculum sections and lessons, design graded timed quizzes using the Quiz Assessment Designer, manage co-teachers, and view assigned students, with all operations securely guarded via teacher-scoped session permissions and executed via `@/lib/courses/actions.ts`.
*   **Live Classes Management**: Create, update, and schedule live interactive class lessons (using YouTube Live stream URLs) with specific execution dates, Indian Standard Time zone displays, and automated status tracking (Upcoming, Live, Ended).
*   **Overview Metrics Upgrade**: Displays 'Wishlisted' total count cards showing how many prospective learners saved the course.

### Student Dashboard & Secure Library
*   **Dashboard Portal**: Quick access links, enrolled courses progress bars, continue-learning shortcuts, transaction receipt logs, a dedicated **Upcoming Live Classes** section, and a **Recently Wishlisted** panel.
*   **Upcoming Live Classes**: Displays up to 3 upcoming scheduled live classes for enrolled courses with real-time countdown clocks, IST formatted timings, custom `.ics` calendar appointment downloads, and quick-joining actions.
*   **My Wishlist Dashboard**: Dedicated wishlist dashboard page at `/student/wishlist` allowing students to browse and manage saved courses with enrollments triggers, discount ratios, and empty states.
*   **My Library Bookshelf**: Located at `/student/library`. Displays all purchased digital playbooks and resources (type `DIGITAL_RESOURCE`) with cover thumbnail grids, purchase dates, and description cards.
*   **Secure PDF online Reader**: Embedded secure PDF viewer desk at `/student/orders/[orderId]/pdf-viewer`. Integrates strict UUID validation checks on parameters to prevent PostgreSQL database casting faults and protects PDF materials by streaming document data securely from Cloudflare R2 storage without exposing direct file downloads.
*   **Verified Course Certificates**: Auto-generates a cryptographic certificate of completion upon 100% course syllabus progress, downloadable as a styled A4 landscape PDF and shareable via public `/verify/[certificateId]` routes. Features a premium interactive previewer with Zoom (In/Out/Reset) and multi-directional scrolling/panning support.
*   **5-Stage Student Shipping Timeline Tracker**: Automatically traces physical order status timelines, drawing custom color pulses on the current transition stage, enabling clipboard-copies, and returning deep-links to tracking systems dynamically.

### Store & Checkout System
*   **Cinematic Dark Glassmorphic Product Cards**: Store product cards upgraded with high-end glassmorphic visuals featuring beautiful green `% OFF` discount badges calculated dynamically from metadata.
*   **Store Management**: Admin can create and manage PDF Books and Physical Products with complete **INR pricing** controls, including a dedicated **Original Price** field alongside the Sale Price in a sleek 3-column admin form. Supports drag-and-drop PDF document uploads with responsive, simplified success indicators (hiding raw URLs). Fully separate from LMS course flow.
*   **Reactive Zustand Cart Store**: Powered by a centralized `zustand` store (`cart-store.ts`) that manages cart state, badge tallies, drawer opens, and persistent localStorage syncs. On viewports below `768px`, the header cart button intelligently shifts from opening the desktop cart drawer to rendering a dedicated, high-fidelity, full-screen mobile `/cart` page with uniform w-8 h-8 quantity selectors, custom coupon handlers, and responsive desktop width overrides.
*   **Stale Cart Item Pruning & Silent Validation Engine**: Automatically verifies item existence, active state, and inventory count on page load, drawer open, and checkout. It dynamically cleanses the cart of deleted/unpublished products without blocking checkouts on remaining valid items, displaying elegant self-dismissing Sonner Toast alerts and instantly syncing cart badge counters.
*   **Universal Coupon Processor**: In-cart coupon verification checks dynamically validating minimum order totals, flat-rate/percentage discounts, dates, and applies-to restrictions. Enforces alphanumeric input sanitization.
*   **Direct Razorpay Localized Checkout**: Bypasses intermediate pages to open Razorpay modal overlay directly. Prefills user profile name, email, and mobile data, collects primary/secondary shipping numbers, and handles localized Indian address formatting.
*   **Order Confirmation & Async Verification Polling Page**: Renders at `/order/[orderId]/confirmation`. Features a dark glassmorphic design and automatically polls the API using SWR every 2 seconds to transition smoothly when webhook callbacks resolve payment. Handles timeouts (>60s) with detailed processing advice, displays item receipts in ₹ INR, fails safely, and contains sharing modules. (Broken "Contact Support" buttons removed as per user request).

### Courses & Lesson Navigation
*   **Courses Catalog**: Cinematic public grid at `/courses` displaying active categories, visual filters, INR prices, strikethrough original prices, and direct enroll/continue learning buttons.
*   **Sticky Purchase Cards**: Responsive sticky sidebar purchase cards on details pages featuring high-contrast gradient call-to-actions, localized currency formatting, and an improved visual hierarchy that prioritizes the "Buy Now" flow over secondary actions. Includes dynamic subtotal calculations and tax-inclusive labeling.
*   **Lesson Player & Progress Tracking**: Immersive video/article lesson interface that registers completed and paused states, updating course progress percentages instantly. Upgraded to a premium, distraction-free **Plyr Custom Video Player** that streams YouTube assets securely via CDN assets (zero local package bloat). It overlays beautiful, customized dark Indigo playback controls, hides native ads, branding overlays, and recommends, and implements native mobile **Landscape Screen Orientation locking** programmatically when full-screen triggers.
*   **Live Class Streaming**: Supports live lesson streams (`LIVE` type) using YouTube Live integrations. Renders countdown widgets, dynamic live status badges, automated schedule checking, and fallback recorded player widgets.
*   **Wishlist Button Integration**: Embedded heart toggle button overlays on both the public course catalog cards and details sticky purchase panels supporting client-side optimistic Zustand sync states.
*   **Verified Review Self-Editing Flow (PUT Integration)**:
    *   Secure Multi-Method API: PUT handler inside `/api/courses/reviews` endpoint validates sessions and active student course enrollments, updating ratings and comments securely.
    *   Pulsing Edit CTAs: When an enrolled student has already published a review, the header triggers an animated "Edit Your Review" action that pre-fills values and lets them edit their review.

### Assessments (Tests & Quizzes)
*   **Immersive Quiz Designer**: Administrative workspaces featuring drag-and-drop question listings, centered layout panels, and modal question creators.
*   **Timed Student Quiz Portal**: Timing modules syncing with PostgreSQL databases, case-sensitivity checking on short answers, multiple question type support, and instant grading analytics.

### Layout-Independent Viewport Portal Popups
*   Replaced all native browser alert/confirm dialogues and tracking shipment overlays with a premium, layout-independent React Portal system (`createPortal` to `document.body`). This guarantees that all modal dialogues, confirm boxes, and dispatch cards escape parent layout containment clips, remain perfectly centered in the active browser viewport, and automatically trigger focus and smooth-scroll on primary action CTAs.

---

## 4. Database Schema

The database is built on **PostgreSQL** and managed using **Prisma ORM**. The schema is optimized with indexes and cascading deletions where appropriate:

### Core Models

*   **`User`**: Account identity records (name, email, phone, credentials, role: STUDENT, TEACHER, ADMIN).
*   **`Category`**: Parent-child nested hierarchy categories mapping courses.
*   **`Course`**: Root learning course outlines containing lessons, reviews, and test sheets.
*   **`CourseSection`**: Syllabus modules organizing lesson play scopes.
*   **`Lesson`**: Singular video, article, resource, quiz, or live class content. Supports `VIDEO`, `ARTICLE`, `RESOURCE`, `QUIZ`, and `LIVE` content types with `scheduledAt` datetime tracking.
*   **`LessonResource`**: Supplemental downloadable files (hosted on Cloudflare R2) or external links.
*   **`Enrollment`**: Mapped table connecting users to courses, containing Razorpay transaction records.
*   **`CourseProgress`**: Real-time progress monitoring (percentage completion, lessons completed).
*   **`LessonProgress`**: Tracks completion state and dates for individual lessons per user.
*   **`CourseReview`**: Student feedback, comments, and rating reviews for courses.
*   **`Wishlist`**: User-saved bookmarks of catalog items.
*   **`Test`**: TIMED assessments, quizzes, and grading scripts.
*   **`Question` & `Option`**: Multiple-choice, true/false, or short-answer database details.
*   **`Attempt` & `AttemptAnswer`**: Records student assessment sessions and answers.
*   **`Product`**: Store item details (shipping checks, PDF downloads, stock metrics).
*   **`Coupon` & `CouponUsage`**: Global and target applies-to campaign structures.
*   **`Order` & `OrderItem`**: Commercial transaction records. `Order` holds dedicated shipment columns (`courierName`, `trackingNumber`, `shippingStatus` enum, `shippedAt`, `deliveredAt`).
*   **`Payment`**: Captures invoice ledger entries linked to orders.
*   **`Notification`**: Standardized in-app messages and notifications.
*   **`Certificate`**: Public blockchain-verified canonical certificate records.
*   **`CartItem`**: Persistent cart records.
*   **`Review`**: Digital store product reviews.

### Database Connection Reliability & Neon Pooling
To prevent connection drops in hot-reloading serverless setups, the architecture enforces:
1.  **Dual Connection Paths**: A pooled connection (`DATABASE_URL`) utilizing Neon's pgBouncer subdomain with `pgbouncer=true` for query actions, and a direct link (`DIRECT_URL`) strictly for migrations.
2.  **Singleton Prisma Instance**: Prevents Next.js from creating connection instances during hot-reloads via `src/lib/prisma.ts`.
3.  **Backoff Connection Wrapper (`withRetry`)**: Automatically intercepts cold-start connection timeouts and retries database queries safely (`src/lib/db.ts`).

---

## 5. API Routes

The following Next.js REST API routes are fully implemented in `src/app/api`:

### Authentication
*   `POST /api/auth/[...nextauth]` — Auth.js core credential controllers and social callbacks.

### Checkout & Store Transactions
*   `POST /api/checkout` — Generates a standard Razorpay checkout order for cart products.
*   `POST /api/checkout/free` — Processes free product checkouts when coupon codes reduce amounts to ₹0.
*   `POST /api/checkout/verify` — Validates Razorpay payments for digital/physical products using HMAC-SHA256 signatures, transitioning status to `PAID`.

### Courses & Classroom
*   `GET /api/courses/[courseId]/enrollment-status` — Polling route fetching SWR enrollment status for active students.
*   `POST /api/courses/enroll/checkout` — Initiates Razorpay checkout orders for LMS courses.
*   `POST /api/courses/enroll/free` — Automatically registers students into free courses.
*   `POST /api/courses/enroll/verify` — Cryptographically verifies course checkout signatures and unlocks course access.
*   `POST /api/courses/enroll/fail` — Callback logging telemetry details for abandoned payment attempts.
*   `POST | PUT /api/courses/reviews` — Creates or edits student course review feedback under secure session checks.
*   `GET /api/wishlist` — Retrieves list of wishlisted courses for the currently logged in student.
*   `POST /api/wishlist` — Toggles the wishlisted state of a course for the student.

### Store Management & Uploads
*   `GET /api/store/products/[id]` — Retrieves digital store product detailed metadata.
*   `POST /api/courses/upload-banner` — Secures Cloudflare R2 bucket banner images upload.
*   `POST /api/courses/upload-pdf` — Secures Cloudflare R2 bucket curriculum materials upload.
*   `POST /api/profile/avatar` — Uploads and updates student profile images in Cloudflare R2.
*   `POST /api/profile` — Saves student details (First name, Last name, Phone).

### Certificates & Verifications
*   `GET /api/certificates/[certificateId]/download` — Renders and downloads student certificate of completion as a styled PDF.
*   `GET /api/certificates/[certificateId]/verify` — Publicly verifies the authenticity of a certificate verification code and returns data JSON.

### Coupons & Promos
*   `POST /api/coupons/validate` — Validates coupon codes against user, scopes, date range, and usage limits.
*   `POST /api/admin/coupons` — Admin coupon creation endpoint.
*   `GET | PUT | DELETE /api/admin/coupons/[id]` — Admin coupon operations.
*   `GET /api/admin/coupons/[id]/usage` — Audits CouponUsage histories.

### Razorpay Webhook Gateway
*   `POST /api/razorpay/fail` — Records checkout failures and updates database Order status to `CANCELLED`.
*   `POST /api/razorpay/verify` — Standard digital product verification handler.
*   `POST /api/razorpay/webhook` — Async payment gateway webhooks tracking `payment.captured` and `payment.failed` directly from Razorpay.
*   `POST /api/webhooks/razorpay` — Webhook backup processor.

### Support & Dev Utilities
*   `GET /api/dev/test-email` — Developer-only email preview and SMTP testing panel.
*   `GET /api/orders/[orderId]/status` — Polling route checking payments status for order confirmation screens.
*   `GET /api/student/orders` — Fetches transaction orders history for students.
*   `GET /api/student/orders/[orderId]/pdf-access` — Validates order tokens and streams secure PDF files safely.
*   `POST /api/admin/orders/[orderId]/shipping` — Admin shipment courier registration and courier tracking updates.
*   `GET /order/[orderId]/confirmation` — Renders order payment success, pending processing, or failure screens.

---

*   **Secure Student Bookshelf**: Added `/student/library` and secure PDF iframe viewer to stream books directly from Cloudflare R2 with UUID injection guard checks.
*   **Direct Checkout Engine**: Bypasses intermediate screens during checkout to launch Razorpay modals directly from Zustand cart drawer or full-screen mobile `/cart` pages.
*   **Admin Coupons Module**: Integrated dashboard CRUD screens at `/admin/coupons` allowing granular discounts configuration with alphanumeric sanitization rules.
*   **Course Feedback PUT integration**: Upgraded `/api/courses/reviews` endpoint to accept `PUT` requests, allowing students to modify ratings or reviews without duplicated records.
*   **Verified Course Certificates**: Auto-generate cryptographically signed certificates of completion upon 100% course progress with A4 landscape PDF downloads, student certificates desk, admin revoke panel, and public verification pages.
*   **Plyr Custom Video Controls**: Replaced native playback blocks with a lightweight CDN player providing customized color palettes and mobile landscape locking structures.
*   **Student Profile Menu Update**: Synchronized the top-right profile dropdown menu links with the sidebar navigation system by introducing the "My Library" page route.
*   **Secure Digital Library Filtering**: Confined the library query strictly to items of type `DIGITAL_RESOURCE` so that physical product purchases do not render in the bookshelf library area.
*   **Fallback Assets Deletion**: Completely removed the legacy `fallbackCourses` and `fallbackProducts` mock arrays from the `siteConfig` file ([site.ts](file:///d:/Work/E-Learning/src/lib/site.ts)) to keep the code footprint clean and production-focused.

---

## 7. Environment Variables

Create a `.env` file in the root directory and configure the variables based on the template below:

```ini
# =========================================================================
# LMS + Digital Store Platform — Environment Variables Config
# =========================================================================

# -------------------------------------------------------------------------
# Core App & Database
# -------------------------------------------------------------------------
DATABASE_URL="postgresql://postgres:password@localhost:5432/e_learning?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/e_learning?schema=public"

AUTH_SECRET="replace-with-a-long-random-32-character-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="replace-with-google-client-id"
GOOGLE_CLIENT_SECRET="replace-with-google-client-secret"
GITHUB_CLIENT_ID="replace-with-github-client-id"
GITHUB_CLIENT_SECRET="replace-with-github-client-secret"

# -------------------------------------------------------------------------
# Razorpay Payments Integration
# -------------------------------------------------------------------------
RAZORPAY_KEY_ID="rzp_test_placeholder_key_id"
RAZORPAY_KEY_SECRET="replace-with-your-razorpay-key-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_placeholder_key_id"
RAZORPAY_WEBHOOK_SECRET="replace-with-your-razorpay-webhook-secret"

# Steps to set up webhook in Razorpay Dashboard:
# 1. Go to https://dashboard.razorpay.com → Settings → Webhooks
# 2. Click "Add New Webhook"
# 3. URL: https://yourdomain.com/api/razorpay/webhook
# 4. Secret: paste the value of RAZORPAY_WEBHOOK_SECRET
# 5. Events to enable: payment.captured, payment.failed
# 6. Copy the secret shown and paste it in your active environment variables file (.env)

# -------------------------------------------------------------------------
# Cloudflare R2 Storage (S3-Compatible API)
# -------------------------------------------------------------------------
R2_ACCOUNT_ID="replace-with-cloudflare-account-id"
R2_ACCESS_KEY_ID="replace-with-r2-access-key-id"
R2_SECRET_ACCESS_KEY="replace-with-r2-secret-access-key"
R2_BUCKET="lms-digital-store-assets"
R2_PUBLIC_URL="https://pub-placeholder.r2.dev"
R2_ENDPOINT="https://replace-with-cloudflare-account-id.r2.cloudflarestorage.com"

# -------------------------------------------------------------------------
# Brevo Email System
# -------------------------------------------------------------------------
BREVO_API_KEY="replace-with-your-brevo-api-key"
BREVO_SENDER_EMAIL="noreply@e-learning.in"
BREVO_SENDER_NAME="E-Learning Academy"
```

---

## 8. Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Local Database
Ensure PostgreSQL is running, then copy `.env.example` to `.env` and configure credentials:
```bash
cp .env.example .env
```

### 3. Run Database Migrations
```bash
npx prisma migrate dev
```

### 4. Seed Database Catalog
```bash
npx tsx prisma/seed.ts
```
*(Default admin email is set as `admin@yourapp.com` with password `Admin@123456` directly inside the seed script)*

### 5. Start Development Server
```bash
npm run dev
```

### 6. Verify Production Compilation & Type Checking
```bash
npx tsc --noEmit
npm run build
```

---

## 9. Deployment Guide

### Vercel Deployment
1. Connect github repository to Vercel.
2. Inject environment variables into settings panel.
3. Configure build step command to run: `prisma generate && next build`.

### Storage Setup
*   Create Cloudflare R2 Bucket, configure CORS rules, and generate access tokens.
*   Update R2 endpoints variables in `.env`.

---

## 10. Production Readiness

*   **Strict Type-Safety**: Base code compiles without errors (`npx tsc --noEmit`).
*   **Secured Checkouts**: Razorpay integration enforces cryptographic HMAC signature checking on both user callbacks and webhooks.
*   **Fail-Soft Operation**: SMTP actions fall back to logging payloads if environment credentials are absent, preventing runtime server crashes.
