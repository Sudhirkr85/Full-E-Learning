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

/**
 * Standard Email Shell Wrapper to generate premium, fully responsive, and mobile-friendly
 * HTML email layouts for Indian student EdTech outcomes.
 */
function getEmailLayout(title: string, preheaderText: string, bodyContentHtml: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "support@e-learning.in";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      background-color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #F8FAFC;
      padding: 40px 0;
    }
    .main-card {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
      border: 1px solid #E2E8F0;
    }
    .header {
      background-color: #0B0F19;
      padding: 32px;
      text-align: center;
      border-bottom: 3px solid #F59E0B;
    }
    .logo-text {
      color: #FFFFFF;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .logo-accent {
      color: #F59E0B;
    }
    .content {
      padding: 40px 32px;
      color: #334155;
      line-height: 1.6;
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      color: #0F172A;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 600;
      color: #1E293B;
      margin-bottom: 16px;
    }
    .text {
      font-size: 15px;
      color: #475569;
      margin-bottom: 24px;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    .cta-button {
      background-color: #F59E0B;
      color: #0B0F19 !important;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 12px;
      display: inline-block;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
    }
    .details-box {
      background-color: #F8FAFC;
      border: 1px solid #F1F5F9;
      border-radius: 16px;
      padding: 24px;
      margin: 24px 0;
    }
    .details-title {
      font-size: 12px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .details-table {
      width: 100%;
      font-size: 14px;
      border-collapse: collapse;
    }
    .details-row td {
      padding: 8px 0;
      border-bottom: 1px solid #F1F5F9;
    }
    .details-row:last-child td {
      border-bottom: none;
    }
    .details-label {
      color: #64748B;
      font-weight: 500;
      text-align: left;
    }
    .details-value {
      color: #1E293B;
      font-weight: 600;
      text-align: right;
    }
    .footer {
      text-align: center;
      padding: 32px;
      font-size: 12px;
      color: #94A3B8;
      background-color: #0B0F19;
      border-top: 1px solid #1E293B;
    }
    .footer-links {
      margin-bottom: 16px;
    }
    .footer-link {
      color: #F59E0B;
      text-decoration: none;
      margin: 0 8px;
    }
    .footer-text {
      margin: 8px 0;
      line-height: 1.5;
    }
    @media only screen and (max-width: 600px) {
      .wrapper {
        padding: 0;
      }
      .main-card {
        border-radius: 0;
        border: none;
      }
      .content {
        padding: 32px 20px;
      }
    }
  </style>
</head>
<body>
  <span style="display:none !important; visibility:hidden; mso-hide:all; font-size:1px; color:#F8FAFC; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">${preheaderText}</span>
  <center class="wrapper">
    <table class="main-card" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td class="header">
          <h1 class="logo-text">🚀 E-LEARNING<span class="logo-accent">.IN</span></h1>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${bodyContentHtml}
        </td>
      </tr>
      <tr>
        <td class="footer">
          <div class="footer-links">
            <a href="${appUrl}/courses" class="footer-link">Catalog</a> •
            <a href="${appUrl}/student/courses" class="footer-link">My dashboard</a> •
            <a href="mailto:${senderEmail}" class="footer-link">Help desk</a>
          </div>
          <p class="footer-text">
            © ${new Date().getFullYear()} E-Learning Platform. Built for Indian Tech Job Seekers & Students.
          </p>
          <p class="footer-text" style="color: #64748B;">
            You received this transactional notification email because you registered or completed an action at E-Learning.in.
          </p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}

/**
 * Utility: format cents value to readable currency string
 */
function formatCurrency(cents: number, currencyCode: string): string {
  return (cents / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2
  });
}

/**
 * 1. Welcome Email Template
 */
