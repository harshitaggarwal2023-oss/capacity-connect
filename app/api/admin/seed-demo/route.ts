import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("key");

  if (secret !== "capacity-connect-seed-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const adminHash = await bcrypt.hash("admin123", 12);

    const admin = await prisma.user.upsert({
      where: { email: "admin@capacityconnect.in" },
      update: {
        passwordHash: adminHash,
        name: "State Administrator",
        role: "ADMIN",
        status: "APPROVED",
      },
      create: {
        email: "admin@capacityconnect.in",
        name: "State Administrator",
        passwordHash: adminHash,
        role: "ADMIN",
        status: "APPROVED",
      },
    });

    // Remove any legacy admin accounts completely
    const deleted = await prisma.user.deleteMany({
      where: {
        role: "ADMIN",
        email: {
          not: "admin@capacityconnect.in",
        },
      },
    });

    return NextResponse.json({
      success: true,
      adminId: admin.id,
      adminEmail: admin.email,
      personalAccountsRemoved: deleted.count,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
