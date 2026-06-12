import {
  renderWelcomeEmail,
  renderEnrollmentEmail,
  renderPaymentSuccessEmail,
  renderOrderConfirmationEmail,
  renderCertificateEmail,
  renderSupportTicketReplyEmail,
  renderPasswordResetEmail,
  renderCombinedWelcomePaymentEmail
} from "./templates";
import {
  WelcomeEmailData,
  EnrollmentEmailData,
  PaymentSuccessEmailData,
  OrderConfirmationEmailData,
  CertificateEmailData,
  SupportTicketReplyEmailData,
  PasswordResetEmailData,
  CombinedWelcomePaymentEmailData
} from "./types";

interface SendEmailParams {
  toEmail: string;
  toName: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

/**
 * Runs a promise-returning email dispatch function in a safe, non-blocking background context.
 * Catches all errors internally so it never interrupts the main event flow.
 */
export function dispatchEmailBackground(promiseFactory: () => Promise<any>): void {
  Promise.resolve()
    .then(() => promiseFactory())
    .then((res) => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[BREVO_EMAIL_BACKGROUND_DISPATCH_COMPLETED]", res);
      }
    })
    .catch((err) => {
      console.error("[BREVO_EMAIL_BACKGROUND_DISPATCH_ERROR]", err);
    });
}

/**
 * Low-level utility to send a transactional email through Brevo's REST API.
 * Server-side only, does not drag heavy dependencies into client bundles.
 * Safe and resilient: never throws uncaught exceptions.
 */