export function renderWelcomeEmail(data: WelcomeEmailData): { html: string; text: string } {
  const title = "Welcome to E-Learning!";
  const preheader = "Start accelerating your software engineering career today.";
  
  const html = getEmailLayout(
    title,
    preheader,
    `
    <h2 class="title">Welcome aboard, ${data.name}! 👋</h2>
    <p class="greeting">We're absolutely thrilled to have you join our learning ecosystem.</p>
    <p class="text">
      E-Learning.in is built specifically to bridge the gap between academic theory and real-world tech stack production. 
      You now have complete access to industry-aligned courses, real coding sandboxes, performance analytics, and blockchain-verified certifications.
    </p>
    <div class="cta-container">
      <a href="${data.appUrl}/courses" class="cta-button" style="color: #0B0F19 !important;">Explore Live Courses</a>
    </div>
    <div class="details-box">
      <h3 class="details-title">Quick Action Checklist</h3>
      <ul style="padding-left: 20px; font-size: 14px; color: #475569; margin: 0; line-height: 1.8;">
        <li>Complete your profile preferences to receive custom recommendations.</li>
        <li>Browse our live tech catalog for specialized database and Next.js courses.</li>
        <li>Reach out to our discord community desk if you need study support.</li>
      </ul>
    </div>
    <p class="text" style="margin-bottom: 0;">
      Best regards,<br>
      <strong>The E-Learning Support Team</strong>
    </p>
    `
  );

  const text = `Welcome aboard, ${data.name}!

We are absolutely thrilled to have you join our learning ecosystem. E-Learning.in is built specifically to bridge the gap between academic theory and real-world tech stack production.

Get started by exploring live courses:
${data.appUrl}/courses

Best regards,
The E-Learning Support Team`;

  return { html, text };
}

/**
 * 2. Enrollment Confirmation Template
 */
export function renderEnrollmentEmail(data: EnrollmentEmailData): { html: string; text: string } {
  const title = "Enrollment Confirmed!";
  const preheader = `You are successfully enrolled in ${data.courseTitle}.`;

  const html = getEmailLayout(
    title,
    preheader,
    `
    <h2 class="title">Your Learning Access is Active! 🎓</h2>
    <p class="greeting">Hello ${data.name},</p>
    <p class="text">
      Your enrollment request has been processed successfully. You now have complete lifetime credentials to start attending lessons, downloading study materials, and running coding challenges in:
    </p>
    <div class="details-box" style="text-align: center; background-color: #F8FAFC; border: 1px solid #F59E0B/20;">
      <h3 style="margin: 0; font-size: 18px; color: #0F172A; font-weight: 800;">${data.courseTitle}</h3>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #64748B;">Ready to resume anytime on your mobile or desktop browser</p>
    </div>
    <div class="cta-container">
      <a href="${data.appUrl}/courses/${data.courseSlug}" class="cta-button" style="color: #0B0F19 !important;">Start First Lesson</a>
    </div>
    <p class="text" style="font-size: 14px; color: #64748B;">
      Tip: Try setting a daily study goal of 30 minutes in your dashboard to maintain your study streak and optimize your certificate rank score!
    </p>
    `
  );

  const text = `Hello ${data.name},

Your enrollment request has been processed successfully. You now have complete lifetime credentials to start attending lessons in:

Course: ${data.courseTitle}

Start your first lesson now:
${data.appUrl}/courses/${data.courseSlug}

Best regards,
The E-Learning Team`;

  return { html, text };
}

/**
 * 3. Payment Success / Receipt Template
 */
export function renderPaymentSuccessEmail(data: PaymentSuccessEmailData): { html: string; text: string } {
  const title = "Payment Successful & Verified!";
  const preheader = `Payment receipt for Order #${data.orderNumber} is ready.`;
  const formattedTotal = formatCurrency(data.totalAmountCents, data.currency);

  let itemsHtml = "";
  data.items.forEach(item => {
    itemsHtml += `
      <tr class="details-row">
        <td class="details-label" style="width: auto;">
          <strong>${item.productName}</strong><br>
          <span style="font-size: 12px; color: #94A3B8;">Qty: ${item.quantity}</span>
        </td>
        <td class="details-value">${formatCurrency(item.totalPriceCents, data.currency)}</td>
      </tr>
    `;
  });

  const html = getEmailLayout(
    title,
    preheader,
    `
    <h2 class="title" style="color: #10B981;">Payment Received & Confirmed! 💳</h2>
    <p class="greeting">Dear ${data.name},</p>
    <p class="text">
      We have successfully validated your payment transaction. The resources and course credentials purchased have been added to your dashboard profile.
    </p>
    <div class="details-box">
      <h3 class="details-title">Receipt Breakdown</h3>
      <table class="details-table">
        <tr class="details-row">
          <td class="details-label">Order Number</td>
          <td class="details-value" style="font-family: monospace;">${data.orderNumber}</td>
        </tr>
        ${itemsHtml}
        <tr class="details-row" style="border-top: 2px dashed #E2E8F0;">
          <td class="details-label" style="font-weight: bold; color: #0F172A; padding-top: 12px;">Total Paid</td>
          <td class="details-value" style="font-size: 16px; color: #F59E0B; padding-top: 12px;">${formattedTotal}</td>
        </tr>
      </table>
    </div>
    <div class="cta-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/student/courses" class="cta-button" style="color: #0B0F19 !important;">Access Purchased Materials</a>
    </div>
    <p class="text" style="font-size: 13px; color: #94A3B8; text-align: center;">
      If you experience any delay in sandbox sync, please contact our helpline at <a href="mailto:${data.supportEmail}" style="color: #F59E0B; text-decoration: none;">${data.supportEmail}</a>.
    </p>
    `
  );

  let itemsText = "";
  data.items.forEach(item => {
    itemsText += ` - ${item.productName} (Qty: ${item.quantity}): ${formatCurrency(item.totalPriceCents, data.currency)}\n`;
  });

  const text = `Dear ${data.name},

We have successfully validated your payment transaction. The resources and course credentials purchased have been added to your dashboard profile.

Order Receipt Breakdown:
Order Number: ${data.orderNumber}
${itemsText}
Total Paid: ${formattedTotal}

Access your dashboard to start learning:
${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/student/courses

If you experience any delay, contact our helpline at: ${data.supportEmail}

Best regards,
The Billing Desk`;

  return { html, text };
}

