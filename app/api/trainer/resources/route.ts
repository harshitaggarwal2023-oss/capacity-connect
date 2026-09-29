import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  courseId: z.string(),
  title: z.string().min(1),
  url: z.string().url(),
  type: z.enum(["PDF", "PPT", "VIDEO"])
});

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "TRAINER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const resources = await prisma.resource.findMany({
    where: { course: { trainerId: (session.user as any).id } },
    include: { course: { select: { title: true } } }
  });
  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "TRAINER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const course = await prisma.course.findFirst({
      where: { id: data.courseId, trainerId: (session.user as any).id }
    });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 403 });

    const resource = await prisma.resource.create({
      data: {
        courseId: data.courseId,
        title: data.title,
        url: data.url,
        type: data.type
      }
    });

    return NextResponse.json(resource);
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
