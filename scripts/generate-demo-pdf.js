const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
  bufferPages: true,
});

const outputPath = path.join(__dirname, '../CAPACITY_CONNECT_DEMO_SCRIPT.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Colors
const PRIMARY = '#0f172a';
const SECONDARY = '#1e3a8a';
const ACCENT_EMERALD = '#065f46';
const TEXT_DARK = '#1e293b';
const TEXT_MUTED = '#64748b';
const BG_LIGHT = '#f8fafc';
const BORDER_COLOR = '#cbd5e1';

// Helper: Section Header
function renderSectionHeader(title, subtitle) {
  doc.moveDown(0.8);
  doc.rect(doc.x, doc.y, doc.page.width - 90, 26).fill('#f1f5f9');
  doc.fillColor(SECONDARY).fontSize(13).font('Helvetica-Bold').text(title, doc.x + 8, doc.y - 20);
  if (subtitle) {
    doc.fillColor(TEXT_MUTED).fontSize(9).font('Helvetica-Oblique').text(subtitle, doc.x + 8, doc.y + 2);
  }
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_DARK);
}

// Helper: Callout Box
function renderCallout(title, items, bgColor = '#eff6ff', borderColor = '#93c5fd') {
  const startY = doc.y;
  doc.rect(doc.x, startY, doc.page.width - 90, 1).fill('transparent'); // marker
  
  doc.fillColor(SECONDARY).fontSize(10).font('Helvetica-Bold').text(title, doc.x + 10, startY + 8);
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK);
  
  items.forEach(item => {
    doc.moveDown(0.2);
    doc.text(`•  ${item}`, { indent: 10, lineGap: 2 });
  });
  doc.moveDown(0.5);
}

// --- COVER / HEADER ---
doc.rect(45, 40, doc.page.width - 90, 75).fill('#0f172a');
doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold').text('CAPACITY CONNECT', 60, 52);
doc.fontSize(10).font('Helvetica').fillColor('#94a3b8').text('State Digital Capacity Building & Competency Management Portal', 60, 76);
doc.fontSize(8.5).fillColor('#38bdf8').text('LIVE URL: https://capacityconnect-portal.vercel.app  |  HACKATHON DEMO GUIDE', 60, 92);

doc.moveDown(3);
doc.fillColor(TEXT_DARK);

// --- META INFO BAR ---
doc.rect(45, 125, doc.page.width - 90, 36).fill('#f8fafc').stroke(BORDER_COLOR);
doc.fillColor(TEXT_DARK).fontSize(8.5).font('Helvetica-Bold');
doc.text('TARGET AUDIENCE: ', 55, 132, { continued: true }).font('Helvetica').text('Smart India Hackathon Jury / Gov Evaluators');
doc.font('Helvetica-Bold').text('SUGGESTED DURATION: ', 55, 146, { continued: true }).font('Helvetica').text('5 to 7 Minutes  |  Role-Based Walkthrough (Trainee -> Trainer -> Admin)');

doc.y = 175;

// --- EXECUTIVE SUMMARY ---
renderSectionHeader('1. EXECUTIVE SUMMARY & PROBLEM STATEMENT', 'Why this platform exists and what problem it solves');
doc.text(
  'Government departments and public service enterprises face severe fragmentation in civil service capacity building. ' +
  'Existing solutions rely on disconnected Google Forms, unproctored video links, manual Excel tracking, and unverifiable paper certificates. ' +
  'CAPACITY CONNECT delivers a unified, multi-tenant digital portal that seamlessly connects Trainees, Certified Mentors, and Department Administrators. ' +
  'Key differentiators include server-authoritative anti-cheat quizzes, interactive competency mapping, persistent WebSocket mentorship channels, ' +
  'and cryptographically verifiable QR completion certificates.'
, { lineGap: 2 });

// --- DEMO CREDENTIALS CHEATSHEET ---
renderSectionHeader('2. DEMO CREDENTIALS CHEATSHEET', 'Quick access accounts pre-seeded on Supabase Cloud');
const colW = (doc.page.width - 90) / 3;
const boxY = doc.y;

// Admin Box
doc.rect(45, boxY, colW - 6, 68).fill('#090d16');
doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold').text('ADMIN COMMAND', 52, boxY + 8);
doc.fontSize(8).font('Helvetica').fillColor('#cbd5e1').text('admin@capacityconnect.in', 52, boxY + 22);
doc.fillColor('#38bdf8').text('Pass: admin123', 52, boxY + 34);
doc.fillColor('#94a3b8').text('Route: /admin/login', 52, boxY + 48);

