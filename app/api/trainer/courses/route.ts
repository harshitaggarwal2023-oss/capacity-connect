import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "TRAINER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const courses = await prisma.course.findMany({
    where: { trainerId: (session.user as any).id }
  });
  return NextResponse.json(courses);
}
