import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.safeParse(body);
    
    if (!data.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    
    const existing = await prisma.user.findUnique({ 
      where: { email: data.data.email } 
    });
    
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    
    const hash = await bcrypt.hash(data.data.password, 12);
    
    await prisma.user.create({
      data: { 
        name: data.data.name, 
        email: data.data.email, 
        passwordHash: hash, 
        role: "TRAINER", 
        status: "PENDING" 
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Trainer signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
