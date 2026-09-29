import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-helpers";
import { rankTrainersForSubject } from "@/lib/competency";
import { z } from "zod";

const schema = z.object({
  courseId: z.string(),
  subjectTags: z.array(z.string()),
});

export async function POST(req: Request) {
  try {
    await requireRole("ADMIN");
    const body = await req.json();
    const parsed = schema.parse(body);

    const trainers = await rankTrainersForSubject(parsed.subjectTags);
    
    // trainers returns an array of { user, score, breakdown: { skills, qualifications, experience } }
    // Limit to top 3
    return NextResponse.json(trainers.slice(0, 3));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
