import React, { useState } from "react";
import { Calendar, User } from "lucide-react";

interface Step1Props {
  formData: {
    firstName: string;
    lastName: string;
    dob: string;
  };
  updateFormData: (data: Partial<{ firstName: string; lastName: string; dob: string }>) => void;
  onNext: () => void;
}

export default function Step1NameDob({ formData, updateFormData, onNext }: Step1Props) {
  const [error, setError] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }
    if (!formData.dob) {
      setError("Please select your date of birth.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
          What&apos;s your name?
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Enter your name and birthday as shown on your college ID.
        </p>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* First & Last Name */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
            First Name
          </label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
            placeholder="e.g. Hitesh"
            className="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            placeholder="e.g. Goyal"
            className="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
          />
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
          Date of Birth
        </label>
        <div className="relative">
          <input
            type="date"
            required
            value={formData.dob}
            onChange={(e) => updateFormData({ dob: e.target.value })}
            className="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
          />
        </div>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
          This won&apos;t be shown publicly on your profile.
        </p>
      </div>

      {/* Next Button */}
      <button
        type="submit"
        className="w-full bg-black text-white dark:bg-white dark:text-black text-sm font-semibold py-3 px-4 rounded-xl hover:opacity-90 active:scale-[0.99] transition shadow-md mt-2"
      >
        Next
      </button>
    </form>
  );
}