import React, { useState, useRef } from "react";
import { Camera, Plus, X, Loader2, Sparkles, Check, Image as ImageIcon } from "lucide-react";
import { supabase } from "../../../lib/supabase";

interface Step5Props {
  formData: {
    firstName: string;
    lastName: string;
    dob: string;
    email: string;
    password: string;
    course: string;
    branch: string;
    username: string;
    avatarUrl: string | null;
  };
  updateFormData: (data: Partial<{ avatarUrl: string | null }>) => void;
}

// Snapchat / Modern Memoji Style Curated Avatars (High-Res SVG Avatars)
const STYLED_AVATARS = [
  {
    id: "coder",
    name: "Cool Coder",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="50" fill="#18181b" />
        {/* Head & Neck */}
        <path d="M38 72 C38 60 62 60 62 72 Z" fill="#fcd34d" />
        <circle cx="50" cy="46" r="22" fill="#fcd34d" />
        {/* Hair */}
        <path d="M28 42 C30 24 70 24 72 42 C65 30 35 30 28 42 Z" fill="#000" />
        {/* Cool Sunglasses */}
        <rect x="34" y="42" width="14" height="9" rx="3" fill="#000" />
        <rect x="52" y="42" width="14" height="9" rx="3" fill="#000" />
        <line x1="48" y1="46" x2="52" y2="46" stroke="#000" strokeWidth="2.5" />
        {/* Smile */}
        <path d="M44 57 Q50 63 56 57" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "campus_girl",
    name: "Campus Vibe",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="50" fill="#f43f5e" />
        <circle cx="50" cy="48" r="21" fill="#fde68a" />
        {/* Stylish Purple Hair */}
        <path d="M26 50 C26 22 74 22 74 50 C74 65 68 70 68 70 C68 40 32 40 32 70 C32 70 26 65 26 50 Z" fill="#4c1d95" />
        {/* Eyes */}
        <circle cx="42" cy="47" r="3" fill="#1e1b4b" />
        <circle cx="58" cy="47" r="3" fill="#1e1b4b" />
        {/* Blush & Smile */}
        <circle cx="38" cy="53" r="3" fill="#fb7185" opacity="0.6" />
        <circle cx="62" cy="53" r="3" fill="#fb7185" opacity="0.6" />
        <path d="M46 54 Q50 58 54 54" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "beanie",
    name: "Backbencher",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="50" fill="#3b82f6" />
        <circle cx="50" cy="50" r="22" fill="#fed7aa" />
        {/* Streetwear Beanie */}
        <path d="M26 42 C26 25 74 25 74 42 Z" fill="#1e293b" />
        <rect x="23" y="38" width="54" height="8" rx="3" fill="#0f172a" />
        {/* Wink Eye & Normal Eye */}
        <circle cx="42" cy="52" r="3" fill="#0f172a" />
        <path d="M55 52 Q59 49 63 52" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Chill Smirk */}
        <path d="M45 61 Q52 64 57 59" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "creator",
    name: "Creator",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="50" fill="#10b981" />
        <circle cx="50" cy="48" r="21" fill="#fed7aa" />
        {/* Hair */}
        <path d="M28 38 C32 20 68 20 72 38 C60 26 40 26 28 38 Z" fill="#78350f" />
        {/* Studio Headphones */}
        <path d="M25 45 C25 25 75 25 75 45" stroke="#0f172a" strokeWidth="4" fill="none" />
        <rect x="22" y="42" width="7" height="15" rx="3" fill="#0f172a" />
        <rect x="71" y="42" width="7" height="15" rx="3" fill="#0f172a" />
        {/* Glasses */}
        <circle cx="42" cy="48" r="7" stroke="#0f172a" strokeWidth="2" fill="none" />
        <circle cx="58" cy="48" r="7" stroke="#0f172a" strokeWidth="2" fill="none" />
        <line x1="49" y1="48" x2="51" y2="48" stroke="#0f172a" strokeWidth="2" />
        {/* Smile */}
        <path d="M46 58 Q50 62 54 58" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "monochrome",
    name: "Minimalist",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="50" fill="#09090b" />
        <circle cx="50" cy="48" r="22" fill="#27272a" />
        {/* White Accent Features */}
        <circle cx="42" cy="47" r="3.5" fill="#fafafa" />
        <circle cx="58" cy="47" r="3.5" fill="#fafafa" />
        <path d="M45 58 Q50 63 55 58" stroke="#fafafa" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "scholar",
    name: "Scholar",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="50" fill="#8b5cf6" />
        <circle cx="50" cy="48" r="21" fill="#fde68a" />
        {/* Side Part Hair */}
        <path d="M29 38 C35 22 72 24 71 42 C58 28 35 30 29 38 Z" fill="#1e1b4b" />
        {/* Round Scholar Spectacles */}
        <circle cx="42" cy="48" r="7" stroke="#1e1b4b" strokeWidth="2.5" fill="#fff" fillOpacity="0.3" />
        <circle cx="58" cy="48" r="7" stroke="#1e1b4b" strokeWidth="2.5" fill="#fff" fillOpacity="0.3" />
        <line x1="49" y1="48" x2="51" y2="48" stroke="#1e1b4b" strokeWidth="2.5" />
        <path d="M46 58 Q50 62 54 58" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
];

