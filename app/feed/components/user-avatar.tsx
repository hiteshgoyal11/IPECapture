import React from "react";

interface UserAvatarProps {
  avatarUrl?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
}

// 6 Preset High-Res Avatars
const PRESET_SVGS: Record<string, React.ReactNode> = {
  coder: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="50" fill="#18181b" />
      <path d="M38 72 C38 60 62 60 62 72 Z" fill="#fcd34d" />
      <circle cx="50" cy="46" r="22" fill="#fcd34d" />
      <path d="M28 42 C30 24 70 24 72 42 C65 30 35 30 28 42 Z" fill="#000" />
      <rect x="34" y="42" width="14" height="9" rx="3" fill="#000" />
      <rect x="52" y="42" width="14" height="9" rx="3" fill="#000" />
      <line x1="48" y1="46" x2="52" y2="46" stroke="#000" strokeWidth="2.5" />
      <path d="M44 57 Q50 63 56 57" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  campus_girl: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="50" fill="#f43f5e" />
      <circle cx="50" cy="48" r="21" fill="#fde68a" />
      <path d="M26 50 C26 22 74 22 74 50 C74 65 68 70 68 70 C68 40 32 40 32 70 C32 70 26 65 26 50 Z" fill="#4c1d95" />
      <circle cx="42" cy="47" r="3" fill="#1e1b4b" />
      <circle cx="58" cy="47" r="3" fill="#1e1b4b" />
      <circle cx="38" cy="53" r="3" fill="#fb7185" opacity="0.6" />
      <circle cx="62" cy="53" r="3" fill="#fb7185" opacity="0.6" />
      <path d="M46 54 Q50 58 54 54" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  beanie: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="50" fill="#3b82f6" />
      <circle cx="50" cy="50" r="22" fill="#fed7aa" />
      <path d="M26 42 C26 25 74 25 74 42 Z" fill="#1e293b" />
      <rect x="23" y="38" width="54" height="8" rx="3" fill="#0f172a" />
      <circle cx="42" cy="52" r="3" fill="#0f172a" />
      <path d="M55 52 Q59 49 63 52" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M45 61 Q52 64 57 59" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  creator: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="50" fill="#10b981" />
      <circle cx="50" cy="48" r="21" fill="#fed7aa" />
      <path d="M28 38 C32 20 68 20 72 38 C60 26 40 26 28 38 Z" fill="#78350f" />
      <path d="M25 45 C25 25 75 25 75 45" stroke="#0f172a" strokeWidth="4" fill="none" />
      <rect x="22" y="42" width="7" height="15" rx="3" fill="#0f172a" />
      <rect x="71" y="42" width="7" height="15" rx="3" fill="#0f172a" />
      <circle cx="42" cy="48" r="7" stroke="#0f172a" strokeWidth="2" fill="none" />
      <circle cx="58" cy="48" r="7" stroke="#0f172a" strokeWidth="2" fill="none" />
      <line x1="49" y1="48" x2="51" y2="48" stroke="#0f172a" strokeWidth="2" />
      <path d="M46 58 Q50 62 54 58" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  monochrome: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="50" fill="#09090b" />
      <circle cx="50" cy="48" r="22" fill="#27272a" />
      <circle cx="42" cy="47" r="3.5" fill="#fafafa" />
      <circle cx="58" cy="47" r="3.5" fill="#fafafa" />
      <path d="M45 58 Q50 63 55 58" stroke="#fafafa" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  scholar: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="50" fill="#8b5cf6" />
      <circle cx="50" cy="48" r="21" fill="#fde68a" />
      <path d="M29 38 C35 22 72 24 71 42 C58 28 35 30 29 38 Z" fill="#1e1b4b" />
      <circle cx="42" cy="48" r="7" stroke="#1e1b4b" strokeWidth="2.5" fill="#fff" fillOpacity="0.3" />
      <circle cx="58" cy="48" r="7" stroke="#1e1b4b" strokeWidth="2.5" fill="#fff" fillOpacity="0.3" />
      <line x1="49" y1="48" x2="51" y2="48" stroke="#1e1b4b" strokeWidth="2.5" />
      <path d="M46 58 Q50 62 54 58" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
};

