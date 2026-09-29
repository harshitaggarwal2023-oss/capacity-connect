import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.safeParse(body);

    if (!data.success) {
      const errorMsg = data.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const email = data.data.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(data.data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.data.name.trim(),
        email,
        passwordHash: hash,
        role: "TRAINEE",
        status: "APPROVED",
        profile: {
          create: {
            fullName: data.data.name.trim(),
            qualifications: ["Trainee Participant"],
            skills: ["Digital Governance", "Capacity Building"],
            yearsExp: 0,
          },
        },
      },
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("Trainee signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
