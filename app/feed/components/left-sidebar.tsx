"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Search,
  Bell,
  PlusSquare,
  MessageSquare,
  User,
  Menu,
  GraduationCap
} from "lucide-react";

interface LeftSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  unreadCount?: number;
}

export default function LeftSidebar({ currentTab, onTabChange, unreadCount = 2 }: LeftSidebarProps) {
  const navItems = [
    { id: "feed", label: "Home", icon: Home },
    { id: "library", label: "PYQs & Notes", icon: BookOpen },
    { id: "search", label: "Search", icon: Search },
    { id: "notices", label: "Notices", icon: Bell, badge: unreadCount },
    { id: "create", label: "Create / Upload", icon: PlusSquare },
    { id: "qa", label: "Campus Q&A", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between fixed top-0 left-0 h-screen z-40 bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out w-16 hover:w-60 group px-3 py-5 select-none shadow-sm">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <Link href="/feed" className="flex items-center gap-3 px-2 text-zinc-950 dark:text-zinc-50 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-[#0F2952] text-white flex items-center justify-center shrink-0 shadow-md">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-[#0F2952] dark:text-zinc-100">IPEC</span>
            <span className="text-[#0284C7]">apture</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3.5 px-2.5 py-3 rounded-xl transition-all duration-150 relative overflow-hidden ${
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-black dark:hover:text-white"
                }`}
              >
                <div className="relative shrink-0">
                  <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs sm:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu Button */}
      <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={() => onTabChange("more")}
          className="w-full flex items-center gap-3.5 px-2.5 py-3 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white transition overflow-hidden"
        >
          <Menu className="w-5 h-5 shrink-0 stroke-[1.75]" />
          <span className="text-xs sm:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            More Options
          </span>
        </button>
      </div>
    </aside>
  );
}