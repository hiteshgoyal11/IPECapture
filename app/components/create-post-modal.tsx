"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import PostCropScreen, { AspectRatioType } from "./post-crop-screen";
import PostEditScreen from "./post-edit-screen";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onPostCreated?: (newPost: any) => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  onPostCreated,
}: CreatePostModalProps) {
  // Step 1: "select" (Drag & drop)
  // Step 2: "crop"   (Instagram Crop Screen)
  // Step 3: "details" (Caption, Preview, Share)
  const [step, setStep] = useState<"select" | "crop" | "edit" | "details">("select");
  const [computedCssFilter, setComputedCssFilter] = useState("none");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropConfig, setCropConfig] = useState<{
    aspectRatio: AspectRatioType;
    zoom: number;
    pan: { x: number; y: number };
  }>({ aspectRatio: "1:1", zoom: 1, pan: { x: 0, y: 0 } });

  const [caption, setCaption] = useState("");
  // 🎯 Discard Confirmation Modal State
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  // Close Request: Agar image select hai toh pehle "Discard post?" popup dikhayega
  const handleRequestClose = () => {
    if (step !== "select") {
      setIsDiscardModalOpen(true);
    } else {
      handleFinalClose();
    }
  };

  // Discard Button Click: Sab clear karke wapas Instagram Screen 1 (Drag & Drop) par layega
  const handleConfirmDiscard = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption("");
    setStep("select"); // 👈 Screen 1 of post
    setIsDiscardModalOpen(false);
  };

  const handleFinalClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption("");
    setStep("select");
    setIsDiscardModalOpen(false);
    onClose();
  };
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Internet Monitor
  useEffect(() => {
    const checkNetwork = () => {
      const conn = (navigator as any).connection;
      setIsSlowNetwork(!navigator.onLine || (conn && (conn.effectiveType === "2g" || conn.saveData)));
    };
    checkNetwork();
    window.addEventListener("online", checkNetwork);
    window.addEventListener("offline", checkNetwork);
    return () => {
      window.removeEventListener("online", checkNetwork);
      window.removeEventListener("offline", checkNetwork);
    };
  }, []);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert("Please upload an image or video file.");
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setStep("crop"); // Direct to Screen 2 Crop
  };

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption("");
    setStep("select");
    onClose();
  };

  // Finalize Upload to Supabase Storage & Database
  const handlePublishPost = async () => {
    if (!selectedFile || isUploading) return;
    setIsUploading(true);

    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `post_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("post-media")
        .upload(filePath, selectedFile, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("post-media")
        .getPublicUrl(filePath);

      const newPostPayload = {
        author_name: currentUser?.full_name || "IPEC Student",
        author_username: currentUser?.username || "ipec_student",
        author_avatar: currentUser?.avatar_url || null,
        media_url: publicUrlData.publicUrl,
        media_type: selectedFile.type.startsWith("video/") ? "video" : "image",
        caption: caption.trim() || "Campus Moment",
        location: "IPEC Campus, Ghaziabad",
        course: currentUser?.course || "B.Tech",
        semester: currentUser?.semester || "Sem 3",
        type: "meme",
        likes_count: 0,
        comments_count: 0,
      };

      const { data: insertedPost, error: insertError } = await supabase
        .from("posts")
        .insert([newPostPayload])
        .select()
        .single();

      if (insertError) throw insertError;

      if (onPostCreated && insertedPost) {
        onPostCreated(insertedPost);
      }

      handleClose();
    } catch (err: any) {
      console.error("Post creation failed:", err);
      alert("Failed to share post: " + (err.message || "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      onClick={handleRequestClose}
      className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-150"
    >
      {/* Top Right Desktop Close Icon */}
      <button
        type="button"
        onClick={handleRequestClose}
        aria-label="Close modal"
        className="fixed top-5 right-6 text-white/80 hover:text-white transition hidden sm:block p-2 hover:scale-110 active:scale-95 cursor-pointer"
      >
        <X className="w-7 h-7 stroke-[2]" />
      </button>

      {/* Main Container (Black, White, Gray only) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
          step === "edit" || step === "details"
            ? "max-w-[520px] sm:max-w-[840px] h-[520px] sm:h-[580px]"
            : "max-w-[480px] sm:max-w-[540px] h-auto"
        }`}
      >
        {/* Slow Network Skeleton Alert */}
        {isSlowNetwork && (
          <div className="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[11px] px-3 py-1.5 text-center border-b border-zinc-200 dark:border-zinc-800 animate-pulse font-mono">
            Optimized upload active (Slow network)
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 1: DRAG PHOTOS AND VIDEOS HERE                    */}
        {/* ======================================================== */}
        {step === "select" && (
          <>
            <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="w-6" />
              <h2 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Create new post
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="sm:hidden text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) processFile(file);
              }}
              className={`min-h-[360px] sm:min-h-[440px] flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-colors ${
                isDragOver ? "bg-zinc-100 dark:bg-zinc-900" : "bg-white dark:bg-zinc-950"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                  e.target.value = "";
                }}
                accept="image/*,video/*"
                className="hidden"
              />

              <div className="w-24 h-24 sm:w-28 sm:h-28 mb-4 text-zinc-800 dark:text-zinc-200 flex items-center justify-center">
                <svg viewBox="0 0 96 96" className="w-full h-full fill-none stroke-current" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="12" y="24" width="48" height="42" rx="8" />
                  <circle cx="28" cy="38" r="4" fill="currentColor" stroke="none" />
                  <path d="M12 56l14-12 16 14 10-8 8 6" />
                  <rect x="36" y="32" width="48" height="42" rx="8" className="fill-white dark:fill-zinc-950 stroke-current" />
                  <polygon points="56,47 56,59 66,53" fill="currentColor" stroke="none" />
                </svg>
              </div>

              <h3 className="text-lg sm:text-xl font-normal text-zinc-900 dark:text-zinc-100 mb-6">
                Drag photos and videos here
              </h3>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Select from computer
              </button>
            </div>
          </>
        )}

        {/* SCREEN 2: CROP */}
        {step === "crop" && previewUrl && (
          <PostCropScreen
            imageSrc={previewUrl || ""}
            onBack={() => setIsDiscardModalOpen(true)}
            onNext={(config: any) => {
              setCropConfig(config);
              setStep("edit"); // 👈 Next to Screen 3 (Filters & Adjustments)
            }}
          />
        )}

        {/* SCREEN 3: FILTERS & ADJUSTMENTS */}
        {step === "edit" && previewUrl && (
          <PostEditScreen
            imageSrc={previewUrl || ""}
            cropConfig={cropConfig}
            onBack={() => setStep("crop")}
            onNext={(editData) => {
              setComputedCssFilter(editData.computedCssFilter);
              setStep("details"); // Next to Screen 4 (Caption & Share)
            }}
          />
        )}

        {/* ======================================================== */}
        {/* SCREEN 3: CAPTION & SHARE DETAILS                        */}
        {/* ======================================================== */}
        {step === "details" && previewUrl && (
          <div className="flex flex-col w-full h-full bg-white dark:bg-zinc-950">
            <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 bg-zinc-50/50 dark:bg-zinc-900/40">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => setStep("crop")}
                className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition p-1 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2]" />
              </button>

              <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Create new post
              </h2>

              <button
                type="button"
                disabled={isUploading}
                onClick={handlePublishPost}
                className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition flex items-center gap-1.5 cursor-pointer"
              >
                {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Share</span>
              </button>
            </header>

            <div className="flex flex-col sm:flex-row min-h-[380px] sm:min-h-[440px] overflow-hidden">
              <div className="flex-1 bg-black flex items-center justify-center overflow-hidden p-2 border-b sm:border-b-0 sm:border-r border-zinc-200 dark:border-zinc-800 min-h-[280px]">
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
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: cropConfig.aspectRatio === "16:9" ? "100%" : "auto",
                    height: cropConfig.aspectRatio === "4:5" || cropConfig.aspectRatio === "1:1" ? "100%" : "auto",
                  }}
                  className="relative flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={previewUrl}
                    alt="Post preview"
                    draggable={false}
                    style={{
                      filter: computedCssFilter,
                      transform: `translate(${cropConfig.pan.x}px, ${cropConfig.pan.y}px) scale(${cropConfig.zoom})`,
                    }}
                    className={`w-full h-full pointer-events-none ${
                      cropConfig.aspectRatio === "original" ? "object-contain" : "object-cover"
                    }`}
                  />
                </div>
              </div>

              <div className="w-full sm:w-[240px] p-4 flex flex-col justify-between bg-white dark:bg-zinc-950 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold uppercase overflow-hidden text-zinc-900 dark:text-zinc-100">
                      {currentUser?.avatar_url ? (
                        <img src={currentUser.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        currentUser?.full_name?.charAt(0) || "U"
                      )}
                    </div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {currentUser?.username || "ipec_student"}
                    </span>
                  </div>

                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    rows={4}
                    className="w-full text-xs bg-transparent border-0 focus:outline-none focus:ring-0 resize-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 scrollbar-none"
                  />
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 text-[11px] text-zinc-500 font-mono space-y-1">
                  <p>Location: IPEC Campus</p>
                  <p>Target: {currentUser?.course || "B.Tech"} Students</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
        {/* EXACT INSTAGRAM DISCARD CONFIRMATION DIALOG              */}
        {/* ======================================================== */}
        {isDiscardModalOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-100 select-none"
          >
            <div className="w-full max-w-[320px] sm:max-w-[360px] rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden text-center animate-in zoom-in-95 duration-100">
              
              {/* Text Header */}
              <div className="p-6 space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Discard post?
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  If you leave, your edits won&apos;t be saved.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleConfirmDiscard}
                  className="w-full py-3 text-xs sm:text-sm font-bold text-rose-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 active:bg-zinc-100 dark:active:bg-zinc-800 transition cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={() => setIsDiscardModalOpen(false)}
                  className="w-full py-3 text-xs sm:text-sm font-normal text-zinc-800 dark:text-zinc-200 border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 active:bg-zinc-100 dark:active:bg-zinc-800 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}
    </div>
  );
}