// Snapchat-Style Modular Avatar Config Interface
export interface AvatarCustomConfig {
  skin: string;
  hairStyle: "fade" | "beanie" | "long_wavy" | "ponytail" | "bob";
  hairColor: string;
  glasses: "none" | "sunglasses" | "round_specs" | "cyber_goggles";
  lipstick: "none" | "pink" | "ruby_red" | "plum";
  blush: boolean;
}

// Dynamic SVG Avatar Component
function CustomAvatarSVG({ config }: { config: AvatarCustomConfig }) {
  const lipstickColors = {
    none: "transparent",
    pink: "#fb7185",
    ruby_red: "#e11d48",
    plum: "#881337",
  };

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Background Studio Circle */}
      <circle cx="50" cy="50" r="50" fill="#09090b" />

      {/* Neck & Face */}
      <path d="M38 72 C38 60 62 60 62 72 Z" fill={config.skin} />
      <circle cx="50" cy="48" r="22" fill={config.skin} />

      {/* Eyes & Brows */}
      <circle cx="42" cy="46" r="2.8" fill="#18181b" />
      <circle cx="58" cy="46" r="2.8" fill="#18181b" />
      <path d="M38 41 Q42 39 46 41" stroke="#18181b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M54 41 Q58 39 62 41" stroke="#18181b" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Girls Makeup: Soft Blush */}
      {config.blush && (
        <>
          <circle cx="36" cy="52" r="3.5" fill="#f43f5e" opacity="0.45" />
          <circle cx="64" cy="52" r="3.5" fill="#f43f5e" opacity="0.45" />
        </>
      )}

      {/* Lips / Lipstick */}
      {config.lipstick !== "none" ? (
        <path d="M44 58 Q50 64 56 58 Q50 61 44 58 Z" fill={lipstickColors[config.lipstick]} stroke={lipstickColors[config.lipstick]} strokeWidth="1" strokeLinejoin="round" />
      ) : (
        <path d="M45 58 Q50 62 55 58" stroke="#18181b" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}

      {/* Hair Styles */}
      {config.hairStyle === "fade" && (
        <path d="M28 42 C30 22 70 22 72 42 C66 30 34 30 28 42 Z" fill={config.hairColor} />
      )}

      {config.hairStyle === "beanie" && (
        <g>
          <path d="M26 40 C26 23 74 23 74 40 Z" fill={config.hairColor} />
          <rect x="23" y="36" width="54" height="7" rx="3" fill="#0f172a" />
        </g>
      )}

      {config.hairStyle === "long_wavy" && (
        <g>
          {/* Back Long Hair */}
          <path d="M24 48 C20 68 26 78 30 78 C35 78 34 60 34 50 Z" fill={config.hairColor} />
          <path d="M76 48 C80 68 74 78 70 78 C65 78 66 60 66 50 Z" fill={config.hairColor} />
          {/* Top Volume */}
          <path d="M27 46 C27 22 73 22 73 46 C67 32 33 32 27 46 Z" fill={config.hairColor} />
        </g>
      )}

      {config.hairStyle === "ponytail" && (
        <g>
          <path d="M70 36 C85 35 88 55 76 65 C82 52 78 40 70 42 Z" fill={config.hairColor} />
          <path d="M28 44 C30 24 70 24 72 44 C66 32 34 32 28 44 Z" fill={config.hairColor} />
          <circle cx="70" cy="38" r="3.5" fill="#f43f5e" />
        </g>
      )}

      {config.hairStyle === "bob" && (
        <path d="M26 48 C24 62 30 64 34 54 C34 30 66 30 66 54 C70 64 76 62 74 48 C74 22 26 22 26 48 Z" fill={config.hairColor} />
      )}

      {/* Glasses / Goggles Layer */}
      {config.glasses === "sunglasses" && (
        <g>
          <rect x="33" y="41" width="15" height="10" rx="3" fill="#000" />
          <rect x="52" y="41" width="15" height="10" rx="3" fill="#000" />
          <line x1="48" y1="46" x2="52" y2="46" stroke="#000" strokeWidth="2.5" />
        </g>
      )}

      {config.glasses === "round_specs" && (
        <g>
          <circle cx="41" cy="46" r="7.5" stroke="#fff" strokeWidth="2" fill="rgba(255,255,255,0.15)" />
          <circle cx="59" cy="46" r="7.5" stroke="#fff" strokeWidth="2" fill="rgba(255,255,255,0.15)" />
          <line x1="48.5" y1="46" x2="51.5" y2="46" stroke="#fff" strokeWidth="2" />
        </g>
      )}

      {config.glasses === "cyber_goggles" && (
        <path d="M30 42 Q50 38 70 42 L68 51 Q50 48 32 51 Z" fill="#06b6d4" opacity="0.85" stroke="#0891b2" strokeWidth="1.5" />
      )}
    </svg>
  );
}