// Trainer Box
doc.rect(45 + colW, boxY, colW - 6, 68).fill('#064e3b');
doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold').text('TEACHER / TRAINER', 52 + colW, boxY + 8);
doc.fontSize(8).font('Helvetica').fillColor('#cbd5e1').text('teacher@capacityconnect.in', 52 + colW, boxY + 22);
doc.fillColor('#34d399').text('Pass: trainer123', 52 + colW, boxY + 34);
doc.fillColor('#a7f3d0').text('Route: /trainer/login', 52 + colW, boxY + 48);

// Trainee Box
doc.rect(45 + (colW * 2), boxY, colW - 6, 68).fill('#172554');
doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold').text('TRAINEE PORTAL', 52 + (colW * 2), boxY + 8);
doc.fontSize(8).font('Helvetica').fillColor('#cbd5e1').text('trainee@capacityconnect.in', 52 + (colW * 2), boxY + 22);
doc.fillColor('#60a5fa').text('Pass: trainee123', 52 + (colW * 2), boxY + 34);
doc.fillColor('#bfdbfe').text('Or Google One-Tap Login', 52 + (colW * 2), boxY + 48);

doc.y = boxY + 80;

// --- STEP-BY-STEP SCRIPT ---
renderSectionHeader('3. DEMONSTRATION TIMELINE & SPOKEN PITCH', 'Follow this script verbatim during live judging');

// ACT 1
doc.fillColor(SECONDARY).font('Helvetica-Bold').fontSize(10.5).text('ACT 1: The Landing Experience & Public Architecture (0:00 - 1:00)');
doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK);
doc.text('•  ACTION: Navigate to https://capacityconnect-portal.vercel.app in full-screen browser.');
doc.text('•  HIGHLIGHT: Point out the floating pill navbar with smooth scroll blur, and the Core Capabilities Bento Grid.');
doc.moveDown(0.2);
doc.fillColor('#334155').font('Helvetica-Oblique').text(
  '"Respected Jury, welcome to CAPACITY CONNECT. Before you is our production deployment on Vercel backed by a managed Supabase PostgreSQL cloud database. ' +
  'Notice our floating pill navigation and Core Capabilities showcase: rather than a generic LMS, this platform is tailored specifically for public administration. ' +
  'It features three segregated role portals, server-authoritative quizzes with anti-cheat timers, AI skill mapping, and tamper-proof certificates."'
, { indent: 10, lineGap: 2 });

doc.moveDown(0.6);

// ACT 2
doc.fillColor(SECONDARY).font('Helvetica-Bold').fontSize(10.5).text('ACT 2: Trainee Experience — Discovery, Learning & Timed Exam (1:00 - 2:45)');
doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK);
doc.text('•  ACTION 1: Click "Sign In" or "Get Started". Highlight Google OAuth & 1-Click Demo login.');
doc.text('•  ACTION 2: Log in as Trainee (trainee@capacityconnect.in). Show the Sapphire Blue Dashboard, learning streak, and enrolled modules.');
doc.text('•  ACTION 3: Click "Courses" (/trainee/courses). Show the course card: "Digital Governance & Public Policy Architecture", instructor tag, syllabus stats, and "Continue Course".');
doc.text('•  ACTION 4: Click "Assessments" and launch the quiz. Show the live server countdown clock (14:59). Answer the 3 questions and click "Submit Assessment".');
doc.text('•  ACTION 5: Show the instant 100% score modal with "You passed" status, and click "Return to Dashboard" (demonstrating the seamless redirect).');
doc.moveDown(0.2);
doc.fillColor('#334155').font('Helvetica-Oblique').text(
  '"Watch as we enter the Trainee portal. Trainees can sign in via verified Google OAuth. Inside their dashboard, participants track curriculum milestones and learning streaks. ' +
  'When launching an assessment, the countdown timer is server-enforced: answers are evaluated server-side to guarantee integrity. Upon submission, grading is instant, ' +
  'and the participant earns a verified QR certificate viewable in their Results tab."'
, { indent: 10, lineGap: 2 });

// --- PAGE 2 ---
doc.addPage();

// ACT 3
renderSectionHeader('3. DEMONSTRATION TIMELINE (CONTINUED)', 'Acts 3, 4, and 5');
doc.fillColor(ACCENT_EMERALD).font('Helvetica-Bold').fontSize(10.5).text('ACT 3: Teacher / Trainer Suite — Content & Mentorship (2:45 - 4:00)');
doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK);
doc.text('•  ACTION 1: Sign out from navbar logout button, navigate to /trainer/login, and enter teacher@capacityconnect.in / trainer123.');
doc.text('•  ACTION 2: Display the Emerald-themed Trainer Suite with the Teacher Dossier card (qualifications, 12 years exp, 310 competency score).');
doc.text('•  ACTION 3: Show "My Courses" (/trainer/courses) where faculty create curricula, and "Assessments" (/trainer/quizzes) for MCQ creation.');
doc.text('•  ACTION 4: Open "Messages" (/trainer/messages): showcase the course mentorship room where trainers receive live trainee questions via Socket.io.');
doc.moveDown(0.2);
doc.fillColor('#334155').font('Helvetica-Oblique').text(
  '"Now shifting to the educator perspective: certified trainers have dedicated authoring tools to draft courseware and MCQ question banks. ' +
  'Notice the live mentorship channel: trainees can ask questions directly related to syllabus modules, and faculty can provide guidance in real-time. ' +
  'This closes the communication loop between civil servants and subject matter experts."'
, { indent: 10, lineGap: 2 });

