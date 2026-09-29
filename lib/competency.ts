import { prisma } from "@/lib/prisma";

function qualTier(quals: string[]): number {
  if (quals.some((q) => /phd|doctorate/i.test(q))) return 3;
  if (quals.some((q) => /master|mtech|msc/i.test(q))) return 2;
  if (quals.some((q) => /bachelor|btech|bsc/i.test(q))) return 1;
  return 0;
}

export async function rankTrainersForSubject(subjectTags: string[]) {
  const trainers = await prisma.user.findMany({
    where: { role: "TRAINER", status: "APPROVED" },
    include: { profile: true },
  });

  return trainers
    .map((trainer) => {
      const profile = trainer.profile;
      if (!profile) return { trainer, score: 0, breakdown: { skillMatches: 0, qualScore: 0, expScore: 0 } };
      const skillMatches = profile.skills.filter((s) =>
        subjectTags.some((t) => s.toLowerCase().includes(t.toLowerCase()))
      ).length;
      const qualScore = 100 * qualTier(profile.qualifications);
      const expScore = 5 * (profile.yearsExp ?? 0);
      const score = 50 * skillMatches + qualScore + expScore;
      return { trainer, score, breakdown: { skillMatches, qualScore, expScore } };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
