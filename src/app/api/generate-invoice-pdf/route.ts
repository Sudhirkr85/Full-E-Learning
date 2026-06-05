import React from "react";
import { existsSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const pdfFontFamily = "InvoiceSans";
const regularFontPath = "C:/Windows/Fonts/segoeui.ttf";
const boldFontPath = "C:/Windows/Fonts/segoeuib.ttf";
const hasInvoiceFont = existsSync(regularFontPath) && existsSync(boldFontPath);

if (hasInvoiceFont) {
  Font.register({
    family: pdfFontFamily,
    fonts: [
      { src: regularFontPath, fontWeight: 400 },
      { src: boldFontPath, fontWeight: 700 },
    ],
  });
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    fontFamily: hasInvoiceFont ? pdfFontFamily : "Helvetica",
    fontSize: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  header: {
    backgroundColor: "#111827",
    color: "#ffffff",
    padding: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  label: {
    color: "#fbbf24",
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 8,
  },
  muted: {
    color: "#94a3b8",
  },
  status: {
    backgroundColor: "#10b981",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    fontSize: 12,
    fontWeight: 700,
    alignSelf: "flex-end",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  body: {
    padding: 28,
    gap: 20,
  },
  grid: {
    flexDirection: "row",
    gap: 18,
  },
  panel: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbe3ef",
    backgroundColor: "#f8fafc",
    padding: 18,
  },
  halfPanel: {
    flex: 1,
    minHeight: 148,
  },
  greenPanel: {
    borderColor: "#86efac",
    backgroundColor: "#ecfdf5",
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: 1.7,
    textTransform: "uppercase",
    color: "#475569",
    fontWeight: 700,
    marginBottom: 12,
  },
  greenTitle: {
    color: "#047857",
  },
  fieldLabel: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 7,
    fontSize: 8,
    textTransform: "uppercase",
    alignSelf: "flex-start",
    marginBottom: 7,
  },
  totalBox: {
    backgroundColor: "#111827",
    color: "#ffffff",
    borderRadius: 12,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: {
    fontSize: 22,
    fontWeight: 700,
  },
  summaryPanel: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbe3ef",
    backgroundColor: "#f8fafc",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    minHeight: 18,
  },
  summaryLabel: {
    color: "#334155",
    fontSize: 10,
  },
  summaryValue: {
    color: "#0f172a",
    fontSize: 10,
    fontWeight: 700,
    minWidth: 90,
    textAlign: "right",
  },
});

function formatCurrency(cents: number, currency: string) {
  if (currency === "INR") {
    return hasInvoiceFont ? `₹${(cents / 100).toFixed(2)}` : `Rs. ${(cents / 100).toFixed(2)}`;
  }

  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency,
  });
}

