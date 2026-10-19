"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Eye, 
  EyeOff, 
  WifiOff, 
  Search,
  AlertCircle,
  CheckCircle2,
  Camera, 
  MapPin, 
  Music2, 
  Heart, 
  Flame, 
  Smile, 
  Volume2, 
  MessageCircle, 
  Send, 
  Bookmark 
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setMounted(true);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Login Handler (Connected to Supabase Auth)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        setSuccessMessage("Logged in successfully! Redirecting...");
        window.location.href = "/resources";
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };


  if (!mounted) {
    return <LandingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-zinc-50 flex flex-col justify-between selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-black transition-colors">
      
      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="bg-amber-500 text-black text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are currently offline. Running in offline preview mode.</span>
        </div>
      )}

      {/* Main Grid Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ========================================================= */}
          {/* LEFT SIDE: Tilted Floating Cards (Multi-Branch & Balanced)*/}
          {/* ========================================================= */}
          <div className="space-y-6 hidden lg:block lg:col-span-7 pr-2">
            
            {/* Tag & Heading */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                IPEC Student Community Hub
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
                See everyday moments from your <br />
                <span className="text-zinc-400 dark:text-zinc-500">college friends.</span>
              </h1>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-md leading-relaxed">
                Catch every campus vibe, funny memes, canteen hangs, and everyday student stories happening right now at IPEC.
              </p>
            </div>

            {/* Overlapping Tilted Cards Showcase */}
            <div className="relative h-[380px] w-full max-w-md pt-2">
              <div className="absolute top-0 left-0 w-[300px] sm:w-[320px] p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/95 dark:bg-zinc-900/95 shadow-xl backdrop-blur-sm z-10 transform -rotate-3 hover:rotate-0 hover:z-30 transition-all duration-300">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px]">
                      <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-full flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                          @aditi.ipec
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </div>
                      <p className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" /> Nescafe Corner, IPEC
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Just now</span>
                </div>

                <div className="relative h-32 w-full rounded-xl bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-900 border border-zinc-200/60 dark:border-zinc-700/60 p-3 flex flex-col justify-between overflow-hidden">
                  <div className="self-start inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 dark:bg-white/15 backdrop-blur-md text-[10px] text-white">
                    <Music2 className="w-3 h-3 text-white" />
                    <span className="font-mono truncate max-w-[140px]">Campus Vibe • Acoustic</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                      &ldquo;Free lecture, rain outside, and cold coffee at Maggi point.&rdquo;
                    </p>
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-white/80 dark:bg-black/60 text-[10px] font-medium">#IPECDiaries</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/80 dark:bg-black/60 text-[10px] font-medium">#CampusLife</span>
                    </div>
                  </div>

                  <div className="self-end inline-flex items-center gap-2.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-zinc-950/90 shadow-md text-[11px] font-semibold border border-zinc-200 dark:border-zinc-800">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Flame className="w-3 h-3 fill-amber-500" /> 184
                    </span>
                    <span className="flex items-center gap-1 text-rose-500">
                      <Heart className="w-3 h-3 fill-rose-500" /> 412
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span className="text-[11px] italic">Send a reply...</span>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Heart className="w-3.5 h-3.5 hover:text-rose-500 cursor-pointer transition" />
                    <Flame className="w-3.5 h-3.5 hover:text-amber-500 cursor-pointer transition" />
                    <Smile className="w-3.5 h-3.5 hover:text-zinc-200 cursor-pointer transition" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-1 right-0 w-[300px] sm:w-[320px] p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl z-20 transform rotate-3 hover:rotate-0 hover:z-30 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-[10px]">
                      IP
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                          @ipec_backbenchers
                        </span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-zinc-500">
                          viral
                        </span>
                      </div>
                      <p className="text-[9px] text-zinc-400">Campus Confessions</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400">2h ago</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 space-y-2">
                  <div className="space-y-1 text-xs">
                    <p className="text-zinc-800 dark:text-zinc-200 leading-snug">
                      <span className="font-bold text-zinc-950 dark:text-zinc-50">Faculty:</span> &ldquo;Attendance proxy lagte hi pakda gaya to internal zero.&rdquo;
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-snug">
                      <span className="font-bold text-zinc-950 dark:text-zinc-50">Backbenchers</span> with 4 fake roll numbers ready: (absolute silence)
                    </p>
                  </div>
                  
                  <div className="pt-1.5 border-t border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-zinc-400" /> Original Audio • IPEC Canteen
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">9.8k vibes</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-1.5 flex items-center justify-between text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-3.5 text-xs">
                    <span className="flex items-center gap-1 font-semibold text-rose-500">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> 1,420
                    </span>
                    <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                      <MessageCircle className="w-3.5 h-3.5" /> 89
                    </span>
                    <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                      <Send className="w-3.5 h-3.5" /> 312
                    </span>
                  </div>
                  <Bookmark className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer transition" />
                </div>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="flex items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 pt-1 font-mono">
              <span>✓ Campus Buzz</span>
              <span>✓ Relatable Memes</span>
              <span>✓ Zero Boring Ads</span>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: The Auth Box (Bigger Buttons & Real DB Auth)  */}
          {/* ========================================================= */}
          <div className="w-full max-w-sm mx-auto space-y-4 lg:col-span-5">
            
            {/* Main Auth Container */}
            <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-2xl p-6 sm:p-7 shadow-sm">
              
              {/* Header inside Card */}
              <div className="text-center mb-5">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
                  IPECapture
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Log in to see photos, memes, and campus stories
                </p>
              </div>

              {/* Error & Success Feedback Alerts */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form Switching: Login vs Sign Up */}
              <form onSubmit={handleLogin} className="space-y-3.5">

                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address (Gmail / Personal)"
                    className="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
                  />
                </div>

                {/* Password Input with Eye Toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* BIGGER ACTION BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white dark:bg-white dark:text-black text-sm font-semibold py-3 px-4 rounded-xl hover:opacity-90 active:scale-[0.99] transition shadow-md disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Log in"}
                </button>

                {/* Forgot Password (Login mode only) */}
                <div className="text-center pt-0.5">
                  <a
                    href="#forgot"
                    className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200 transition"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500">
                    OR
                  </span>
                  <div className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
                </div>

                {/* BIGGER BROWSE AS GUEST BUTTON */}
                <Link
                  href="/resources"
                  className="w-full flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700 text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition"
                >
                  <Search className="w-4 h-4 text-zinc-500" />
                  <span>Browse as Guest (Quick Search)</span>
                </Link>

              </form>
            </div>

            {/* Bottom Sign-Up Card */}
            <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-2xl p-4 text-center">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-black dark:text-white hover:underline ml-1"
                >
                  Sign up
                </Link>
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 py-3.5 px-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px]">
            <span className="hover:underline cursor-pointer">About IPECapture</span>
            <span className="hover:underline cursor-pointer">Community Rules</span>
            <span className="hover:underline cursor-pointer">AKTU Syllabus</span>
            <span className="hover:underline cursor-pointer">GitHub Repo</span>
          </div>
          <p className="text-[11px] font-mono">
            © 2026 IPECapture • Built for IPEC Students
          </p>
        </div>
      </footer>

    </div>
  );
}

// Flash Skeleton Component
function LandingSkeleton() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-zinc-50 flex flex-col justify-between p-4 sm:p-8 md:p-12 animate-pulse">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          <div className="space-y-4 hidden lg:block lg:col-span-7">
            <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-9 w-80 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-9 w-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-4 w-96 bg-zinc-200 dark:bg-zinc-800 rounded mt-3"></div>
            
            <div className="pt-4 space-y-3">
              <div className="h-32 w-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
              <div className="h-32 w-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl ml-8"></div>
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto space-y-4 lg:col-span-5">
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-7 space-y-4">
              <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto"></div>
              <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto mb-3"></div>
              <div className="h-11 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
              <div className="h-11 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
              <div className="h-11 w-full bg-zinc-300 dark:bg-zinc-700 rounded-xl"></div>
            </div>
            <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
          </div>

        </div>
      </main>
    </div>
  );
}