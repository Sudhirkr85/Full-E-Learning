/**
 * Type definitions for the Brevo Email System.
 * Ensures strict TypeScript verification across all transactional email flows.
 */

export interface WelcomeEmailData {
  name: string;
  appUrl: string;
}

export interface EnrollmentEmailData {
  name: string;
  courseTitle: string;
  courseSlug: string;
  appUrl: string;
}

export interface OrderItemSummary {
  productName: string;
  quantity: number;
  totalPriceCents: number;
}

export interface PaymentSuccessEmailData {
  name: string;
  orderNumber: string;
  totalAmountCents: number;
  currency: string;
  items: OrderItemSummary[];
  supportEmail: string;
}

export interface OrderConfirmationEmailData {
  name: string;
  orderNumber: string;
  totalAmountCents: number;
  currency: string;
  items: OrderItemSummary[];
  checkoutUrl: string;
}

export interface CertificateEmailData {
  name: string;
  courseTitle: string;
  verificationCode: string;
  certificateUrl: string;
}

export interface SupportTicketReplyEmailData {
  name: string;
  ticketNumber: string;
  ticketSubject: string;
  message: string;
  ticketUrl: string;
}

export interface PasswordResetEmailData {
  name: string;
  resetUrl: string;
}

export interface CombinedWelcomePaymentEmailData {
  name: string;
  appUrl: string;
  orderNumber: string;
  totalAmountCents: number;
  currency: string;
  items: OrderItemSummary[];
  supportEmail: string;
}
