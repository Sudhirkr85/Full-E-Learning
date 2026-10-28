-- CreateEnum
CREATE TYPE "UpdateType" AS ENUM ('ADMIT_CARD', 'APPLY', 'RESULT', 'ANSWER_KEY', 'SYLLABUS', 'GUIDE', 'NEWS');

-- CreateEnum
CREATE TYPE "UpdateStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'EXPIRED');

-- CreateTable
CREATE TABLE "update_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "UpdateType" NOT NULL,
    "exam" TEXT NOT NULL DEFAULT 'NMMS',
    "state" TEXT,
    "status" "UpdateStatus" NOT NULL DEFAULT 'DRAFT',
    "links" JSONB NOT NULL,
    "importantDates" JSONB NOT NULL,
    "faqs" JSONB NOT NULL,
    "sources" JSONB NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "showAds" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "update_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "update_posts_slug_key" ON "update_posts"("slug");

-- CreateIndex
CREATE INDEX "update_posts_status_publishedAt_idx" ON "update_posts"("status", "publishedAt");
