"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Lock, Eye, CheckCircle } from "lucide-react";

type LessonItem = {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  isPreview: boolean;
};

type SectionItem = {
  id: string;
  title: string;
  lessons: LessonItem[];
};

type CourseDetailClientProps = {
  slug: string;
  description: string;
  sections: SectionItem[];
  isEnrolled: boolean;
  outcomes: string[];
};

function toLessonTypeLabel(type: string) {
  return type.toLowerCase();
}

export function CourseDetailClient({ slug, description, sections, isEnrolled, outcomes }: CourseDetailClientProps) {
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const hasLongDescription = description.length > 220;

  return (
    <>
      <div className="border rounded-xl p-6">
        <p className={`${expandedDescription ? "" : "line-clamp-3"} text-sm text-muted-foreground`}>{description}</p>
        {hasLongDescription ? (
          <button
            type="button"
            className="mt-2 text-sm font-medium text-primary"
            onClick={() => setExpandedDescription((prev) => !prev)}
          >
            {expandedDescription ? "Read less" : "Read more"}
          </button>
        ) : null}
      </div>

      {outcomes.length ? (
        <div className="border rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">What you'll learn</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {outcomes.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <h2 className="text-lg font-semibold mb-4">Course Curriculum</h2>
        <div className="space-y-3">
          {sections.map((section) => {
            const isExpanded = expandedSectionId === section.id;
            return (
              <div key={section.id} className="border rounded-xl">
                <button
                  type="button"
                  onClick={() => setExpandedSectionId((prev) => (prev === section.id ? null : section.id))}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    {section.title}
                  </span>
                  <span className="text-sm text-muted-foreground">({section.lessons.length} lessons)</span>
                </button>
                {isExpanded ? (
                  <div className="border-t p-3 space-y-2">
                    {section.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate text-sm">{lesson.title}</span>
                          <Badge variant="outline" className="text-xs capitalize">{toLessonTypeLabel(lesson.contentType)}</Badge>
                          {lesson.isPreview ? (
                            <Badge variant="secondary" className="text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Badge>
                          ) : null}
                        </div>
                        <div>
                          {lesson.isPreview ? (
                            <Link href={`/courses/${slug}/preview/${lesson.id}`} className="text-sm font-medium text-primary">
                              Open preview lesson
                            </Link>
                          ) : isEnrolled ? (
                            <Link href={`/student/courses/${slug}/lessons/${lesson.id}`} className="text-sm font-medium text-primary">
                              Open lesson
                            </Link>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                              <Lock className="h-3.5 w-3.5" />
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
