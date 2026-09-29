import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const messageSchema = z.object({
  receiverId: z.string().optional(),
  content: z.string().min(1, "Message content cannot be empty"),
  roomId: z.string().optional(),
  courseId: z.string().optional(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const roomId = courseId.startsWith("course:") ? courseId : `course:${courseId}`;

  try {
    const messages = await prisma.message.findMany({
      where: { roomId },
      include: {
        sender: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
      },
      orderBy: { sentAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = messageSchema.parse(body);

    const effectiveCourseId =
      data.courseId ||
      (data.roomId ? data.roomId.replace(/^course:/, "") : undefined);

    const roomId = data.roomId || (effectiveCourseId ? `course:${effectiveCourseId}` : "general");

    let finalReceiverId = data.receiverId;

    // Validate that receiverId actually exists in the database
    if (finalReceiverId) {
      const exists = await prisma.user.findUnique({
        where: { id: finalReceiverId },
        select: { id: true },
      });
      if (!exists) {
        finalReceiverId = undefined;
      }
    }

    // If receiverId is not valid, automatically find the course trainer or course instructor
    if (!finalReceiverId && effectiveCourseId) {
      const course = await prisma.course.findUnique({
        where: { id: effectiveCourseId },
        select: { trainerId: true },
      });
      if (course?.trainerId) {
        finalReceiverId = course.trainerId;
      }
    }

    // Fallback: If current user is the trainer, send to first enrolled student or admin
    if (!finalReceiverId) {
      const fallbackUser = await prisma.user.findFirst({
        where: {
          id: { not: session.user.id },
        },
        select: { id: true },
      });
      finalReceiverId = fallbackUser?.id || session.user.id;
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId: finalReceiverId,
        content: data.content.trim(),
        roomId,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
