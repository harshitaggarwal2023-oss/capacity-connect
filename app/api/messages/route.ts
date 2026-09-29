import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const messageSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(1),
  roomId: z.string().min(1),
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

  const roomId = `course:${courseId}`;

  const messages = await prisma.message.findMany({
    where: {
      roomId,
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id }
      ]
    },
    orderBy: { sentAt: "asc" }
  });

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = messageSchema.parse(body);

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId: data.receiverId,
        content: data.content,
        roomId: data.roomId,
      }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
