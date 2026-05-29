import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const usages = await prisma.couponUsage.findMany({
      where: { couponId: id },
      orderBy: { usedAt: "desc" },
      include: {
        coupon: true
      }
    });

    // Populate user names in-memory as User references might not be explicitly linked in model
    const populated = await Promise.all(
      usages.map(async (u) => {
        const user = await prisma.user.findUnique({
          where: { id: u.userId },
          select: { name: true, email: true }
        });
        return {
          ...u,
          userName: user?.name || "Anonymous Student",
          userEmail: user?.email || ""
        };
      })
    );

    return NextResponse.json({ usages: populated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}
