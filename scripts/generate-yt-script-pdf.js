const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 35, bottom: 35, left: 40, right: 40 },
  bufferPages: true,
});

const outputPath = path.join(__dirname, '../CAPACITY_CONNECT_YOUTUBE_DEMO_SCRIPT.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Styling constants
const RED_YT = '#ef4444';
const NAVY_DARK = '#0f172a';
const SLATE_BLUE = '#1e3a8a';
const TEXT_DARK = '#1e293b';
const TEXT_MUTED = '#64748b';
const ACCENT_BG = '#f1f5f9';
const BORDER_COLOR = '#cbd5e1';

// Helper: Section Header
function renderSection(title, badge) {
  doc.moveDown(0.6);
  const startY = doc.y;
  doc.rect(40, startY, doc.page.width - 80, 22).fill('#f8fafc').stroke('#e2e8f0');
  doc.fillColor(NAVY_DARK).fontSize(10.5).font('Helvetica-Bold').text(title, 48, startY + 6);
  if (badge) {
    doc.fillColor(RED_YT).fontSize(8).font('Helvetica-Bold').text(badge, doc.page.width - 160, startY + 6, { width: 110, align: 'right' });
  }
  doc.moveDown(0.6);
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_DARK);
}

// Helper: Two-Column YouTube Scene Block
function renderScene(timecode, sceneTitle, visualDirections, voiceoverText) {
  const startY = doc.y;
  const colVisualW = 195;
  const colVoW = doc.page.width - 80 - colVisualW - 15;
  const colVoX = 40 + colVisualW + 15;

  // Header of Scene
  doc.rect(40, startY, doc.page.width - 80, 18).fill('#0f172a');
  doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica-Bold').text(`${timecode}  |  ${sceneTitle}`, 48, startY + 5);

  doc.y = startY + 24;

  const contentStartY = doc.y;

  // Left Column: Visual & Screen Actions
  doc.fillColor('#dc2626').font('Helvetica-Bold').fontSize(8).text('SCREEN / VISUAL ACTIONS', 44, contentStartY);
  doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(8.2);
  visualDirections.forEach(v => {
    doc.moveDown(0.15);
    doc.text(`• ${v}`, 44, doc.y, { width: colVisualW - 8, lineGap: 1.5 });
  });

  const visualEndY = doc.y;

  // Right Column: Spoken Voiceover
  doc.fillColor(SLATE_BLUE).font('Helvetica-Bold').fontSize(8).text('SPOKEN VOICEOVER (DIALOGUE)', colVoX, contentStartY);
  doc.fillColor(TEXT_DARK).font('Helvetica-Oblique').fontSize(8.4);
  doc.text(`"${voiceoverText}"`, colVoX, contentStartY + 12, { width: colVoW - 8, lineGap: 2 });

  const voEndY = doc.y;

  // Box border around the whole scene
  const blockHeight = Math.max(visualEndY, voEndY) - startY + 8;
  doc.rect(40, startY, doc.page.width - 80, blockHeight).stroke('#cbd5e1');

  doc.y = startY + blockHeight + 8;
}

// ==================== PAGE 1 ====================

// Video Header Banner
doc.rect(40, 35, doc.page.width - 80, 68).fill('#0f172a');
doc.fillColor(RED_YT).fontSize(9).font('Helvetica-Bold').text('▶ YOUTUBE VIDEO DEMONSTRATION & WALKTHROUGH SCRIPT', 52, 45);
doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('CAPACITY CONNECT: Government Digital Training Platform', 52, 58);
doc.fillColor('#94a3b8').fontSize(8.5).font('Helvetica').text('Video Target Duration: 5 - 6 Minutes  |  Tone: Confident, Crisp, Professional Tech Demo  |  Format: Voiceover + Screen Capture', 52, 78);

doc.y = 112;

// Suggested Video Metadata Box
doc.rect(40, doc.y, doc.page.width - 80, 58).fill('#f8fafc').stroke(BORDER_COLOR);
const metaY = doc.y + 6;
doc.fillColor(NAVY_DARK).fontSize(8.5).font('Helvetica-Bold').text('YOUTUBE TITLE OPTIONS:', 48, metaY);
doc.font('Helvetica').fontSize(8).fillColor(TEXT_DARK);
doc.text('1. "Capacity Connect — State Digital Capacity Building & Competency Portal (Full Demo)"', 48, metaY + 12);
doc.text('2. "Building India\'s GovTech Training Infrastructure: Capacity Connect Complete Walkthrough"', 48, metaY + 24);
doc.text('Production Link: https://capacityconnect-portal.vercel.app  |  GitHub: harshitaggarwal2023-oss/capacity-connect', 48, metaY + 38);

doc.y = metaY + 54;

