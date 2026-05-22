import { NextResponse } from "next/server";
import { 
  renderWelcomeEmail,
  renderEnrollmentEmail,
  renderPaymentSuccessEmail,
  renderOrderConfirmationEmail,
  renderCertificateEmail,
  renderSupportTicketReplyEmail,
  renderPasswordResetEmail,
  renderCombinedWelcomePaymentEmail
} from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/service";

/**
 * GET /api/dev/test-email
 * A development-safe utility endpoint to preview email templates or trigger mock tests.
 */
export async function GET(request: Request) {
  // Security baseline: only enable in development mode to prevent server misuse
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Unauthorized in production environments.", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const template = searchParams.get("template") || "welcome";
  const send = searchParams.get("send") === "true";
  const to = searchParams.get("to") || "student@example.com";
  const name = searchParams.get("name") || "Rajesh Kumar";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let rendered: { html: string; text: string };

  switch (template.toLowerCase()) {
    case "welcome":
      rendered = renderWelcomeEmail({ name, appUrl });
      break;
    case "enrollment":
      rendered = renderEnrollmentEmail({
        name,
        courseTitle: "Mastering Next.js 15 & Full-Stack Architecture",
        courseSlug: "mastering-nextjs-15",
        appUrl
      });
      break;
    case "payment":
      rendered = renderPaymentSuccessEmail({
        name,
        orderNumber: "ORD-2026-A8B9C0",
        totalAmountCents: 499900, // ₹4,999.00
        currency: "INR",
        items: [
          { productName: "Mastering Next.js 15 & Full-Stack Architecture", quantity: 1, totalPriceCents: 499900 }
        ],
        supportEmail: "support@e-learning.in"
      });
      break;
    case "order":
      rendered = renderOrderConfirmationEmail({
        name,
        orderNumber: "ORD-2026-A8B9C0",
        totalAmountCents: 499900,
        currency: "INR",
        items: [
          { productName: "Mastering Next.js 15 & Full-Stack Architecture", quantity: 1, totalPriceCents: 499900 }
        ],
        checkoutUrl: `${appUrl}/checkout/ORD-2026-A8B9C0`
      });
      break;
    case "certificate":
      rendered = renderCertificateEmail({
        name,
        courseTitle: "Mastering Next.js 15 & Full-Stack Architecture",
        verificationCode: "CERT-2026-9E4F2B",
        certificateUrl: `${appUrl}/certificates/verify/CERT-2026-9E4F2B`
      });
      break;
    case "support":
      rendered = renderSupportTicketReplyEmail({
        name,
        ticketNumber: "TCK-48192",
        ticketSubject: "Prisma Client Pool Size Connection Warning on Localhost",
        message: "Hello Rajesh, we looked into your Prisma connection limits. In your local .env database URL, try appending '?connection_limit=5' to balance pool resources for concurrent dev threads. That will resolve the timeout errors you are seeing.",
        ticketUrl: `${appUrl}/student/support/TCK-48192`
      });
      break;
    case "reset":
      rendered = renderPasswordResetEmail({
        name,
        resetUrl: `${appUrl}/auth/reset-password?token=mock_reset_token_123`
      });
      break;
    case "combined":
      rendered = renderCombinedWelcomePaymentEmail({
        name,
        appUrl,
        orderNumber: "ORD-2026-COMBINED",
        totalAmountCents: 499900,
        currency: "INR",
        items: [
          { productName: "Mastering Next.js 15 & Full-Stack Architecture", quantity: 1, totalPriceCents: 499900 }
        ],
        supportEmail: "support@e-learning.in"
      });
      break;
    default:
      return NextResponse.json(
        { 
          error: "Unknown template type", 
          supportedTemplates: ["welcome", "enrollment", "payment", "order", "certificate", "support", "reset", "combined"] 
        }, 
        { status: 400 }
      );
  }

  // Trigger real email dispatch if requested
  if (send) {
    const result = await sendEmail({
      toEmail: to,
      toName: name,
      subject: `[Dev Test] ${template.toUpperCase()} Email Notification`,
      htmlContent: rendered.html,
      textContent: rendered.text
    });
    return NextResponse.json({
      message: `Test email dispatch triggered to: ${to}`,
      result
    });
  }

  // Standard preview: Render the beautiful premium HTML template directly in the browser viewport
  return new NextResponse(rendered.html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}
