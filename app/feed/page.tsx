"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Type,
  SlidersHorizontal,
  Pipette,
  MoreVertical,
  Trash2,
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MapPin, 
  Download, 
  Eye, 
  FileText, 
  CheckCircle2, 
  Search, 
  Camera, 
  Plus, 
  X, 
  WifiOff,
  Sparkles,
  Loader2,
  AlertTriangle,
  ChevronLeft, 
  ChevronRight, 
  Share2
} from "lucide-react";
import LeftSidebar from "./components/left-sidebar";
import RightSidebar from "./components/right-sidebar";
import MobileNav from "./components/mobile-nav";
import FeedSkeleton from "./components/feed-skeleton";
import UserAvatar from "./components/user-avatar";
import { supabase } from "../../lib/supabase";
import StoryMentionModal from "./components/story-mention-modal";

export type TextStyleType = 
  | "classic" | "boxed" | "neon" | "gradient" | "typewriter" 
  | "retro" | "cyber" | "soft" | "gold" | "italic" | "outline" | "bold";

export interface StoryTextItem {
  id: string;
  text: string;
  x: number;
  y: number;
  scale?: number;
  hasBox?: boolean; // 👈 User decides box ON/OFF
  color?: string;
  style: any;
}

interface Story {
  id: string;
  author_name: string;
  author_username: string;
  author_avatar?: string | null;
  media_url: string;
  caption?: string;
  created_at: string;
  likes_count?: number;
  hasBox?: boolean;
  color?: string;
  story_texts?: any[]; // <-- Add this
  filter?: string;               // <-- Add this
  badge?: string | null;         // <-- Add this
}

