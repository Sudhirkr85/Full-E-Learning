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
  { label: "My Profile", href: "/student/profile" },
  { label: "My Courses", href: "/student/courses" },
  { label: "My Orders", href: "/student/orders" }
];

export const teacherNav = [
  { label: "Overview", href: "/teacher/dashboard" },
  { label: "Courses", href: "/teacher/courses" },
  { label: "My Students", href: "/teacher/enrollments" },
  { label: "Categories", href: "/teacher/categories" }
];

export const adminNav = [
  { label: "My Profile", href: "/admin/profile" },
  { label: "Overview", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Enrollments", href: "/admin/enrollments" },
  { label: "Courses", href: "/admin/courses" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Store", href: "/admin/store" },
  { label: "Audit Logs", href: "/admin/audit-logs" },
  { label: "Change Password", href: "/admin/settings/change-password" },
  { label: "Platform Config", href: "/admin/settings/platform" }
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