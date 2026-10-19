import React from "react";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-zinc-50 p-4 sm:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Top Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Personal Reference • Compact Scale
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-zinc-950 dark:text-zinc-100">
            IPECapture Style & Typography Guide
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Clean, left-aligned, small-to-medium typography for academic resource management.
          </p>
        </div>

        {/* 1. Dual-Theme Color System */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            1. Dual-Theme Color Palette
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="h-6 w-full bg-zinc-950 dark:bg-zinc-50 rounded mb-2"></div>
              <p className="text-xs font-semibold">Primary Solid</p>
              <p className="text-[11px] text-zinc-500 font-mono">#09090B / #FFFFFF</p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-emerald-50 dark:bg-emerald-950/30">
              <div className="h-6 w-full bg-emerald-600 rounded mb-2"></div>
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Verified</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">Emerald</p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-amber-50 dark:bg-amber-950/30">
              <div className="h-6 w-full bg-amber-500 rounded mb-2"></div>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Pending</p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">Amber</p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-rose-50 dark:bg-rose-950/30">
              <div className="h-6 w-full bg-rose-600 rounded mb-2"></div>
              <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">Rejected</p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-mono">Rose</p>
            </div>
          </div>
        </section>

        {/* 2. Compact Typography Scale (Clean 2-Column Grid) */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            2. Typography Hierarchy (Left-Aligned & Compact)
          </h2>
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            
            {/* Page Title */}
            <div className="p-3.5 grid grid-cols-1 md:grid-cols-4 gap-2 items-baseline">
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">Page Title (24px)</span>
              <div className="md:col-span-3">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
                  IPEC Academic Portal
                </h1>
              </div>
            </div>

            {/* Section Header */}
            <div className="p-3.5 grid grid-cols-1 md:grid-cols-4 gap-2 items-baseline">
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">Section Header (18px)</span>
              <div className="md:col-span-3">
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-200">
                  Previous Year Question Papers
                </h2>
              </div>
            </div>

            {/* Card Title */}
            <div className="p-3.5 grid grid-cols-1 md:grid-cols-4 gap-2 items-baseline">
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">Card Title (15px)</span>
              <div className="md:col-span-3">
                <h3 className="text-[15px] font-medium leading-snug text-zinc-900 dark:text-zinc-100">
                  Data Structures & Algorithms (2024 End-Sem)
                </h3>
              </div>
            </div>

            {/* Body / Notice */}
            <div className="p-3.5 grid grid-cols-1 md:grid-cols-4 gap-2 items-baseline">
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">Body / Notice (13px)</span>
              <div className="md:col-span-3">
                <p className="text-xs sm:text-sm font-normal text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  AKTU odd-semester examinations are scheduled for next month. Check the updated syllabus.
                </p>
              </div>
            </div>

            {/* Buttons / Actions */}
            <div className="p-3.5 grid grid-cols-1 md:grid-cols-4 gap-2 items-baseline">
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">Button / Action (13px)</span>
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="text-xs font-medium px-3 py-1.5 rounded-md bg-black text-white dark:bg-white dark:text-black">
                  Upload Resource
                </span>
                <span className="text-xs font-medium px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700">
                  Filter Papers
                </span>
              </div>
            </div>

            {/* Subject Code (Mono) */}
            <div className="p-3.5 grid grid-cols-1 md:grid-cols-4 gap-2 items-baseline">
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">Subject Code (Mono)</span>
              <div className="md:col-span-3">
                <span className="font-mono text-xs font-bold tracking-wider text-zinc-800 dark:text-zinc-300">
                  KCS-301 • BAS-102
                </span>
              </div>
            </div>

            {/* Post Metadata */}
            <div className="p-3.5 grid grid-cols-1 md:grid-cols-4 gap-2 items-baseline">
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">Post Metadata (11px)</span>
              <div className="md:col-span-3">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  CSE • 3rd Semester • 2.4 MB • 2 days ago
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Compact Sample Components */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            3. Interactive Component Samples
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Compact Resource Card */}
            <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  KCS-301
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                  Verified
                </span>
              </div>
              <h3 className="text-sm font-semibold leading-snug">
                Data Structures End-Sem Paper 2024
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                CSE • 3rd Sem • 3.2 MB
              </p>
              <button className="w-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold py-2 rounded-md hover:opacity-90 transition">
                View Document
              </button>
            </div>

            {/* Compact Form Field & Buttons */}
            <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
                  Subject Code
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. KCS-301" 
                  className="w-full text-xs px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button className="bg-black text-white dark:bg-white dark:text-black text-xs font-semibold px-3 py-2 rounded-md">
                  Upload PDF
                </button>
                <button className="border border-zinc-300 dark:border-zinc-700 text-xs font-semibold px-3 py-2 rounded-md">
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}