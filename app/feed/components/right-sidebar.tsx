import React from "react";
import { Pin, ArrowUpRight, CheckCircle2, Users } from "lucide-react";
import UserAvatar from "./user-avatar";

interface Notice {
  id: string;
  title: string;
  category: string;
  published_date: string;
}

interface RightSidebarProps {
  notices: Notice[];
  currentUser?: any;
  userHasActiveStory?: boolean; // ✅ Add this
}

export default function RightSidebar({ notices, currentUser, userHasActiveStory = false }: RightSidebarProps) {
  const suggestedClassmates = [
    { name: "Ananya Sharma", role: "BCA • 3rd Sem", handle: "@ananya.ipec" },
    { name: "IPEC Coders Club", role: "Technical Society", handle: "@ipec_coders" },
    { name: "Itz.IPEC.Confession", role: "Campus Community", handle: "@itz.ipec.confession" },
  ];

  return (
    <aside className="hidden xl:block w-80 sticky top-0 h-screen p-5 space-y-6 overflow-y-auto select-none">
      
      {/* Dynamic Student Identity Card */}
      <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={userHasActiveStory ? "p-[2.5px] rounded-full bg-gradient-to-tr from-[#0F2952] via-[#0284C7] to-[#38BDF8]" : "p-[1px] rounded-full border border-zinc-200 dark:border-zinc-800"}>
            <UserAvatar avatarUrl={currentUser?.avatar_url} name={currentUser?.full_name} size="lg" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-950 dark:text-zinc-100">
              {currentUser?.full_name || "Student"}
            </p>
            <p className="text-[11px] text-zinc-500 font-mono">
              @{currentUser?.username || "ipec_student"} • {currentUser?.course || "BCA"}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-[#0284C7] dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          {currentUser?.branch ? currentUser.branch.split(" - ")[1] || "Active" : "Active"}
        </span>
      </div>

      {/* Official College Noticeboard */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-mono">
            <Pin className="w-3.5 h-3.5 text-rose-500 rotate-45" />
            Official Notices
          </h3>
          <span className="text-[10px] font-mono text-zinc-400">Live AKTU</span>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
          {notices.map((notice) => (
            <div key={notice.id} className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition cursor-pointer group">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${
                  notice.category === "Urgent"
                    ? "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400"
                    : notice.category === "Sessional"
                    ? "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
                    : "bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400"
                }`}>
                  {notice.category}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">{notice.published_date}</span>
              </div>
              <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-snug group-hover:text-black dark:group-hover:text-white transition">
                {notice.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Campus Classmates / Creators */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-mono">
          <Users className="w-3.5 h-3.5 text-[#0284C7]" />
          Suggested For You
        </h3>

        <div className="space-y-2.5">
          {suggestedClassmates.map((student) => (
            <div key={student.handle} className="flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{student.name}</p>
                <p className="text-[11px] text-zinc-500">{student.role}</p>
              </div>
              <button
                type="button"
                className="text-xs font-semibold px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 text-[10px] text-zinc-400 dark:text-zinc-600 space-y-1 font-mono">
        <p>About • Guidelines • AKTU Portal • API</p>
        <p>© 2026 IPECapture • Built for IPEC Students</p>
      </div>

    </aside>
  );
}