/**
 * 4. Order Confirmation Template
 */
export function renderOrderConfirmationEmail(data: OrderConfirmationEmailData): { html: string; text: string } {
  const title = "Order Placed Successfully";
  const preheader = `Your order #${data.orderNumber} has been recorded and is pending checkout.`;
  const formattedTotal = formatCurrency(data.totalAmountCents, data.currency);

  let itemsHtml = "";
  data.items.forEach(item => {
    itemsHtml += `
      <tr class="details-row">
        <td class="details-label" style="width: auto;">
          <strong>${item.productName}</strong><br>
          <span style="font-size: 12px; color: #94A3B8;">Qty: ${item.quantity}</span>
        </td>
        <td class="details-value">${formatCurrency(item.totalPriceCents, data.currency)}</td>
      </tr>
    `;
  });

  const html = getEmailLayout(
    title,
    preheader,
    `
    <h2 class="title">Order Awaiting Payment 🛒</h2>
    <p class="greeting">Hello ${data.name},</p>
    <p class="text">
      Your checkout request has been registered in our billing log. To finalise access credentials, please complete the payment securely through our Razorpay checkout desk:
    </p>
    <div class="details-box">
      <h3 class="details-title">Order Ledger Summary</h3>
      <table class="details-table">
        <tr class="details-row">
          <td class="details-label">Order Reference</td>
          <td class="details-value" style="font-family: monospace;">${data.orderNumber}</td>
        </tr>
        ${itemsHtml}
        <tr class="details-row" style="border-top: 2px dashed #E2E8F0;">
          <td class="details-label" style="font-weight: bold; color: #0F172A; padding-top: 12px;">Total Due</td>
          <td class="details-value" style="font-size: 16px; color: #F59E0B; padding-top: 12px;">${formattedTotal}</td>
        </tr>
      </table>
    </div>
    <div class="cta-container">
      <a href="${data.checkoutUrl}" class="cta-button" style="color: #0B0F19 !important;">Complete Safe Payment</a>
    </div>
    <p class="text" style="font-size: 14px; color: #64748B;">
      Note: This payment request will remain valid for the next 24 hours. Course coupons and promo pricing can only be locked in during this active window.
    </p>
    `
  );

  let itemsText = "";
  data.items.forEach(item => {
    itemsText += ` - ${item.productName} (Qty: ${item.quantity}): ${formatCurrency(item.totalPriceCents, data.currency)}\n`;
  });

  const text = `Hello ${data.name},

Your order has been recorded. To finalise your access credentials, please complete the secure payment through our checkout desk:

Order Number: ${data.orderNumber}
${itemsText}
Total Due: ${formattedTotal}

Complete your checkout here:
${data.checkoutUrl}

Best regards,
The Billing Desk`;

  return { html, text };
}

/**
 * 5. Certificate Issued Template
 */
