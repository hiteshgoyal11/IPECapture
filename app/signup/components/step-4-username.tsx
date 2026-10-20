import React, { useState, useEffect, useMemo } from "react";
import { Check, X, Loader2, Sparkles, AtSign } from "lucide-react";
import { supabase } from "../../../lib/supabase";

interface Step4Props {
  formData: {
    firstName: string;
    lastName: string;
    username: string;
  };
  updateFormData: (data: Partial<{ username: string }>) => void;
  onNext: () => void;
}

export default function Step4Username({ formData, updateFormData, onNext }: Step4Props) {
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  // 1. Generate Smart Suggestions from Step 1 First & Last Name
  const suggestions = useMemo(() => {
    const f = formData.firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const l = formData.lastName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const base = f || "student";

    const list: string[] = [];
    if (f && l) {
      list.push(`${f}${l}`);
      list.push(`${f}.${l}`);
      list.push(`${f}_${l}`);
    } else {
      list.push(`${base}_ipec`);
      list.push(`${base}.07`);
      list.push(`${base}_hub`);
    }
    return list.slice(0, 3);
  }, [formData.firstName, formData.lastName]);

  // Set initial suggestion if username is empty
  useEffect(() => {
    if (!formData.username && suggestions.length > 0) {
      updateFormData({ username: suggestions[0] });
    }
  }, [suggestions]);

  // 2. Debounced Real-Time Database Availability Check (Instagram Logic)
  useEffect(() => {
    const username = formData.username.trim().toLowerCase();

    if (!username) {
      setIsAvailable(null);
      setError("");
      return;
    }

    // Format validation
    if (username.length < 3) {
      setIsAvailable(false);
      setError("Username must be at least 3 characters.");
      return;
    }

    if (!/^[a-z0-9._]+$/.test(username)) {
      setIsAvailable(false);
      setError("Only letters, numbers, dots (.), and underscores (_) allowed.");
      return;
    }

    setError("");
    setChecking(true);
    setIsAvailable(null);

    const timer = setTimeout(async () => {
      try {
        const { data, error: dbError } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username)
          .maybeSingle();

        if (dbError) throw dbError;

        if (data) {
          setIsAvailable(false);
          setError("This username is already taken. Try another.");
        } else {
          setIsAvailable(true);
          setError("");
        }
      } catch (err) {
        // Fallback for offline or fresh table
        setIsAvailable(true);
      } finally {
        setChecking(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable) {
      setError("Please choose an available username.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
          Create a username
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Pick a handle for your campus identity and posts. You can change this later.
        </p>
      </div>

      {/* Username Input with Live Status */}
      <div>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
          Username
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) => updateFormData({ username: e.target.value.toLowerCase().trim() })}
            placeholder="e.g. hitesh_goyal"
            className="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition pr-10 font-mono"
          />

          {/* Right Status Icon */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {checking && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
            {!checking && isAvailable === true && (
              <Check className="w-4 h-4 text-emerald-500" />
            )}
            {!checking && isAvailable === false && (
              <X className="w-4 h-4 text-rose-500" />
            )}
          </div>
        </div>

        {/* Live Availability Message (Instagram Style) */}
        <div className="mt-1.5 min-h-[18px]">
          {checking && (
            <p className="text-[11px] text-zinc-400 flex items-center gap-1">
              Checking availability...
            </p>
          )}
          {!checking && isAvailable === true && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> Username is available
            </p>
          )}
          {!checking && error && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
              <X className="w-3 h-3" /> {error}
            </p>
          )}
        </div>
      </div>

      {/* Suggested Usernames Pills */}
      <div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-2 font-medium">
          <Sparkles className="w-3 h-3 text-amber-500" /> Suggested for you
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => updateFormData({ username: item })}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition ${
                formData.username === item
                  ? "bg-black text-white dark:bg-white dark:text-black border-transparent font-semibold"
                  : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600"
              }`}
            >
              @{item}
            </button>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <button
        type="submit"
        disabled={checking || !isAvailable}
        className="w-full bg-black text-white dark:bg-white dark:text-black text-sm font-semibold py-3 px-4 rounded-xl hover:opacity-90 active:scale-[0.99] transition shadow-md disabled:opacity-50 mt-2"
      >
        Next
      </button>
    </form>
  );
}