# 📓 IPECapture Design Reference (Compact & Sleek)

> Personal reference guide for colors, compact typography, and UI rules.
> **Rule:** No over-large fonts. Information density is prioritized (Small to Medium scale).

---

## 1. Compact Typography Scale (Strictly Small & Medium)

| Element | Max Size | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Main Page Title** | ~24px – 28px | `text-2xl sm:text-3xl font-bold tracking-tight` | "IPEC Academic Archive", "Resource Library" (Max limit) |
| **Section Title** | ~18px – 20px | `text-lg sm:text-xl font-semibold tracking-tight` | "Previous Year Papers", "Filter Documents" |
| **Document / Card Title** | ~15px | `text-[15px] sm:text-base font-semibold leading-snug` | "Data Structures End-Sem 2024" |
| **Buttons (All)** | 13px – 14px | `text-xs sm:text-sm font-semibold tracking-wide` | "Upload PDF", "Download", "Login" |
| **Inputs / Dropdowns** | 13px – 14px | `text-xs sm:text-sm font-normal` | Search bar, email, password inputs |
| **Form Labels** | 13px | `text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300` | "Subject Code", "Semester" |
| **Body / Notices** | 13px – 14px | `text-xs sm:text-sm font-normal leading-relaxed text-zinc-600 dark:text-zinc-400` | Notice descriptions, long text |
| **Timestamps & Meta** | 11px – 12px | `text-xs font-normal text-zinc-500 dark:text-zinc-400` | "CSE • 3rd Sem • 2 days ago" |
| **Subject Codes (Mono)** | 11px – 12px | `font-mono text-xs font-bold tracking-wider` | `KCS-301`, `BAS-102` |
| **Badges / Status Pills**| 10px – 11px | `text-[11px] font-semibold uppercase tracking-wider` | `VERIFIED`, `PENDING`, `PYQ` |

---

## 2. Monochrome Dual-Theme Color Reference

| Purpose | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| **Page Background** | `bg-white` (`#FFFFFF`) | `dark:bg-zinc-950` (`#09090B`) |
| **Cards & Boxes** | `bg-zinc-50` (`#FAFAFA`) | `dark:bg-zinc-900` (`#18181B`) |
| **Borders** | `border-zinc-200` (`#E4E4E7`) | `dark:border-zinc-800` (`#27272A`) |
| **Main Text** | `text-zinc-950` (`#09090B`) | `dark:text-zinc-50` (`#FAFAFA`) |
| **Muted Text** | `text-zinc-500` (`#71717A`) | `dark:text-zinc-400` (`#A1A1AA`) |
| **Primary Button** | `bg-black text-white hover:bg-zinc-800` | `dark:bg-white dark:text-black dark:hover:bg-zinc-200` |

---

## 3. Status Badges Reference
* **Verified / Approved:** `bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800`
* **Pending Review:** `bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800`
* **Rejected / Error:** `bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800`
* **Urgent Notice:** `bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800`