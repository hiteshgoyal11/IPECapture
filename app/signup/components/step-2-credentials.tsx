import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

interface Step2Props {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  updateFormData: (data: Partial<{ email: string; password: string; confirmPassword: string }>) => void;
  onNext: () => void;
}

export default function Step2Credentials({ formData, updateFormData, onNext }: Step2Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // 2. Password length check (Supabase minimum 6)
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // 3. Password match check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-check.");
      return;
    }

    setError("");
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
          Create login credentials
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          You will use this email and password to log in to IPECapture.
        </p>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Email Input */}
      <div>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
          Email Address
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          placeholder="e.g. hitesh@gmail.com"
          className="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
        />
      </div>

      {/* Password with Eye Toggle */}
      <div>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={(e) => updateFormData({ password: e.target.value })}
            placeholder="At least 6 characters"
            className="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password with Eye Toggle */}
      <div>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={formData.confirmPassword}
            onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
            placeholder="Re-enter password"
            className="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
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