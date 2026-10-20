"use client";

import React from "react";
import { Home, BookOpen, PlusSquare, Bell, User } from "lucide-react";

interface MobileNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  unreadCount?: number;
}

export default function MobileNav({ currentTab, onTabChange, unreadCount = 2 }: MobileNavProps) {
  const tabs = [
    { id: "feed", icon: Home },
    { id: "library", icon: BookOpen },
    { id: "create", icon: PlusSquare },
    { id: "notices", icon: Bell, badge: unreadCount },
    { id: "profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 z-50 flex items-center justify-around px-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`p-2.5 rounded-xl relative transition ${
              isActive ? "text-black dark:text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            {tab.badge && tab.badge > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center font-mono">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}