doc.moveDown(0.6);

// ACT 4
doc.fillColor(PRIMARY).font('Helvetica-Bold').fontSize(10.5).text('ACT 4: Admin Command Center — Governance & State Oversight (4:00 - 5:15)');
doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK);
doc.text('•  ACTION 1: Sign in as Admin via /admin/login using admin@capacityconnect.in / admin123.');
doc.text('•  ACTION 2: Show the Executive Onyx Command Center: platform stats, active trainee counts, and national completion rates.');
doc.text('•  ACTION 3: Scroll to the Teacher Dossier & Course Card gallery. Click "Archive Course" or "Publish Course" — show live state toggle via /api/admin/courses/[id]/status.');
doc.text('•  ACTION 4: Point to the System Announcement broadcast feed and User Approval Queue for state oversight.');
doc.moveDown(0.2);
doc.fillColor('#334155').font('Helvetica-Oblique').text(
  '"Finally, the Admin Command Center provides macro-level governance for departmental directors. Admins monitor trainee throughput, approve trainer applications, ' +
  'and exercise administrative authority over curriculum status. With one click, an administrator can toggle course availability across the state portal."'
, { indent: 10, lineGap: 2 });

doc.moveDown(0.6);

// ACT 5
doc.fillColor(SECONDARY).font('Helvetica-Bold').fontSize(10.5).text('ACT 5: Architecture & Closing Pitch (5:15 - 6:00)');
doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK);
doc.text('•  HIGHLIGHT: Multi-tier cloud architecture running live in production.');
doc.text('•  SUMMARY POINTS:');
doc.text('   1. Next.js 16 (Turbopack) on Vercel with automatic edge SSL and zero infrastructure overhead.');
doc.text('   2. Supabase Cloud PostgreSQL with connection pooling (PgBouncer) for high concurrency.');
doc.text('   3. NextAuth v5 JWT session architecture with role-based routing middleware.');
doc.text('   4. Real-time WebSocket layer for course messaging and admin announcements.');
doc.moveDown(0.2);
doc.fillColor('#334155').font('Helvetica-Oblique').text(
  '"In conclusion, CAPACITY CONNECT is not a prototype — it is a production-hardened, multi-tenant digital ecosystem ready to scale across state and central departments. ' +
  'It delivers verified learning outcomes, eliminates administrative overhead, and empowers our public workforce. Thank you, and we welcome your questions."'
, { indent: 10, lineGap: 2 });

// --- FAQ & JURY Q&A ---
renderSectionHeader('4. ANTICIPATED JURY QUESTIONS & WINNING ANSWERS', 'Preparation for rapid-fire technical questions');

const qas = [
  {
    q: 'Q1: How do you prevent cheating on online assessments?',
    a: 'Answer: We utilize server-authoritative evaluation. Question options are shuffled, the countdown timer is validated against the server timestamp upon submission, and correct answers are never sent to the client browser until after the attempt is sealed in PostgreSQL.'
  },
  {
    q: 'Q2: How does the platform scale for thousands of government employees?',
    a: 'Answer: The Next.js frontend runs serverlessly on Vercel’s global Edge network. Database requests use Supabase’s transaction connection pooler (PgBouncer on port 6543), preventing connection exhaustion during mass training drives.'
  },
  {
    q: 'Q3: How are certificates verified by external departments?',
    a: 'Answer: Each completion generates an immutable cryptographic certificate record with a unique public hash and QR code. Anyone scanning the QR code can immediately verify certificate validity against our public database without logging in.'
  }
];

qas.forEach(qa => {
  doc.moveDown(0.3);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(SECONDARY).text(qa.q);
  doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_DARK).text(qa.a, { indent: 10, lineGap: 1.5 });
});

// --- FOOTER ON ALL PAGES ---
const pageCount = doc.bufferedPageRange().count;
for (let i = 0; i < pageCount; i++) {
  doc.switchToPage(i);
  doc.rect(45, doc.page.height - 35, doc.page.width - 90, 0.5).fill('#cbd5e1');
  doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica');
  doc.text('CAPACITY CONNECT  |  Hackathon Demonstration & Workflow Script', 45, doc.page.height - 28);
  doc.text(`Page ${i + 1} of ${pageCount}`, doc.page.width - 100, doc.page.height - 28, { align: 'right' });
}

doc.end();
console.log('PDF generated successfully at:', outputPath);