// SCENE 1: HOOK & INTRO
renderScene(
  '0:00 - 0:45',
  'SCENE 1: The Hook & The Problem in Government Training',
  [
    'Start on camera (talking head) or full-screen dynamic motion graphics showing logos of civil services.',
    'Quick B-roll: stacks of physical paper files, generic confusing Google Forms, unorganized Zoom links.',
    'Fast whip-pan transition into the live production site: https://capacityconnect-portal.vercel.app.'
  ],
  'Every year, state and central departments conduct thousands of training sessions for public servants. But how do we know if anyone actually learned? In reality, training is stuck in manual attendance, unproctored video calls, and paper certificates that anyone could forge. Today, we are proud to introduce CAPACITY CONNECT — a production-ready, cloud-native digital capacity building portal designed to modernize civil service capability at national scale. Let us take a tour.'
);

// SCENE 2: LANDING & ARCHITECTURE
renderScene(
  '0:45 - 1:30',
  'SCENE 2: Floating Pill Navbar & Bento Capabilities',
  [
    'Full-screen capture of landing page on 4K/1080p display.',
    'Smoothly scroll down. Zoom in (115%) on the floating rounded-pill navbar as it shrinks and blurs against the background.',
    'Highlight the Core Capabilities Bento Grid: cursor hovers over the 6 distinct feature cards (RBAC, Anti-Cheat, WebSocket Chat, AI Gap Analysis).'
  ],
  'We are live on our production deployment at capacityconnect-portal.vercel.app. From the moment you land, the platform feels light years ahead of traditional government software. Notice our floating pill navbar with glassmorphic blur, and our Core Capabilities bento showcase. Rather than a generic LMS, CAPACITY CONNECT is purpose-built with role-based institutional portals, server-enforced countdown timers, AI skill matrices, and cryptographic completion credentials.'
);

// SCENE 3: TRAINEE PORTAL & DASHBOARD
renderScene(
  '1:30 - 2:30',
  'SCENE 3: Trainee Portal & Personalized Curriculum',
  [
    'Click "Get Started" ➔ shows the brand-new Trainee Signup & Login portal.',
    'Click "Sign in with Google" or 1-Click Trainee Demo login.',
    'Smooth transition into /trainee/dashboard (Sapphire Blue theme).',
    'Pan over: Learning streak counter, current enrolled courses, and competency radar metrics.'
  ],
  'Let us begin as a Trainee. Participants can sign in with their official credentials or use verified Google OAuth with zero friction. Inside the Trainee dashboard, participants track their active courses, competency streaks, and upcoming deadlines. Everything is tailored: syllabus handbooks, video modules, and departmental circulars are delivered in one distraction-free interface.'
);

// ==================== PAGE 2 ====================
doc.addPage();

// SCENE 4: COURSE CATALOG & LIVE ASSESSMENT
renderScene(
  '2:30 - 3:45',
  'SCENE 4: Course Catalog & Server-Authoritative Anti-Cheat Quiz',
  [
    'Navigate to /trainee/courses. Point out the course: "Digital Governance & Public Policy Architecture", instructor credentials, and syllabus chips.',
    'Click to start the Assessment (/trainee/assessments/[id]).',
    'HIGHLIGHT CUE: Red outline/zoom on the countdown clock (14:59).',
    'Select answers for the 3 questions and click "Submit Assessment".',
    'Show the 100% Score card ("Assessment Complete - You passed").',
    'Click "Return to Dashboard" to prove the seamless navigation.'
  ],
  'Now, let us test learning outcomes. Trainees browse certified curricula and enroll with one click. When an assessment begins, our anti-cheat engine takes over. The countdown timer is locked to the server clock; answer options are scrambled; and the correct answers are strictly kept on the server until the attempt is cryptographically sealed in PostgreSQL. Upon submission, grading is calculated instantly, awarding our trainee a perfect 100% score and returning them smoothly to their dashboard.'
);

// SCENE 5: TEACHER / TRAINER SUITE & WEBSOCKET CHAT
renderScene(
  '3:45 - 4:45',
  'SCENE 5: Teacher Suite, Teacher Dossier & Live Mentorship',
  [
    'Click navbar logout icon ➔ Navigate to /trainer/login.',
    'Log in as Prof. Vikram Malhotra (teacher@capacityconnect.in / trainer123).',
    'Show Emerald-themed Trainer Dashboard with Teacher Dossier (12 yrs exp, 310 competency points).',
    'Open /trainer/messages: Click on the course channel.',
    'Split screen or demonstrate live typing: show real-time trainee inquiries delivered via Socket.io with zero delay.'
  ],
  'Now let us switch to the educator perspective. Certified trainers access an Emerald-themed suite equipped with their official Teacher Dossier, highlighting qualifications, years of service, and competency points. Trainers can publish question banks, manage syllabus files, and mentor trainees directly. Notice our live mentorship channel: powered by WebSockets, faculty can answer participant doubts in real-time, completely closing the communication gap.'
);

