"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, X, MapPin, Search, Sparkles, User } from "lucide-react";
import UserAvatar from "./user-avatar";
import { supabase } from "../../../lib/supabase";

export type MentionFontStyle = 
  | "classic" 
  | "modern" 
  | "signature" 
  | "editor" 
  | "poster" 
  | "bubble" 
  | "typewriter";

interface StoryMentionModalProps {
  isOpen: boolean;
  initialTab?: "mention" | "location" | "none";
  onClose: () => void;
  onSelectMention: (mentionItem: { text: string; hasBox: boolean; style: string }) => void;
  onSelectLocation: (locationText: string) => void;
}

export default function StoryMentionModal({
  isOpen,
  initialTab = "mention",
  onClose,
  onSelectMention,
  onSelectLocation,
}: StoryMentionModalProps) {
  const [activeTab, setActiveTab] = useState<"mention" | "location" | "none">("mention");
  const [usernameQuery, setUsernameQuery] = useState("");
  const [userSuggestions, setUserSuggestions] = useState<any[]>([]);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [hasBox, setHasBox] = useState<boolean>(true);
  const [selectedStyle, setSelectedStyle] = useState<MentionFontStyle>("classic");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const editableRef = useRef<HTMLSpanElement | null>(null);

  // Initialize or reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setUsernameQuery("");
      setLocationSearchQuery("");
      if (editableRef.current) {
        editableRef.current.innerText = "@";
        editableRef.current.dataset.ready = "true";
      }
    }
  }, [isOpen, initialTab]);

  // Focus and position cursor immediately after '@' on mount
  useEffect(() => {
    if (isOpen && activeTab === "mention" && editableRef.current) {
      const el = editableRef.current;
      el.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isOpen, activeTab]);

  // IPEC Campus Verified Locations
  const IPEC_LOCATIONS = [
    "📍 Nescafe Corner",
    "📍 Central Lawn",
    "📍 Maggi Point",
    "📍 Block A Lab 3",
    "📍 Library Reading Hall",
    "📍 Main Auditorium",
    "📍 Workshop Ground",
    "📍 Canteen Plaza",
    "📍 Administrative Block",
    "📍 Mechanical Block Lawn",
    "📍 Computer Center Lab 1",
    "📍 Sports Complex Court",
  ];

  // Filtered campus locations
  const filteredLocations = IPEC_LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  // Live Supabase User Search with Debounce
  useEffect(() => {
    if (activeTab !== "mention") return;

    let isSubscribed = true;
    const cleanQuery = usernameQuery.trim();

    async function searchUsers() {
      // Agar user ne @ ke aage kuch type nahi kiya to suggestions khali rahenge
      if (!cleanQuery) {
        setUserSuggestions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .ilike("username", `${cleanQuery}%`)
          .limit(8);

        if (!error && data && isSubscribed) {
          setUserSuggestions(data);
        }
      } catch (err) {
        console.error("Profile search error:", err);
      } finally {
        if (isSubscribed) setIsSearching(false);
      }
    }

    const timer = setTimeout(searchUsers, 120);
    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [usernameQuery, activeTab]);

  if (!isOpen) return null;

  // Choose profile directly from avatar carousel
  const handlePickUser = (user: any) => {
    onSelectMention({
      text: `@${user.username}`,
      hasBox: hasBox,
      style: selectedStyle,
    });
    handleResetAndClose();
  };

  // Submit manual custom username
  const handleDoneManualMention = () => handleResetAndClose();

  const handlePickLocation = (loc: string) => {
    onSelectLocation(loc);
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setActiveTab("none");
    setUsernameQuery("");
    setUserSuggestions([]);
    setLocationSearchQuery("");
    onClose();
  };

  // Font typography engine styling
  const getFontStyleClass = (style: MentionFontStyle) => {
    switch (style) {
      case "modern":
        return "[font-family:'Oswald',sans-serif] uppercase tracking-normal font-semibold";
      case "signature":
        return "[font-family:'Caveat',cursive] tracking-wide font-bold text-3xl sm:text-4xl";
      case "editor":
        return "[font-family:'Courier_Prime',monospace] font-bold tracking-tight";
      case "poster":
        return "[font-family:Georgia,serif] font-black italic uppercase tracking-tighter";
      case "bubble":
        return "[font-family:'Comfortaa',cursive,sans-serif] font-bold tracking-tight lowercase first-letter:uppercase";
      case "typewriter":
        return "[font-family:'Courier_Prime',monospace] font-normal tracking-widest";
      case "classic":
      default:
        return "font-sans font-black tracking-tight";
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/85 dark:bg-black/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-5 select-none animate-in fade-in duration-150 transition-colors">
      
      {/* ========================================================= */}
      {/* TOP HEADER: Cancel, Title, and Done Action               */}
      {/* ========================================================= */}
      <header className="flex items-center justify-between pt-2 px-1 z-30">
        <button
          type="button"
          onClick={handleResetAndClose}
          className="text-xs sm:text-sm font-semibold text-white/80 hover:text-white transition active:scale-95 cursor-pointer py-1 px-2.5 rounded-full hover:bg-white/10"
        >
          Cancel
        </button>

        {/* Dynamic Title / Tab Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span className="text-[11px] font-mono font-bold text-zinc-200 uppercase tracking-widest">
            {activeTab === "mention" ? "Mention" : "Location"}
          </span>
        </div>
        <div className="w-12" />
      </header>

      {/* ========================================================= */}
      {/* CENTER WORKSPACE: Single Clean Stepped Mention Tag        */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md mx-auto px-4 text-center my-auto">
        {activeTab === "mention" ? (
          <div className="w-full text-center flex flex-col items-center justify-center">
            
            {/* 
              🔥 INSTAGRAM STEPPED CONNECTED PILL:
              - `inline` + `box-decoration-break: clone` tightly wraps small text (e.g. @34)
              - Automatically wraps across lines without right-side overflow or cutting
              - Single element, zero duplicate outer box, zero outside hanging @
            */}
            <span
              ref={(el) => {
                editableRef.current = el;
                if (el && !el.dataset.ready) {
                  el.innerText = usernameQuery ? `@${usernameQuery}` : "@";
                  el.dataset.ready = "true";
                }
              }}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              autoFocus
              onInput={(e) => {
                let text = e.currentTarget.innerText;
                // Enforce lock: first character must always remain '@'
                if (!text.startsWith("@")) {
                  text = "@" + text.replace(/@/g, "");
                  e.currentTarget.innerText = text;
                }
                const clean = text.replace(/^@+/, "").trim();
                setUsernameQuery(clean);
              }}
              onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
              style={{
                lineHeight: 1.35,
                padding: "8px 16px",
                borderRadius: "16px",
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
                backgroundColor: hasBox ? "#09090b" : "transparent",
              }}
              className={`inline text-center text-2xl sm:text-3xl font-bold break-words whitespace-pre-wrap [box-decoration-break:clone] [-webkit-box-decoration-break:clone] outline-none border-none ring-0 max-w-[88%] sm:max-w-[82%] transition-all ${
                hasBox
                  ? "text-white shadow-2xl border border-white/15"
                  : "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] no-underline"
              } ${getFontStyleClass(selectedStyle)}`}
            />

            {/* Micro Hint for user */}
            <p className="text-[11px] font-mono text-zinc-400 mt-3 drop-shadow-sm">
              Type username or select campus profile below
            </p>
          </div>
        ) : (
          /* ========================================================= */
          /* LOCATION SELECTION WORKSPACE                              */
          /* ========================================================= */
          <div className="w-full space-y-3 max-w-sm">
            {/* Search Input for Locations */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={locationSearchQuery}
                onChange={(e) => setLocationSearchQuery(e.target.value)}
                placeholder="Search campus spot..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-sky-500/60 transition"
              />
            </div>

            {/* Location List View */}
            <div className="w-full space-y-1.5 max-h-72 overflow-y-auto scrollbar-thin pr-1">
              {filteredLocations.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500 font-mono">
                  No campus spots matched your search.
                </div>
              ) : (
                filteredLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handlePickLocation(loc)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 text-left text-xs text-white font-medium flex items-center justify-between transition active:scale-98 border border-white/5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 opacity-80 group-hover:opacity-100 shrink-0" />
                      <span className="truncate">{loc.replace("📍 ", "")}</span>
                    </div>
                    <Check className="w-3.5 h-3.5 text-sky-400 opacity-60 group-hover:opacity-100 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* BOTTOM SECTION: Profiles Carousel + Typography Controls  */}
      {/* ========================================================= */}
      <footer className="w-full space-y-3 pb-2 z-30">
        
        {/* ========================================================================= */}
        {/* 🐶 INSTAGRAM USER PROFILE AVATAR ROW (Responsive & Adaptive Search View)   */}
        {/* ========================================================================= */}
        {activeTab === "mention" && (
          <div className="w-full max-w-lg mx-auto px-2 sm:px-4 select-none">
            {/* 1. Flash Skeleton / Loading State jab user type kar raha ho */}
            {isSearching && userSuggestions.length === 0 && usernameQuery.trim() !== "" ? (
              <div className="flex items-center justify-center gap-3 sm:gap-4.5 py-2.5 px-3 overflow-x-auto scrollbar-none animate-in fade-in duration-150">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 animate-pulse">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full bg-zinc-800/80 border border-white/10" />
                    <div className="w-12 sm:w-14 h-2.5 bg-zinc-800/70 rounded-full" />
                  </div>
                ))}
              </div>
            ) : userSuggestions.length > 0 ? (
              /* 2. Live Matching Campus Profiles Carousel */
              <div 
                role="listbox"
                aria-label="Campus Mention Suggestions"
                className="flex items-center justify-start sm:justify-center gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-none py-2 px-2.5 touch-pan-x animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                {userSuggestions.map((user, idx) => (
                  <button
                    key={user.id || `user-sugg-${idx}`}
                    type="button"
                    onClick={() => handlePickUser(user)}
                    aria-label={`Mention @${user.username}`}
                    className="group relative flex flex-col items-center gap-1.5 cursor-pointer shrink-0 transition-all duration-150 active:scale-90 sm:hover:scale-105 focus:outline-none"
                  >
                    {/* Dual-Tone Outer Gradient Ring */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full p-[2px] bg-gradient-to-tr from-[#0F2952] via-[#0284C7] to-[#38BDF8] shadow-md group-hover:shadow-[#0284C7]/40 transition-shadow">
                      <div className="w-full h-full rounded-full bg-zinc-950 p-[1.5px] overflow-hidden flex items-center justify-center">
                        <UserAvatar 
                          avatarUrl={user.avatar_url} 
                          name={user.full_name || user.username} 
                          size="md" 
                        />
                      </div>
                    </div>

                    {/* Username text with tight font-mono clamp */}
                    <span className="text-[10px] sm:text-[11px] md:text-xs font-mono font-medium text-zinc-200 group-hover:text-white truncate max-w-[64px] sm:max-w-[74px] md:max-w-[82px] text-center tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                      @{user.username}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🛠️ BOTTOM PILL BAR: [A] Box Toggle + 7 Instagram Fonts (Adaptive Screen)    */}
        {/* ========================================================================= */}
        {activeTab === "mention" && (
          <div className="w-fit max-w-[94%] sm:max-w-md md:max-w-lg mx-auto px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#262626]/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/15 dark:border-white/10 shadow-2xl flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto scrollbar-none transition-all">
            
            {/* [A] Background Box Toggle Button */}
            <button
              type="button"
              title="Toggle Background Box"
              onClick={() => setHasBox(!hasBox)}
              className={`w-7 h-7 shrink-0 ml-0.5 rounded-[7px] flex items-center justify-center transition-all duration-150 active:scale-90 select-none box-border cursor-pointer ${
                hasBox
                  ? "bg-white text-zinc-950 font-bold shadow-md"
                  : "border-[2px] border-white text-white bg-transparent"
              }`}
            >
              <span className="font-sans font-bold text-xs sm:text-[13px] leading-none">A</span>
            </button>

            <div className="h-4 w-[1px] bg-white/20 shrink-0" />

            {/* Font Style Selectors */}
            {(["classic", "modern", "signature", "editor", "poster", "bubble", "typewriter"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedStyle(m)}
                className={`text-[11px] font-bold px-3 py-1 rounded-full capitalize shrink-0 transition-all cursor-pointer ${
                  selectedStyle === m
                    ? "bg-white text-zinc-950 shadow-sm scale-100"
                    : "text-zinc-300 hover:text-white active:scale-95"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

      </footer>
    </div>
  );
}