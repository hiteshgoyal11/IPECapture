import React from "react";

export default function FeedSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-950 dark:text-zinc-100 flex justify-center animate-pulse">
      <div className="w-full max-w-7xl flex">
        
        {/* Left Rail Skeleton */}
        <div className="hidden md:block w-16 lg:w-60 border-r border-zinc-200 dark:border-zinc-800 p-4 space-y-6">
          <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          <div className="space-y-4 pt-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Center Stream Skeleton */}
        <div className="flex-1 max-w-[620px] mx-auto p-4 sm:p-6 space-y-5">
          
          {/* Stories Tray Skeleton (Top of Filters) */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5 bg-zinc-50/40 dark:bg-zinc-900/40">
            <div className="flex gap-4 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="w-14 h-14 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                  <div className="h-2.5 w-10 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Pills Skeleton */}
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-7 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
            ))}
          </div>

          {/* Quick Creator Box Skeleton */}
          <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>

          {/* Post Card Skeleton */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                <div className="h-2.5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              </div>
            </div>
            <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="hidden xl:block w-80 border-l border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
          <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
          <div className="h-56 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
          <div className="h-36 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
        </div>

      </div>
    </div>
  );
}