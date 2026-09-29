import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@capacityconnect.in" },
    update: {},
    create: {
      email: "admin@capacityconnect.in",
      name: "Platform Admin",
      passwordHash: hash,
      role: "ADMIN",
      status: "APPROVED",
    },
  });
  console.log("Seeded: admin@capacityconnect.in / admin123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