export async function sendEmail({
  toEmail,
  toName,
  subject,
  htmlContent,
  textContent
}: SendEmailParams): Promise<{ success: boolean; bypassed?: boolean; messageId?: string; error?: string }> {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME;

    // Environment safety check: Silently bypass email sending if config is incomplete
    if (!apiKey || !senderEmail || !senderName) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[BREVO_EMAIL_SERVICE] Warning: Missing Brevo configuration variables (BREVO_API_KEY, BREVO_SENDER_EMAIL, or BREVO_SENDER_NAME). ` +
          `Email dispatch was safely bypassed.`
        );
        console.log(`[BYPASSED EMAIL DATA] To: ${toName} <${toEmail}> | Subject: "${subject}"`);
      }
      return { success: true, bypassed: true, error: "Bypassed due to missing API key or sender config." };
    }

    const payload = {
      sender: {
        name: senderName,
        email: senderEmail
      },
      to: [
        {
          email: toEmail,
          name: toName
        }
      ],
      subject,
      htmlContent,
      textContent
    };

    if (process.env.NODE_ENV !== "production") {
      console.log(`[BREVO_EMAIL_SERVICE] Dispatching email to ${toEmail}...`);
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.code || data.error) {
      console.error("[BREVO_EMAIL_SERVICE_API_ERROR]", data);
      return { success: false, error: data.message || "Failed sending email through Brevo API." };
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[BREVO_EMAIL_SERVICE_SUCCESS] Email sent successfully. Message ID:", data.messageId);
    }
    return { success: true, messageId: data.messageId };
  } catch (err: any) {
    console.error("[BREVO_EMAIL_SERVICE_CRITICAL_FAILURE]", err);
    return { success: false, error: err.message || "An unexpected error occurred during email transmission." };
  }
}

/**
 * 1. Dispatch Welcome Email
 */
export async function sendWelcomeEmail(toEmail: string, toName: string, data: WelcomeEmailData) {
  try {
    const { html, text } = renderWelcomeEmail(data);
    return await sendEmail({
      toEmail,
      toName,
      subject: `Welcome to Sagar Coaching Centre, ${toName}! 🚀`,
      htmlContent: html,
      textContent: text
    });
  } catch (err: any) {
    console.error(`[EMAIL_DISPATCH_ERROR] sendWelcomeEmail failed:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * 2. Dispatch Enrollment Email
 */
export async function sendEnrollmentEmail(toEmail: string, toName: string, data: EnrollmentEmailData) {
  try {
    const { html, text } = renderEnrollmentEmail(data);
    return await sendEmail({
      toEmail,
      toName,
      subject: `Access Active: Enrolled in "${data.courseTitle}" 🎓`,
      htmlContent: html,
      textContent: text
    });
  } catch (err: any) {
    console.error(`[EMAIL_DISPATCH_ERROR] sendEnrollmentEmail failed:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * 3. Dispatch Payment Success Receipt Email
 */
export async function sendPaymentSuccessEmail(toEmail: string, toName: string, data: PaymentSuccessEmailData) {
  try {
    const { html, text } = renderPaymentSuccessEmail(data);
    return await sendEmail({
      toEmail,
      toName,
      subject: `Payment Verified: Receipt for Order #${data.orderNumber} 💳`,
      htmlContent: html,
      textContent: text
    });
  } catch (err: any) {
    console.error(`[EMAIL_DISPATCH_ERROR] sendPaymentSuccessEmail failed:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * 4. Dispatch Order Confirmation Email
 */
export async function sendOrderConfirmationEmail(toEmail: string, toName: string, data: OrderConfirmationEmailData) {
  try {
    const { html, text } = renderOrderConfirmationEmail(data);
    return await sendEmail({
      toEmail,
      toName,
      subject: `Order Created: #${data.orderNumber} Awaiting Checkout 🛒`,
      htmlContent: html,
      textContent: text
    });
  } catch (err: any) {
    console.error(`[EMAIL_DISPATCH_ERROR] sendOrderConfirmationEmail failed:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * 5. Dispatch Certificate Issued Email
 */
export async function sendCertificateEmail(toEmail: string, toName: string, data: CertificateEmailData) {
  try {
    const { html, text } = renderCertificateEmail(data);
    return await sendEmail({
      toEmail,
      toName,
      subject: `Congratulations! Official Certificate Generated for "${data.courseTitle}" 🎓🏆`,
      htmlContent: html,
      textContent: text
    });
  } catch (err: any) {
    console.error(`[EMAIL_DISPATCH_ERROR] sendCertificateEmail failed:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * 6. Dispatch Support Ticket Reply Email
 */
export async function sendSupportTicketReplyEmail(toEmail: string, toName: string, data: SupportTicketReplyEmailData) {
  try {
    const { html, text } = renderSupportTicketReplyEmail(data);
    return await sendEmail({
      toEmail,
      toName,
      subject: `Support Update: Reply on Ticket #${data.ticketNumber} 💬`,
      htmlContent: html,
      textContent: text
    });
  } catch (err: any) {
    console.error(`[EMAIL_DISPATCH_ERROR] sendSupportTicketReplyEmail failed:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * 7. Dispatch Password Reset Link Email
 */
export async function sendPasswordResetEmail(toEmail: string, toName: string, data: PasswordResetEmailData) {
  try {
    const { html, text } = renderPasswordResetEmail(data);
    return await sendEmail({
      toEmail,
      toName,
      subject: `Security: Password Reset Credentials 🔒`,
      htmlContent: html,
      textContent: text
    });
  } catch (err: any) {
    console.error(`[EMAIL_DISPATCH_ERROR] sendPasswordResetEmail failed:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * 8. Dispatch Combined Welcome + Payment Success Email (for first-time checkout users)
 */
export async function sendCombinedWelcomePaymentEmail(toEmail: string, toName: string, data: CombinedWelcomePaymentEmailData) {
  try {
    const { html, text } = renderCombinedWelcomePaymentEmail(data);
    return await sendEmail({
      toEmail,
      toName,
      subject: `Welcome to Sagar Coaching Centre & Payment Confirmed! 🚀💳`,
      htmlContent: html,
      textContent: text
    });
  } catch (err: any) {
    console.error(`[EMAIL_DISPATCH_ERROR] sendCombinedWelcomePaymentEmail failed:`, err);
    return { success: false, error: err.message };
  }
}