export function renderCertificateEmail(data: CertificateEmailData): { html: string; text: string } {
  const title = "Course Completed & Certificate Issued! 🎉";
  const preheader = `Congratulations! Your official certificate for ${data.courseTitle} is generated.`;

  const html = getEmailLayout(
    title,
    preheader,
    `
    <h2 class="title" style="color: #F59E0B;">Outstanding Achievement! 🏆🏅</h2>
    <p class="greeting">Dear ${data.name},</p>
    <p class="text">
      Congratulations! You have completed 100% of the lessons, exercises, and assessments in:
    </p>
    <div class="details-box" style="text-align: center; border: 2px solid #F59E0B; background-color: #F8FAFC;">
      <span style="font-size: 32px;">🎓</span>
      <h3 style="margin: 8px 0 0 0; font-size: 18px; color: #0F172A; font-weight: 800;">${data.courseTitle}</h3>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748B; font-family: monospace;">Code: ${data.verificationCode}</p>
    </div>
    <p class="text">
      Your official verification certificate has been cryptographically signed and issued on our public ledger. You can download the high-resolution PDF print copy or attach it directly to your LinkedIn credentials list.
    </p>
    <div class="cta-container">
      <a href="${data.certificateUrl}" class="cta-button" style="color: #0B0F19 !important;">View Certificate</a>
    </div>
    <p class="text" style="font-size: 14px; color: #475569;">
      This credential serves as verified proof of your system architecture competence and production-readiness. Keep pushing boundaries!
    </p>
    `
  );

  const text = `Dear ${data.name},

Congratulations! You have completed 100% of the lessons, exercises, and assessments in:

Course: ${data.courseTitle}
Verification Code: ${data.verificationCode}

Your official verification certificate has been cryptographically signed. You can download the PDF copy or add it to LinkedIn here:
${data.certificateUrl}

Keep pushing boundaries!

Best regards,
The Academic Board`;

  return { html, text };
}

/**
 * 6. Support Ticket Reply Template
 */
export function renderSupportTicketReplyEmail(data: SupportTicketReplyEmailData): { html: string; text: string } {
  const title = "New Reply to Support Ticket";
  const preheader = `A team member replied to ticket #${data.ticketNumber}: "${data.ticketSubject}".`;

  const html = getEmailLayout(
    title,
    preheader,
    `
    <h2 class="title">Support Desk Update 💬</h2>
    <p class="greeting">Hello ${data.name},</p>
    <p class="text">
      An administrator has posted an official response to your active help desk thread:
    </p>
    <div class="details-box">
      <h3 class="details-title">Response Preview</h3>
      <div style="font-style: italic; color: #1E293B; background-color: #FFFFFF; border-left: 4px solid #F59E0B; padding: 12px 16px; font-size: 14px; border-radius: 4px; margin-bottom: 12px;">
        "${data.message}"
      </div>
      <table class="details-table" style="font-size: 12px; margin-top: 8px;">
        <tr class="details-row">
          <td class="details-label">Ticket ID</td>
          <td class="details-value" style="font-family: monospace;">#${data.ticketNumber}</td>
        </tr>
        <tr class="details-row">
          <td class="details-label">Subject</td>
          <td class="details-value">${data.ticketSubject}</td>
        </tr>
      </table>
    </div>
    <div class="cta-container">
      <a href="${data.ticketUrl}" class="cta-button" style="color: #0B0F19 !important;">View Ticket Thread</a>
    </div>
    <p class="text" style="font-size: 13px; color: #64748B;">
      Please reply directly through the web portal interface to keep all notes consolidated in one auditable log. Do not reply directly to this automated email.
    </p>
    `
  );

  const text = `Hello ${data.name},

An administrator has posted an official response to your active help desk thread:

Ticket Reference: #${data.ticketNumber}
Subject: "${data.ticketSubject}"

Reply Details:
"${data.message}"

Open the support desk portal to respond:
${data.ticketUrl}

Best regards,
The CRM Desk`;

  return { html, text };
}

/**
 * 7. Password Reset Template
 */
