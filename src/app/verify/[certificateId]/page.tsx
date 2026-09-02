import { permanentRedirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    certificateId: string;
  }>;
}

export default async function LegacyVerifyCertificatePage({ params }: PageProps) {
  const { certificateId } = await params;
  permanentRedirect(`/certificates/verify/${certificateId}`);
}