// SCENE 6: ADMIN COMMAND CENTER
renderScene(
  '4:45 - 5:30',
  'SCENE 6: Admin Command Center & State Curriculum Control',
  [
    'Navigate to /admin/login ➔ Log in with admin@capacityconnect.in / admin123.',
    'Display the Executive Onyx Command Center: national pass rates, active trainee volume, and pending instructor approvals.',
    'Scroll to Teacher Dossier course card. Click "Archive Course" or "Publish Course" ➔ highlight the instant state change in the UI.',
    'Briefly show the system announcement broadcast tool.'
  ],
  'Finally, we enter the Admin Command Center — built for state secretaries and training directors. From this executive cockpit, leadership monitors statewide completion rates, approves new trainer applications, and exercises governance over curriculum. With a single click on any course card, an administrator can toggle its status between Published and Archived, immediately updating course availability across the state portal.'
);

// ==================== PAGE 3 ====================
doc.addPage();

// SCENE 7: TECHNICAL ARCHITECTURE & OUTRO
renderScene(
  '5:30 - 6:15',
  'SCENE 7: Cloud Architecture & High-Impact Outro',
  [
    'Show full architectural graphic: Next.js 16 + React 19 + Turbopack + Vercel Edge + Supabase Cloud PostgreSQL + Socket.io + Google OAuth.',
    'Switch to camera (talking head) with the live portal displayed on monitor in background.',
    'Display GitHub repo link (harshitaggarwal2023-oss/capacity-connect) and live URL (capacityconnect-portal.vercel.app).'
  ],
  'Under the hood, CAPACITY CONNECT is engineered for high concurrency. Our frontend runs on Next.js 16 and React 19 deployed globally on Vercel Edge. Our database is powered by Supabase Cloud PostgreSQL using transaction pooling to easily support thousands of concurrent civil servants during mass training drives. We have built a production-hardened platform ready for nationwide deployment. Check out our live link in the description, explore our code on GitHub, and thank you for watching.'
);

// YOUTUBE DESCRIPTION & TIMESTAMPS TEMPLATE
renderSection('YOUTUBE DESCRIPTION & PINNED COMMENT TEMPLATE', 'Copy & paste directly into YouTube Studio');

const descBoxY = doc.y;
doc.rect(40, descBoxY, doc.page.width - 80, 160).fill('#f8fafc').stroke(BORDER_COLOR);

doc.fillColor(NAVY_DARK).fontSize(8.5).font('Helvetica-Bold').text('VIDEO DESCRIPTION TEMPLATE:', 48, descBoxY + 8);
doc.font('Helvetica').fontSize(7.8).fillColor(TEXT_DARK);
const descText = [
  'CAPACITY CONNECT is a state digital capacity building & competency management portal engineered to modernize departmental civil service training.',
  '',
  '🌐 Live Portal: https://capacityconnect-portal.vercel.app',
  '💻 GitHub Repository: https://github.com/harshitaggarwal2023-oss/capacity-connect',
  '',
  '⏱️ TIMESTAMPS:',
  '0:00 - Introduction & The Civil Service Training Problem',
  '0:45 - Architecture, Floating Pill Navbar & Bento Capabilities',
  '1:30 - Trainee Portal, Dashboard & Learning Streak',
  '2:30 - Course Catalog & Anti-Cheat Timed Assessment Demo',
  '3:45 - Teacher / Trainer Suite & Real-Time Mentorship Chat',
  '4:45 - Admin Command Center, Teacher Dossier & Course Toggling',
  '5:30 - Cloud Infrastructure (Next.js 16 + Supabase + Vercel) & Wrap-Up',
  '',
  '🏷️ TAGS: #GovTech #SmartIndiaHackathon #NextJS #Supabase #Vercel #WebDevelopment #FullStack'
];

descText.forEach(line => {
  doc.text(line, 48, doc.y, { width: doc.page.width - 96 });
});

// Production Checklist Box
doc.y = descBoxY + 170;
renderSection('VIDEO PRODUCTION TIPS & AUDIO SETTINGS', 'Best practices for high-impact recording');
doc.fontSize(8.2).font('Helvetica').fillColor(TEXT_DARK);
doc.text('• Resolution: Record in 1920x1080 (1080p) or 2560x1440 (1440p) at 60 FPS for ultra-smooth scrolling.');
doc.text('• Mouse Cursor: Enable a subtle click highlight or zoom effect in your editing software (ScreenFlow / OBS / Premiere).');
doc.text('• Background Music: Use a soft, modern ambient corporate tech beat (e.g. low-volume lofi/synthwave at -22 dB).');
doc.text('• Browser Setup: Press F11 or Cmd+Shift+F for clean full-screen browser with bookmark bar hidden.');

// Page Footers
const pageCount = doc.bufferedPageRange().count;
for (let i = 0; i < pageCount; i++) {
  doc.switchToPage(i);
  doc.rect(40, doc.page.height - 25, doc.page.width - 80, 0.5).fill('#cbd5e1');
  doc.fillColor(TEXT_MUTED).fontSize(7.5).font('Helvetica');
  doc.text('CAPACITY CONNECT  |  YouTube Video Walkthrough Script & Production Plan', 40, doc.page.height - 20);
  doc.text(`Page ${i + 1} of ${pageCount}`, doc.page.width - 100, doc.page.height - 20, { align: 'right' });
}

doc.end();
console.log('YouTube Script PDF generated at:', outputPath);
