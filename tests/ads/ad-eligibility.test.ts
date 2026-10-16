import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  isPathEligible,
  isDataEligible,
  canServeAds,
  shouldLoadAdScript,
  loadAdSenseScript
} from "@/lib/ads/ad-eligibility";
import type { AdContext } from "@/lib/ads/ad-eligibility";

describe("AdSense Policy & Eligibility Suite (Permanent Repository Tests)", () => {
  beforeEach(() => {
    // Reset master switch before each test
    delete process.env.NEXT_PUBLIC_ADS_ENABLED;
  });

  describe("1. Master Kill-Switch Enforcement", () => {
    it("should be ineligible and disabled when NEXT_PUBLIC_ADS_ENABLED is unset", () => {
      delete process.env.NEXT_PUBLIC_ADS_ENABLED;
      const res = canServeAds("/blog/bihar-nmms-2024");
      assert.equal(res.eligible, false);
      assert.match(res.reason, /not enabled/i);
    });

    it("should be ineligible and disabled when NEXT_PUBLIC_ADS_ENABLED is 'false'", () => {
      process.env.NEXT_PUBLIC_ADS_ENABLED = "false";
      const res = canServeAds("/blog/bihar-nmms-2024");
      assert.equal(res.eligible, false);
      assert.match(res.reason, /not enabled/i);
    });

    it("should allow eligible routes only when NEXT_PUBLIC_ADS_ENABLED is explicitly 'true'", () => {
      process.env.NEXT_PUBLIC_ADS_ENABLED = "true";
      const res = canServeAds("/blog/bihar-nmms-2024");
      assert.equal(res.eligible, true);
    });
  });

  describe("2. Public Educational Content (Permitted Routes)", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_ADS_ENABLED = "true";
    });

    it("allows public blog listing page (/blog)", () => {
      assert.equal(isPathEligible("/blog"), true);
      assert.equal(isDataEligible("/blog"), true);
      assert.equal(canServeAds("/blog").eligible, true);
    });

    it("allows public educational blog articles (/blog/*)", () => {
      const path = "/blog/bihar-nmms-2024-question-paper-answer-key-pdf";
      assert.equal(isPathEligible(path), true);
      assert.equal(isDataEligible(path), true);
      assert.equal(canServeAds(path).eligible, true);
    });

    it("allows public PDF reading pages with verified free/public status", () => {
      const pdfPath = "/blog/up-nmms-2023-solved-paper";
      const publicContext: AdContext = { isFree: true, isPublic: true, priceCents: 0, isPaid: false };
      assert.equal(isPathEligible(pdfPath), true);
      assert.equal(isDataEligible(pdfPath, publicContext), true);
      assert.equal(canServeAds(pdfPath, publicContext).eligible, true);
    });

    it("allows course informational catalog (/courses) if confirmed public/free", () => {
      const freeContext: AdContext = { isFree: true, isPublic: true, priceCents: 0, isPaid: false, requiresEnrollment: false };
      assert.equal(isPathEligible("/courses"), true);
      assert.equal(isDataEligible("/courses", freeContext), true);
      assert.equal(canServeAds("/courses", freeContext).eligible, true);
    });

    it("allows genuine public free mock test landing page with verified public/free context", () => {
      const freeTestLanding = "/courses/free-nmms-mat-mock-test";
      const freeContext: AdContext = {
        isFree: true,
        isPublic: true,
        priceCents: 0,
        isPaid: false,
        requiresEnrollment: false
      };
      assert.equal(isPathEligible(freeTestLanding), true);
      assert.equal(isDataEligible(freeTestLanding, freeContext), true);
      assert.equal(canServeAds(freeTestLanding, freeContext).eligible, true);
    });
  });

  describe("3. Fail-Closed Protection on Missing or Unknown Metadata", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_ADS_ENABLED = "true";
    });

    it("rejects course route if data context is missing (fail-closed)", () => {
      const path = "/courses/some-course";
      assert.equal(isPathEligible(path), true);
      // Without context, access status cannot be verified -> MUST reject
      assert.equal(isDataEligible(path, undefined), false);
      assert.equal(canServeAds(path, undefined).eligible, false);
    });

    it("rejects course route if isPublic is missing or false", () => {
      const path = "/courses/some-course";
      const incompleteContext: AdContext = { isFree: true, priceCents: 0 };
      assert.equal(isDataEligible(path, incompleteContext), false);
      assert.equal(canServeAds(path, incompleteContext).eligible, false);
    });

    it("rejects course route if priceCents === 0 but requires paid enrollment", () => {
      const path = "/courses/zero-price-paywalled";
      const paywalledContext: AdContext = { isFree: false, isPublic: true, priceCents: 0, requiresEnrollment: true };
      assert.equal(isDataEligible(path, paywalledContext), false);
      assert.equal(canServeAds(path, paywalledContext).eligible, false);
    });

    it("rejects completely unknown routes (fail-closed default)", () => {
      const unknownPaths = ["/", "/store", "/vip-telegram", "/custom-page", "/random"];
      for (const p of unknownPaths) {
        assert.equal(isPathEligible(p), false, `Path "${p}" should be rejected by fail-closed default`);
        assert.equal(canServeAds(p).eligible, false);
      }
    });
  });

  describe("4. Paid Content Protection (Must Never Be Eligible)", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_ADS_ENABLED = "true";
    });

    it("rejects paid course with priceCents > 0", () => {
      const path = "/courses/paid-masterclass";
      const paidContext: AdContext = { priceCents: 49900, isPaid: true, isFree: false };
      assert.equal(isDataEligible(path, paidContext), false);
      assert.equal(canServeAds(path, paidContext).eligible, false);
    });

    it("rejects paid lesson or paid mock test", () => {
      const path = "/courses/nmms-mock-test-series";
      const paidContext: AdContext = { priceCents: 9900, isPaid: true };
      assert.equal(isDataEligible(path, paidContext), false);
      assert.equal(canServeAds(path, paidContext).eligible, false);
    });

    it("rejects blog post if marked as paid or paywalled", () => {
      const path = "/blog/premium-pyq-bundle";
      const paidContext: AdContext = { priceCents: 19900, isPaid: true };
      assert.equal(isDataEligible(path, paidContext), false);
      assert.equal(canServeAds(path, paidContext).eligible, false);
    });
  });

  describe("5. Active Test-Taking & Classroom Interfaces (Strict Route Blocks)", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_ADS_ENABLED = "true";
    });

    const activeTestRoutes = [
      "/courses/nmms/tests/test-1",
      "/courses/nmms/tests/mat-mock-test-2024",
      "/courses/navodaya/lessons/lesson-1",
      "/courses/navodaya/learn",
      "/courses/sainik/quiz/section-1",
      "/courses/sainik/resources/res-1"
    ];

    for (const route of activeTestRoutes) {
      it(`strictly blocks active test/lesson route: ${route}`, () => {
        assert.equal(isPathEligible(route), false);
        assert.equal(canServeAds(route).eligible, false);
      });
    }
  });

  describe("6. Prohibited Routes (Admin, Auth, Dashboards, Checkout)", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_ADS_ENABLED = "true";
    });

    const prohibitedRoutes = [
      "/admin",
      "/admin/dashboard",
      "/admin/courses",
      "/admin/users",
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/logout",
      "/dashboard",
      "/student/dashboard",
      "/student/courses",
      "/student/orders",
      "/teacher/dashboard",
      "/profile",
      "/cart",
      "/checkout",
      "/checkout/order-123",
      "/order/order-123/confirmation",
      "/order-confirmation/order-123",
      "/payment",
      "/privacy-policy",
      "/terms",
      "/refund-policy",
      "/disclaimer",
      "/api/checkout",
      "/api/courses"
    ];

    for (const route of prohibitedRoutes) {
      it(`prohibits route: ${route}`, () => {
        assert.equal(isPathEligible(route), false);
        assert.equal(canServeAds(route).eligible, false);
      });
    }
  });

  describe("7. Script Loading Policy & Deduplication", () => {
    it("shouldLoadAdScript returns false when master switch is disabled", () => {
      delete process.env.NEXT_PUBLIC_ADS_ENABLED;
      assert.equal(shouldLoadAdScript("/blog/test"), false);
    });

    it("shouldLoadAdScript returns false for prohibited routes even if master switch is enabled", () => {
      process.env.NEXT_PUBLIC_ADS_ENABLED = "true";
      assert.equal(shouldLoadAdScript("/admin"), false);
      assert.equal(shouldLoadAdScript("/login"), false);
      assert.equal(shouldLoadAdScript("/checkout"), false);
      assert.equal(shouldLoadAdScript("/courses/nmms/tests/active-test"), false);
    });

    it("shouldLoadAdScript returns true only for verified public eligible content when enabled", () => {
      process.env.NEXT_PUBLIC_ADS_ENABLED = "true";
      assert.equal(shouldLoadAdScript("/blog/bihar-nmms-2024"), true);
    });

    it("loadAdSenseScript returns false in non-browser environment without throwing", () => {
      process.env.NEXT_PUBLIC_ADS_ENABLED = "true";
      const res = loadAdSenseScript("ca-pub-test", "/blog/test");
      assert.equal(res, false);
    });

    it("loadAdSenseScript deduplicates and avoids creating multiple script tags", () => {
      // Mock minimal browser DOM in test runner
      const mockHead = {
        appended: [] as any[],
        appendChild(elem: any) {
          this.appended.push(elem);
        }
      };

      const mockDoc = {
        head: mockHead,
        querySelector(selector: string) {
          if (mockHead.appended.length > 0) {
            return mockHead.appended[0]; // Already exists
          }
          return null;
        },
        createElement(tagName: string) {
          return { tagName, src: "", async: false, crossOrigin: "" };
        }
      };

      (globalThis as any).window = {};
      (globalThis as any).document = mockDoc;

      process.env.NEXT_PUBLIC_ADS_ENABLED = "true";

      // First call: appends script
      const firstCall = loadAdSenseScript("ca-pub-12345", "/blog/first-post");
      assert.equal(firstCall, true);
      assert.equal(mockHead.appended.length, 1);
      assert.match(mockHead.appended[0].src, /client=ca-pub-12345/);

      // Second call (multiple AdSlots on same page): skips injection and reuses existing script
      const secondCall = loadAdSenseScript("ca-pub-12345", "/blog/first-post");
      assert.equal(secondCall, true);
      assert.equal(mockHead.appended.length, 1); // Length remains 1, no duplicate injected!

      // Cleanup mock
      delete (globalThis as any).window;
      delete (globalThis as any).document;
    });
  });
});
