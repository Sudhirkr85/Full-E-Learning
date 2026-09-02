import { permanentRedirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function LegacyOrderConfirmationPage({ params }: PageProps) {
  const { orderId } = await params;
  permanentRedirect(`/order-confirmation/${orderId}`);
}
