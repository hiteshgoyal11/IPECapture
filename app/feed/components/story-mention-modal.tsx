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
  const [boxType, setBoxType] = useState<"none" | "white" | "black">("black");
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
  // 🏛️ Official IPEC Campus Verified Locations & Facilities
  const IPEC_LOCATIONS = [
    // Academic Buildings & Core
    { name: "Block-A Academic Building", sub: "Core Classrooms, Labs & Faculty Offices" },
    { name: "Block-B Academic Building", sub: "Tutorial Rooms & Departmental Labs" },
    { name: "Block-C Academic Block", sub: "Specialized Labs & Classrooms" },
    { name: "Central Library", sub: "Digital E-Journals & Reading Zones" },
    { name: "Main Auditorium & Conference Hall", sub: "Cultural Complex & Placement Seminars" },
    { name: "Training & Placement Cell", sub: "Corporate Drives & Training Hub" },
    { name: "Main Reception & Admin Block", sub: "Central Hub & Visitor Services" },

    // Hostels & Accommodation
    { name: "Boys Hostel Complex", sub: "Buildings 1, 2, 3 Residential Quarters" },
    { name: "Girls Hostel Complex", sub: "Secure Residential Blocks" },
    { name: "Campus Guest & Waiting Rooms", sub: "Visiting Parents & Guest Quarters" },

    // Sports & Recreation
    { name: "Indoor Games Arena", sub: "Billiards, Table Tennis & Badminton Courts" },
    { name: "Basketball & Sports Ground", sub: "Outdoor Sports Arena" },
    { name: "Campus Gymnasium", sub: "Well-equipped Fitness Center" },

    // Daily Convenience & Hangouts
    { name: "Central Dining & Hostel Mess", sub: "In-House Student Mess Facilities" },
    { name: "Campus Convenience Store", sub: "Daily Essentials & Stationery" },
    { name: "Nescafe Corner", sub: "Central Campus Plaza" },
    { name: "Maggi Point", sub: "Student Activity Center" },
  ];

  const filteredLocations = IPEC_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
    loc.sub.toLowerCase().includes(locationSearchQuery.toLowerCase())
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
      hasBox: boxType !== "none",
      style: selectedStyle,
    });
    handleResetAndClose();
  };

  // Submit manual custom username
  const handleDoneManualMention = () => handleResetAndClose();

  // ✅ Location ko onSelectMention se bhejenge taaki storyTexts mein add ho
  // ✅ Location ko as a White Location Tag bheje ga
  const handlePickLocation = (loc: any) => {
    const locName = typeof loc === "string" ? loc : loc.name;
    const cleanName = locName.replace(/📍/g, "").trim();

    onSelectMention({
      text: cleanName,
      hasBox: false,
      style: "location",
      color: "#ffffff",
    } as any);

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
                backgroundColor: boxType === "none" ? "transparent" : boxType === "white" ? "#ffffff" : "#09090b",
                  color: boxType === "white" ? "#000000" : "#ffffff",
              }}
              className={`inline text-center text-2xl sm:text-3xl font-bold break-words whitespace-pre-wrap [box-decoration-break:clone] [-webkit-box-decoration-break:clone] outline-none border-none ring-0 max-w-[88%] sm:max-w-[82%] transition-all ${
                boxType !== "none"
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
          /* LOCATION SELECTION: Pure Black & White Minimal Instagram UI */
          /* ========================================================= */
          <div className="w-full space-y-3.5 max-w-sm sm:max-w-md mx-auto px-1 animate-in fade-in duration-200">
            
            {/* 1. Minimal Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 stroke-[2]" />
              <input
                type="text"
                autoFocus
                value={locationSearchQuery}
                onChange={(e) => setLocationSearchQuery(e.target.value)}
                placeholder="Search location..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-zinc-900 border border-white/10 text-white text-xs sm:text-[13px] placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition shadow-inner"
              />
              {locationSearchQuery && (
                <button
                  type="button"
                  onClick={() => setLocationSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 2. Location List View (Ugly scrollbar 100% hidden) */}
            <div className="w-full space-y-1.5 max-h-80 overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
              {filteredLocations.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 font-mono">
                  No campus location found.
                </div>
              ) : (
                filteredLocations.map((loc) => (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => handlePickLocation(loc.name)}
                    className="w-full p-3 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900 active:scale-[0.99] text-left flex items-center justify-between transition-all border border-white/5 hover:border-white/10 cursor-pointer group select-none"
                  >
                    {/* Left: Clean Location Pin + Name + Subtitle */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                        {/*Photo wala exact Solid Pin with Center Circle (Pure White Vector Icon) */}
                        <svg className="w-4 h-4 text-white group-hover:text-black fill-current" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </div>
                      <div className="truncate">
                        <p className="text-xs sm:text-[13px] font-semibold text-white tracking-tight leading-tight truncate">
                          {loc.name}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-zinc-400 font-normal leading-tight truncate mt-0.5">
                          {loc.sub}
                        </p>
                      </div>
                    </div>

                    {/* Right: Minimal Check Indicator */}
                    <Check className="w-4 h-4 text-zinc-400 opacity-40 group-hover:opacity-100 group-hover:text-white transition-opacity shrink-0 ml-2" />
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

        {/* 🛠️ BOTTOM PILL BAR: Screen ke center mein lock, dono taraf exact barabar curve */}
        {activeTab === "mention" && (
          <div className="w-full flex items-center justify-center px-4 select-none">
            <div
              onWheel={(e) => { e.currentTarget.scrollLeft += e.deltaY; }}
              className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-2.5 touch-pan-x"
            >
              {/* [A] Background Box Toggle Button */}
              <button
                type="button"
                title="Toggle Background (Black / White / None)"
                onClick={() => setBoxType((prev) => (prev === "black" ? "white" : prev === "white" ? "none" : "black"))}
                className={`w-7 h-7 shrink-0 ml-0.5 rounded-[7px] flex items-center justify-center transition-all duration-150 active:scale-90 select-none box-border cursor-pointer ${
                  boxType === "white"
                    ? "bg-white text-zinc-950 font-bold shadow-md"
                    : boxType === "black"
                    ? "bg-zinc-950 text-white font-bold border border-white/50 shadow-md"
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

              {/* Right edge spacer */}
              <div className="w-2.5 shrink-0" />
            </div>
          </div>
        )}

      </footer>
    </div>
  );
}