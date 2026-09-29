import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireRole(role: "TRAINEE" | "TRAINER" | "ADMIN") {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== role) {
    redirect(`/${role.toLowerCase()}/login`);
  }
  return session;
}
