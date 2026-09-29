import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q) {
    return NextResponse.json({ courses: [], trainers: [], resources: [] });
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const role = user?.role;

  let courseFilter: any = {
    title: { contains: q, mode: "insensitive" }
  };
  let resourceFilter: any = {
    title: { contains: q, mode: "insensitive" }
  };

  if (role === "TRAINEE") {
    courseFilter.status = "PUBLISHED";
    resourceFilter.course = { enrollments: { some: { traineeId: userId } } };
  } else if (role === "TRAINER") {
    courseFilter.trainerId = userId;
    resourceFilter.course = { trainerId: userId };
  }

  const [courses, trainers, resources] = await Promise.all([
    prisma.course.findMany({
      where: courseFilter,
      select: { id: true, title: true, description: true }
    }),
    prisma.user.findMany({
      where: {
        role: "TRAINER",
        name: { contains: q, mode: "insensitive" }
      },
      select: { id: true, name: true }
    }),
    prisma.resource.findMany({
      where: resourceFilter,
      select: { id: true, title: true, type: true, courseId: true }
    })
  ]);

  return NextResponse.json({ courses, trainers, resources });
}
