"use client";

import React from "react";
import { Trash2 } from "lucide-react";

export interface StoryTextItem {
  id: string;
  text: string;
  x: number;
  y: number;
  scale?: number;
  hasBox?: boolean;
  style: any;
  color?: string;
}

interface StoryCanvasViewportProps {
  imageSrc: string | null;
  filter: "Original" | "grayscale" | "warm";
  filterToast: string | null;
  storyTexts: StoryTextItem[];
  isDraggingText: boolean;
  isOverTrash: boolean;
  isTextEditing: boolean;
  editingTextId: string | null;
  textHasBox: boolean;
  selectedTextColor: string;
  authorUsername?: string;
  authorAvatar?: string | null;
  onDragStart: (id: string, e: React.PointerEvent<HTMLDivElement>) => void;
  getTextStyleClass: (style: any) => string;
}

export default function StoryCanvasViewport({
  imageSrc,
  filter,
  filterToast,
  storyTexts,
  isDraggingText,
  isOverTrash,
  isTextEditing,
  editingTextId,
  textHasBox,
  selectedTextColor,
  authorUsername = "ipecapture",
  authorAvatar,
  onDragStart,
  getTextStyleClass,
}: StoryCanvasViewportProps) {
  if (!imageSrc) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden select-none bg-gradient-to-b from-[#0284C7] via-[#0F2952] to-[#040d1a]">
      
      {/* ========================================================= */}
      {/* 1. INSTAGRAM AMBIENT VIBRANT LIGHT OVERLAY                */}
      {/* ========================================================= */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.5) 0%, transparent 60%)"
        }}
      />

      {/* ========================================================= */}
      {/* 2. INSTAGRAM PHOTO CARD (Image 2 Wala Exact Frame)        */}
      {/* ========================================================= */}
      <div className="relative z-10 w-[88%] sm:w-[84%] max-w-[390px] max-h-[70vh] flex flex-col rounded-3xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.85)] border border-white/25 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-300">
        
        {/* Top Mini Author Header */}
        <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-md border-b border-white/10 shrink-0 select-none">
          {/* Avatar: Valid link hoga tabhi load karega, warna clean initial letter dikhayega (Zero 404 error) */}
          <div className="w-5 h-5 rounded-full overflow-hidden bg-gradient-to-tr from-[#0F2952] to-[#0284C7] flex items-center justify-center shrink-0 text-white font-bold text-[10px] uppercase shadow-sm">
            {authorAvatar && (authorAvatar.startsWith("http") || authorAvatar.startsWith("data:")) ? (
              <img 
                src={authorAvatar} 
                alt="author" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              authorUsername.charAt(0).toUpperCase()
            )}
          </div>
          <span className="font-sans font-bold text-[11px] text-white tracking-tight leading-none drop-shadow">
            @{authorUsername}
          </span>
        </div>

        {/* Center Image (Zero Crop, Zero Blur, Aspect-Ratio Preserved) */}
        <div className="w-full flex items-center justify-center bg-black/20 p-0.5 overflow-hidden">
          <img
            src={imageSrc}
            alt="Story Card"
            className={`w-full h-auto max-h-[60vh] object-contain block transition-all duration-200 ${
              filter === "grayscale"
                ? "grayscale contrast-105"
                : filter === "warm"
                ? "sepia-[0.35] saturate-125 brightness-105"
                : ""
            }`}
            style={{ imageRendering: "auto" }}
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FILTER TOAST NOTIFICATION                             */}
      {/* ========================================================= */}
      {filterToast && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center animate-in fade-in zoom-in-95 duration-150">
          <span className="px-5 py-2 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white font-mono font-bold text-xs tracking-wider shadow-2xl">
            {filterToast}
          </span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. CANVAS INTERACTIVE LAYERS (Texts + Location Badge)     */}
      {/* ========================================================= */}
      {storyTexts.map((item, index) => {
        const isOverTrashZone = isDraggingText && item.y > 78 && Math.abs(item.x - 50) < 22;
        const currentScale = item.scale || 1;

        if (isTextEditing && editingTextId === item.id) return null;

        return (
          <div
            key={item.id || `story-text-layer-${index}`}
            onPointerDown={(e) => onDragStart(item.id, e)}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) scale(${currentScale * (isOverTrashZone ? 0.72 : 1)}) rotate(${((item as any).rotation || 0) + (isOverTrashZone ? -6 : 0)}deg)`,
              touchAction: "none",
            }}
            className="absolute z-20 cursor-grab active:cursor-grabbing select-none text-center max-w-[92%] pointer-events-auto will-change-transform transition-transform duration-75"
          >
            {item.style === "location" ? (
              /* 📍 Location Badge: Solid Pin Icon + Website Gradient Text */
              <div 
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "9999px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px 14px",
                  boxShadow: "0 12px 28px -5px rgba(0, 0, 0, 0.35), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  userSelect: "none",
                }}
              >
                {/* Solid Vector Pin with Center Hole */}
                <svg 
                  style={{ 
                    width: "14px", 
                    height: "14px", 
                    color: "#0284C7", 
                    fill: "#0284C7", 
                    flexShrink: 0, 
                    marginRight: "6px",
                    display: "block"
                  }} 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>

                {/* Location Name (Website Blue Gradient) */}
                <span 
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontWeight: 900,
                    fontSize: "11px",
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                    background: "linear-gradient(to right, #0F2952, #0284C7, #38BDF8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block"
                  }}
                >
                  {item.text}
                </span>
              </div>
            ) : (
              /* Normal Typography Layers */
              <span
                style={{ 
                  lineHeight: 1.35, 
                  padding: "6px 14px", 
                  borderRadius: "14px",
                  WebkitBoxDecorationBreak: "clone",
                  boxDecorationBreak: "clone" as any,
                  backgroundColor: (item?.hasBox ?? textHasBox) 
                    ? (item?.color || selectedTextColor || "#09090b") 
                    : "transparent",
                  color: (item?.hasBox ?? textHasBox)
                    ? ((hex) => {
                        const h = (hex || "#000000").replace("#", "");
                        const r = parseInt(h.substring(0, 2), 16) || 0;
                        const g = parseInt(h.substring(2, 4), 16) || 0;
                        const b = parseInt(h.substring(4, 6), 16) || 0;
                        return (r * 299 + g * 587 + b * 114) / 1000 >= 145 ? "#000000" : "#ffffff";
                      })(item?.color || selectedTextColor || "#09090b")
                    : (item?.color || selectedTextColor || "#ffffff"),
                }}
                className={`inline text-center text-xl sm:text-2xl outline-none border-none ring-0 max-w-[85%] break-words whitespace-pre-wrap box-decoration-clone ${
                  !(item?.hasBox ?? textHasBox) 
                    ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]" 
                    : "shadow-none"
                } ${getTextStyleClass(item.style)}`}
              >
                {item.text}
              </span>
            )}
          </div>
        );
      })}

      {/* ========================================================= */}
      {/* 5. TRASH DROP TARGET (Drag-to-Delete)                      */}
      {/* ========================================================= */}
      {isDraggingText && (
        <div
          style={{ touchAction: "none" }}
          className="absolute bottom-24 sm:bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex items-center justify-center animate-in fade-in zoom-in-90 slide-in-from-bottom-4 duration-150 ease-out will-change-transform select-none"
        >
          <div
            className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border transition-all duration-200 ease-out backdrop-blur-xl ${
              isOverTrash
                ? "scale-115 bg-zinc-900/90 text-white border-zinc-700 shadow-xl"
                : "scale-100 bg-zinc-950/75 text-zinc-300 border-zinc-700/50 shadow-lg"
            }`}
          >
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
          </div>
        </div>
      )}
    </div>
  );
}