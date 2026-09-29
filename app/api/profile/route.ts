import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().min(1),
  qualifications: z.array(z.string()),
  skills: z.array(z.string()),
  experience: z.string().optional(),
  yearsExp: z.number().nonnegative(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id }
  });

  return NextResponse.json(profile || {});
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = profileSchema.parse(body);

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        fullName: data.fullName,
        qualifications: data.qualifications,
        skills: data.skills,
        experience: data.experience,
        yearsExp: data.yearsExp,
      },
      create: {
        userId: session.user.id,
        fullName: data.fullName,
        qualifications: data.qualifications,
        skills: data.skills,
        experience: data.experience,
        yearsExp: data.yearsExp,
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
