"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Smile,
  MapPin,
  UserPlus,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  Loader2,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import UserAvatar from "../feed/components/user-avatar";

export interface TaggedUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
}

interface PostDetailsScreenProps {
  imageSrc: string;
  cropConfig: {
    aspectRatio: string;
    zoom: number;
    pan: { x: number; y: number };
  };
  computedCssFilter: string;
  currentUser: any;
  caption: string;
  setCaption: (cap: string) => void;
  onBack: () => void;
  onPublish: (detailsData: {
    taggedUsers: TaggedUser[];
    location: string;
    hideLikes: boolean;
    commentsDisabled: boolean;
  }) => void;
  isUploading: boolean;
}

// Official IPEC Campus Locations
const IPEC_LOCATIONS = [
  "IPEC Campus, Ghaziabad",
  "Central Library, IPEC",
  "Block-A (Academic)",
  "Block-B (Laboratories)",
  "Block-C (Workshops)",
  "IPEC Business School",
  "Auditorium, IPEC",
  "Training and Placement Cell",
  "Main Reception & Admin Offices",
  "Conference & Seminar Halls",
  "Indoor Sports Complex",
  "Basketball Court, IPEC",
  "Boys Hostel, IPEC",
  "Girls Hostel, IPEC",
  "Gymnasium, IPEC",
];

