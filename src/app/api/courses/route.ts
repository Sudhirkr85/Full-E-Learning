import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: {
        teachers: {
          include: {
            teacher: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ courses });
  } catch (err: any) {
    console.error("[GET_COURSES_API_ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