export default function UserAvatar({ avatarUrl, name = "Student", size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-10 h-10",
  };

  // 1. Agar Custom Photo Upload ki thi (Data URL ya Cloud URL)
  if (avatarUrl && (avatarUrl.startsWith("data:image") || avatarUrl.startsWith("http"))) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800`}>
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  // 2. Agar 6 Presets me se koi choose kiya tha (coder, beanie, campus_girl, etc.)
  if (avatarUrl && PRESET_SVGS[avatarUrl]) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden shrink-0`}>
        {PRESET_SVGS[avatarUrl]}
      </div>
    );
  }

  // 3. Agar Snapchat-Style Custom Avatar banaya tha
  if (avatarUrl && avatarUrl.startsWith("custom:")) {
    try {
      const config = JSON.parse(avatarUrl.replace("custom:", ""));
      return (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden shrink-0 bg-black`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="50" fill="#09090b" />
            <path d="M38 72 C38 60 62 60 62 72 Z" fill={config.skin || "#fed7aa"} />
            <circle cx="50" cy="48" r="22" fill={config.skin || "#fed7aa"} />
            <circle cx="42" cy="46" r="2.8" fill="#18181b" />
            <circle cx="58" cy="46" r="2.8" fill="#18181b" />
            {config.blush && (
              <>
                <circle cx="36" cy="52" r="3.5" fill="#f43f5e" opacity="0.45" />
                <circle cx="64" cy="52" r="3.5" fill="#f43f5e" opacity="0.45" />
              </>
            )}
            <path d="M44 58 Q50 63 56 58" stroke={config.lipstick !== "none" ? "#e11d48" : "#18181b"} strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Hair */}
            {config.hairStyle === "fade" && (
              <path d="M28 42 C30 22 70 22 72 42 C66 30 34 30 28 42 Z" fill={config.hairColor || "#18181b"} />
            )}
            {config.hairStyle === "beanie" && (
              <g>
                <path d="M26 40 C26 23 74 23 74 40 Z" fill={config.hairColor || "#18181b"} />
                <rect x="23" y="36" width="54" height="7" rx="3" fill="#0f172a" />
              </g>
            )}
            {config.hairStyle === "long_wavy" && (
              <g>
                <path d="M24 48 C20 68 26 78 30 78 C35 78 34 60 34 50 Z" fill={config.hairColor || "#18181b"} />
                <path d="M76 48 C80 68 74 78 70 78 C65 78 66 60 66 50 Z" fill={config.hairColor || "#18181b"} />
                <path d="M27 46 C27 22 73 22 73 46 C67 32 33 32 27 46 Z" fill={config.hairColor || "#18181b"} />
              </g>
            )}
            {config.hairStyle === "ponytail" && (
              <g>
                <path d="M70 36 C85 35 88 55 76 65 C82 52 78 40 70 42 Z" fill={config.hairColor || "#18181b"} />
                <path d="M28 44 C30 24 70 24 72 44 C66 32 34 32 28 44 Z" fill={config.hairColor || "#18181b"} />
              </g>
            )}
            {config.hairStyle === "bob" && (
              <path d="M26 48 C24 62 30 64 34 54 C34 30 66 30 66 54 C70 64 76 62 74 48 C74 22 26 22 26 48 Z" fill={config.hairColor || "#18181b"} />
            )}

            {/* Glasses */}
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
        </div>
      );
    } catch (e) {
      // Fallback
    }
  }

  // 4. Agar user ne default 'coder' rakha tha to coder SVG dikhega
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden shrink-0`}>
      {PRESET_SVGS.coder}
    </div>
  );
}