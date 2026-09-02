import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";

export const metadata: Metadata = makeMetadata({
  title: "Shopping Cart | Sagar Coaching Centre",
  description: "View and manage items in your shopping cart.",
  path: "/cart",
  noIndex: true
});

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
