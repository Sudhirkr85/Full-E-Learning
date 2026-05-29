import { sendEmail } from "./service";

interface SendOrderConfirmationEmailParams {
  order: any;
  user: any;
}

export async function sendOrderConfirmationEmail({ order, user }: SendOrderConfirmationEmailParams) {
  const firstName = user?.name ? user.name.split(" ")[0] : "Student";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const supportEmail = process.env.BREVO_SENDER_EMAIL || "support@e-learning.in";

  // Check types of items purchased
  const hasPdf = order.items.some((item: any) => item.productType === "DIGITAL_RESOURCE");
  const firstPdfItem = order.items.find((item: any) => item.productType === "DIGITAL_RESOURCE");
  const pdfProductId = firstPdfItem?.productId || "";

  const shippingInfo = order.metadata?.shippingAddress;

  // Build items table rows
  let itemsRowsHtml = "";
  for (const item of order.items) {
    const typeLabel = item.productType === "PHYSICAL" ? "PHYSICAL" : "PDF";
    const formattedPrice = (item.totalPriceCents / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR"
    });
    itemsRowsHtml += `
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 12px 8px; color: #f8fafc; font-size: 14px;">${item.productName}</td>
        <td style="padding: 12px 8px; color: #94a3b8; font-size: 12px; font-weight: bold; text-align: center;">${typeLabel}</td>
        <td style="padding: 12px 8px; color: #94a3b8; font-size: 14px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 8px; color: #a78bfa; font-size: 14px; font-weight: bold; text-align: right;">${formattedPrice}</td>
      </tr>
    `;
  }

  const formattedTotal = (order.totalCents / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR"
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmed</title>
    </head>
    <body style="background-color: #0a0a0f; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 0;">
      <div style="max-w: 600px; margin: 0 auto; bg-color: #0d1117; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
        
        <!-- Header -->
        <div style="background-color: #0d1117; padding: 32px; text-align: center; border-b: 1px solid #1e293b;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">
            🚀 E-LEARNING<span style="color: #7c3aed;">.IN</span>
          </h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 32px; background-color: #0d1117;">
          <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 16px;">
            Hi ${firstName},
          </h2>
          <p style="font-size: 15px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
            Thank you for your purchase! We have successfully received your payment. Your order details and credentials are listed below.
          </p>

          <div style="background-color: #0a0a0f; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <p style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 0; margin-bottom: 8px; letter-spacing: 1px;">
              Order ID Reference
            </p>
            <p style="font-family: monospace; font-size: 14px; color: #e2e8f0; margin: 0; font-weight: bold;">
              ${order.orderNumber}
            </p>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="border-bottom: 2px solid #1e293b;">
                <th style="padding: 8px; text-align: left; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Product</th>
                <th style="padding: 8px; text-align: center; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Type</th>
                <th style="padding: 8px; text-align: center; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                <th style="padding: 8px; text-align: right; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
              <tr>
                <td colspan="3" style="padding: 16px 8px 0 8px; font-size: 14px; font-weight: bold; color: #f8fafc;">Total Paid</td>
                <td style="padding: 16px 8px 0 8px; font-size: 18px; font-weight: 900; color: #7c3aed; text-align: right;">${formattedTotal}</td>
              </tr>
            </tbody>
          </table>

          <!-- Conditional CTAs -->
          ${hasPdf && pdfProductId ? `
            <div style="text-align: center; margin: 32px 0;">
              <a href="${appUrl}/store/read/${pdfProductId}" style="background-color: #7c3aed; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);">
                Read Now
              </a>
            </div>
          ` : ""}

          ${shippingInfo ? `
            <div style="background-color: #0a0a0f; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; margin-top: 30px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                Shipping & Delivery
              </h3>
              <p style="font-size: 13px; color: #a78bfa; font-weight: bold; margin-top: 0; margin-bottom: 8px;">
                Estimated dispatch: 3-5 business days
              </p>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">
                <strong>Deliver to:</strong><br>
                ${shippingInfo.fullName}<br>
                ${shippingInfo.addressLine1}${shippingInfo.addressLine2 ? `, ${shippingInfo.addressLine2}` : ""}<br>
                ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.postalCode}<br>
                ${shippingInfo.country}
              </p>
            </div>
          ` : ""}

        </div>

        <!-- Footer -->
        <div style="background-color: #0a0a0f; padding: 32px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 8px 0;">
            Need help? Contact our support desk at <a href="mailto:${supportEmail}" style="color: #7c3aed; text-decoration: none;">${supportEmail}</a>
          </p>
          <p style="margin: 0;">
            © ${new Date().getFullYear()} E-Learning Platform. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  const textContent = `
    Hi ${firstName},

    Order Confirmed! Subject: Receipt for Order #${order.orderNumber}
    Total Paid: ${formattedTotal}

    To access your items, visit ${appUrl}/student/dashboard.
    If you purchased a PDF, read it here: ${appUrl}/store/read/${pdfProductId}
    ${shippingInfo ? `Physical items will be dispatched in 3-5 business days to ${shippingInfo.fullName} at PIN ${shippingInfo.postalCode}` : ""}

    Support contact: ${supportEmail}
  `;

  return await sendEmail({
    toEmail: order.billingEmail,
    toName: user?.name || "Student",
    subject: "Order Confirmed — E-Learning Platform 🎉",
    htmlContent,
    textContent
  });
}