export function renderPasswordResetEmail(data: PasswordResetEmailData): { html: string; text: string } {
  const title = "Password Reset Request";
  const preheader = "Reset credentials for your E-Learning.in account.";

  const html = getEmailLayout(
    title,
    preheader,
    `
    <h2 class="title">Secure Password Reset Link 🔒</h2>
    <p class="greeting">Hello ${data.name},</p>
    <p class="text">
      We received a request to update the login credentials for your student profile. If you initiated this change, please click the secure link below to construct a new credential:
    </p>
    <div class="cta-container">
      <a href="${data.resetUrl}" class="cta-button" style="color: #0B0F19 !important;">Reset Password</a>
    </div>
    <p class="text" style="font-size: 13px; color: #64748B;">
      Safety Warning: This unique link is valid for **60 minutes only**. If you did not trigger this request, you can safely ignore this automated message. Your account remains fully secure.
    </p>
    `
  );

  const text = `Hello ${data.name},

We received a request to update the login credentials for your student profile.

Click the secure link below to reset your password (valid for 60 minutes):
${data.resetUrl}

If you did not make this request, you can safely ignore this email.

Best regards,
Security Operations`;

  return { html, text };
}

/**
 * 8. Combined Welcome + Payment Success Email Template for first-time checkout users
 */
export function renderCombinedWelcomePaymentEmail(data: CombinedWelcomePaymentEmailData): { html: string; text: string } {
  const title = "Welcome & Payment Verified! 🚀💳";
  const preheader = `Welcome to E-Learning! Your order #${data.orderNumber} is confirmed.`;
  const formattedTotal = formatCurrency(data.totalAmountCents, data.currency);

  let itemsHtml = "";
  data.items.forEach(item => {
    itemsHtml += `
      <tr class="details-row">
        <td class="details-label" style="width: auto;">
          <strong>${item.productName}</strong><br>
          <span style="font-size: 12px; color: #94A3B8;">Qty: ${item.quantity}</span>
        </td>
        <td class="details-value">${formatCurrency(item.totalPriceCents, data.currency)}</td>
      </tr>
    `;
  });

  const html = getEmailLayout(
    title,
    preheader,
    `
    <h2 class="title" style="color: #10B981;">Welcome & Payment Confirmed! 🚀💳</h2>
    <p class="greeting">Hello ${data.name},</p>
    <p class="text">
      We are absolutely thrilled to welcome you to our learning ecosystem! 
      Your student account has been created, and we have successfully validated your payment transaction.
    </p>
    <div class="details-box">
      <h3 class="details-title">Receipt Breakdown</h3>
      <table class="details-table">
        <tr class="details-row">
          <td class="details-label">Order Number</td>
          <td class="details-value" style="font-family: monospace;">${data.orderNumber}</td>
        </tr>
        ${itemsHtml}
        <tr class="details-row" style="border-top: 2px dashed #E2E8F0;">
          <td class="details-label" style="font-weight: bold; color: #0F172A; padding-top: 12px;">Total Paid</td>
          <td class="details-value" style="font-size: 16px; color: #F59E0B; padding-top: 12px;">${formattedTotal}</td>
        </tr>
      </table>
    </div>
    <div class="cta-container">
      <a href="${data.appUrl}/student/courses" class="cta-button" style="color: #0B0F19 !important;">Explore Live Courses & Dashboard</a>
    </div>
    <div class="details-box">
      <h3 class="details-title">Quick Start Checklist</h3>
      <ul style="padding-left: 20px; font-size: 14px; color: #475569; margin: 0; line-height: 1.8;">
        <li>Use your billing email <strong>${data.supportEmail}</strong> to log in.</li>
        <li>Access your purchased courses and sandboxes from your dashboard link above.</li>
        <li>Reach out to our helpline desk at <a href="mailto:${data.supportEmail}" style="color: #F59E0B; text-decoration: none;">${data.supportEmail}</a> if you need study support.</li>
      </ul>
    </div>
    <p class="text" style="margin-bottom: 0;">
      Best regards,<br>
      <strong>The E-Learning Team</strong>
    </p>
    `
  );

  let itemsText = "";
  data.items.forEach(item => {
    itemsText += ` - ${item.productName} (Qty: ${item.quantity}): ${formatCurrency(item.totalPriceCents, data.currency)}\n`;
  });

  const text = `Hello ${data.name},
  
Welcome to E-Learning.in! We are absolutely thrilled to welcome you to our learning ecosystem. Your student account has been created, and we have successfully validated your payment transaction.

Order Receipt Breakdown:
Order Number: ${data.orderNumber}
${itemsText}
Total Paid: ${formattedTotal}

Use your billing email to log in and start learning:
${data.appUrl}/student/courses

If you need any assistance, contact our support desk: ${data.supportEmail}

Best regards,
The E-Learning Team`;

  return { html, text };
}

