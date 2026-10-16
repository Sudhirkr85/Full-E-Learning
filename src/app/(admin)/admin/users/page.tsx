import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";
import { UsersSearchFilter, UsersTableClient } from "./users-client";

export const metadata: Metadata = makeMetadata({
  title: "User Management - Admin Desk",
  description: "Governance control, role escalation, search, and user accounts oversight.",
  path: "/admin/users",
  noIndex: true
});

type UsersPageProps = {
  searchParams?: Promise<{
    q?: string;
    filter?: string;
    page?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const params = searchParams ? await searchParams : {};
  const q = params.q?.trim() || "";
  const filter = params.filter || "ALL";
  const page = params.page ? parseInt(params.page, 10) : 0;
  const currentPage = isNaN(page) || page < 0 ? 0 : page;

  // Build Prisma query condition
  const where: any = {};
  if (filter !== "ALL") {
    where.role = filter;
  }
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } }
    ];
  }

  // Fetch paginated users, total count, and all available courses
  const [users, totalCount, courses] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
      skip: currentPage * 20,
      include: {
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
              }
            },
            progress: true
          },
          orderBy: { createdAt: "desc" }
        }
      }
    }),
    prisma.user.count({ where }),
    prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        priceCents: true,
        status: true
      },
      orderBy: { title: "asc" }
    })
  ]);

  const hasNextPage = (currentPage + 1) * 20 < totalCount;
  const hasPrevPage = currentPage > 0;

  const buildPageUrl = (targetPage: number) => {
    const searchPart = q ? `&q=${encodeURIComponent(q)}` : "";
    const filterPart = filter !== "ALL" ? `&filter=${filter}` : "";
    return `/admin/users?page=${targetPage}${searchPart}${filterPart}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary">Admin oversight</Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white">User Accounts</h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-3xl">
          Manage platform participants. Inspect joined dates, search by name or email, filter lists by roles, and promote students to instructors.
        </p>
      </div>

      <UsersSearchFilter />

      <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">System Users</CardTitle>
          <CardDescription className="text-slate-400">Total of {totalCount} matching user accounts registered in database.</CardDescription>
        </CardHeader>
        <CardContent className="px-0 md:px-6">
          {users.length > 0 ? (
            <UsersTableClient
              users={users}
              courses={courses}
              currentUserEmail={session.user.email!}
            />
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No students or matching user accounts found. Try adjusting filters or search query terms.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalCount > 20 && (
        <div className="flex items-center justify-between mt-4">
          <Button
            asChild
            variant="outline"
            disabled={!hasPrevPage}
            className={`bg-white/5 border-white/10 text-white rounded-xl ${
              !hasPrevPage ? "opacity-50 pointer-events-none" : "hover:bg-white/10 hover:text-white"
            }`}
          >
            <Link href={buildPageUrl(currentPage - 1)}>Previous</Link>
          </Button>

          <span className="text-xs text-slate-400 font-semibold">
            Page {currentPage + 1} of {Math.ceil(totalCount / 20)}
          </span>

          <Button
            asChild
            variant="outline"
            disabled={!hasNextPage}
            className={`bg-white/5 border-white/10 text-white rounded-xl ${
              !hasNextPage ? "opacity-50 pointer-events-none" : "hover:bg-white/10 hover:text-white"
            }`}
          >
            <Link href={buildPageUrl(currentPage + 1)}>Next</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
