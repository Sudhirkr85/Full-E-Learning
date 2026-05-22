import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { Package, ShieldCheck, CreditCard, ChevronRight, ShoppingCart } from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "My Orders | Dashboard",
  description: "Track your purchases, digital file downloads, and physical item shipping logs.",
  path: "/student/orders",
  noIndex: true
});

export default async function StudentOrdersPage() {
  const student = await requireRole(["STUDENT"]);

  // Fetch all orders for this student
  const orders = await prisma.order.findMany({
    where: { userId: student.id },
    orderBy: { placedAt: "desc" },
    include: {
      items: true,
    },
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="border-amber-500/20 text-amber-500 bg-amber-500/[0.05]">pending</Badge>;
      case "PAID":
        return <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/[0.05]">paid</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">cancelled</Badge>;
      case "REFUNDED":
        return <Badge variant="secondary">refunded</Badge>;
      default:
        return <Badge variant="outline">{status.toLowerCase()}</Badge>;
    }
  };

  const getShippingStatusBadge = (order: any) => {
    const meta: any = order.metadata || {};
    const status = meta.shippingStatus || "NOT_APPLICABLE";

    switch (status) {
      case "NOT_APPLICABLE":
        return null;
      case "PROCESSING":
        return <Badge variant="outline" className="border-blue-500/20 text-blue-500 bg-blue-500/[0.05] ml-2">processing</Badge>;
      case "SHIPPED":
        return <Badge variant="outline" className="border-amber-500/20 text-amber-500 bg-amber-500/[0.05] ml-2">shipped</Badge>;
      case "DELIVERED":
        return <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/[0.05] ml-2">delivered</Badge>;
      default:
        return <Badge variant="outline" className="ml-2">{status.toLowerCase()}</Badge>;
    }
  };

  return (
    <section className="space-y-8">
      <div className="max-w-3xl">
        <Badge variant="secondary" className="flex items-center gap-1 self-start w-fit">
          <Package className="h-3 w-3" />
          Purchase Records
        </Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Your Orders & Billing</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Access receipts, download digital guides, track shipping status, or retry pending checkout orders.
        </p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card className="max-w-lg mx-auto py-12 text-center border-dashed">
            <CardHeader>
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto opacity-35 mb-2" />
              <CardTitle>No purchases yet</CardTitle>
              <CardDescription>You haven't placed any store orders or digital item purchases yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/store">Browse Learning Store</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => {
              const formattedTotal = (order.totalCents / 100).toLocaleString("en-US", {
                style: "currency",
                currency: order.currency,
              });

              const dateStr = new Date(order.placedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <Card 
                  key={order.id} 
                  className="border-border/60 hover:border-border transition hover:shadow-soft duration-250 bg-card/50 backdrop-blur-[1px]"
                >
                  <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-muted-foreground">· {dateStr}</span>
                      </div>
                      
                      <div className="flex items-center">
                        {getPaymentStatusBadge(order.status)}
                        {getShippingStatusBadge(order)}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                        {order.items.map(item => item.productName).join(", ")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-border">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">Total Price</span>
                        <span className="text-base font-bold text-foreground">{formattedTotal}</span>
                      </div>

                      <div className="flex gap-2">
                        {order.status === "PENDING" && (
                          <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-background">
                            <Link href={`/checkout/${order.id}`}>Pay Now</Link>
                          </Button>
                        )}
                        <Button asChild size="sm" variant="outline" className="flex items-center gap-1">
                          <Link href={`/student/orders/${order.id}`}>Details</Link>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
