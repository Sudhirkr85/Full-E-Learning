import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { makeMetadata } from "@/lib/site";
import { UsersSearchFilter, PromoteButton } from "./users-client";

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

  // Fetch paginated users and total count
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
      skip: currentPage * 20
    }),
    prisma.user.count({ where })
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
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-200 border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Joined Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => {
                    const isSelf = u.email === session.user.email;
                    return (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3.5 font-semibold text-white">{u.name || "N/A"}</td>
                        <td className="px-4 py-3.5 font-mono text-slate-300 text-xs">{u.email}</td>
                        <td className="px-4 py-3.5">
                          <Badge
                            variant={
                              u.role === "ADMIN"
                                ? "default"
                                : u.role === "TEACHER"
                                ? "secondary"
                                : "outline"
                            }
                            className={
                              u.role === "ADMIN"
                                ? "bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold"
                                : u.role === "TEACHER"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold"
                                : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                            }
                          >
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {isSelf ? (
                            <span className="text-xs text-indigo-400 font-bold">Logged In</span>
                          ) : (
                            <PromoteButton userId={u.id} userRole={u.role} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
