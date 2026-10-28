import type { Metadata } from "next";
import { makeMetadata } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { getPublicUpdatesList } from "@/lib/updates/queries";
import { UpdatesFilterClient } from "@/components/updates/updates-filter-client";
import { Bell } from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "परीक्षा अपडेट्स एवं सूचनाएं (Exam Updates & Alerts) | Sagar Coaching Centre",
  description:
    "NMMS, Navodaya, Sainik School और अन्य छात्रवृत्ति परीक्षाओं के आधिकारिक एडमिट कार्ड, आवेदन पत्र, परीक्षा तिथि, रिजल्ट और महत्वपूर्ण सूचनाएं।",
  path: "/updates",
});

export const revalidate = 60; // ISR 1 minute

export default async function UpdatesListingPage() {
  const posts = await getPublicUpdatesList();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 sm:py-14">
      <Container>
        {/* Header Hero */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 mb-4 shadow-xs">
            <Bell className="h-3.5 w-3.5 text-indigo-600" />
            <span>आधिकारिक सूचनाएं एवं परीक्षा अलर्ट्स</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
            ताज़ा परीक्षा अपडेट्स (Exam Alerts & Updates)
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            NMMS, Navodaya, Sainik School और अन्य छात्रवृत्ति परीक्षाओं के नवीनतम एडमिट कार्ड,
            आवेदन तिथियां, उत्तर कुंजी एवं परिणाम की समयबद्ध व प्रामाणिक जानकारी।
          </p>
        </div>

        {/* Client Filters and Listing */}
        <UpdatesFilterClient initialPosts={posts} />
      </Container>
    </div>
  );
}
