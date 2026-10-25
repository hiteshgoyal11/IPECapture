"use client";

import React, { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";

export interface FilterOption {
  id: string;
  name: string;
  filter: string; // CSS filter string template
}

// 12 Authentic Instagram Filters
export const INSTAGRAM_FILTERS: FilterOption[] = [
  { id: "original", name: "Original", filter: "none" },
  { id: "clarendon", name: "Clarendon", filter: "contrast(1.2) saturate(1.25)" },
  { id: "gingham", name: "Gingham", filter: "brightness(1.05) hue-rotate(-10deg)" },
  { id: "moon", name: "Moon", filter: "grayscale(1) contrast(1.1) brightness(1.1)" },
  { id: "lark", name: "Lark", filter: "contrast(0.9) brightness(1.15) saturate(1.1)" },
  { id: "reyes", name: "Reyes", filter: "sepia(0.25) brightness(1.1) contrast(0.85) saturate(0.75)" },
  { id: "juno", name: "Juno", filter: "contrast(1.15) saturate(1.4)" },
  { id: "slumber", name: "Slumber", filter: "saturate(0.66) brightness(1.05) sepia(0.35)" },
  { id: "crema", name: "Crema", filter: "sepia(0.4) contrast(1.1) brightness(1.05)" },
  { id: "ludwig", name: "Ludwig", filter: "saturate(1.25) contrast(1.08)" },
  { id: "aden", name: "Aden", filter: "hue-rotate(-20deg) contrast(0.9) saturate(0.85) brightness(1.2)" },
  { id: "perpetua", name: "Perpetua", filter: "contrast(1.05) brightness(1.1)" },
];

export interface AdjustmentsState {
  brightness: number; // -100 to 100 (default 0)
  contrast: number;   // -100 to 100 (default 0)
  fade: number;       // 0 to 100 (default 0)
  saturation: number; // -100 to 100 (default 0)
  temperature: number;// -100 to 100 (default 0)
  vignette: number;   // 0 to 100 (default 0)
}

interface PostEditScreenProps {
  imageSrc: string;
  cropConfig: {
    aspectRatio: string;
    zoom: number;
    pan: { x: number; y: number };
  };
  onBack: () => void;
  onNext: (editData: {
    filterId: string;
    filterIntensity: number;
    adjustments: AdjustmentsState;
    computedCssFilter: string;
  }) => void;
}

export default function PostEditScreen({
  imageSrc,
  cropConfig,
  onBack,
  onNext,
}: PostEditScreenProps) {
  const [activeTab, setActiveTab] = useState<"filters" | "adjustments">("filters");

  // Selected Filter State
  const [selectedFilterId, setSelectedFilterId] = useState<string>("original");
  const [filterIntensity, setFilterIntensity] = useState<number>(100);

  // Adjustments State
  const [adjustments, setAdjustments] = useState<AdjustmentsState>({
    brightness: 0,
    contrast: 0,
    fade: 0,
    saturation: 0,
    temperature: 0,
    vignette: 0,
  });

  // Compute Live Combined CSS Filter string with dynamic intensity (0-100)
  const computedCssFilter = useMemo(() => {
    const filterObj = INSTAGRAM_FILTERS.find((f) => f.id === selectedFilterId);
    let base = "";

    if (filterObj?.filter && filterObj.filter !== "none") {
      const ratio = filterIntensity / 100; // 0 (original) to 1 (full filter)
      switch (selectedFilterId) {
        case "clarendon":
          base = `contrast(${1 + 0.2 * ratio}) saturate(${1 + 0.25 * ratio})`;
          break;
        case "gingham":
          base = `brightness(${1 + 0.05 * ratio}) hue-rotate(${-10 * ratio}deg)`;
          break;
        case "moon":
          base = `grayscale(${ratio}) contrast(${1 + 0.1 * ratio}) brightness(${1 + 0.1 * ratio})`;
          break;
        case "lark":
          base = `contrast(${1 - 0.1 * ratio}) brightness(${1 + 0.15 * ratio}) saturate(${1 + 0.1 * ratio})`;
          break;
        case "reyes":
          base = `sepia(${0.25 * ratio}) brightness(${1 + 0.1 * ratio}) contrast(${1 - 0.15 * ratio}) saturate(${1 - 0.25 * ratio})`;
          break;
        case "juno":
          base = `contrast(${1 + 0.15 * ratio}) saturate(${1 + 0.4 * ratio})`;
          break;
        case "slumber":
          base = `saturate(${1 - 0.34 * ratio}) brightness(${1 + 0.05 * ratio}) sepia(${0.35 * ratio})`;
          break;
        case "crema":
          base = `sepia(${0.4 * ratio}) contrast(${1 + 0.1 * ratio}) brightness(${1 + 0.05 * ratio})`;
          break;
        case "ludwig":
          base = `saturate(${1 + 0.25 * ratio}) contrast(${1 + 0.08 * ratio})`;
          break;
        case "aden":
          base = `hue-rotate(${-20 * ratio}deg) contrast(${1 - 0.1 * ratio}) saturate(${1 - 0.15 * ratio}) brightness(${1 + 0.2 * ratio})`;
          break;
        case "perpetua":
          base = `contrast(${1 + 0.05 * ratio}) brightness(${1 + 0.1 * ratio})`;
          break;
        default:
          base = filterObj.filter;
      }
    }

    // Adjustments
    const b = 1 + adjustments.brightness / 100;
    const c = 1 + adjustments.contrast / 100;
    const s = 1 + adjustments.saturation / 100;
    const f = adjustments.fade > 0 ? `opacity(${1 - (adjustments.fade / 100) * 0.3})` : "";
    const temp =
      adjustments.temperature > 0
        ? `sepia(${adjustments.temperature / 150})`
        : adjustments.temperature < 0
        ? `hue-rotate(${adjustments.temperature / 2}deg)`
        : "";

    const parts = [
      base,
      `brightness(${Math.max(0.2, b)})`,
      `contrast(${Math.max(0.2, c)})`,
      `saturate(${Math.max(0, s)})`,
      f,
      temp,
    ].filter(Boolean);

    return parts.join(" ") || "none";
  }, [selectedFilterId, filterIntensity, adjustments]);

  // Handle Adjustment change
  const handleAdjustmentChange = (key: keyof AdjustmentsState, value: number) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 select-none">
      {/* Header Bar: [← Back] ----- Edit ----- [Next] */}
      <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 bg-zinc-50/50 dark:bg-zinc-900/40 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition p-1 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>

        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Edit
        </h2>

        {/* Monochrome Next Button (Black, White, Gray only) */}
        <button
          type="button"
          onClick={() =>
            onNext({
              filterId: selectedFilterId,
              filterIntensity,
              adjustments,
              computedCssFilter,
            })
          }
          className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition cursor-pointer px-2 py-1"
        >
          Next
        </button>
      </header>

      {/* Main Studio Body (Split: Preview Left, Tools Right) */}
      <div className="flex flex-col sm:flex-row flex-1 overflow-hidden min-h-0 h-full">
        
        {/* Left: Active Image Preview (Live Filter & Vignette) */}
        <div className="relative flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden h-[340px] sm:h-full p-3 sm:p-5">
          <div
            style={{
              aspectRatio:
                cropConfig.aspectRatio === "4:5"
                  ? "4 / 5"
                  : cropConfig.aspectRatio === "16:9"
                  ? "16 / 9"
                  : cropConfig.aspectRatio === "1:1"
                  ? "1 / 1"
                  : undefined,
              width: cropConfig.aspectRatio === "16:9" ? "100%" : cropConfig.aspectRatio === "1:1" ? "100%" : "auto",
              height: cropConfig.aspectRatio === "4:5" ? "100%" : cropConfig.aspectRatio === "1:1" ? "100%" : "auto",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            className="relative flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-150"
          >
            <img
              src={imageSrc}
              alt="Live filtered preview"
              draggable={false}
              style={{
                filter: computedCssFilter,
                transform: `translate(${cropConfig.pan.x}px, ${cropConfig.pan.y}px) scale(${cropConfig.zoom})`,
              }}
              className={`w-full h-full pointer-events-none ${
                cropConfig.aspectRatio === "original" ? "object-contain" : "object-cover"
              }`}
            />

            {/* Vignette Shadow Overlay */}
            {adjustments.vignette > 0 && (
              <div
                style={{
                  boxShadow: `inset 0 0 ${adjustments.vignette * 1.5}px rgba(0, 0, 0, ${
                    (adjustments.vignette / 100) * 0.95
                  })`,
                }}
                className="absolute inset-0 pointer-events-none"
              />
            )}
          </div>
        </div>

        {/* Right Panel: Tabs [Filters | Adjustments] */}
        <div className="w-full sm:w-[320px] md:w-[340px] flex flex-col bg-white dark:bg-zinc-950 border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-zinc-800 shrink-0 h-full overflow-hidden">
          
          {/* Sub-Tabs: Filters & Adjustments */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 shrink-0 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("filters")}
              className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
                activeTab === "filters"
                  ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
              }`}
            >
              Filters
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("adjustments")}
              className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
                activeTab === "adjustments"
                  ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
              }`}
            >
              Adjustments
            </button>
          </div>

          {/* TAB 1: FILTERS GRID & INTENSITY SLIDER */}
          {activeTab === "filters" && (
            <div className="flex-1 flex flex-col justify-between p-3.5 overflow-hidden">
              {/* 3-Column Filter Thumbnail Grid */}
              <div className="grid grid-cols-3 gap-2.5 overflow-y-auto max-h-[280px] sm:max-h-[350px] pr-1 scrollbar-none">
                {INSTAGRAM_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFilterId(f.id)}
                    className="flex flex-col items-center gap-1.5 p-1 rounded-xl transition cursor-pointer group"
                  >
                    <div
                      className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 transition ${
                        selectedFilterId === f.id
                          ? "border-zinc-900 dark:border-white shadow-md scale-105"
                          : "border-transparent group-hover:border-zinc-300 dark:group-hover:border-zinc-700"
                      }`}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=60"
                        alt={f.name}
                        style={{ filter: f.filter }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className={`text-[11px] capitalize tracking-tight ${
                        selectedFilterId === f.id
                          ? "font-bold text-zinc-950 dark:text-zinc-50"
                          : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
                      }`}
                    >
                      {f.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Filter Intensity Slider (Instagram Exact Bar) */}
              {selectedFilterId !== "original" && (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filterIntensity}
                    onChange={(e) => setFilterIntensity(parseInt(e.target.value))}
                    className="flex-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
                  />
                  <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 min-w-[28px] text-right">
                    {filterIntensity}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADJUSTMENTS SLIDERS (Brightness, Contrast, Fade, etc.) */}
          {activeTab === "adjustments" && (
            <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[330px] sm:max-h-[380px] scrollbar-none">
              {[
                { key: "brightness", label: "Brightness", min: -100, max: 100 },
                { key: "contrast", label: "Contrast", min: -100, max: 100 },
                { key: "fade", label: "Fade", min: 0, max: 100 },
                { key: "saturation", label: "Saturation", min: -100, max: 100 },
                { key: "temperature", label: "Temperature", min: -100, max: 100 },
                { key: "vignette", label: "Vignette", min: 0, max: 100 },
              ].map((item) => (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <span>{item.label}</span>
                    <span className="font-mono text-zinc-500 dark:text-zinc-400">
                      {adjustments[item.key as keyof AdjustmentsState]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    value={adjustments[item.key as keyof AdjustmentsState]}
                    onChange={(e) =>
                      handleAdjustmentChange(
                        item.key as keyof AdjustmentsState,
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}