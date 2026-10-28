import { UpdateType, UpdateStatus } from "@prisma/client";

export type UpdateLinkKind = "official" | "apply" | "download" | "notification" | "other";

export interface UpdateLink {
  label: string;
  url: string;
  kind: UpdateLinkKind;
}

export interface ImportantDate {
  label: string;
  value: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SourceItem {
  label: string;
  url: string;
}

export interface UpdatePostData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  type: UpdateType;
  exam: string;
  state?: string | null;
  status: UpdateStatus;
  links: UpdateLink[];
  importantDates: ImportantDate[];
  faqs: FAQItem[];
  sources: SourceItem[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  showAds: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