function safeFilename(value: string) {
  return value.replace(/[^a-z0-9_-]/gi, "_");
}

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order id is required" }, { status: 400 });
    }

    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isBuyer = order.userId === session.user.id;
    const isStaff = session.user.role === "ADMIN" || session.user.role === "TEACHER";

    if (!isBuyer && !isStaff) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const metadata = (order.metadata || {}) as any;
    const shippingAddress = metadata.shippingAddress;
    const shippingFeeCents = Math.max(
      0,
      order.totalCents - (order.subtotalCents - order.discountCents),
    );
    const customerName = shippingAddress?.fullName || session.user.name || "Customer";
    const placedAt = new Date(order.placedAt).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const h = React.createElement;
    const document = h(
      Document,
      {
        title: `Invoice ${order.orderNumber}`,
        author: "Sagar Coaching Centre Bhagwanpur",
      },
      h(
        Page,
        { size: "A4", style: styles.page },
        h(
          View,
          { style: styles.card },
          h(
            View,
            { style: styles.header },
            h(
              View,
              { style: { flex: 1 } },
              h(Text, { style: styles.label }, "Receipt Invoice"),
              h(Text, { style: styles.orderNumber }, order.orderNumber),
              h(Text, { style: styles.muted }, placedAt),
            ),
            h(
              View,
              { style: { width: 190 } },
              h(Text, { style: styles.status }, order.status.toLowerCase()),
              h(Text, { style: { color: "#cbd5e1", textAlign: "right" } }, `Email: ${order.billingEmail}`),
            ),
          ),
          h(
            View,
            { style: styles.body },
            h(
              View,
              { style: styles.grid },
              h(
                View,
                { style: [styles.panel, styles.halfPanel] },
                h(Text, { style: styles.sectionTitle }, "Billing Details"),
                h(Text, { style: styles.fieldLabel }, "Full Name"),
                h(Text, { style: styles.fieldValue }, customerName),
                h(Text, { style: styles.fieldLabel }, "Email Address"),
                h(Text, { style: styles.fieldValue }, order.billingEmail),
                order.billingPhone ? h(Text, { style: styles.fieldLabel }, "Phone") : null,
                order.billingPhone ? h(Text, { style: styles.fieldValue }, order.billingPhone) : null,
              ),
              shippingAddress
                ? h(
                    View,
                    { style: [styles.panel, styles.halfPanel] },
                    h(Text, { style: styles.sectionTitle }, "Delivery Address"),
                    h(Text, { style: styles.fieldLabel }, "Recipient Name"),
                    h(Text, { style: styles.fieldValue }, shippingAddress.fullName),
                    h(Text, { style: styles.fieldLabel }, "Phone"),
                    h(Text, { style: styles.fieldValue }, shippingAddress.primaryPhone || order.billingPhone || "-"),
                    h(Text, { style: styles.fieldLabel }, "Full Address"),
                    h(
                      Text,
                      { style: { lineHeight: 1.5 } },
                      `${shippingAddress.addressLine1}${shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""}\n${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}\n${shippingAddress.country}`,
                    ),
                  )
                : h(
                    View,
                    { style: [styles.panel, styles.halfPanel, styles.greenPanel] },
                    h(Text, { style: [styles.sectionTitle, styles.greenTitle] }, "Delivery Method"),
                    h(Text, { style: [styles.fieldValue, { color: "#047857" }] }, "Instant Digital Access"),
                    h(Text, { style: { color: "#047857", lineHeight: 1.5 } }, "Authorized PDF resources and online course access are unlocked immediately on your dashboard."),
                  ),
            ),
            h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, "Purchased Items"),
              ...order.items.map((item, index) =>
                h(
                  View,
                  { key: item.id, style: styles.item },
                  h(
                    View,
                    { style: { flex: 1 } },
                    h(Text, { style: styles.badge }, `Item ${index + 1} · ${(item.productType || "Digital").replace("_", " ")}`),
                    h(Text, { style: { fontSize: 12, fontWeight: 700 } }, item.productName),
                    item.quantity > 1
                      ? h(Text, { style: { color: "#64748b", marginTop: 5 } }, `Quantity: ${item.quantity} x ${formatCurrency(item.unitPriceCents, item.currency)}`)
                      : null,
                  ),
                  h(
                    View,
                    { style: { width: 110, alignItems: "flex-end" } },
                    h(Text, { style: styles.fieldLabel }, "Amount"),
                    h(Text, { style: { fontSize: 13, fontWeight: 700 } }, formatCurrency(item.totalPriceCents, item.currency)),
                  ),
                ),
              ),
            ),
            h(
              View,
              { style: styles.summaryPanel },
              h(
                View,
                { style: styles.summaryRow },
                h(Text, { style: styles.summaryLabel }, "Subtotal"),
                h(Text, { style: styles.summaryValue }, formatCurrency(order.subtotalCents, order.currency)),
              ),
              order.discountCents > 0
                ? h(
                    View,
                    { style: styles.summaryRow },
                    h(Text, { style: styles.summaryLabel }, "Discount Applied"),
                    h(Text, { style: styles.summaryValue }, `-${formatCurrency(order.discountCents, order.currency)}`),
                  )
                : null,
              shippingFeeCents > 0
                ? h(
                    View,
                    { style: styles.summaryRow },
                    h(Text, { style: styles.summaryLabel }, "Shipping Fee"),
                    h(Text, { style: styles.summaryValue }, formatCurrency(shippingFeeCents, order.currency)),
                  )
                : null,
            ),
            h(
              View,
              { style: styles.totalBox },
              h(Text, { style: { fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" } }, "Total Paid"),
              h(Text, { style: styles.total }, formatCurrency(order.totalCents, order.currency)),
            ),
          ),
        ),
      ),
    );

    const pdfBuffer = await renderToBuffer(document);
    const filename = `invoice-${safeFilename(order.orderNumber)}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
