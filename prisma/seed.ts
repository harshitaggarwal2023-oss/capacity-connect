import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CAPACITY CONNECT initial platform data...");

  // 1. User's requested Admin account
  const adminPasswordHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@capacityconnect.in" },
    update: {
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      status: "APPROVED",
    },
    create: {
      email: "admin@capacityconnect.in",
      name: "Harshit Aggarwal (Admin)",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      status: "APPROVED",
    },
  });
  console.log("Admin seeded:", admin.email);

  // 2. Sample Teacher / Trainer account
  const teacherPasswordHash = await bcrypt.hash("trainer123", 12);
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@capacityconnect.in" },
    update: {
      passwordHash: teacherPasswordHash,
      role: "TRAINER",
      status: "APPROVED",
    },
    create: {
      email: "teacher@capacityconnect.in",
      name: "Prof. Vikram Malhotra",
      passwordHash: teacherPasswordHash,
      role: "TRAINER",
      status: "APPROVED",
      profile: {
        create: {
          fullName: "Prof. Vikram Malhotra",
          qualifications: ["PhD in Public Administration", "Certified GovTech Trainer"],
          skills: ["Digital Governance", "Cybersecurity", "Public Policy", "e-Governance"],
          experience: "12 years in civil service training and governance architecture",
          yearsExp: 12,
          competencyScore: 310,
        },
      },
    },
  });
  console.log("Teacher seeded:", teacher.email);

  // 3. Sample Course created by Teacher
  let course = await prisma.course.findFirst({
    where: { title: "Digital Governance & Public Policy Architecture" },
  });

  if (!course) {
    course = await prisma.course.create({
      data: {
        title: "Digital Governance & Public Policy Architecture",
        description: "Comprehensive foundational training on modern digital governance, institutional data security, and citizen service workflows.",
        status: "PUBLISHED",
        trainerId: teacher.id,
        resources: {
          create: [
            {
              title: "Digital Governance Training Manual (PDF)",
              url: "/resources/digital-governance-training.pdf",
              type: "PDF",
            },
          ],
        },
        quizzes: {
          create: [
            {
              title: "Foundational Assessment: Digital Policy",
              deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
              timeLimit: 15,
              passMark: 60,
              questions: {
                create: [
                  {
                    text: "What is the primary objective of isolated portal role-based access control?",
                    options: [
                      "Prevent privilege escalation and enforce least-privilege boundary",
                      "Make user registration slower",
                      "Duplicate database tables",
                      "Disable user notifications",
                    ],
                    correctIndex: 0,
                  },
                  {
                    text: "Which mechanism guarantees quiz timers cannot be tampered with on client devices?",
                    options: [
                      "Client-side setInterval timer",
                      "Server-authoritative timestamp validation on submission",
                      "Browser cookies without expiry",
                      "Local storage flags",
                    ],
                    correctIndex: 1,
                  },
                  {
                    text: "What does the deterministic competency mapping algorithm evaluate?",
                    options: [
                      "Random lottery selection",
                      "Domain skill tag match, qualification tiers, and years of experience",
                      "Number of social media followers",
                      "Highest bidder auction",
                    ],
                    correctIndex: 1,
                  },
                ],
              },
            },
          ],
        },
      },
    });
    console.log("Sample Course seeded with PDF Resource and Quiz:", course.title);
  } else {
    // Ensure the PDF resource is attached
    const existingResource = await prisma.resource.findFirst({
      where: { courseId: course.id, url: "/resources/digital-governance-training.pdf" },
    });
    if (!existingResource) {
      await prisma.resource.create({
        data: {
          title: "Digital Governance Training Manual (PDF)",
          url: "/resources/digital-governance-training.pdf",
          type: "PDF",
          courseId: course.id,
        },
      });
      console.log("Attached PDF resource to existing course.");
    }
  }

  // 4. Sample Announcement
  const existingAnnouncement = await prisma.announcement.findFirst({
    where: { title: "Welcome to CAPACITY CONNECT" },
  });
  if (!existingAnnouncement) {
    await prisma.announcement.create({
      data: {
        adminId: admin.id,
        title: "Welcome to CAPACITY CONNECT",
        content: "The centralized state digital capacity building platform is now live. Explore new modules, take certified assessments, and connect with faculty.",
        type: "ANNOUNCEMENT",
      },
    });
    console.log("Sample announcement published.");
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
