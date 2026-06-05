import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site";
import { Toaster } from "sonner";
import Script from "next/script";
import { MobileContactBar } from "@/components/MobileContactBar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Sagar Coaching Centre | NMMS, Navodaya, Sainik School Coaching Bihar",
    template: "%s | Sagar Coaching Centre",
  },
  description:
    "Bihar ke sabse trusted scholarship coaching centre. NMMS, Navodaya, Sainik School, Shrestha NETS, CMMSS exam preparation by Shrvan Kumar Sagar, Bhagwanpur, Supaul.",
  keywords: [
    "NMMS coaching Bihar",
    "Navodaya coaching Supaul",
    "Sainik School coaching Bihar",
    "Shrestha NETS",
    "CMMSS exam",
    "Megha Chhatravriti",
    "scholarship exam Bihar",
    "Sagar Coaching Centre Bhagwanpur",
    "Shrvan Kumar Sagar",
  ],
  authors: [{ name: "Shrvan Kumar Sagar" }],
  creator: "Shrvan Kumar Sagar",
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: "https://sagarcoachingcentre.com",
    siteName: "Sagar Coaching Centre",
    title: "Sagar Coaching Centre | Bihar's #1 Scholarship Coaching",
    description:
      "NMMS, Navodaya, Sainik School, Shrestha NETS की तैयारी। Founded by Shrvan Kumar Sagar, Supaul Bihar.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagar Coaching Centre Bhagwanpur",
    description: "Bihar's #1 Scholarship Exam Coaching Centre",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${manrope.variable} font-sans bg-[#0a0a0f] text-foreground overflow-x-hidden`}>
        <ThemeProvider>
          {children}
          <Toaster position="bottom-center" richColors />
        </ThemeProvider>
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <MobileContactBar />
      </body>
    </html>
  );
}