export default function PostDetailsScreen({
  imageSrc,
  cropConfig,
  computedCssFilter,
  currentUser,
  caption,
  setCaption,
  onBack,
  onPublish,
  isUploading,
}: PostDetailsScreenProps) {
  // Real Database Profile State
  const [dbUser, setDbUser] = useState<any>(currentUser);

  useEffect(() => {
    if (!currentUser?.id) return;
    const fetchLatestProfile = async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .eq("id", currentUser.id)
          .single();
        if (data) setDbUser(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchLatestProfile();
  }, [currentUser]);

  // Tagging State
  const [taggedUsers, setTaggedUsers] = useState<TaggedUser[]>([]);
  const [activeTagCoord, setActiveTagCoord] = useState<{ x: number; y: number } | null>(null);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [showTagTip, setShowTagTip] = useState(true);
  const [draggingTagId, setDraggingTagId] = useState<string | null>(null);

  // Post Meta States
  const [location, setLocation] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isAiLabel, setIsAiLabel] = useState(false);
  const [hideLikes, setHideLikes] = useState(false);
  const [commentsDisabled, setCommentsDisabled] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Emoji Picker Pop
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojis = ["❤️", "🙌", "🔥", "👏", "😢", "😍", "✨", "🎉", "💯", "🚀"];

  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Click on photo to set tag anchor
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    setActiveTagCoord({ x, y });
    setTagSearchQuery("");
    setShowTagTip(false);
  };

  // Search users in DB
  useEffect(() => {
    if (!activeTagCoord || tagSearchQuery.trim().length === 0) {
      setSearchedUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingUsers(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .ilike("username", `%${tagSearchQuery.trim()}%`)
          .limit(5);

        if (!error && data) {
          setSearchedUsers(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearchingUsers(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [tagSearchQuery, activeTagCoord]);

  const selectUserToTag = (user: any) => {
    if (!activeTagCoord) return;
    setTaggedUsers((prev) => [
      ...prev.filter((t) => t.id !== user.id),
      {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        x: activeTagCoord.x,
        y: activeTagCoord.y,
      },
    ]);
    setActiveTagCoord(null);
    setTagSearchQuery("");
  };

  const removeTag = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaggedUsers((prev) => prev.filter((t) => t.id !== id));
  };

  // Drag tag like Instagram story
  const handleTagPointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggingTagId(id);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMoveImage = (e: React.PointerEvent) => {
    if (!draggingTagId || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    setTaggedUsers((prev) =>
      prev.map((t) => (t.id === draggingTagId ? { ...t, x, y } : t))
    );
  };

  const handlePointerUpImage = (e: React.PointerEvent) => {
    if (draggingTagId) {
      setDraggingTagId(null);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch (_) {}
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 select-none overflow-hidden">
      {/* Header */}
      <header className="h-11 sm:h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 bg-zinc-50/70 dark:bg-zinc-900/60 shrink-0">
        <button
          type="button"
          onClick={onBack}
          disabled={isUploading}
          className="p-1 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>

        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create new post
        </h2>

        <button
          type="button"
          onClick={() =>
            onPublish({
              taggedUsers,
              location,
              hideLikes,
              commentsDisabled,
            })
          }
          disabled={isUploading}
          className="text-xs font-bold text-sky-500 hover:text-sky-600 dark:text-sky-400 hover:opacity-80 transition cursor-pointer flex items-center gap-1.5"
        >
          {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Share</span>
        </button>
      </header>

      {/* Main Split Layout */}
      <div className="flex flex-col sm:flex-row flex-1 overflow-hidden min-h-0 h-full">
        {/* Left Side: Photo with Tagging Overlay */}
        <div className="relative flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden h-[320px] sm:h-full p-2 sm:p-4 select-none">
          {/* Top Tip Badge */}
          {showTagTip && taggedUsers.length === 0 && !activeTagCoord && (
            <div className="absolute top-4 z-20 pointer-events-none bg-black/80 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-lg animate-in fade-in">
              Click photo to tag people
            </div>
          )}

          <div
            ref={imageContainerRef}
            onClick={handleImageClick}
            onPointerMove={handlePointerMoveImage}
            onPointerUp={handlePointerUpImage}
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
            className="relative flex items-center justify-center overflow-hidden cursor-crosshair shadow-2xl transition-all duration-150"
          >
            <img
              src={imageSrc}
              alt="Post preview"
              draggable={false}
              style={{
                filter: computedCssFilter,
                transform: `translate(${cropConfig.pan.x}px, ${cropConfig.pan.y}px) scale(${cropConfig.zoom})`,
              }}
              className={`w-full h-full pointer-events-none select-none ${
                cropConfig.aspectRatio === "original" ? "object-contain" : "object-cover"
              }`}
            />

            {/* Bottom-left Instagram Person Badge */}
            {taggedUsers.length > 0 && (
              <div className="absolute bottom-3 left-3 z-10 w-7 h-7 rounded-full bg-black/75 backdrop-blur-md flex items-center justify-center text-white border border-white/10 shadow-lg pointer-events-none">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}

            {/* Draggable Instagram Tag Pills */}
            {taggedUsers.map((tag) => (
              <div
                key={tag.id}
                style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
                onPointerDown={(e) => handleTagPointerDown(tag.id, e)}
                onClick={(e) => e.stopPropagation()}
                className="absolute z-20 -translate-x-1/2 -translate-y-full mb-1 flex items-center gap-1.5 bg-[#262626]/95 hover:bg-[#333]/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-2xl border border-white/10 cursor-grab active:cursor-grabbing backdrop-blur-sm select-none animate-in zoom-in-95 duration-100"
              >
                <span>{tag.username}</span>
                <button
                  type="button"
                  onClick={(e) => removeTag(tag.id, e)}
                  className="hover:text-zinc-300 text-zinc-400 p-0.5"
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                </button>
                {/* Instagram caret arrow */}
                <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#262626]/95 pointer-events-none" />
              </div>
            ))}

            {/* Active Tag Popover Search Modal */}
            {activeTagCoord && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  left: `${Math.min(70, Math.max(30, activeTagCoord.x))}%`,
                  top: `${Math.min(70, Math.max(25, activeTagCoord.y))}%`,
                }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 w-64 rounded-xl bg-zinc-900/95 border border-zinc-700/80 backdrop-blur-xl shadow-2xl overflow-hidden text-white animate-in zoom-in-95 duration-150"
              >
                <div className="flex items-center gap-2 p-2 border-b border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-400 pl-1">Tag:</span>
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search"
                      value={tagSearchQuery}
                      onChange={(e) => setTagSearchQuery(e.target.value)}
                      className="w-full text-xs bg-zinc-800/80 rounded-md py-1 px-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTagCoord(null)}
                    className="text-zinc-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-40 overflow-y-auto p-1 scrollbar-none">
                  {isSearchingUsers ? (
                    <div className="py-4 flex justify-center text-zinc-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : searchedUsers.length > 0 ? (
                    searchedUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => selectUserToTag(u)}
                        className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-800/70 text-left transition"
                      >
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-zinc-700/60 flex items-center justify-center">
                          <UserAvatar
                            avatarUrl={u.avatar_url}
                            name={u.full_name || u.username}
                            size="sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-white">{u.username}</p>
                          <p className="text-[10px] text-zinc-400 truncate">{u.full_name}</p>
                        </div>
                      </button>
                    ))
                  ) : tagSearchQuery.trim() ? (
                    <p className="text-center text-xs py-3 text-zinc-500">No users found.</p>
                  ) : (
                    <p className="text-center text-[11px] py-2 text-zinc-500">
                      Type username to mention
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Caption & Details Form (Scrollable) */}
        <div className="w-full sm:w-[320px] md:w-[350px] flex flex-col bg-white dark:bg-zinc-950 border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-zinc-800 shrink-0 h-full overflow-y-auto scrollbar-none divide-y divide-zinc-200 dark:divide-zinc-800">
          {/* User Info & Caption */}
          <div className="p-3.5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800">
                <UserAvatar
                  avatarUrl={dbUser?.avatar_url || currentUser?.avatar_url}
                  name={dbUser?.full_name || currentUser?.full_name || currentUser?.username}
                  size="sm"
                />
              </div>
              <span className="text-xs font-bold truncate text-zinc-900 dark:text-zinc-100">
                {dbUser?.username || currentUser?.username || "ipec_student"}
              </span>
            </div>

            <textarea
              value={caption}
              onChange={(e) => {
                if (e.target.value.length <= 2200) setCaption(e.target.value);
              }}
              placeholder="Add a caption..."
              rows={4}
              className="w-full text-xs bg-transparent border-0 focus:outline-none focus:ring-0 resize-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 scrollbar-none"
            />

            {/* Emoji & Character Count Bar */}
            <div className="flex items-center justify-between text-zinc-400 text-xs pt-1 relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((p) => !p)}
                className="hover:text-zinc-600 dark:hover:text-zinc-200 transition"
              >
                <Smile className="w-4 h-4 stroke-[1.8]" />
              </button>

              {showEmojiPicker && (
                <div className="absolute left-0 bottom-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 flex gap-1 shadow-xl z-20">
                  {emojis.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        setCaption(caption + em);
                        setShowEmojiPicker(false);
                      }}
                      className="hover:scale-125 transition text-base p-1"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[11px] font-mono text-zinc-500">
                {caption.length}/2,200
              </span>
            </div>
          </div>

          {/* Add / Selected Location (Instagram Exact) */}
          <div className="p-3.5">
            {location ? (
              // Selected state (Screenshot 2 exact)
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-950 dark:text-zinc-50">
                <span className="truncate pr-2">{location}</span>
                <button
                  type="button"
                  onClick={() => {
                    setLocation("");
                    setLocationSearch("");
                  }}
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            ) : (
              // Unselected state with IPEC autocomplete
              <div>
                <div
                  onClick={() => setIsLocationOpen((p) => !p)}
                  className="flex items-center justify-between text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  <span>Add location</span>
                  <MapPin className="w-4 h-4 text-zinc-500" />
                </div>

                {isLocationOpen && (
                  <div className="mt-2 space-y-1.5">
                    <input
                      type="text"
                      autoFocus
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      placeholder="Search IPEC Campus location..."
                      className="w-full text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1.5 px-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />

                    {/* IPEC Location Autocomplete List: Only show when typing */}
                    {locationSearch.trim().length > 0 && (
                      <div className="max-h-36 overflow-y-auto rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 divide-y divide-zinc-200/50 dark:divide-zinc-800/50 scrollbar-none animate-in fade-in duration-100">
                        {IPEC_LOCATIONS.filter((loc) =>
                          loc.toLowerCase().includes(locationSearch.trim().toLowerCase())
                        ).length > 0 ? (
                          IPEC_LOCATIONS.filter((loc) =>
                            loc.toLowerCase().includes(locationSearch.trim().toLowerCase())
                          ).map((loc) => (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => {
                                setLocation(loc);
                                setLocationSearch("");
                                setIsLocationOpen(false);
                              }}
                              className="w-full text-left p-2 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded transition flex items-center justify-between cursor-pointer"
                            >
                              <span className="truncate">{loc}</span>
                              <MapPin className="w-3 h-3 text-zinc-400 shrink-0 ml-1" />
                            </button>
                          ))
                        ) : (
                          <div className="p-2 text-xs text-zinc-400 text-center">
                            No campus location found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Advanced Settings Accordion */}
          <div className="p-3.5 space-y-3">
            <div
              onClick={() => setIsAdvancedOpen((p) => !p)}
              className="flex items-center justify-between text-xs font-semibold cursor-pointer text-zinc-800 dark:text-zinc-200"
            >
              <span>Advanced settings</span>
              {isAdvancedOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>

            {isAdvancedOpen && (
              <div className="space-y-4 pt-1 animate-in fade-in duration-150">
                {/* Hide Likes */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-800 dark:text-zinc-200">
                      Hide like and view counts on this post
                    </span>
                    <button
                      type="button"
                      onClick={() => setHideLikes((p) => !p)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition duration-200 ${
                        hideLikes ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-300 dark:bg-zinc-800"
                      }`}
                    >
                      <div
                        className={`bg-white dark:bg-zinc-950 w-4 h-4 rounded-full shadow transition duration-200 ${
                          hideLikes ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-tight">
                    Only you will see the total number of likes and views on this post.
                  </p>
                </div>

                {/* Turn off commenting */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-800 dark:text-zinc-200">
                      Turn off commenting
                    </span>
                    <button
                      type="button"
                      onClick={() => setCommentsDisabled((p) => !p)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition duration-200 ${
                        commentsDisabled
                          ? "bg-zinc-900 dark:bg-zinc-100"
                          : "bg-zinc-300 dark:bg-zinc-800"
                      }`}
                    >
                      <div
                        className={`bg-white dark:bg-zinc-950 w-4 h-4 rounded-full shadow transition duration-200 ${
                          commentsDisabled ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-tight">
                    You can change this later by going to the ··· menu.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}