export default function Step5Avatar({ formData, updateFormData }: Step5Props) {
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>("coder");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Snapchat-style Studio States
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customTab, setCustomTab] = useState<"hair" | "glasses" | "makeup" | "skin">("hair");
  const [avatarConfig, setAvatarConfig] = useState<AvatarCustomConfig>({
    skin: "#fed7aa",
    hairStyle: "fade",
    hairColor: "#18181b",
    glasses: "none",
    lipstick: "none",
    blush: false,
  });

  // Crop Feature States
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // File pick karte hi Crop Modal open hoga
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be under 5MB.");
      return;
    }

    setErrorMessage("");
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result as string);
      setZoomLevel(1);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // Reset input
  };

  // Canvas-based Instagram circular crop export
  const applyCrop = () => {
    if (!rawImage) return;
    const img = new Image();
    img.src = rawImage;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 320;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const minDim = Math.min(img.width, img.height);
      const scaledWidth = (img.width / minDim) * size * zoomLevel;
      const scaledHeight = (img.height / minDim) * size * zoomLevel;
      const dx = (size - scaledWidth) / 2;
      const dy = (size - scaledHeight) / 2;

      ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);

      const croppedUrl = canvas.toDataURL("image/webp", 0.85);
      setUploadedImage(croppedUrl);
      setSelectedAvatarId("");
      setIsCropModalOpen(false);
    };
  };

  const handleSelectAvatar = (id: string) => {
    setSelectedAvatarId(id);
    setUploadedImage(null);
    setErrorMessage("");
  };

  // Final Account Creation in Supabase (100% ALL DATA SAVED)
  const handleFinalSubmit = async (isSkipping: boolean = false) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const finalFullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      // Pehle tha: const finalAvatar = ...
      // Ab ye karo:
      const finalAvatar = isSkipping 
        ? "default" 
        : uploadedImage 
        ? uploadedImage 
        : isCustomizing || selectedAvatarId === "custom"
        ? `custom:${JSON.stringify(avatarConfig)}`  // ✅ Ye custom avatar ka sara hair, goggle, lipstick data save karega
        : selectedAvatarId;

      // 1. Supabase Auth me Email & Password save hoga
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: finalFullName,
            username: formData.username.trim().toLowerCase(),
            course: formData.course,
            branch: formData.branch,
            dob: formData.dob,
            avatar_url: finalAvatar,
          },
        },
      });

      if (authError) throw authError;

      // 2. Database 'profiles' table me SARA DATA save hoga
      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").upsert([
          {
            id: authData.user.id,
            email: formData.email.trim().toLowerCase(),
            full_name: finalFullName,
            dob: formData.dob,                    // ✅ Screen 1 (DOB saved)
            course: formData.course,              // ✅ Screen 3 (Course saved)
            branch: formData.branch || null,      // ✅ Screen 3 (Branch saved)
            username: formData.username.trim().toLowerCase(), // ✅ Screen 4 (Username saved)
            avatar_url: finalAvatar,              // ✅ Screen 5 (Avatar saved)
            created_at: new Date().toISOString(),
          },
        ]);

        if (profileError) {
          console.error("Profile table error:", profileError.message);
          throw new Error("Could not save profile details: " + profileError.message);
        }

        // 3. Sab save hone ke baad redirect
        window.location.href = "/feed";
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account. Please try again.");
      setIsSubmitting(false);
    }
  };

  const activeAvatarObj = STYLED_AVATARS.find((a) => a.id === selectedAvatarId);

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
          Choose your profile look
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Pick a Snapchat-style campus avatar or upload your photo.
        </p>
      </div>

      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs text-left">
          {errorMessage}
        </div>
      )}

      {/* ========================================================= */}
      {/* INSTAGRAM / SNAP SIGNATURE PROFILE AVATAR RING            */}
      {/* ========================================================= */}
      <div className="flex flex-col items-center justify-center pt-1">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />

        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          
          {/* IPECapture Brand Identity Ring (Navy to Cyan) */}
          <div className="w-32 h-32 rounded-full p-[3.5px] bg-gradient-to-tr from-[#0F2952] via-[#0284C7] to-[#38BDF8] shadow-lg shadow-sky-500/10 transition-transform group-hover:scale-105 duration-300">
            <div className="w-full h-full rounded-full bg-white dark:bg-zinc-950 p-[3px] overflow-hidden flex items-center justify-center">
              {uploadedImage ? (
                <img src={uploadedImage} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : isCustomizing || selectedAvatarId === "custom" ? (
                <div className="w-full h-full rounded-full overflow-hidden">
                  <CustomAvatarSVG config={avatarConfig} />
                </div>
              ) : activeAvatarObj ? (
                <div className="w-full h-full rounded-full overflow-hidden">
                  {activeAvatarObj.svg}
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-3xl font-mono">
                  {formData.firstName.charAt(0).toUpperCase() || "I"}
                </div>
              )}
            </div>
          </div>

          {/* Floating Camera / Plus Button (Exact Instagram UI) */}
          <div className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-lg border-2 border-white dark:border-black transition-transform group-hover:scale-110">
            {uploadedImage ? (
              <X
                className="w-4 h-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedImage(null);
                  setSelectedAvatarId("coder");
                }}
              />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2.5 font-medium">
          {uploadedImage ? "Custom photo selected" : `@${formData.username || "ipec_student"}`}
        </p>
      </div>

      {/* ========================================================= */}
      {/* SNAPCHAT STYLE AVATAR CUSTOMIZER CONTROLS                 */}
      {/* ========================================================= */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            setIsCustomizing(!isCustomizing);
            setSelectedAvatarId("custom");
            setUploadedImage(null);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sky-500/50 bg-sky-50 dark:bg-sky-950/40 text-[#0284C7] dark:text-sky-300 text-xs font-semibold hover:bg-sky-100 transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isCustomizing ? "Close Avatar Studio" : "🎨 Design Your Avatar (Snapchat Style)"}</span>
        </button>

        {isCustomizing && (
          <div className="mt-3 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-3 animate-in fade-in zoom-in-95 duration-150 text-left">
            
            {/* Category Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 pb-2 gap-2 text-xs font-mono">
              {(["hair", "glasses", "makeup", "skin"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCustomTab(tab)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition ${
                    customTab === tab
                      ? "bg-black text-white dark:bg-white dark:text-black font-bold"
                      : "text-zinc-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB 1: HAIR & HAIR COLOR */}
            {customTab === "hair" && (
              <div className="space-y-2.5">
                <p className="text-[11px] font-medium text-zinc-500">Hairstyle</p>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {[
                    { id: "fade", label: "Cool Fade" },
                    { id: "beanie", label: "Street Beanie" },
                    { id: "long_wavy", label: "Long Wavy" },
                    { id: "ponytail", label: "Ponytail" },
                    { id: "bob", label: "Chic Bob" },
                  ].map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setAvatarConfig({ ...avatarConfig, hairStyle: h.id as any })}
                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition ${
                        avatarConfig.hairStyle === h.id
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>

                <p className="text-[11px] font-medium text-zinc-500 pt-1">Hair Color</p>
                <div className="flex gap-2">
                  {["#18181b", "#78350f", "#d97706", "#7c3aed", "#e11d48"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAvatarConfig({ ...avatarConfig, hairColor: c })}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        avatarConfig.hairColor === c ? "border-white scale-125 shadow-md" : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: GLASSES / GOGGLES */}
            {customTab === "glasses" && (
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-zinc-500">Eyewear & Goggles</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "none", label: "No Glasses" },
                    { id: "sunglasses", label: "Dark Sunglasses" },
                    { id: "round_specs", label: "Scholar Specs" },
                    { id: "cyber_goggles", label: "Neon Goggles" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setAvatarConfig({ ...avatarConfig, glasses: g.id as any })}
                      className={`py-2 px-2.5 rounded-lg border text-xs transition ${
                        avatarConfig.glasses === g.id
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: MAKEUP & LIPSTICK */}
            {customTab === "makeup" && (
              <div className="space-y-2.5">
                <p className="text-[11px] font-medium text-zinc-500">Lipstick Shade</p>
                <div className="flex gap-2">
                  {[
                    { id: "none", label: "Natural", color: "#e4e4e7" },
                    { id: "pink", label: "Soft Pink", color: "#fb7185" },
                    { id: "ruby_red", label: "Ruby Red", color: "#e11d48" },
                    { id: "plum", label: "Dark Plum", color: "#881337" },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setAvatarConfig({ ...avatarConfig, lipstick: l.id as any })}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition ${
                        avatarConfig.lipstick === l.id
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-950/60 font-bold"
                          : "border-zinc-200 dark:border-zinc-800"
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Cheek Blush</span>
                  <input
                    type="checkbox"
                    checked={avatarConfig.blush}
                    onChange={(e) => setAvatarConfig({ ...avatarConfig, blush: e.target.checked })}
                    className="w-4 h-4 accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: SKIN TONES */}
            {customTab === "skin" && (
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-zinc-500">Skin Tone</p>
                <div className="flex gap-2.5">
                  {["#fde68a", "#fed7aa", "#fcd34d", "#d97706"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAvatarConfig({ ...avatarConfig, skin: s })}
                      style={{ backgroundColor: s }}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        avatarConfig.skin === s ? "border-black dark:border-white scale-110 shadow-md" : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SNAP / MEMOJI STYLE AVATARS GRID                          */}
      {/* ========================================================= */}
      <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
        <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mb-3 uppercase tracking-wider">
          Snap / Memoji Avatars
        </p>
        
        <div className="grid grid-cols-6 gap-2 justify-items-center">
          {STYLED_AVATARS.map((avatar) => {
            const isSelected = selectedAvatarId === avatar.id && !uploadedImage;
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => handleSelectAvatar(avatar.id)}
                className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0.5 transition-all ${
                  isSelected
                    ? "ring-2 ring-black dark:ring-white scale-110 shadow-md"
                    : "opacity-70 hover:opacity-100 hover:scale-105"
                }`}
                title={avatar.name}
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  {avatar.svg}
                </div>
                {isSelected && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* ACTION BUTTONS (COMPLETE VS SKIP AS INSTAGRAM)             */}
      {/* ========================================================= */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleFinalSubmit(false)}
          className="w-full bg-black text-white dark:bg-white dark:text-black text-sm font-semibold py-3 px-4 rounded-xl hover:opacity-90 active:scale-[0.99] transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating your profile...</span>
            </>
          ) : (
            <span>Save &amp; Enter IPECapture</span>
          )}
        </button>

        {/* Instagram-Style "Skip for now" */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleFinalSubmit(true)}
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200 transition py-1 block w-full"
        >
          Skip for now
        </button>
      </div>

      {/* ========================================================= */}
      {/* INSTAGRAM STYLE PHOTO CROP MODAL                          */}
      {/* ========================================================= */}
      {isCropModalOpen && rawImage && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-4 shadow-2xl text-center">
            
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
                Crop Profile Picture
              </h3>
              <button
                type="button"
                onClick={() => setIsCropModalOpen(false)}
                className="text-zinc-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Circular Crop Viewport with Zoom */}
            <div className="flex justify-center py-2">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-dashed border-[#0284C7] shadow-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={rawImage}
                  alt="Crop preview"
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="w-full h-full object-cover transition-transform duration-75"
                />
              </div>
            </div>

            {/* Zoom Slider */}
            <div className="space-y-1.5 px-4">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>Zoom</span>
                <span>{zoomLevel.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="w-full accent-[#0284C7] cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsCropModalOpen(false)}
                className="flex-1 text-xs font-semibold py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCrop}
                className="flex-1 text-xs font-semibold py-2.5 rounded-xl bg-[#0F2952] text-white hover:bg-[#0284C7] transition shadow-md"
              >
                Apply Crop
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}