export default function MainFeedPage() {
  // 🎯 Real Instagram Auto-Contrast (YIQ Brightness Formula)
  const getContrastColor = (hex: string) => {
    const cleanHex = (hex || "#000000").replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness >= 145 ? "#000000" : "#ffffff";
  };
  // Open editor for a brand new text
  const handleAddNewText = () => {
    // handleAddNewText me:
    setSelectedTextColor("#09090b");
    setIsColorPickerOpen(false);
    setEditingTextId(null);
    setActiveInputText("");
    setTextStyleMode("boxed");
    setIsTextEditing(true);
  };

  // Open editor for an existing text
  const handleEditText = (item: StoryTextItem) => {
    setSelectedTextColor(item.color || "#09090b");
    setIsColorPickerOpen(false);
    setEditingTextId(item.id);
    setActiveInputText(item.text);
    setTextStyleMode(item.style);
    setTextHasBox(!!item.hasBox);
    setIsTextEditing(true);
  };

  const [textHasBox, setTextHasBox] = useState<boolean>(false);
  const [activeToolTab, setActiveToolTab] = useState<"style" | "box">("style");

  // Save current text (New or Edited)
  const handleFinishText = () => {
    const trimmed = activeInputText.trim();
    console.log("👉 [1. handleFinishText Called]:", {
      rawInput: activeInputText,
      trimmed: trimmed,
      editingTextId: editingTextId,
      currentTextsCount: storyTexts.length,
      style: textStyleMode
    });

    if (!trimmed) {
      console.warn("⚠️ [handleFinishText]: Text khali tha isliye save nahi hua!");
      if (editingTextId) {
        setStoryTexts((prev) => prev.filter((t) => t.id !== editingTextId));
      }
      setIsTextEditing(false);
      setEditingTextId(null);
      setActiveInputText("");
      return;
    }

    if (editingTextId) {
      console.log("✏️ [handleFinishText]: Existing text update ho raha hai id:", editingTextId);
      setStoryTexts((prev) =>
        prev.map((t) =>
          t.id === editingTextId
            ? { ...t, text: trimmed, style: textStyleMode, hasBox: textHasBox, color: selectedTextColor }
            : t
        )
      );
    } else {
      const newItem: any = {
        id: "txt_" + Date.now().toString(),
        text: trimmed,
        x: 50,
        y: Math.min(70, 42 + storyTexts.length * 8),
        scale: 1,
        hasBox: textHasBox,
        style: textStyleMode,
        color: selectedTextColor
      };
      console.log("➕ [handleFinishText]: Naya text item add ho raha hai:", newItem);
      setStoryTexts((prev) => {
        const next = [...prev, newItem];
        console.log("📦 [Updated storyTexts array]:", next);
        return next;
      });
    }

    setActiveInputText("");
    setEditingTextId(null);
    setIsTextEditing(false);
  };
  const [mounted, setMounted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [activeMoodTab, setActiveMoodTab] = useState<"all" | "my_course" | "pyqs" | "memes">("all");
  const [currentNavTab, setCurrentNavTab] = useState("feed");
  
  // Data States
  const [posts, setPosts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<string>>(new Set());

  // Post Creator State
  const [newPostCaption, setNewPostCaption] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  // Multi-Story & Instagram Status Progress States
  const [activeStoryUsername, setActiveStoryUsername] = useState<string | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [storyReplyText, setStoryReplyText] = useState("");
  const [isStoryLiked, setIsStoryLiked] = useState(false);
  const [storyViewers, setStoryViewers] = useState<any[]>([]);
  const [isViewersSheetOpen, setIsViewersSheetOpen] = useState(false);
  const storyInputRef = useRef<HTMLInputElement>(null);
  // Story Uploading State (Rotating Cuts Ring ke liye)
  const [isUploadingStory, setIsUploadingStory] = useState(false);

  // Story Editor Studio States
  const [editorRawImage, setEditorRawImage] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  // 1. Multi-Text Items State (Instagram Positioning & Multi-Texts)
  interface StoryTextItem {
    id: string;
    text: string;
    x: number; // percentage (0 to 100)
    y: number; // percentage (0 to 100)
    scale?: number;
    hasBox?: boolean;
    style: any; // 👈 "boxed" | "neon" | "plain" ko hata kar sirf `any` likh dein!
    color?: string;
  }

  const [storyTexts, setStoryTexts] = useState<StoryTextItem[]>([]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [activeInputText, setActiveInputText] = useState("");
  const [textStyleMode, setTextStyleMode] = useState<any>("boxed"); // 👈 Yahan <any> likh dein
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [isMentionModalOpen, setIsMentionModalOpen] = useState(false);
  const [mentionModalTab, setMentionModalTab] = useState<"mention" | "location">("mention");
  const [selectedTextColor, setSelectedTextColor] = useState<string>("#09090b");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
  const [colorPalettePage, setColorPalettePage] = useState<number>(0); // 0 = Dot 1, 1 = Dot 2, 2 = Dot 3
  useEffect(() => {
    if (isTextEditing) {
      const el = document.querySelector("[contenteditable]");
      if (el) {
        console.log("🔍 [Editing CSS Check]:", {
          display: getComputedStyle(el).display,
          webkitBoxDecorationBreak: (getComputedStyle(el) as any).webkitBoxDecorationBreak,
          textHasBox: textHasBox,
          innerHTML: el.innerHTML,
        });
      }
    }
  }, [isTextEditing, activeInputText, textHasBox]);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [filterToast, setFilterToast] = useState<string | null>(null);

  // 12 High-End Instagram Typography Engine Styles
  const getTextStyleClass = (style: any) => {
    switch (style) {
      case "boxed":
        return "bg-white text-zinc-950 font-black px-5 py-2 rounded-2xl shadow-2xl border border-white/40";
      case "neon":
        return "text-[#38BDF8] font-black italic [text-shadow:_0_0_12px_#0284C7,_0_0_28px_#0284C7,_0_0_50px_#0369a1]";
      case "gradient":
        return "bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 bg-clip-text text-transparent font-black tracking-tight";
      case "typewriter":
        return "bg-black/90 text-emerald-400 font-mono font-bold px-4 py-1.5 rounded-lg border border-emerald-500/40 tracking-wider";
      case "retro":
        return "bg-amber-400 text-black font-extrabold px-4 py-1.5 rounded-md -rotate-2 shadow-[4px_4px_0px_#000]";
      case "cyber":
        return "text-yellow-300 font-mono font-black [text-shadow:_0_0_10px_#eab308,_0_0_25px_#ca8a04] tracking-widest uppercase";
      case "soft":
        return "bg-black/60 backdrop-blur-xl text-white font-semibold px-5 py-2 rounded-full border border-white/20";
      case "gold":
        return "bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent font-black [filter:drop-shadow(0_2px_8px_rgba(217,119,6,0.5))]";
      case "italic":
        return "text-white italic font-serif font-black text-xl [text-shadow:_0_2px_12px_rgba(0,0,0,0.9)]";
      case "outline":
        return "text-transparent [-webkit-text-stroke:_1.5px_white] font-black tracking-wider uppercase";
      case "bold":
        return "bg-rose-600 text-white font-black px-5 py-1.5 rounded-xl uppercase tracking-tighter shadow-lg shadow-rose-900/40";
      case "classic":
      default:
        return "text-white font-extrabold [text-shadow:_0_2px_4px_rgba(0,0,0,0.9),_0_0_18px_rgba(0,0,0,0.85)]";
    }
  };

  // Filter Switch Handler with 1.5s Auto-Disappear Toast
  const handleFilterToggle = () => {
    const list: Array<"Original" | "grayscale" | "warm"> = ["Original", "grayscale", "warm"];
    const labels = { Original: "Original", grayscale: "B&W Monochrome", warm: "Warm Sunset" };
    const next = list[(list.indexOf(storyFilter) + 1) % list.length];
    setStoryFilter(next);
    setFilterToast(labels[next]);
    setTimeout(() => setFilterToast(null), 1400); // 1.4s me fade out hoga
  };

  // Drag Text Handler (Smooth on Mobile Touch & Laptop Mouse)
  // Instagram Style Drag with Trash Drop Target & Click Suppression
  // Ultra-Smooth 60FPS Drag (Zero Hang, GPU Accelerated)
  const handleDragText = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const target = e.currentTarget;
    const parent = target.parentElement;
    if (!parent) return;

    let hasUserMoved = false;
    let isPinchingActive = false;
    const initialPointerX = e.clientX;
    const initialPointerY = e.clientY;
    const viewportBoundingRect = parent.getBoundingClientRect();

    const currentItem = storyTexts.find((textNode) => textNode.id === id);
    if (!currentItem) return;

    let computedXPercent = currentItem.x;
    let computedYPercent = currentItem.y;
    let activeScaleMultiplier = currentItem.scale || 1.0;
    let anchorScaleSnapshot = activeScaleMultiplier;

    const pointerRoster = new Map<number, { clientX: number; clientY: number }>();
    pointerRoster.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });

    let initialTouchSpanDistance = 0;

    setIsDraggingText(true);

    const onPointerMove = (moveEvent: PointerEvent) => {
      pointerRoster.set(moveEvent.pointerId, {
        clientX: moveEvent.clientX,
        clientY: moveEvent.clientY,
      });

      // =========================================================================
      // MODE 1: MOBILE & TABLET DUAL-TOUCH PINCH TO ZOOM / RESIZE
      // =========================================================================
      if (pointerRoster.size >= 2) {
        isPinchingActive = true;
        const activeFingerPoints = Array.from(pointerRoster.values());
        const currentInterDistance = Math.hypot(
          activeFingerPoints[0].clientX - activeFingerPoints[1].clientX,
          activeFingerPoints[0].clientY - activeFingerPoints[1].clientY
        );

        if (!initialTouchSpanDistance) {
          initialTouchSpanDistance = currentInterDistance;
          anchorScaleSnapshot = activeScaleMultiplier;
        } else {
          const expansionRatio = currentInterDistance / initialTouchSpanDistance;
          activeScaleMultiplier = Math.min(3.8, Math.max(0.45, anchorScaleSnapshot * expansionRatio));

          target.style.transform = `translate(-50%, -50%) scale(${activeScaleMultiplier}) translateZ(0)`;
        }
        return;
      }

      // =========================================================================
      // MODE 2: SINGLE-POINTER TRANSLATION & PANNING (DESKTOP, MOUSE & MOBILE DRAG)
      // =========================================================================
      if (!isPinchingActive) {
        const displacementDeltaX = moveEvent.clientX - initialPointerX;
        const displacementDeltaY = moveEvent.clientY - initialPointerY;

        if (Math.hypot(displacementDeltaX, displacementDeltaY) > 5) {
          hasUserMoved = true;
        }

        computedXPercent = Math.min(88, Math.max(12, currentItem.x + (displacementDeltaX / viewportBoundingRect.width) * 100));
        computedYPercent = Math.min(90, Math.max(10, currentItem.y + (displacementDeltaY / viewportBoundingRect.height) * 100));

        // Direct hardware layer mutation bypassing React reconciliation cycles
        target.style.left = `${computedXPercent}%`;
        target.style.top = `${computedYPercent}%`;

        // Trash Removal Zone Calculation (Bottom 22% Screen Center)
        const isHoveringTrashTarget = computedYPercent > 78 && Math.abs(computedXPercent - 50) < 22;
        if (isHoveringTrashTarget) {
          setIsOverTrash(true);
          target.style.transform = `translate(-50%, -50%) scale(${activeScaleMultiplier * 0.72}) rotate(-6deg) translateZ(0)`;
        } else {
          setIsOverTrash(false);
          target.style.transform = `translate(-50%, -50%) scale(${activeScaleMultiplier}) translateZ(0)`;
        }
      }
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      pointerRoster.delete(upEvent.pointerId);

      // Multi-touch fallback: Wait till all fingers release before finalizing state
      if (pointerRoster.size > 0) {
        initialTouchSpanDistance = 0;
        return;
      }

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      setIsDraggingText(false);
      setIsOverTrash(false);

      // 1. Trashed Drop Verification
      const isTargetDroppedInTrash = computedYPercent > 78 && Math.abs(computedXPercent - 50) < 22;
      if (isTargetDroppedInTrash) {
        setStoryTexts((previousNodes) => previousNodes.filter((textNode) => textNode.id !== id));
        return;
      }

      // 2. Commit Position and Scale Mutations to Global State
      const hasPhysicalMutationOccurred = hasUserMoved || isPinchingActive || activeScaleMultiplier !== (currentItem.scale || 1.0);
      if (hasPhysicalMutationOccurred) {
        setStoryTexts((previousNodes) =>
          previousNodes.map((textNode) =>
            textNode.id === id
              ? {
                  ...textNode,
                  x: computedXPercent,
                  y: computedYPercent,
                  scale: Number(activeScaleMultiplier.toFixed(3)),
                }
              : textNode
          )
        );
      } else {
        // 3. Simple Click/Tap Interaction -> Trigger In-place Text Editing Studio
        if (currentItem.text.startsWith("@")) {
          setIsMentionModalOpen(true); // Mention hai to StoryMentionModal khulega
        } else {
          handleEditText(currentItem); // Normal text hai to Normal Editor khulega
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };
  const [storyBadge, setStoryBadge] = useState<string | null>(null);
  const [storyFilter, setStoryFilter] = useState<"Original" | "grayscale" | "warm">("Original");

  // 1. File select hote hi direct upload nahi hoga -> Editor open hoga
  // ✅ 1. Editor HAMESHA turant khulega (No Block):
  const handleStoryFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setEditorRawImage(localUrl);
    setStoryTexts([]);
    setStoryBadge(null);
    setStoryFilter("Original");
    setIsEditorOpen(true); // ✅ Screen 100% khulegi
    e.target.value = "";
  };

  const handleFinalizeAndPostStory = async () => {
    if (!editorRawImage) return;

    setIsEditorOpen(false);
    setIsUploadingStory(true);

    // Active User Check with On-the-fly Auth Fallback
    let authorName = currentUser?.full_name || "IPEC Student";
    let authorUsername = currentUser?.username || "ipec_student";
    let authorAvatar = currentUser?.avatar_url || null;

    if (!currentUser) {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const { data: prof } = await supabase.from("profiles").select("*").eq("id", authData.user.id).maybeSingle();
        if (prof) {
          authorName = prof.full_name;
          authorUsername = prof.username;
          authorAvatar = prof.avatar_url;
        }
      }
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = editorRawImage;

    img.onload = async () => {
      // 1. Full HD 1080x1920 Story Canvas
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        setIsUploadingStory(false);
        return;
      }

      // Safe Rounded Rectangle Helper (Zero Browser Canvas Error)
      const drawRoundedBox = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
      };

      // 2. Filter Application
      if (storyFilter === "grayscale") {
        ctx.filter = "grayscale(100%) contrast(105%)";
      } else if (storyFilter === "warm") {
        ctx.filter = "sepia(35%) saturate(140%) brightness(102%)";
      } else {
        ctx.filter = "none";
      }

      // 3. Aspect Ratio Preserved Center Draw
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const drawX = (canvas.width - img.width * scale) / 2;
      const drawY = (canvas.height - img.height * scale) / 2;
      ctx.drawImage(img, drawX, drawY, img.width * scale, img.height * scale);
      ctx.filter = "none";

      // 4. College Location Badge Render (IPEC Navy/Cyan Theme)
      if (storyBadge) {
        ctx.font = "bold 34px monospace";
        const bTextWidth = ctx.measureText(storyBadge).width;
        const bPadX = 50;
        const bWidth = bTextWidth + bPadX * 2;
        const bHeight = 84;
        const bX = (canvas.width - bWidth) / 2;
        const bY = 240;

        ctx.fillStyle = "rgba(15, 41, 82, 0.92)";
        drawRoundedBox(bX, bY, bWidth, bHeight, 42);

        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#38BDF8";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(storyBadge, canvas.width / 2, bY + bHeight / 2);
      }

      // 5. Custom Typography Render (Boxed / Neon / Plain)
      if (storyTexts.length > 0) {
        ctx.font = "bold 48px sans-serif";
        const tMetrics = ctx.measureText(storyTexts[0].text);
        const tWidth = tMetrics.width;
        const tPadX = 45;
        const tBoxW = tWidth + tPadX * 2;
        const tBoxH = 100;
        const tX = (canvas.width - tBoxW) / 2;
        const tY = 960;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (textStyleMode === "boxed") {
          ctx.fillStyle = "rgba(0, 0, 0, 0.82)";
          drawRoundedBox(tX, tY - tBoxH / 2, tBoxW, tBoxH, 24);
          ctx.fillStyle = "#ffffff";
          ctx.fillText(storyTexts[0].text, canvas.width / 2, tY);
        } else if (textStyleMode === "neon") {
          ctx.shadowColor = "#0284C7";
          ctx.shadowBlur = 24;
          ctx.fillStyle = "#38BDF8";
          ctx.fillText(storyTexts[0].text, canvas.width / 2, tY);
          ctx.shadowBlur = 0;
        } else {
          ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
          ctx.shadowBlur = 16;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(storyTexts[0].text, canvas.width / 2, tY);
          ctx.shadowBlur = 0;
        }
      }

      // 6. High-Efficiency Payload Compression (Under 180KB -> Zero 500 Error)
      const optimizedMediaPayload = canvas.toDataURL("image/jpeg", 0.7);

      // 7. Live Supabase Storage Commit
      try {
        const { data, error } = await supabase.from("stories").insert([{
          author_name: authorName,
          author_username: authorUsername,
          author_avatar: authorAvatar,
          media_url: optimizedMediaPayload,
          caption: storyTexts[0]?.text || "Campus Story",
          story_texts: storyTexts,       // ✅ DB Column: story_texts (JSONB)
          filter: storyFilter,           // ✅ DB Column: filter (text)
          badge: storyBadge,
        }]).select().single();

        if (error) throw error;

        if (data) {
          setStories((prev) => [data, ...prev]);
        }
      } catch (err: any) {
        console.error("Story commit failed:", err.message || err);
        alert("Could not post story. Please try with another image.");
      } finally {
        setIsUploadingStory(false);
      }
    };

    img.onerror = () => {
      console.error("Image loading failed on canvas.");
      setIsUploadingStory(false);
    };
  };

  // 1. Pehle Grouping aur currentStory calculate karo
  const storiesByUser = stories.reduce((acc: Record<string, Story[]>, s) => {
    if (!acc[s.author_username]) acc[s.author_username] = [];
    acc[s.author_username].push(s);
    return acc;
  }, {});

  const currentActiveUserStories = activeStoryUsername ? storiesByUser[activeStoryUsername] || [] : [];
  const currentStory = currentActiveUserStories[currentStoryIndex] || null;

  // Global Ordered Queue of all students who have active stories
  const orderedStoryUsers = [
    ...(currentUser?.username && storiesByUser[currentUser.username] ? [currentUser.username] : []),
    ...Object.keys(storiesByUser).filter((u) => u !== currentUser?.username),
  ];

  const currentUserQueueIndex = orderedStoryUsers.indexOf(activeStoryUsername || "");

  // Checks if user can go backwards or forwards across ALL stories
  const canGoPrev = currentUserQueueIndex > 0 || currentStoryIndex > 0;
  const canGoNext =
    currentUserQueueIndex < orderedStoryUsers.length - 1 ||
    currentStoryIndex < currentActiveUserStories.length - 1;

  // Instagram Global Navigation: Next Story (Same user OR Next user)
  const goToNextStory = () => {
    if (currentStoryIndex < currentActiveUserStories.length - 1) {
      setCurrentStoryIndex((i) => i + 1);
      setStoryProgress(0);
    } else if (currentUserQueueIndex < orderedStoryUsers.length - 1) {
      const nextUser = orderedStoryUsers[currentUserQueueIndex + 1];
      setActiveStoryUsername(nextUser);
      setCurrentStoryIndex(0);
      setStoryProgress(0);
    } else {
      setActiveStoryUsername(null);
      setCurrentStoryIndex(0);
    }
  };

  // Instagram Global Navigation: Prev Story (Same user OR Prev user)
  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((i) => i - 1);
      setStoryProgress(0);
    } else if (currentUserQueueIndex > 0) {
      const prevUser = orderedStoryUsers[currentUserQueueIndex - 1];
      const prevUserStories = storiesByUser[prevUser] || [];
      setActiveStoryUsername(prevUser);
      setCurrentStoryIndex(Math.max(0, prevUserStories.length - 1));
      setStoryProgress(0);
    }
  };

    // Comments Sheet & Timer Pause States
  const [isCommentsSheetOpen, setIsCommentsSheetOpen] = useState(false);
  const [storyComments, setStoryComments] = useState<any[]>([]);
  const [ownerReplyInput, setOwnerReplyInput] = useState("");

  // Share Sheet State taaki Share par bhi timer ruke
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Story Options Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Report Modal States (Timer pauses while reporting)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportStep, setReportStep] = useState<"reasons" | "success">("reasons");

  // Timer Freeze: Report karte waqt bhi timer 100% freeze rahega
  const isTimerPaused = isViewersSheetOpen || isCommentsSheetOpen || isShareModalOpen || isMenuOpen || isReportModalOpen;

  // IPEC Campus Specific Unique Report Reasons (Not copy-pasted Instagram text)
  const CAMPUS_REPORT_REASONS = [
    "Harassment, bullying, or targeted call-outs",
    "Misleading college circular or fake exam info",
    "Inappropriate, offensive, or NSFW content",
    "Unpermitted photograph of student or faculty",
    "Hate speech, discrimination, or abusive slang",
    "Spam, commercial promo, or fraud",
    "Other violation of IPEC community standards",
  ];

  // Timer: Uses goToNextStory automatically
  useEffect(() => {
    if (!activeStoryUsername || !currentStory || isTimerPaused) return;

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          goToNextStory();
          return 0;
        }
        return prev + 0.42; // ~12 seconds
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeStoryUsername, currentStoryIndex, currentUserQueueIndex, isTimerPaused, currentActiveUserStories.length]);

  // 2. Ab currentStory define ho chuka hai, to isOwnStory check karo
  const isOwnStory = currentStory?.author_username === currentUser?.username;

  // 1. Progress sirf tab 0 hoga jab nayi story aayegi (Pause hone par 0 nahi hoga)
  useEffect(() => {
    setStoryProgress(0);
  }, [activeStoryUsername, currentStoryIndex]);

  // 2. Slow & Smooth 12-Second Timer (Freeze on Pause)
  useEffect(() => {
    if (!activeStoryUsername || !currentStory || isTimerPaused) return;

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          if (currentStoryIndex < currentActiveUserStories.length - 1) {
            setCurrentStoryIndex((i) => i + 1);
            return 0;
          } else {
            setActiveStoryUsername(null);
            setCurrentStoryIndex(0);
            return 0;
          }
        }
        // 50ms me 0.42% -> Exactly ~12 Seconds (Slow & Calm)
        return prev + 0.42;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeStoryUsername, currentStoryIndex, currentActiveUserStories.length, isTimerPaused]);

  // Record View & Fetch Viewers with Likes for Own Story
  useEffect(() => {
    if (!currentStory || !currentUser) return;

    if (!isOwnStory) {
      // Duplicate aane par ignore karega, 409 error nahi aayega
      supabase.from("story_views").upsert(
        [{
          story_id: currentStory.id,
          viewer_username: currentUser.username,
          viewer_name: currentUser.full_name,
          viewer_avatar: currentUser.avatar_url,
        }],
        { onConflict: "story_id, viewer_username", ignoreDuplicates: true }
      ).then(() => {});
    } else {
      // 2. Fetch all viewers who saw our story + check if they liked
      async function fetchViewers() {
        const { data: views } = await supabase.from("story_views").select("*").eq("story_id", currentStory.id);
        const { data: likes } = await supabase.from("story_likes").select("username").eq("story_id", currentStory.id);

        const likedUsernames = new Set(likes?.map((l: any) => l.username) || []);
        const combined = views?.map((v: any) => ({
          ...v,
          hasLiked: likedUsernames.has(v.viewer_username),
        })) || [];

        setStoryViewers(combined);
      }
      fetchViewers();
    }
  }, [currentStory?.id, isOwnStory, currentUser]);

  // Set of usernames who have active 24h stories
  const activeStoryAuthors = new Set(stories.map(s => s.author_username));
  const userHasActiveStory = currentUser?.username ? activeStoryAuthors.has(currentUser.username) : false;

  useEffect(() => {
    // 1. Connection Tracker
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    // 2. Fetch Live Supabase Data
    async function loadFeedData() {
      try {
        // A. Current User Profile
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authData.user.id)
            .maybeSingle();

          if (profile) setCurrentUser(profile);
        }

        // B. Active 24-Hour Stories (Created in last 24h only)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: storiesData } = await supabase
          .from("stories")
          .select("*")
          .gt("created_at", twentyFourHoursAgo)
          .order("created_at", { ascending: false });

        if (storiesData && storiesData.length > 0) {
          setStories(storiesData);
        }

        // C. Posts & Notices
        const { data: postsData } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        const { data: noticesData } = await supabase
          .from("notices")
          .select("*")
          .order("is_pinned", { ascending: false });

        if (postsData) setPosts(postsData);
        if (noticesData) setNotices(noticesData);
      } catch (err) {
        console.error("Live feed sync error:", err);
      } finally {
        setMounted(true);
      }
    }

    loadFeedData();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Post Creator Handler
  const handleCreatePost = async () => {
    if (!newPostCaption.trim() || !currentUser) return;
    setIsPosting(true);

    const newPost = {
      author_name: currentUser.full_name,
      author_username: currentUser.username,
      author_avatar: currentUser.avatar_url,
      type: "meme",
      location: "IPEC Campus, Ghaziabad",
      caption: newPostCaption.trim(),
      course: currentUser.course || "B.Tech",
      semester: "Sem 3",
      likes_count: 0,
      comments_count: 0,
    };

    try {
      const { data, error } = await supabase.from("posts").insert([newPost]).select().single();
      if (!error && data) {
        setPosts(prev => [data, ...prev]);
        setNewPostCaption("");
      }
    } catch (e) {
      console.error("Post creation error:", e);
    } finally {
      setIsPosting(false);
    }
  };

  // 100% Uncropped Full Story Upload (Multiple Stories Supported)
  const handleStoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploadingStory(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const fullUncroppedMedia = reader.result as string;
      const newStoryRecord = {
        author_name: currentUser.full_name,
        author_username: currentUser.username,
        author_avatar: currentUser.avatar_url,
        media_url: fullUncroppedMedia, // ✅ Pure Full Image without any crop
        caption: "Campus Story",
      };

      try {
        const { data, error } = await supabase.from("stories").insert([newStoryRecord]).select().single();
        if (!error && data) {
          setStories((prev) => [data, ...prev]);
        }
      } catch (err) {
        console.error("Story upload failed:", err);
      } finally {
        setIsUploadingStory(false); // ✅ Upload hote hi ring normal ho jayegi
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Story Like Handler (Saves in Supabase)
  const handleToggleStoryLike = async () => {
    if (!currentStory || !currentUser) return;
    const nextState = !isStoryLiked;
    setIsStoryLiked(nextState);

    try {
      if (nextState) {
        await supabase.from("story_likes").insert([{ story_id: currentStory.id, username: currentUser.username }]);
        await supabase.from("stories").update({ likes_count: (currentStory.likes_count || 0) + 1 }).eq("id", currentStory.id);
      }
    } catch (e) {
      console.error("Story like error:", e);
    }
  };

  // Story Reply / Comment Handler (Saves in Supabase)
  const handleSendStoryReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyReplyText.trim() || !currentStory || !currentUser) return;

    const replyPayload = {
      story_id: currentStory.id,
      author_name: currentUser.full_name,
      author_username: currentUser.username,
      comment_text: storyReplyText.trim(),
    };

    try {
      await supabase.from("story_comments").insert([replyPayload]);
      setStoryReplyText("");
      alert("Reply sent to @" + currentStory.author_username);
    } catch (err) {
      console.error("Reply sending failed:", err);
    }
  };

  // Fetch Comments for current story
  useEffect(() => {
    if (!currentStory?.id) return;
    async function loadComments() {
      const { data } = await supabase.from("story_comments").select("*").eq("story_id", currentStory.id).order("created_at", { ascending: true });
      if (data) setStoryComments(data);
    }
    loadComments();
  }, [currentStory?.id, isCommentsSheetOpen]);

  const handleShareStory = () => {
    setIsShareModalOpen(true); // Timer ruk jayega
    if (navigator.share) {
      navigator.share({
        title: "IPECapture Story",
        text: `Check out @${currentStory?.author_username}'s campus story!`,
        url: window.location.href,
      }).finally(() => {
        setIsShareModalOpen(false); // Band hote hi timer wapas chalega
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Story link copied to clipboard!");
      setTimeout(() => setIsShareModalOpen(false), 1500);
    }
  };

  // 1. Real Story Deletion from Supabase Database
  const handleDeleteStory = async () => {
    if (!currentStory) return;
    try {
      await supabase.from("stories").delete().eq("id", currentStory.id);
      setStories((prev) => prev.filter((s) => s.id !== currentStory.id));
      setIsMenuOpen(false);
      goToNextStory(); // Next story par jump karega ya close hoga
    } catch (err) {
      console.error("Story delete error:", err);
    }
  };

  // Real Database Report Submission in Supabase
  const handleSubmitCampusReport = async (reason: string) => {
    if (!currentStory || !currentUser) return;

    try {
      await supabase.from("story_reports").insert([{
        story_id: currentStory.id,
        reported_username: currentStory.author_username,
        reporter_username: currentUser.username,
        reason: reason,
      }]);
    } catch (err) {
      console.error("Report save error:", err);
    } finally {
      setReportStep("success");
    }
  };

  // Owner comment/reply submission
  const handleOwnerCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerReplyInput.trim() || !currentStory || !currentUser) return;

    const payload = {
      story_id: currentStory.id,
      author_name: currentUser.full_name,
      author_username: currentUser.username,
      comment_text: ownerReplyInput.trim(),
    };

    const { data, error } = await supabase.from("story_comments").insert([payload]).select().single();
    if (!error && data) {
      setStoryComments((prev) => [...prev, data]);
      setOwnerReplyInput("");
    }
  };

  // Like Toggle
  const toggleLike = (postId: string) => {
    setLikedPostIds(prev => {
      const next = new Set(prev);
      const isLiked = next.has(postId);
      if (isLiked) {
        next.delete(postId);
        setPosts(pList => pList.map(p => p.id === postId ? { ...p, likes_count: p.likes_count - 1 } : p));
      } else {
        next.add(postId);
        setPosts(pList => pList.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
      }
      return next;
    });
  };

  // Bookmark Toggle
  const toggleBookmark = (postId: string) => {
    setBookmarkedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  // Flash Skeleton Screen (Accurately synced with network)
  if (!mounted) {
    return <FeedSkeleton />;
  }

  // Filtered Posts Logic
  const filteredPosts = posts.filter((post) => {
    if (activeMoodTab === "memes") return post.type === "meme";
    if (activeMoodTab === "pyqs") return post.type === "academic";
    if (activeMoodTab === "my_course") {
      const studentCourse = currentUser?.course || "B.Tech";
      return post.course?.includes(studentCourse) || post.course?.includes("General");
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-zinc-50 flex justify-center selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-black transition-colors">
      
      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-black text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-md">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are currently offline. Running cached campus view.</span>
        </div>
      )}

      {/* 1. Left Expandable Sidebar (Desktop) */}
      <LeftSidebar currentTab={currentNavTab} onTabChange={setCurrentNavTab} unreadCount={2} />

      {/* Main Layout Container */}
      <div className="w-full max-w-7xl flex justify-between md:pl-16 group-hover:md:pl-60 transition-all duration-300">
        
        {/* ========================================================= */}
        {/* CENTER FEED STREAM (Instagram Style Focus)               */}
        {/* ========================================================= */}
        <main className="flex-1 max-w-[620px] mx-auto p-4 sm:p-6 pb-20 md:pb-8 space-y-5">
          
          {/* Mobile Top Header */}
          <div className="md:hidden flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <span className="font-extrabold text-lg tracking-tight">
              <span className="text-[#0F2952] dark:text-zinc-100">IPEC</span>
              <span className="text-[#0284C7]">apture</span>
            </span>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-zinc-500" />
              {/* Profile Circle: Blue Ring ONLY IF HAS ACTIVE STORY */}
              <div className={userHasActiveStory ? "p-[2px] rounded-full bg-gradient-to-tr from-[#0F2952] via-[#0284C7] to-[#38BDF8]" : "p-[1px] rounded-full border border-zinc-200 dark:border-zinc-800"}>
                <UserAvatar avatarUrl={currentUser?.avatar_url} name={currentUser?.full_name} size="sm" />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 24-HOUR CAMPUS STORIES TRAY (TOP OF THE FILTERS)         */}
          {/* ========================================================= */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 bg-zinc-50/50 dark:bg-zinc-900/40 select-none">
            <input 
              type="file" 
              ref={storyInputRef} 
              onChange={handleStoryFileSelected}
              accept="image/*" 
              className="hidden" 
            />

            <div className="flex items-center gap-3.5 overflow-x-auto scrollbar-none py-2.5 px-1">
              
              {/* CURRENT USER STORY (RESPONSIVE + ROTATING CUTS UPLOAD RING) */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 select-none">
                <div className="relative flex items-center justify-center">
                  
                  {/* Real Instagram Single-Arc Handoff Uploading Ring */}
                  {isUploadingStory && (
                    <svg
                      className="absolute -inset-1.5 w-[68px] h-[68px] pointer-events-none z-10"
                      viewBox="0 0 100 100"
                    >
                      <defs>
                        <linearGradient id="ipecRealStoryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0F2952" />
                          <stop offset="40%" stopColor="#0284C7" />
                          <stop offset="100%" stopColor="#38BDF8" />
                        </linearGradient>
                      </defs>
                      <style>{`
                        @keyframes igSingleArcRotation {
                          0% { transform: rotate(-90deg); }
                          100% { transform: rotate(270deg); }
                        }
                        @keyframes igSingleArcMorph {
                          0% {
                            /* Starting me chota cut */
                            stroke-dasharray: 25 255;
                            stroke-dashoffset: 0;
                          }
                          45% {
                            /* Tezi se sweep hokar bada arc banta hai */
                            stroke-dasharray: 215 65;
                            stroke-dashoffset: -35;
                          }
                          75% {
                            /* Top par pahunch kar gap ek dam chhota ho jata hai */
                            stroke-dasharray: 250 30;
                            stroke-dashoffset: -120;
                          }
                          100% {
                            /* Tail catch-up karti hai aur wapas chota cut ban kar loop restart hota hai */
                            stroke-dasharray: 25 255;
                            stroke-dashoffset: -276;
                          }
                        }
                        .ig-single-chaser-arc {
                          transform-origin: 50% 50%;
                          animation: igSingleArcRotation 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite,
                                     igSingleArcMorph 1.5s ease-in-out infinite;
                        }
                      `}</style>
                      <circle
                        className="ig-single-chaser-arc"
                        cx="50"
                        cy="50"
                        r="44"
                        fill="none"
                        stroke="url(#ipecRealStoryGradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {/* Story Watch Circle */}
                  <div 
                    onClick={() => {
                      if (isUploadingStory) return;
                      if (userHasActiveStory) {
                        setActiveStoryUsername(currentUser?.username);
                        setCurrentStoryIndex(0);
                      } else {
                        storyInputRef.current?.click();
                      }
                    }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform sm:hover:scale-105 active:scale-95 duration-200 cursor-pointer ${
                      isUploadingStory
                        ? "p-[2.5px] opacity-75"
                        : userHasActiveStory 
                        ? "p-[2.5px] bg-gradient-to-tr from-[#0F2952] via-[#0284C7] to-[#38BDF8]" 
                        : "p-[1.5px] border-2 border-dashed border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px] overflow-hidden flex items-center justify-center">
                      <UserAvatar avatarUrl={currentUser?.avatar_url} name={currentUser?.full_name} size="md" />
                    </div>
                  </div>

                  {/* '+' Button (Uploading ke time mini-spinner banega, normal time '+' icon) */}
                  <button
                    type="button"
                    title="Add another story"
                    disabled={isUploadingStory}
                    onClick={(e) => {
                      e.stopPropagation();
                      storyInputRef.current?.click();
                    }}
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0284C7] hover:bg-[#0ea5e9] text-white flex items-center justify-center border-2 border-white dark:border-black shadow-md cursor-pointer transition hover:scale-110 active:scale-90"
                  >
                    {isUploadingStory ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    ) : (
                      <Plus className="w-2.5 h-2.5 stroke-[3]" />
                    )}
                  </button>

                </div>
                
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate max-w-[62px] text-center">
                  {isUploadingStory ? "Posting..." : userHasActiveStory ? "Your Story" : "Add Story"}
                </span>
              </div>

              {/* Other Campus Students with Active Stories */}
              {Object.keys(storiesByUser).filter(u => u !== currentUser?.username).map((username) => {
                const userStories = storiesByUser[username];
                const firstStory = userStories[0];
                return (
                  <div 
                    key={username} 
                    onClick={() => {
                      setActiveStoryUsername(username);
                      setCurrentStoryIndex(0);
                    }}
                    className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
                  >
                    <div className="w-14 h-14 rounded-full p-[2.5px] bg-gradient-to-tr from-[#0F2952] via-[#0284C7] to-[#38BDF8] flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
                      <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px] overflow-hidden flex items-center justify-center">
                        <UserAvatar avatarUrl={firstStory.author_avatar} name={firstStory.author_name} size="md" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 truncate max-w-[64px]">
                      {username.split("_")[0]}
                    </span>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Feed Mood Switcher Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: "all", label: "All Campus" },
              { id: "my_course", label: currentUser?.course || "B.Tech" },
              { id: "pyqs", label: "Solved PYQs" },
              { id: "memes", label: "Campus Memes" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMoodTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition ${
                  activeMoodTab === tab.id
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm font-semibold"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Creator Box */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3">
            <div className="flex items-center gap-3">
              {/* Profile Circle: Blue Ring ONLY IF HAS ACTIVE STORY */}
              <div className={userHasActiveStory ? "p-[2px] rounded-full bg-gradient-to-tr from-[#0F2952] via-[#0284C7] to-[#38BDF8] shrink-0" : "p-[1px] rounded-full border border-zinc-200 dark:border-zinc-800 shrink-0"}>
                <UserAvatar avatarUrl={currentUser?.avatar_url} name={currentUser?.full_name} size="md" />
              </div>
              <input
                type="text"
                value={newPostCaption}
                onChange={(e) => setNewPostCaption(e.target.value)}
                placeholder={`What's on your mind, ${currentUser?.full_name?.split(" ")[0] || "Hitesh"}?`}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80 text-xs text-zinc-500">
              <div className="flex items-center gap-4">
                <button 
                  type="button" 
                  onClick={() => storyInputRef.current?.click()}
                  className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition"
                >
                  <Camera className="w-4 h-4 text-[#0284C7]" />
                  <span>Post Story (24h)</span>
                </button>
                <button type="button" className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Upload PDF</span>
                </button>
              </div>
              <button 
                type="button" 
                disabled={isPosting || !newPostCaption.trim()}
                onClick={handleCreatePost}
                className="bg-black text-white dark:bg-white dark:text-black text-xs font-semibold px-4 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-40 transition flex items-center gap-1.5"
              >
                {isPosting && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>Post</span>
              </button>
            </div>
          </div>

          {/* POSTS STREAM */}
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const isLiked = likedPostIds.has(post.id);
              const isBookmarked = bookmarkedPostIds.has(post.id);
              const postAuthorHasStory = activeStoryAuthors.has(post.author_username);

              return (
                <article
                  key={post.id}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                >
                  {/* Post Author Header */}
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar: Blue ring ONLY IF AUTHOR HAS ACTIVE STORY */}
                      <div className={postAuthorHasStory ? "p-[2px] rounded-full bg-gradient-to-tr from-[#0F2952] via-[#0284C7] to-[#38BDF8]" : "p-[1px] rounded-full border border-zinc-200 dark:border-zinc-800"}>
                        <UserAvatar avatarUrl={post.author_avatar} name={post.author_name} size="sm" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-zinc-950 dark:text-zinc-50">{post.author_name}</span>
                          {post.type === "academic" && <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7]" />}
                        </div>
                        <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{post.location || "IPEC Campus"}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">2h ago</span>
                  </div>

                  {/* POST CONTENT: TYPE A - MEME / CAMPUS MOMENT */}
                  {post.type === "meme" && (
                    <div className="space-y-3">
                      <div className="px-4 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        {post.caption}
                      </div>
                      <div className="h-64 sm:h-72 w-full bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center p-6 text-center border-y border-zinc-100 dark:border-zinc-900">
                        <span className="font-mono text-xs text-zinc-400 mb-2">[ Campus Life Photograph / Meme ]</span>
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 max-w-sm italic">
                          &ldquo;Attendance 74.9% vs ERP portal sessional admit card gatekeeper&rdquo;
                        </p>
                      </div>
                    </div>
                  )}

                  {/* POST CONTENT: TYPE B - ACADEMIC SOLVED PAPER */}
                  {post.type === "academic" && (
                    <div className="p-4 space-y-3">
                      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#0F2952] dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                            {post.subject_code}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">{post.file_size}</span>
                        </div>
                        <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">{post.subject_name}</h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">{post.caption}</p>
                        
                        <div className="pt-2 flex gap-2">
                          <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Read in Browser</span>
                          </button>
                          <button type="button" className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interaction Bar */}
                  <div className="p-3.5 pt-2 flex items-center justify-between text-zinc-700 dark:text-zinc-300">
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <button 
                        type="button" 
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition ${isLiked ? "text-rose-500 font-bold" : "hover:text-rose-500"}`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
                        <span>{post.likes_count}</span>
                      </button>
                      <button type="button" className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments_count}</span>
                      </button>
                      <button type="button" className="hover:text-black dark:hover:text-white transition">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => toggleBookmark(post.id)}
                      className={`transition ${isBookmarked ? "text-black dark:text-white" : "text-zinc-400 hover:text-black dark:hover:text-white"}`}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

        </main>

        {/* 3. Right Sidebar (Gradient ring passed conditionally) */}
        <RightSidebar notices={notices} currentUser={currentUser} userHasActiveStory={userHasActiveStory} />

      </div>

      {/* ========================================================= */}
      {/* INSTAGRAM-STYLE STORY CREATOR STUDIO (TEXT, BADGES, TONE) */}
      {/* ========================================================= */}
      {isEditorOpen && editorRawImage && (
        <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-150">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Caveat:wght@600&family=Courier+Prime:ital,wght@0,700;1,750&family=Playfair+Display:ital,wght@1,600&family=Bebas+Neue&family=Comfortaa:wght@700&family=Cinzel:wght@600&display=swap');
          `}</style>
          <div className="relative w-full h-full sm:h-[650px] sm:max-w-sm rounded-none sm:rounded-3xl border-0 sm:border border-zinc-800 bg-black flex flex-col justify-between overflow-hidden shadow-2xl">
            
            {/* Top Toolbar: [✕ Cancel] -------------------- [Aa New Text] [✨ Tone Filter] */}
            <header className="relative z-30 w-full px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-auto select-none">
              
              {/* Left Action: Close / Discard Button */}
              <button
                type="button"
                onClick={() => {
                  setIsEditorOpen(false);
                  setStoryTexts([]);
                  setStoryBadge(null);
                  setStoryFilter("Original");
                }}
                aria-label="Discard Story"
                className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 active:bg-black/90 text-white/90 hover:text-white backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                <X className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-200 group-hover:rotate-90" />
              </button>

              {/* Right Utility Actions: [Add Text] [Tone / Filter] */}
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* 1. Add Brand New Text Action Button */}
                <button
                  type="button"
                  onClick={handleAddNewText}
                  title="Add New Text Layer"
                  className="relative group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 active:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                >
                  <Type className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:scale-110" />
                </button>

                {/* 2. Color Tone Filter Switcher with Middle Toast */}
                <button
                  type="button"
                  onClick={handleFilterToggle}
                  title="Cycle Photo Tone"
                  className={`group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md border transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg cursor-pointer ${
                    storyFilter !== "Original"
                      ? "bg-[#0F2952]/90 border-[#0284C7]/60 text-[#38BDF8]"
                      : "bg-black/40 hover:bg-black/70 active:bg-black/90 text-white/90 hover:text-white border-white/10"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:rotate-180" />
                </button>

              </div>
            </header>

            {/* Central Viewport with Image & Live Layers */}
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 overflow-hidden">
              <img
                src={editorRawImage}
                alt="Story preview"
                className={`w-full h-full object-contain transition-all duration-200 ${
                  storyFilter === "grayscale" ? "grayscale" : storyFilter === "warm" ? "sepia-[0.35] saturate-125" : ""
                }`}
              />

              {/* 1. Center Floating Filter Toast (1.4s me fade out hoga) */}
              {filterToast && (
                <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center animate-in fade-in zoom-in-95 duration-150">
                  <span className="px-5 py-2 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white font-mono font-bold text-xs tracking-wider shadow-2xl">
                    {filterToast}
                  </span>
                </div>
              )}

              {/* 2. Campus Badge Preview */}
              {storyBadge && (
                <div className="absolute top-16 z-20 px-3.5 py-1.5 rounded-full bg-[#0F2952]/90 border border-[#0284C7]/50 text-[#38BDF8] text-xs font-mono font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                  <span>{storyBadge}</span>
                  <X className="w-3 h-3 cursor-pointer text-white/70 hover:text-white" onClick={() => setStoryBadge(null)} />
                </div>
              )}

              {/* Debug render log */}
              {(() => {
                console.log("🎨 [Rendering Canvas Texts]:", {
                  count: storyTexts.length,
                  items: storyTexts,
                  isTextEditing: isTextEditing
                });
                return null;
              })()}

              {/* 3. Multi-Texts (Free-drag anywhere + Mobile 1-Tap / Desktop Double-Click to Edit) */}
              {storyTexts.map((item, index) => {
                const isOverTrashZone = isDraggingText && item.y > 78 && Math.abs(item.x - 50) < 22;
                const currentScale = item.scale || 1;

                if (isTextEditing && editingTextId === item.id) return null;

                return (
                  <div
                    key={item.id || `story-text-layer-${index}`}
                    onPointerDown={(e) => handleDragText(item.id, e)}
                    ref={(el) => {
                      if (!el) return;
                      el.onwheel = (e: WheelEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setStoryTexts((prev) =>
                          prev.map((t) => {
                            if (t.id !== item.id) return t;
                            if (e.shiftKey) {
                              return { ...t, rotation: ((t as any).rotation || 0) + (e.deltaY < 0 ? 6 : -6) }; // 🔄 Shift + Scroll se rotate
                            }
                            return { ...t, scale: Math.min(4.5, Math.max(0.4, (t.scale || 1) * (e.deltaY < 0 ? 1.06 : 0.94))) };
                          })
                        );
                      };
                    }}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `translate(-50%, -50%) scale(${currentScale * (isOverTrashZone ? 0.72 : 1)}) rotate(${((item as any).rotation || 0) + (isOverTrashZone ? -6 : 0)}deg)`,
                      touchAction: "none",
                    }}
                    className="absolute z-20 cursor-grab active:cursor-grabbing select-none text-center w-full max-w-[86%] sm:max-w-[80%] md:max-w-[75%] pointer-events-auto will-change-transform transition-transform duration-75"
                  >
                    {/* 
                      🔥 INSTAGRAM STEPPED CONNECTED PILLS:
                      `inline` + `box-decoration-break: clone` se har line ka box alag size ka banta hai
                      aur aapas mein jud kar organic cloud/bubble shape banata hai.
                    */}
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
                      } ${
                        item.style === "modern"
                          ? "[font-family:'Oswald',sans-serif] font-medium tracking-normal uppercase"
                          : item.style === "signature"
                          ? "[font-family:'Caveat',cursive] font-semibold tracking-normal"
                          : item.style === "editor"
                          ? "[font-family:'Courier_Prime',monospace] font-bold tracking-tight"
                          : item.style === "poster"
                          ? "[font-family:Georgia,serif] font-black tracking-tighter uppercase italic"
                          : item.style === "bubble"
                          ? "[font-family:'Comfortaa',cursive,sans-serif] font-bold tracking-tight lowercase first-letter:uppercase"
                          : item.style === "deco"
                          ? "[font-family:'Montserrat',sans-serif] font-extralight tracking-[0.25em] uppercase"
                          : item.style === "squeeze"
                          ? "[font-family:'Bebas_Neue',sans-serif] tracking-wider uppercase inline-block scale-y-125"
                          : item.style === "strong"
                          ? "font-sans [font-family:Impact,sans-serif] italic uppercase tracking-tight"
                          : item.style === "typewriter"
                          ? "[font-family:'Courier_Prime',monospace] font-normal tracking-widest"
                          : item.style === "meme"
                          ? `font-sans [font-family:Impact,sans-serif] font-black uppercase tracking-wider ${
                              !item.hasBox ? "[text-shadow:_2px_2px_0px_#000]" : ""
                            }`
                          : item.style === "elegant"
                          ? "[font-family:'Playfair_Display',serif] italic font-medium tracking-wide"
                          : item.style === "directional"
                          ? "[font-family:'Cinzel',serif] font-bold tracking-[0.2em] uppercase underline decoration-2 underline-offset-4"
                          : item.style === "literature"
                          ? "[font-family:'Playfair_Display',serif] font-normal tracking-normal"
                          : "font-sans font-black tracking-tight"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                );
              })}

              {isDraggingText && (
                <div
                  style={{ touchAction: "none" }}
                  className="absolute bottom-24 sm:bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex items-center justify-center animate-in fade-in zoom-in-90 slide-in-from-bottom-4 duration-150 ease-out will-change-transform select-none"
                >
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full border transition-all duration-200 ease-out backdrop-blur-xl ${
                        isOverTrash
                          ? "scale-115 sm:scale-120 bg-zinc-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-950 border-zinc-700/80 dark:border-zinc-300/80 shadow-xl"
                          : "scale-100 bg-zinc-950/75 dark:bg-black/75 text-zinc-300 dark:text-zinc-200 border-zinc-700/50 dark:border-zinc-800/80 shadow-lg"
                      }`}
                    >
                      <Trash2
                        className={`w-5 h-5 sm:w-6 sm:h-6 md:w-6.5 md:h-6.5 transition-all duration-150 ease-out stroke-[2] ${
                          isOverTrash
                            ? "scale-105 text-white dark:text-zinc-950"
                            : "scale-100 text-zinc-300 dark:text-zinc-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Text Input Modal when 'Aa' is active */}
              {isTextEditing && (
                <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex flex-col justify-between p-6 animate-in fade-in duration-150">
                  <div className="flex justify-between items-center text-white">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTextEditing(false);
                        setEditingTextId(null);
                        setActiveInputText("");
                      }}
                      className="bg-transparent border-none p-0 text-sm sm:text-base font-medium text-white/85 hover:text-white dark:text-zinc-200 dark:hover:text-white transition-all active:scale-95 cursor-pointer outline-none ring-0 shadow-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsTextEditing(false)}
                      className="text-xs font-bold px-3 py-1 bg-white text-black rounded-full"
                    >
                      Done
                    </button>
                  </div>

                  <div className="flex-1 flex items-center justify-center w-full px-4 text-center">
                    <div className="w-full text-center">
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        role="textbox"
                        autoFocus
                        data-placeholder="Type campus vibe..."
                        ref={(el) => {
                          if (el && !el.dataset.ready) {
                            el.innerText = activeInputText;
                            el.dataset.ready = "true";
                            // Cursor end par place karega
                            const range = document.createRange();
                            const sel = window.getSelection();
                            range.selectNodeContents(el);
                            range.collapse(false);
                            sel?.removeAllRanges();
                            sel?.addRange(range);
                          }
                        }}
                        onInput={(e) => setActiveInputText(e.currentTarget.innerText)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            document.execCommand("insertLineBreak");
                            handleFinishText();
                          }
                        }}
                        style={{ 
                          lineHeight: 1.35, 
                          whiteSpace: "pre-wrap",
                          backgroundColor: textHasBox ? (selectedTextColor || "#09090b") : "transparent",
                          color: textHasBox
                            ? ((hex) => {
                                const h = (hex || "#000000").replace("#", "");
                                const r = parseInt(h.substring(0, 2), 16) || 0;
                                const g = parseInt(h.substring(2, 4), 16) || 0;
                                const b = parseInt(h.substring(4, 6), 16) || 0;
                                return (r * 299 + g * 587 + b * 114) / 1000 >= 145 ? "#000000" : "#ffffff";
                              })(selectedTextColor)
                            : (selectedTextColor || "#ffffff"),
                        }}
                        className={`inline text-center text-xl sm:text-2xl outline-none border-none ring-0 max-w-[85%] break-words whitespace-pre-wrap leading-[1.3] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] ${
                          textHasBox
                            ? "px-3.5 py-1.5 rounded-2xl shadow-none"
                            : "drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] px-2 py-1"
                        } ${
                          textStyleMode === "modern" ? "[font-family:'Oswald',sans-serif] font-medium uppercase" :
                          textStyleMode === "signature" ? "[font-family:'Caveat',cursive] font-semibold" :
                          textStyleMode === "editor" ? "[font-family:'Courier_Prime',monospace] font-bold" :
                          textStyleMode === "poster" ? "[font-family:Georgia,serif] font-black italic uppercase" :
                          textStyleMode === "bubble" ? "[font-family:'Comfortaa',cursive] font-bold" :
                          textStyleMode === "deco" ? "[font-family:'Montserrat',sans-serif] tracking-[0.2em] uppercase" :
                          textStyleMode === "squeeze" ? "[font-family:'Bebas_Neue',sans-serif] uppercase" :
                          textStyleMode === "strong" ? "font-sans [font-family:Impact,sans-serif] italic uppercase" :
                          textStyleMode === "typewriter" ? "[font-family:'Courier_Prime',monospace]" :
                          textStyleMode === "meme" ? "[font-family:Impact,sans-serif] font-black uppercase" :
                          textStyleMode === "elegant" ? "[font-family:'Playfair_Display',serif] italic font-medium" :
                          textStyleMode === "directional" ? "[font-family:'Cinzel',serif] font-bold uppercase underline" :
                          textStyleMode === "literature" ? "[font-family:'Playfair_Display',serif]" :
                          "font-sans font-bold"
                        }`}
                      />
                      </div>
                  </div>

  
                  {/* 🎨 HORIZONTAL COLOR PALETTE (Rainbow Circle par click karne se aayega) */}
                  {/* 🎨 INSTAGRAM 3-PAGE COLOR PALETTE WITH < > & 3 DOTS */}
                  {isColorPickerOpen && (
                    <div className="w-full max-w-sm sm:max-w-md mx-auto pb-3 flex flex-col items-center justify-center gap-1.5 select-none">
                      
                      {/* Swatches Row with Very Small < > Arrows */}
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 w-full max-w-sm px-1">
                        
                        {/* Left Chevron < (Page 1 par lock/dimmed) */}
                        <button
                          type="button"
                          disabled={colorPalettePage === 0}
                          onClick={() => setColorPalettePage((p) => Math.max(0, p - 1))}
                          className={`p-0.5 transition-all active:scale-90 ${
                            colorPalettePage === 0 
                              ? "opacity-20 cursor-not-allowed text-zinc-500" 
                              : "text-white/90 hover:text-white cursor-pointer hover:scale-110"
                          }`}
                        >
                          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                        </button>

                        {/* Unique Non-Repeating Swatches (9 Colors per Page) */}
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                          {(
                            colorPalettePage === 0
                              ? ["#ffffff", "#000000", "#38bdf8", "#22c55e", "#f59e0b", "#f97316", "#ef4444", "#ec4899", "#a855f7"] // Page 1: Classic Rainbow
                              : colorPalettePage === 1
                              ? ["#d4a373", "#78350f", "#6ee7b7", "#c084fc", "#fb7185", "#93c5fd", "#fdba74", "#86efac", "#e879f9"] // Page 2: Warm Sand, Brown & Pastels
                              : ["#06b6d4", "#84cc16", "#991b1b", "#047857", "#ca8a04", "#d946ef", "#1d4ed8", "#65a30d", "#312e81"] // Page 3: Neon, Deep Earth & Jewel
                          ).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setSelectedTextColor(c);
                                if (editingTextId) {
                                  setStoryTexts((prev) => prev.map((t) => t.id === editingTextId ? { ...t, color: c } : t));
                                }
                              }}
                              style={{ backgroundColor: c }}
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full shrink-0 border-2 transition-all duration-150 active:scale-90 ${
                                selectedTextColor.toLowerCase() === c.toLowerCase()
                                  ? "scale-115 border-white shadow-md ring-1 ring-black/40"
                                  : "border-white/30 hover:border-white/70"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Right Chevron > (Page 3 par lock/dimmed) */}
                        <button
                          type="button"
                          disabled={colorPalettePage === 2}
                          onClick={() => setColorPalettePage((p) => Math.min(2, p + 1))}
                          className={`p-0.5 transition-all active:scale-90 ${
                            colorPalettePage === 2 
                              ? "opacity-20 cursor-not-allowed text-zinc-500" 
                              : "text-white/90 hover:text-white cursor-pointer hover:scale-110"
                          }`}
                        >
                          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* 3 Pagination Indicator Dots */}
                      <div className="flex items-center justify-center gap-1.5 pt-0.5">
                        {[0, 1, 2].map((dotIdx) => (
                          <span
                            key={dotIdx}
                            onClick={() => setColorPalettePage(dotIdx)}
                            className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${
                              colorPalettePage === dotIdx
                                ? "w-2.5 bg-white shadow-sm"
                                : "w-1 bg-white/35 hover:bg-white/60"
                            }`}
                          />
                        ))}
                      </div>

                    </div>
                  )}

                  <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1">
                    {/* 'A' Background Box Toggle Button */}
                    <button
                      type="button"
                      title="Toggle Text Background"
                      onClick={() => {
                        const nextBox = !textHasBox;
                        setTextHasBox(nextBox);
                        if (editingTextId) {
                          setStoryTexts((prev: any) =>
                            prev.map((t: any) => (t.id === editingTextId ? { ...t, hasBox: nextBox } : t))
                          );
                        }
                      }}
                      style={textHasBox ? {
                        backgroundColor: selectedTextColor || "#000000",
                        color: ["#ffffff", "#eab308", "#fde047"].includes((selectedTextColor || "").toLowerCase()) ? "#000000" : "#ffffff",
                      } : undefined}
                      className={`w-6 h-6 sm:w-6.5 sm:h-6.5 shrink-0 rounded-[7px] flex items-center justify-center transition-all duration-150 active:scale-90 select-none ${
                        textHasBox
                          ? "shadow-md border border-white/25"
                          : "border-[1.8px] border-white text-white bg-transparent"
                      }`}
                    >
                      <span className="font-sans font-bold text-xs sm:text-[13px] leading-none">A</span>
                    </button>

                    {/* 🌈 RAINBOW COLOR WHEEL BUTTON (Between 'A' & Fonts) */}
                    <button
                      type="button"
                      title="Color Picker"
                      onClick={() => setIsColorPickerOpen((prev) => !prev)}
                      style={{
                        background: "conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)",
                      }}
                      className={`w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-full flex items-center justify-center p-[2px] transition-all duration-150 active:scale-90 cursor-pointer ${
                        isColorPickerOpen ? "scale-110 ring-2 ring-white" : ""
                      }`}
                    >
                      <div 
                        className="w-full h-full rounded-full border border-black/30" 
                        style={{ backgroundColor: selectedTextColor }} 
                      />
                    </button>

                    <div className="h-5 w-[1px] bg-white/20 shrink-0 mx-0.5" />

                    {/* Font Styles ("classic", "modern", etc.) */}
                    {(["classic", "modern", "signature", "editor", "poster", "bubble", "deco", "squeeze", "strong", "typewriter", "meme", "elegant", "directional", "literature"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setTextStyleMode(m);
                          if (editingTextId) {
                            setStoryTexts((prev: any) =>
                              prev.map((t: any) => (t.id === editingTextId ? { ...t, style: m } : t))
                            );
                          }
                        }}
                        className={`text-[10px] sm:text-[11px] font-sans font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full capitalize whitespace-nowrap transition-all duration-150 ease-out shrink-0 select-none ${
                          textStyleMode === m
                            ? "bg-white text-zinc-950 shadow-sm scale-100"
                            : "bg-[#262626] text-zinc-300 hover:text-white hover:bg-[#333333] active:scale-95"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Bar: Badges Picker & "Post Story" Button */}
            <div className="p-4 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-3">

              {/* Mention & Location Bar */}
              <div className="flex items-center justify-center gap-12 sm:gap-16 py-1 select-none">
                {/* 1. Mention */}
                <button type="button" onClick={() => { setMentionModalTab("mention"); setIsMentionModalOpen(true); }} className="flex items-center gap-1.5 text-white active:scale-95 transition cursor-pointer">
                  <span className="font-sans font-bold text-[17px] leading-none text-white -mt-[1px]">@</span>
                  <span className="font-sans font-medium text-[13px] leading-none">Mention</span>
                </button>

                {/* 2. Location */}
                <button type="button" onClick={() => { setMentionModalTab("location"); setIsMentionModalOpen(true); }} className="flex items-center gap-1.5 text-white active:scale-95 transition cursor-pointer">
                  <svg className="w-[18px] h-[18px] text-white shrink-0 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 21c3.5-4.5 6.5-8.5 6.5-12a6.5 6.5 0 1 0-13 0c0 3.5 3 7.5 6.5 12z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="9" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                  <span className="font-sans font-medium text-[13px] leading-none">Location</span>
                </button>
              </div>

              {/* Post Story Primary Button */}
              <button
                type="button"
                onClick={handleFinalizeAndPostStory}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0F2952] to-[#0284C7] hover:opacity-90 active:scale-[0.99] text-white text-xs font-bold tracking-wide shadow-xl flex items-center justify-center gap-2 transition"
              >
                <span>Share to Story</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 📍 @Mention & Location Instagram Modal */}
            <StoryMentionModal
              isOpen={isMentionModalOpen}
              initialTab={mentionModalTab}
              onClose={() => setIsMentionModalOpen(false)}
              onSelectMention={(mention) => {
                const newItem = {
                  id: "txt_" + Date.now().toString(),
                  text: mention.text,
                  x: 50,
                  y: 45,
                  scale: 1,
                  hasBox: mention.hasBox,
                  style: mention.style,
                  color: "#09090b",
                };
                setStoryTexts((prev) => [...prev, newItem]);
              }}
              onSelectLocation={(loc) => {
                setStoryBadge(loc);
              }}
            />

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* INSTAGRAM / WHATSAPP MULTI-STORY VIEWER WITH REAL ACTIONS  */}
      {/* ========================================================= */}
      {activeStoryUsername && currentStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-0 sm:p-4 select-none">
          <div className="relative w-full h-full sm:h-[600px] sm:max-w-sm rounded-none sm:rounded-3xl overflow-hidden bg-black border-0 sm:border border-zinc-800 shadow-2xl flex flex-col justify-between">
            
            {/* Top Multi-Story Segmented Progress Bars (Instagram Status Line) */}
            <div className="p-4 pb-2 space-y-2.5 z-20 bg-gradient-to-b from-black/90 to-transparent">
              <div className="flex gap-1.5 w-full">
                {currentActiveUserStories.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                      style={{
                        width: idx < currentStoryIndex ? "100%" : idx === currentStoryIndex ? `${storyProgress}%` : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Author Info & Close */}
              <div className="flex items-center justify-between text-white pt-1">
                <div className="flex items-center gap-2">
                  <div className="p-[1.5px] rounded-full bg-gradient-to-tr from-[#0F2952] to-[#0284C7]">
                    <UserAvatar avatarUrl={currentStory.author_avatar} name={currentStory.author_name} size="sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none">{currentStory.author_name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">@{currentStory.author_username}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveStoryUsername(null);
                    setCurrentStoryIndex(0);
                  }}
                  className="text-white/80 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tap Left / Right Navigation Touch Zones (Invisible like Instagram) */}
            <div
              onClick={() => currentStoryIndex > 0 && setCurrentStoryIndex((i) => i - 1)}
              className="absolute left-0 top-16 bottom-20 w-1/3 z-10 cursor-pointer"
            />
            <div
              onClick={() => {
                if (currentStoryIndex < currentActiveUserStories.length - 1) {
                  setCurrentStoryIndex((i) => i + 1);
                } else {
                  setActiveStoryUsername(null);
                  setCurrentStoryIndex(0);
                }
              }}
              className="absolute right-0 top-16 bottom-20 w-2/3 z-10 cursor-pointer"
            />

            {/* Uncropped Full Image Display */}
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
              <img src={currentStory.media_url} alt="Story" className="w-full h-full object-contain" />
            </div>

            {/* ========================================================= */}
            {/* CONDITIONAL BOTTOM BAR: OWN STORY VS OTHERS' STORY        */}
            {/* ========================================================= */}
            <div className="p-3.5 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
              
              {/* CASE A: APNI STORY - Show Seen/Viewers Bar (No Like, No Message) */}
              {isOwnStory ? (
                <div
                  onClick={() => setIsViewersSheetOpen(true)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition cursor-pointer backdrop-blur-md border border-white/10 text-white"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-xs font-semibold">{storyViewers.length} Views</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-300">
                    <span>Swipe up for activity</span>
                    <span className="text-xs">↑</span>
                  </div>
                </div>
              ) : (
                /* CASE B: DOOSRO KI STORY - Show Message Box & Like Heart */
                <form onSubmit={handleSendStoryReply} className="flex items-center gap-2.5">
                  <input
                    type="text"
                    value={storyReplyText}
                    onChange={(e) => setStoryReplyText(e.target.value)}
                    placeholder={`Send message to @${currentStory.author_username}...`}
                    className="flex-1 bg-black/60 border border-zinc-700 focus:border-white rounded-full px-4 py-2 text-xs text-white placeholder:text-zinc-400 focus:outline-none transition backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={handleToggleStoryLike}
                    className="text-white hover:scale-110 active:scale-95 transition p-1"
                  >
                    <Heart className={`w-5 h-5 ${isStoryLiked ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                  </button>
                  <button type="submit" className="text-white hover:text-sky-400 transition p-1">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>

            {activeStoryUsername && currentStory && (
              <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-0 sm:p-4 select-none">
                
                <button
                  type="button"
                  onClick={() => {
                    setActiveStoryUsername(null);
                    setCurrentStoryIndex(0);
                    setIsViewersSheetOpen(false);
                    setIsCommentsSheetOpen(false);
                    setIsMenuOpen(false);
                  }}
                  className="hidden sm:flex fixed top-5 right-6 z-50 text-white/80 hover:text-white p-2 transition hover:scale-110"
                >
                  <X className="w-7 h-7" />
                </button>

                <button
                  type="button"
                  disabled={!canGoPrev}
                  onClick={goToPrevStory}
                  aria-label="Previous Story"
                  className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white mr-3 lg:mr-5 transition-all shrink-0 ${
                    !canGoPrev ? "opacity-20 cursor-not-allowed" : "opacity-90 hover:scale-110 active:scale-95 cursor-pointer"
                  }`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="relative w-full h-full sm:h-[650px] sm:max-w-sm rounded-none sm:rounded-3xl border-0 sm:border border-zinc-800 bg-black flex flex-col justify-between overflow-hidden shadow-2xl">
                  
                  <div className="p-4 pb-2 space-y-2.5 z-20 bg-gradient-to-b from-black/90 to-transparent">
                    <div className="flex gap-1.5 w-full">
                      {currentActiveUserStories.map((_, idx) => (
                        <div key={idx} className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full transition-[width] duration-75 ease-linear"
                            style={{
                              width: idx < currentStoryIndex ? "100%" : idx === currentStoryIndex ? `${storyProgress}%` : "0%",
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-white pt-1">
                      <div className="flex items-center gap-2">
                        <div className="p-[1.5px] rounded-full bg-gradient-to-tr from-[#0F2952] to-[#0284C7]">
                          <UserAvatar avatarUrl={currentStory.author_avatar} name={currentStory.author_name} size="sm" />
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-none">{currentStory.author_name}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">@{currentStory.author_username}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Background touch zone ko block karega
                            setIsMenuOpen(true);
                          }}
                          className="p-1.5 text-white hover:text-sky-400 transition hover:scale-110 active:scale-90 cursor-pointer relative z-30"
                          title="Options"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveStoryUsername(null);
                            setCurrentStoryIndex(0);
                            setIsViewersSheetOpen(false);
                            setIsCommentsSheetOpen(false);
                            setIsMenuOpen(false);
                          }}
                          className="sm:hidden p-1 text-white/80 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                    <img src={currentStory.media_url} alt="Story" className="w-full h-full object-contain" />
                  </div>

                  {/* ========================================================= */}
                  {/* EXACT BOTTOM BAR AS REQUESTED BY USER                     */}
                  {/* [Eye + count] -------------- [Comment] [Share]            */}
                  {/* ========================================================= */}
                  <div className="p-3.5 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                    {/* APNI STORY: Transparent Floating Icons (No Background Strip) */}
                    {isOwnStory ? (
                      <div className="flex items-center justify-between px-2 py-1 text-white">
                        
                        {/* Left: Eye Icon + View Count */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsViewersSheetOpen(true);
                            setIsCommentsSheetOpen(false);
                          }}
                          className="flex items-center gap-2 hover:text-sky-400 transition drop-shadow-md"
                        >
                          <Eye className="w-5 h-5 text-white" />
                          <span className="text-xs font-semibold font-mono">{storyViewers.length}</span>
                        </button>

                        {/* Right: Comment Icon + Share Icon */}
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCommentsSheetOpen(true);
                              setIsViewersSheetOpen(false);
                            }}
                            className="hover:text-sky-400 transition p-1 drop-shadow-md"
                            title="Comments & Replies"
                          >
                            <MessageCircle className="w-5 h-5 text-white" />
                          </button>

                          <button
                            type="button"
                            onClick={handleShareStory}
                            className="hover:text-sky-400 transition p-1 drop-shadow-md"
                            title="Share Story"
                          >
                            <Share2 className="w-5 h-5 text-white" />
                          </button>
                        </div>

                      </div>
                    ) : (
                      /* Others Story Bottom Bar: Like & Share Only */
                      <div className="flex items-center justify-end gap-5 px-3 py-1 text-white">
                        <button
                          type="button"
                          onClick={handleToggleStoryLike}
                          className="hover:scale-110 active:scale-90 transition p-1 drop-shadow-md"
                          title="Like Story"
                        >
                          <Heart className={`w-6 h-6 transition-colors ${isStoryLiked ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                        </button>

                        <button
                          type="button"
                          onClick={handleShareStory}
                          className="hover:text-sky-400 hover:scale-110 active:scale-90 transition p-1 drop-shadow-md"
                          title="Share Story"
                        >
                          <Share2 className="w-6 h-6 text-white" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ========================================================= */}
                  {/* VIEWERS BOTTOM SHEET (48% Height + Internal Scroll)       */}
                  {/* ========================================================= */}
                  {isViewersSheetOpen && (
                    <div className="absolute bottom-0 left-0 right-0 z-30 h-[48%] rounded-t-3xl bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-xl p-3.5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-bottom duration-200">
                      <div className="space-y-2 shrink-0">
                        <div className="w-8 h-1 bg-zinc-700 rounded-full mx-auto"></div>
                        <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 text-white">
                          <span className="text-xs font-bold font-mono">Seen by {storyViewers.length} students</span>
                          <button type="button" onClick={() => setIsViewersSheetOpen(false)} className="text-zinc-400 hover:text-white p-0.5">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 overflow-y-auto flex-1 my-2 pr-1.5 scrollbar-thin">
                        {storyViewers.length === 0 ? (
                          <p className="text-center text-zinc-500 text-xs py-4 font-mono">No views yet</p>
                        ) : (
                          storyViewers.map((viewer, idx) => (
                            <div key={viewer.viewer_username ? `${viewer.viewer_username}-${idx}` : `viewer-${idx}`} className="flex items-center justify-between text-white py-1 hover:bg-white/5 px-2 rounded-xl transition">
                              <div className="flex items-center gap-2.5">
                                <div className="relative">
                                  <UserAvatar avatarUrl={viewer.viewer_avatar} name={viewer.viewer_name} size="sm" />
                                  {viewer.hasLiked && (
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 flex items-center justify-center shadow-sm">
                                      <Heart className="w-2 h-2 fill-white text-white" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold leading-tight">{viewer.viewer_name}</p>
                                  <p className="text-[10px] text-zinc-400 font-mono">@{viewer.viewer_username}</p>
                                </div>
                              </div>
                              {viewer.hasLiked && <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />}
                            </div>
                          ))
                        )}
                      </div>

                      <button type="button" onClick={() => setIsViewersSheetOpen(false)} className="w-full text-xs font-semibold py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded-xl transition shrink-0">
                        Close
                      </button>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* COMMENTS BOTTOM SHEET (Exact 48% Height + Reply Input)    */}
                  {/* ========================================================= */}
                  {isCommentsSheetOpen && (
                    <div className="absolute bottom-0 left-0 right-0 z-30 h-[48%] rounded-t-3xl bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-xl p-3.5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-bottom duration-200">
                      <div className="space-y-2 shrink-0">
                        <div className="w-8 h-1 bg-zinc-700 rounded-full mx-auto"></div>
                        <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 text-white">
                          <span className="text-xs font-bold font-mono">Story Comments ({storyComments.length})</span>
                          <button type="button" onClick={() => setIsCommentsSheetOpen(false)} className="text-zinc-400 hover:text-white p-0.5">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-2 overflow-y-auto flex-1 my-2 pr-1.5 scrollbar-thin">
                        {storyComments.length === 0 ? (
                          <p className="text-center text-zinc-500 text-xs py-4 font-mono">No comments yet. Say something!</p>
                        ) : (
                          storyComments.map((c, idx) => (
                            <div key={c.id || `comment-${idx}`} className="text-xs text-white py-1 px-2 rounded-xl bg-white/5 space-y-0.5">
                              <span className="font-bold text-sky-400">@{c.author_username}: </span>
                              <span className="text-zinc-200">{c.comment_text}</span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Reply / Comment Input */}
                      <form onSubmit={handleOwnerCommentSubmit} className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                        <input
                          type="text"
                          value={ownerReplyInput}
                          onChange={(e) => setOwnerReplyInput(e.target.value)}
                          placeholder="Write a comment or reply..."
                          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                        />
                        <button type="submit" className="text-xs font-semibold px-3 py-1.5 bg-white text-black rounded-xl hover:bg-zinc-200 transition">
                          Send
                        </button>
                      </form>
                    </div>
                  )}

                  {/* THREE-DOTS ACTION SHEET (ISMENUOPEN) */}
                  {isMenuOpen && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                      }}
                      className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-150"
                    >
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="w-full rounded-t-3xl bg-zinc-950 border-t border-zinc-800 p-4 space-y-2 text-center animate-in slide-in-from-bottom duration-200 shadow-2xl"
                      >
                        <div className="w-8 h-1 bg-zinc-700 rounded-full mx-auto mb-2"></div>

                        {isOwnStory ? (
                          <>
                            <button
                              type="button"
                              onClick={handleDeleteStory}
                              className="w-full py-3 text-xs font-bold text-rose-500 hover:bg-rose-950/30 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Story</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIsMenuOpen(false);
                                handleShareStory();
                              }}
                              className="w-full py-3 text-xs font-semibold text-white hover:bg-zinc-900 rounded-xl transition flex items-center justify-center gap-2 border-t border-zinc-900 cursor-pointer"
                            >
                              <Share2 className="w-4 h-4" />
                              <span>Share Story</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsReportModalOpen(true);
                                setReportStep("reasons");
                              }}
                              className="w-full py-3 text-xs font-bold text-rose-500 hover:bg-rose-950/30 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <AlertTriangle className="w-4 h-4" />
                              <span>Report Inappropriate</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIsMenuOpen(false);
                                handleShareStory();
                              }}
                              className="w-full py-3 text-xs font-semibold text-white hover:bg-zinc-900 rounded-xl transition flex items-center justify-center gap-2 border-t border-zinc-900 cursor-pointer"
                            >
                              <Share2 className="w-4 h-4" />
                              <span>Share Story</span>
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsMenuOpen(false)}
                          className="w-full py-3 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition border-t border-zinc-800 pt-2.5 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* 2-STEP CAMPUS REPORT MODAL (REAL DB + IPECAPTURE UI)      */}
                  {/* ========================================================= */}
                  {isReportModalOpen && (
                    <div className="absolute inset-0 z-50 bg-zinc-950/95 backdrop-blur-xl p-4 flex flex-col justify-between animate-in fade-in duration-150 select-none">
                      
                      {/* STEP 1: SELECT REPORT REASON */}
                      {reportStep === "reasons" ? (
                        <div className="space-y-3 flex-1 flex flex-col">
                          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-white">
                            <button 
                              type="button" 
                              onClick={() => setIsReportModalOpen(false)} 
                              className="text-zinc-400 hover:text-white p-1"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <h4 className="text-xs font-bold font-mono">Report Story</h4>
                            <div className="w-5" />
                          </div>

                          <div className="pt-1">
                            <p className="text-xs font-bold text-white">Why are you reporting this story?</p>
                            <p className="text-[11px] text-zinc-400 mt-0.5">Your report is anonymous. Help keep our IPEC community safe.</p>
                          </div>

                          {/* Reasons List */}
                          <div className="space-y-1 overflow-y-auto flex-1 my-2 pr-1 scrollbar-thin">
                            {CAMPUS_REPORT_REASONS.map((reason) => (
                              <button
                                key={reason}
                                type="button"
                                onClick={() => handleSubmitCampusReport(reason)}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 active:bg-white/10 text-left transition group"
                              >
                                <span className="text-xs text-zinc-300 group-hover:text-white leading-snug pr-2">
                                  {reason}
                                </span>
                                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* STEP 2: FEEDBACK & CONFIRMATION */
                        <div className="flex-1 flex flex-col justify-between py-6 text-center animate-in zoom-in-95 duration-150">
                          <div className="space-y-3 pt-6">
                            {/* Green Success Badge */}
                            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                              <CheckCircle2 className="w-7 h-7" />
                            </div>

                            <h4 className="text-sm font-bold text-white">Thanks for letting us know</h4>
                            <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                              Your report has been securely saved. Our student moderators will review this story within 2 hours.
                            </p>

                            <div className="pt-4 border-t border-zinc-800/80 max-w-xs mx-auto text-left space-y-2">
                              <p className="text-xs font-semibold text-rose-400 hover:underline cursor-pointer flex items-center justify-between py-1">
                                <span>Block @{currentStory?.author_username}</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </p>
                              <p className="text-xs text-zinc-400 hover:text-white cursor-pointer flex items-center justify-between py-1">
                                <span>Review IPEC Community Guidelines</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </p>
                            </div>
                          </div>

                          {/* IPECapture Signature Blue Close Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setIsReportModalOpen(false);
                              setReportStep("reasons");
                            }}
                            className="w-full py-3 rounded-xl bg-[#0F2952] hover:bg-[#0284C7] text-white text-xs font-semibold shadow-lg transition active:scale-[0.99]"
                          >
                            Close
                          </button>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* Navigation Chevron: NEXT (>) - Mobile par hide, Laptop par active */}
                <button
                  type="button"
                  disabled={!canGoNext}
                  onClick={goToNextStory}
                  aria-label="Next Story"
                  className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white ml-3 lg:mr-0 ml-3 lg:ml-5 transition-all shrink-0 ${
                    !canGoNext ? "opacity-20 cursor-not-allowed" : "opacity-90 hover:scale-110 active:scale-95 cursor-pointer"
                  }`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

              </div>
            )}

                </div>
              </div>
            )}

        {/* 4. Mobile Bottom Navigation */}
        {!activeStoryUsername && (
          <MobileNav currentTab={currentNavTab} onTabChange={setCurrentNavTab} unreadCount={2} />
        )}

    </div>
  );
}