import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site";
import { Toaster } from "sonner";
import { MobileContactBar } from "@/components/MobileContactBar";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "devanagari"],
  variable: "--font-poppins",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sagarcoaching.tech"),
  title: {
    default:  "Sagar Coaching Centre | NMMS, Navodaya, Sainik School Online Coaching India",
    template: "%s | Sagar Coaching Centre",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  description:
    "India ke sabse trusted scholarship coaching. NMMS, Navodaya, Sainik School, Shrestha NETS, CMMSS online preparation by Shrvan Kumar Sagar, Bhagwanpur Supaul Bihar. All states.",
  keywords: [
    "NMMS coaching online India",
    "Navodaya coaching India",
    "Sainik School coaching online",
    "Shrestha NETS coaching",
    "CMMSS exam coaching",
    "Megha Chhatravriti",
    "scholarship exam class 8",
    "NMMS UP Bihar MP Rajasthan",
    "JNVST coaching",
    "Sagar Coaching Centre Bhagwanpur",
    "Shrvan Kumar Sagar",
  ],
  authors:  [{ name: "Shrvan Kumar Sagar" }],
  creator:  "Shrvan Kumar Sagar",
  openGraph: {
    type:        "website",
    locale:      "hi_IN",
    url:         siteConfig.url,
    siteName:    "Sagar Coaching Centre",
    title:       "Sagar Coaching Centre | India's Trusted Scholarship Coaching",
    description: "NMMS, Navodaya, Sainik School, Shrestha NETS की तैयारी। Founded by Shrvan Kumar Sagar, Bhagwanpur Supaul Bihar. Online for all states.",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Sagar Coaching Centre Bhagwanpur",
    description: "India's Trusted Online Scholarship Exam Coaching — NMMS, Navodaya, Sainik School",
  },
  other: {
    "google-adsense-account": "ca-pub-8160370419154141",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8160370419154141"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${poppins.variable} ${spaceGrotesk.variable} font-sans bg-[#0a0a0f] text-foreground overflow-x-hidden`}>
        <ThemeProvider>
          {children}
          <Toaster position="bottom-center" richColors />
        </ThemeProvider>
        <MobileContactBar />
      </body>
    </html>
  );
}
