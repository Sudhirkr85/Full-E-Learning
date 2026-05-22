import type { Metadata } from "next";

export const siteConfig = {
  name: "E-Learning Platform",
  description: "A modern learning platform for students, teachers, and administrators.",
  url: "http://localhost:3000"
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Store", href: "/store" },
  { label: "Login", href: "/login" }
];

export const footerNav = [
  { label: "Courses", href: "/courses" },
  { label: "Store", href: "/store" },
  { label: "Register", href: "/register" }
];

export const studentNav = [
  { label: "Overview", href: "/student/dashboard" },
  { label: "My Courses", href: "/student/courses" },
  { label: "My Orders", href: "/student/orders" },
  { label: "Support Tickets", href: "/student/support" }
];

export const teacherNav = [
  { label: "Overview", href: "/teacher/dashboard" },
  { label: "Courses", href: "/teacher/dashboard" },
  { label: "Students", href: "/teacher/dashboard" }
];

export const adminNav = [
  { label: "Overview", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/dashboard" },
  { label: "Support Tickets", href: "/admin/support" },
  { label: "Settings", href: "/admin/dashboard" }
];

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export function makeMetadata({ title, description, path, noIndex = false }: MetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true }
  };
}