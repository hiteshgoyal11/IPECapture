# IPECapture 🎓

> A modern, zero-cost, student-focused academic resource and community portal for **Inderprastha Engineering College (IPEC)**.

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38bdf8?style=flat&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20Postgres%20%7C%20Storage-3ECF8E?style=flat&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-gray?style=flat)

---

## 📌 Project Overview

Finding previous-year question papers (PYQs), verified lecture notes, assignments, and official college circulars at IPEC is often chaotic across multiple WhatsApp and Telegram groups. 

**IPECapture** solves this by providing a unified, cleanly indexed, and fast web application where students can discover, read, and contribute verified college resources without clutter, paywalls, or ads.

> **Note:** IPECapture is strictly a resource-sharing platform and document archive. It is **not** a learning management system (LMS) and does not stream or host video content.

---

## ✨ Key Features

### 1. Academic Resource Explorer
- **Subject & Semester Filtering:** Fast faceted search by Branch (CSE, IT, ECE, ME, Civil, etc.), Semester (1–8), and Resource Category.
- **Categorized Archives:** Dedicated sections for Previous Year Questions (PYQs), Faculty Notes, Assignments, and AKTU/College Syllabus.
- **In-Browser Document Reader:** Read PDFs directly inside an integrated reader with zero forced downloads, saving student mobile data.

### 2. Verified Student Submissions & Moderation
- **Community Uploads:** Students can upload PDFs and question papers directly from their dashboard.
- **Moderation Workflow:** All incoming files enter a `pending` queue. Admin/moderators review and approve documents before they become publicly visible, preventing spam and incorrect material.

### 3. College Notices & Campus Events
- Official college notifications, circulars, and exam timetable alerts.
- Dedicated showcase for college hackathons, technical fests, and society events.

### 4. Student Project Showcase
- Students can showcase their open-source projects, complete with tech-stack tags, live demo links, and GitHub repository references.

### 5. Adaptive Monochrome Design
- Clean, high-contrast, black-and-white minimalist interface inspired by modern developer platforms (Vercel, Linear).
- **Automatic System Theme Switching:** Smooth transition between clean white light mode and battery-saving dark mode based on the user's OS preference (`prefers-color-scheme`).

---

## 🛠️ Tech Stack & Infrastructure

- **Frontend Framework:** [Next.js](https://nextjs.org/) (App Router, Server Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/) for strict type safety
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with class-based dynamic theme switching
- **Database:** [Supabase](https://supabase.com/) (Managed PostgreSQL)
- **Authentication:** Supabase Auth (Secure session management and cookie-based SSR)
- **File Storage:** Supabase Storage (Hard-capped file buckets with strict MIME-type validation)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Hosting & Deployment:** [Vercel](https://vercel.com/) (Free Tier)

---

## 🔒 Security & Cost-Control Architecture

IPECapture is engineered from day one to operate strictly within **100% free-tier cloud limits**, completely eliminating unexpected billing risks:

1. **Row Level Security (RLS):** Every PostgreSQL table enforces strict RLS policies. Anonymous users can only query resources with `status = 'approved'`.
2. **Tamper-Proof Roles:** User roles (`student`, `moderator`, `admin`) are secured on the database level. Students cannot escalate their own privileges.
3. **Storage Safeguards:**
   - Client and server-side validation strictly limits file uploads to `.pdf` and image types.
   - Max file size is capped at **10 MB** per document.
   - Hard storage quotas prevent automatic charges—uploads stop safely if cloud storage approaches limits.
4. **Environment Safety:** Secret service keys are strictly kept on the server environment and never exposed to client-side bundles.

---

## 📁 Repository Structure

```text
ipecapture/
├── public/                 # Static assets, college logos, and icons
├── src/
│   ├── app/                # Next.js App Router (pages & server actions)
│   │   ├── (auth)/         # Login, Register, Password Reset routes
│   │   ├── (dashboard)/    # Student upload & submission tracking
│   │   ├── admin/          # Moderation queue and notice manager
│   │   ├── resources/      # Resource library and PDF viewer
│   │   ├── notices/        # College circulars and event board
│   │   ├── projects/       # Student project showcase
│   │   ├── layout.tsx      # Root layout with ThemeProvider
│   │   └── page.tsx        # Landing / Home page
│   ├── components/         # Reusable UI components (Navbar, Cards, FilterSidebar)
│   ├── lib/                # Supabase client helpers (SSR & client)
│   └── types/              # Database schema & TypeScript definitions
├── .env.local.example      # Sample environment variables
├── tailwind.config.ts      # Tailwind configuration (monochrome palette)
└── README.md