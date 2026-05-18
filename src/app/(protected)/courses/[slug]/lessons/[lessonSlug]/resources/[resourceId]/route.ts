import { NextResponse } from "next/server";
import { getLessonResourceAccess } from "@/lib/courses/access";

type ResourceRouteContext = {
  params: Promise<{
    slug: string;
    lessonSlug: string;
    resourceId: string;
  }>;
};

export async function GET(request: Request, { params }: ResourceRouteContext) {
  const { slug, lessonSlug, resourceId } = await params;
  const bundle = await getLessonResourceAccess(slug, lessonSlug, resourceId);

  if (!bundle) {
    const fallbackUrl = new URL(`/courses/${slug}/lessons/${lessonSlug}?resource=locked`, request.url);
    return NextResponse.redirect(fallbackUrl);
  }

  const targetUrl = bundle.resource.url.startsWith("http") ? bundle.resource.url : new URL(bundle.resource.url, request.url).toString();
  return NextResponse.redirect(targetUrl);
}