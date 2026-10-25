"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ZoomIn, Maximize2, Image as ImageIcon, Check } from "lucide-react";

export type AspectRatioType = "original" | "1:1" | "4:5" | "16:9";

export interface PostCropScreenProps {
  imageSrc: string;
  onBack: () => void;
  onNext: (croppedData: {
    aspectRatio: AspectRatioType;
    zoom: number;
    pan: { x: number; y: number };
  }) => void;
}

export default function PostCropScreen({
  imageSrc,
  onBack,
  onNext,
}: PostCropScreenProps) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>("1:1");
  const [isAspectMenuOpen, setIsAspectMenuOpen] = useState(false);

  const [zoom, setZoom] = useState<number>(1);
  const [isZoomSliderOpen, setIsZoomSliderOpen] = useState(false);

  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    setPan({ x: 0, y: 0 });
  }, [aspectRatio]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const maxBound = Math.max(80, (zoom - 1) * 150 + 60);
    const newX = Math.min(maxBound, Math.max(-maxBound, e.clientX - dragStartRef.current.x));
    const newY = Math.min(maxBound, Math.max(-maxBound, e.clientY - dragStartRef.current.y));
    setPan({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch (_) {}
  };

  const getCropFrameStyle = (): React.CSSProperties => {
    switch (aspectRatio) {
      case "4:5":
        return {
          aspectRatio: "4 / 5",
          height: "100%",
          width: "auto",
          maxHeight: "100%",
        };
      case "16:9":
        return {
          aspectRatio: "16 / 9",
          width: "100%",
          height: "auto",
          maxWidth: "100%",
        };
      case "1:1":
        return {
          aspectRatio: "1 / 1",
          width: "100%",
          height: "100%",
        };
      case "original":
      default:
        return {
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
        };
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 select-none">
      <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 bg-zinc-50/50 dark:bg-zinc-900/40 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition p-1 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>

        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Crop
        </h2>

        <button
          type="button"
          onClick={() => onNext({ aspectRatio, zoom, pan })}
          className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition cursor-pointer px-2 py-1"
        >
          Next
        </button>
      </header>

      <div className="relative w-full aspect-square max-h-[520px] bg-zinc-900 flex items-center justify-center overflow-hidden">
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            aspectRatio:
              aspectRatio === "4:5"
                ? "4 / 5"
                : aspectRatio === "16:9"
                ? "16 / 9"
                : aspectRatio === "1:1"
                ? "1 / 1"
                : undefined,
            width: aspectRatio === "16:9" ? "100%" : aspectRatio === "1:1" ? "100%" : "auto",
            height: aspectRatio === "4:5" ? "100%" : aspectRatio === "1:1" ? "100%" : "auto",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          className="relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 ease-out"
        >
          <img
            src={imageSrc}
            alt="Crop Preview"
            draggable={false}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isDragging ? "none" : "transform 0.15s ease-out",
            }}
            className={`w-full h-full pointer-events-none transition-all duration-150 ${
              aspectRatio === "original" ? "object-contain" : "object-cover"
            }`}
          />
        </div>

        {/* Aspect Ratio Menu */}
        {isAspectMenuOpen && (
          <div className="absolute bottom-16 left-4 z-40 w-36 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 backdrop-blur-xl shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100 text-white">
            {[
              { id: "original", label: "Original", icon: <ImageIcon className="w-4 h-4" /> },
              { id: "1:1", label: "1:1", icon: <div className="w-3.5 h-3.5 border-2 border-current rounded-sm" /> },
              { id: "4:5", label: "4:5", icon: <div className="w-3 h-4 border-2 border-current rounded-sm" /> },
              { id: "16:9", label: "16:9", icon: <div className="w-4 h-2.5 border-2 border-current rounded-sm" /> },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setAspectRatio(opt.id as AspectRatioType);
                  setIsAspectMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  aspectRatio === opt.id
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={aspectRatio === opt.id ? "text-white" : "text-zinc-500"}>
                    {opt.icon}
                  </span>
                  <span>{opt.label}</span>
                </div>
                {aspectRatio === opt.id && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            ))}
          </div>
        )}

        {/* Zoom Slider */}
        {isZoomSliderOpen && (
          <div className="absolute bottom-16 left-16 z-40 px-3.5 py-2.5 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 backdrop-blur-xl shadow-2xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-100">
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => {
                const z = parseFloat(e.target.value);
                setZoom(z);
                if (z <= 1) setPan({ x: 0, y: 0 });
              }}
              className="w-32 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <span className="text-[11px] font-mono font-bold text-zinc-300 min-w-[28px]">
              {zoom.toFixed(1)}x
            </span>
          </div>
        )}

        {/* Floating Buttons */}
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2">
          <button
            type="button"
            title="Aspect Ratio"
            onClick={() => {
              setIsAspectMenuOpen((p) => !p);
              setIsZoomSliderOpen(false);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 backdrop-blur-md cursor-pointer ${
              isAspectMenuOpen
                ? "bg-white text-black shadow-lg scale-105"
                : "bg-black/60 hover:bg-black/80 text-white/90 border border-white/20 active:scale-95"
            }`}
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Zoom Image"
            onClick={() => {
              setIsZoomSliderOpen((p) => !p);
              setIsAspectMenuOpen(false);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 backdrop-blur-md cursor-pointer ${
              isZoomSliderOpen || zoom > 1
                ? "bg-white text-black shadow-lg scale-105"
                : "bg-black/60 hover:bg-black/80 text-white/90 border border-white/20 active:scale-95"
            }`}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}