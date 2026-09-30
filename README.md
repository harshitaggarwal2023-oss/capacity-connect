<div align="center">

# 🏛️ CAPACITY CONNECT
### State Digital Capacity Building & Competency Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://capacityconnect-portal.vercel.app)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)

<br />

### 🌐 **[Live Production Deployment](https://capacityconnect-portal.vercel.app)**
A cloud-native, multi-tenant digital ecosystem engineered to modernize departmental civil service training, automate competency evaluations, and issue cryptographically verifiable credentials.

</div>

---

## 📌 Table of Contents
- [Executive Overview](#-executive-overview)
- [System Architecture](#-system-architecture)
- [Key Capabilities](#-key-capabilities)
- [Three-Tier Role Portals](#-three-tier-role-portals)
- [Live Demo Credentials](#-live-demo-credentials)
- [Tech Stack](#-tech-stack)
- [Local Development Setup](#-local-development-setup)
- [Database & Migrations](#-database--migrations)
- [Cloud Deployment](#-cloud-deployment)
- [Repository Structure](#-repository-structure)

---

## 🏛️ Executive Overview

Traditional departmental capacity building in state and central institutions faces severe structural inefficiencies:
- **Fragmented Silos:** Training materials scattered across disconnected Google Forms, unmonitored video links, and paper manuals.
- **Unverified Assessments:** Lack of cheat-resistant evaluation mechanisms or timed proctoring for civil servants.
- **Lack of Real-Time Mentorship:** Trainees have no direct, isolated communication channels with certified trainers.
- **Paper & Fraudulent Certificates:** Non-verifiable paper certificates with no public cryptographic verification trail.

**CAPACITY CONNECT** solves this with a unified, role-segregated platform connecting **Trainees**, **Certified Trainers**, and **State Administrators** with deterministic server-authoritative assessments, live WebSocket course mentorship, and tamper-evident QR completion credentials.

---

## 📐 System Architecture

```mermaid
graph TD
    Client[Browser / Mobile Client] -->|HTTPS / Next.js 16| VercelEdge[Vercel Global Edge Network]
    Client -->|WebSocket| SocketServer[Socket.io Real-Time Engine]
    
    subgraph Vercel Edge Serverless
        VercelEdge --> AuthMiddleware[NextAuth v5 Middleware / JWT]
        AuthMiddleware --> RoleGateways[Trainee / Trainer / Admin Portals]
        RoleGateways --> APIRoutes[Next.js Serverless Route Handlers]
        APIRoutes --> QuizEngine[Server-Authoritative Anti-Cheat Engine]
    end
    
    subgraph Data Layer
        APIRoutes -->|Prisma Client ORM| PgBouncer[Supabase PgBouncer Pooler :6543]
        SocketServer -->|State Sync| PgBouncer
        PgBouncer --> SupabasePostgres[(Supabase PostgreSQL Database)]
    end
    
    subgraph External Integrations
        AuthMiddleware --> GoogleOAuth[Google Cloud OAuth 2.0]
        APIRoutes --> PDFEngine[PDFKit Certificate Generator]
    end
```

---

## ⚡ Key Capabilities

### 1. 🛡️ Server-Authoritative Anti-Cheat Quizzes
- **Deterministic Server Timers:** Timers are bound to server timestamps. Attempt records cannot be manipulated via client clocks.
- **Answer Scrambling:** Question orders and option indices are shuffled.
- **Hidden Answer Keys:** Correct indices are never transmitted to the browser until the attempt is cryptographically sealed in the database.

### 2. 💬 Real-Time Mentorship & Course Rooms
- Persistent WebSocket channels (`Socket.io`) connecting participants directly to assigned faculty trainers.
- Room isolation based on course enrollment (`course:<id>`).
- Built-in graceful HTTP polling fallback for maximum reliability across restrictive government firewalls.

### 3. 📜 Cryptographic QR Verification Certificates
- Automatic generation of verified completion credentials upon passing assessments.
- Unique public verification hash embedded in an on-certificate QR code for instant third-party validation without login.

### 4. 📊 AI Competency & Skill Gap Analysis
- Real-time aggregation of participant scores mapped against civil service capability frameworks.
- Trainee dashboard displays personalized strength indicators, completion streaks, and curriculum progress.

### 5. 🧑‍💼 Interactive Admin Command Center & Teacher Dossier
- Comprehensive platform metrics, completion rates, and department throughput analytics.
- **Interactive Teacher Dossier:** Executive controls to audit faculty profiles and toggle course publication states (`Published` ↔ `Archived`) in real-time.

---

## 🎭 Three-Tier Role Portals

| Portal | Theme | Route | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **Trainee Portal** | Deep Sapphire (`#172554`) | `/trainee/dashboard` | Browse curricula, participate in timed assessments, track skill streaks, export certificates, and chat with mentors. |
| **Trainer Suite** | Emerald Forest (`#064e3b`) | `/trainer/dashboard` | Manage syllabus modules, author MCQ banks, monitor trainee submissions, and manage course mentorship channels. |
| **Admin Command** | Executive Onyx (`#090d16`) | `/admin/dashboard` | Macro-level state analytics, trainer application approvals, statewide circular broadcasts, and course governance. |

---

## 🔑 Live Demo Credentials

The platform is pre-seeded with sample users for immediate evaluation on the [Live Portal](https://capacityconnect-portal.vercel.app):

| Role | Portal URL | Demo Email | Demo Password | Quick Sign In |
| :--- | :--- | :--- | :--- | :--- |
| **System Administrator** | [`/admin/login`](https://capacityconnect-portal.vercel.app/admin/login) | `admin@capacityconnect.in` | `admin123` | 1-Click Admin Button |
| **Certified Trainer** | [`/trainer/login`](https://capacityconnect-portal.vercel.app/trainer/login) | `teacher@capacityconnect.in` | `trainer123` | 1-Click Trainer Button |
| **Public Trainee** | [`/trainee/login`](https://capacityconnect-portal.vercel.app/trainee/login) | `trainee@capacityconnect.in` | `trainee123` | 1-Click Trainee Button |

> 💡 **Google OAuth:** You can also use **"Continue with Google"** on [`/trainee/login`](https://capacityconnect-portal.vercel.app/trainee/login) or [`/trainee/signup`](https://capacityconnect-portal.vercel.app/trainee/signup) with your own Google account.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.3.7 (App Router, Turbopack)
- **UI Library:** React 19 + Framer Motion (Aceternity UI Floating Pill Navbar, Bento Grids)
- **Styling:** Tailwind CSS v4 + `@tabler/icons-react`
- **Database:** Supabase Cloud PostgreSQL (Prisma ORM v6.4.1)
- **Connection Pooling:** PgBouncer (Transaction mode on `:6543`, Direct mode on `:5432`)
- **Authentication:** NextAuth.js v5 (Google OAuth 2.0 + Credentials Provider + JWT Cookies + bcryptjs)
- **Real-Time Layer:** Socket.io v4 with room isolation
- **Document Generation:** PDFKit for verified completion certificates
- **Deployment:** Vercel Global Edge Network (Frontend) + Supabase (Database) + Render (Socket.io)

---

## 💻 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/harshitaggarwal2023-oss/capacity-connect.git
cd capacity-connect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Database (Local Postgres or Supabase)
DATABASE_URL="postgresql://postgres:password@localhost:5432/capacity_connect?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/capacity_connect"

# NextAuth Secret & App URLs
NEXTAUTH_SECRET="your-secure-random-secret-key"
AUTH_SECRET="your-secure-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Real-Time Socket.io
SOCKET_PORT=3001
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"

# Google Cloud OAuth 2.0 Credentials
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 4. Run Migrations & Seed Database
```bash
npx prisma db push
npm run seed
```

### 5. Start Development Servers
Run the Next.js web application:
```bash
npm run dev
```

In a separate terminal, start the Socket.io real-time server:
```bash
npm run dev:socket
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database & Migrations

The database schema is managed via Prisma ORM located in [`prisma/schema.prisma`](prisma/schema.prisma):

- **`User` / `Account` / `Session`:** NextAuth user identity, role-based governance (`TRAINEE`, `TRAINER`, `ADMIN`), and approval states.
- **`Profile`:** Qualifications, years of experience, and competency metrics.
- **`Course` / `Resource`:** Courseware, syllabus files, and accredited module references.
- **`Enrollment`:** Progress tracking (`0% - 100%`) and milestone dates.
- **`Quiz` / `Question` / `Attempt`:** Server-authoritative assessment records and question pools.
- **`Message`:** Isolated course-room real-time messaging between trainees and mentors.
- **`Certificate`:** Cryptographic completion records with public verification hashes.

---

## 🚀 Cloud Deployment

### Vercel Deployment (Frontend & APIs)
This repository includes `"postinstall": "prisma generate"` in `package.json`, ensuring zero-config Prisma compilation during Vercel builds.

```bash
npx vercel --prod
```

### Supabase (Database)
Supports both Transaction Pooler (`DATABASE_URL`, port `6543`) and Direct Session connection (`DIRECT_URL`, port `5432`) in [`prisma/schema.prisma`](prisma/schema.prisma) for serverless scalability.

---

## 📁 Repository Structure

```text
├── app/
│   ├── (admin)/admin/          # Executive Admin Portal & Dashboards
│   ├── (auth)/                 # Role-based Login & Signup (Trainee, Trainer, Admin)
│   ├── (trainee)/trainee/      # Trainee Dashboard, Catalog, Exams & Results
│   ├── (trainer)/trainer/      # Trainer Suite, Curriculum & Question Builder
│   ├── api/                    # Serverless Next.js Route Handlers
│   │   ├── admin/              # User approvals, announcements, course toggling
│   │   ├── assessments/        # Server-authoritative quiz start & submit
│   │   ├── auth/               # NextAuth & registration endpoints
│   │   ├── courses/            # Course catalog & enrollment queries
│   │   ├── messages/           # Course room direct mentorship messages
│   │   └── profile/            # Competency profiles & skills
│   ├── page.tsx                # Public Landing Page with Core Capabilities Bento
│   └── layout.tsx              # Root HTML & Global Providers
├── components/
│   ├── landing/                # Bento features, Hero, Portal cards
│   ├── ui/                     # Aceternity floating pill navbar, buttons, cards
│   ├── portal-navbar.tsx       # Floating authenticated portal navbar
│   └── landing-navbar.tsx      # Public landing navbar with mobile drawer
├── lib/
│   ├── prisma.ts               # Global Prisma client instance
│   └── auth-helpers.ts         # Server-side RBAC session guards
├── prisma/
│   ├── schema.prisma           # Relational PostgreSQL schema
│   └── seed.ts                 # Database seed script
├── server/
│   ├── index.ts                # Real-time Socket.io server
│   └── tsconfig.json           # Socket.io TypeScript config
└── scripts/
    ├── generate-demo-pdf.js    # PDF generation for Hackathon Jury Pitch
    └── generate-yt-script-pdf.js # YouTube Demo Video Script PDF generator
```

---

<div align="center">

**CAPACITY CONNECT** — Built with precision for the **Smart India Hackathon (SIH)**.  
*Empowering civil service capacity with transparent, verifiable digital infrastructure.*

</div>
