/**
 * Centralized Google AdSense Route & Data Eligibility Rules (Fail-Closed Architecture)
 * 
 * Strict placement rules:
 * - Allowed ONLY on:
 *   1. Public educational blog articles and listing (/blog, /blog/*)
 *   2. Public PDF-reading pages (/blog/*)
 *   3. Genuinely free mock tests / courses landing pages only when verified public,
 *      free of charge (priceCents === 0), and requiring no paid enrollment.
 * 
 * - Strictly PROHIBITED on:
 *   - Admin dashboards and management (/admin, /admin/*)
 *   - Authentication pages (/login, /register, /forgot-password, /reset-password, /logout)
 *   - Student / Teacher private dashboards (/student/*, /teacher/*, /dashboard, /dashboard/*, /profile, /profile/*)
 *   - Paid courses, paid tests, paid lessons, and checkout flows (/cart, /checkout/*, /order/*, /payment)
 *   - Active test-taking interfaces, timers, questions, and classroom quizzes (/courses/[slug]/tests/*, /learn, etc.)
 *   - Legal policies and compliance pages (/privacy-policy, /terms, /refund-policy, /disclaimer)
 *   - Unknown routes and routes with unverified access status (Fail-Closed by default)
 */

export interface AdContext {
  /** Course or test price in paise (0 = free, >0 = paid) */
  priceCents?: number | null;
  /** Explicit free resource flag */
  isFree?: boolean;
  /** Explicitly verified public access (not behind auth or login) */
  isPublic?: boolean;
  /** Whether the resource is behind a paid enrollment requirement or paywall */
  isPaid?: boolean;
  /** Whether paid enrollment is required to access the content */
  requiresEnrollment?: boolean;
  /** User role, if authenticated */
  userRole?: string | null;
}

// Prohibited route path prefixes
const PROHIBITED_PATH_PREFIXES = [
  "/admin",
  "/dashboard",
  "/student",
  "/teacher",
  "/profile",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/logout",
  "/cart",
  "/checkout",
  "/order",
  "/order-confirmation",
  "/payment",
  "/verify",
  "/certificates/verify",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
  "/disclaimer",
  "/api",
];

// Subpaths indicating active testing, timers, questions, classroom quizzes, or private lessons
const PROHIBITED_SUBPATH_PATTERNS = [
  "/tests/",
  "/tests",
  "/lessons/",
  "/learn",
  "/resources/",
  "/quiz/",
];

/**
 * Normalizes a URL pathname for uniform policy evaluation
 */
function normalizePath(pathname: string): string {
  if (!pathname) return "";
  return pathname.toLowerCase().split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
}

/**
 * Checks if the route path itself qualifies for ad placement (Fail-Closed Whitelist)
 */
export function isPathEligible(pathname: string): boolean {
  if (!pathname) return false;
  
  const cleanPath = normalizePath(pathname);

  // 1. Immediately reject any prohibited prefix
  for (const prefix of PROHIBITED_PATH_PREFIXES) {
    if (cleanPath === prefix || cleanPath.startsWith(`${prefix}/`)) {
      return false;
    }
  }

  // 2. Immediately reject any active test taking, private lesson, or quiz subpath
  for (const pattern of PROHIBITED_SUBPATH_PATTERNS) {
    if (cleanPath.includes(pattern)) {
      return false;
    }
  }

  // 3. Allowed Whitelist:
  // Public blog articles and listing
  if (cleanPath === "/blog" || cleanPath.startsWith("/blog/")) {
    return true;
  }

  // Course catalog overview
  if (cleanPath === "/courses") {
    return true;
  }

  // Course informational landing pages (e.g. /courses/nmms-free-quiz)
  // Must NOT be a subpath like /lessons, /tests, or /learn (already checked above)
  if (cleanPath.startsWith("/courses/")) {
    return true; // Still subject to mandatory isDataEligible check
  }

  // Fail-closed default: any unknown route (e.g. /, /store, /vip-telegram) is ineligible
  return false;
}

/**
 * Validates data-aware access and pricing to ensure NO ads ever appear on paid or private content.
 * Follows strict fail-closed policy: missing or incomplete metadata on course/test routes returns false.
 */
export function isDataEligible(pathname: string, context?: AdContext): boolean {
  const cleanPath = normalizePath(pathname);

  // Blog posts are static, public, non-monetized educational resources compiled by the coaching center
  if (cleanPath === "/blog" || cleanPath.startsWith("/blog/")) {
    if (context?.isPaid === true) return false;
    if (typeof context?.priceCents === "number" && context.priceCents > 0) return false;
    return true;
  }

  // For course and test routes, access and pricing MUST be explicitly confirmed public and free
  if (cleanPath.startsWith("/courses")) {
    // If context is missing, fail-closed: cannot verify access status
    if (!context) {
      return false;
    }

    // Explicit rejections
    if (context.isPaid === true) return false;
    if (context.requiresEnrollment === true) return false;
    if (context.isFree === false) return false;
    if (typeof context.priceCents === "number" && context.priceCents > 0) return false;

    // Explicit confirmations required: must be explicitly public, free, and priceCents === 0
    if (context.isFree === true && context.isPublic === true && context.priceCents === 0) {
      return true;
    }

    // Default fail-closed for course routes
    return false;
  }

  // Unknown route type defaults to false
  return false;
}

/**
 * Master check combining route-awareness, data-pricing, and site approval status.
 */
export function canServeAds(
  pathname: string, 
  context?: AdContext
): { eligible: boolean; reason: string } {
  // Master kill-switch: disabled by default until approval established
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
  if (!adsEnabled) {
    return {
      eligible: false,
      reason: "Master ads switch (NEXT_PUBLIC_ADS_ENABLED) is not enabled."
    };
  }

  if (!isPathEligible(pathname)) {
    return {
      eligible: false,
      reason: `Route '${pathname}' is not in an authorized public educational ad zone.`
    };
  }

  if (!isDataEligible(pathname, context)) {
    return {
      eligible: false,
      reason: "Content is paid, requires enrollment, or access status is not verified public/free."
    };
  }

  return {
    eligible: true,
    reason: "Route and content pricing qualify for AdSense ad serving."
  };
}

/**
 * Checks if the external Google AdSense script (adsbygoogle.js) should be loaded for a given route and context.
 * Strict rule: The script is ONLY permitted to load if canServeAds() returns eligible.
 */
export function shouldLoadAdScript(pathname: string, context?: AdContext): boolean {
  return canServeAds(pathname, context).eligible;
}

/**
 * Centralized, deduplicated AdSense script loader.
 * Loads adsbygoogle.js only when eligible and ensures only a single instance exists in document.head.
 */
export function loadAdSenseScript(
  publisherId: string,
  pathname: string,
  context?: AdContext
): boolean {
  if (typeof window === "undefined" || !publisherId) {
    return false;
  }

  if (!shouldLoadAdScript(pathname, context)) {
    return false;
  }

  // Check if already injected in document to avoid duplicate script tags
  const existingScript = document.querySelector(
    'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
  );
  if (existingScript) {
    return true;
  }

  try {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(publisherId)}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
    return true;
  } catch (err) {
    console.warn("[AdSense] Failed to dynamically append AdSense script:", err);
    return false;
  }
}
