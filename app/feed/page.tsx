// "use client";

// import React, { useState, useEffect } from "react";
// import { 
//   Heart, 
//   MessageCircle, 
//   Send, 
//   Bookmark, 
//   MapPin, 
//   Download, 
//   Eye, 
//   FileText, 
//   Sparkles,
//   Share2,
//   CheckCircle2,
//   Search,
//   Camera
// } from "lucide-react";
// import LeftSidebar from "./components/left-sidebar";
// import RightSidebar from "./components/right-sidebar";
// import MobileNav from "./components/mobile-nav";
// import FeedSkeleton from "./components/feed-skeleton";
// import { supabase } from "../../lib/supabase";
// import UserAvatar from "./components/user-avatar";

// export default function MainFeedPage() {
//   const [mounted, setMounted] = useState(false);
//   const [activeMoodTab, setActiveMoodTab] = useState<"all" | "my_course" | "pyqs" | "memes">("all");
//   const [currentNavTab, setCurrentNavTab] = useState("feed");
//   const [posts, setPosts] = useState<any[]>([]);
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const [notices, setNotices] = useState<any[]>([]);

//   useEffect(() => {
//     async function loadFeedData() {
//       try {
//         // Load Posts from Supabase
//         const { data: postsData } = await supabase
//           .from("posts")
//           .select("*")
//           .order("created_at", { ascending: false });

//         // Load Notices from Supabase
//         const { data: noticesData } = await supabase
//           .from("notices")
//           .select("*")
//           .order("is_pinned", { ascending: false });

//         if (postsData && postsData.length > 0) setPosts(postsData);
//         if (noticesData && noticesData.length > 0) setNotices(noticesData);
//       } catch (err) {
//         console.error("Feed data fetch fallback:", err);
//       } finally {
//         setMounted(true);
//       }
//     }

//     loadFeedData();
//   }, []);

//   // Flash Skeleton Screen during initial network load
//   if (!mounted) {
//     return <FeedSkeleton />;
//   }

//   // Filtered Posts Logic
//   const filteredPosts = posts.filter((post) => {
//     if (activeMoodTab === "memes") return post.type === "meme";
//     if (activeMoodTab === "pyqs") return post.type === "academic";
//     if (activeMoodTab === "my_course") return post.course?.includes("BCA") || post.course?.includes("General");
//     return true;
//   });

//   return (
//     <div className="min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-zinc-50 flex justify-center selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-black transition-colors">
      
//       {/* 1. Left Expandable Sidebar (Desktop) */}
//       <LeftSidebar currentTab={currentNavTab} onTabChange={setCurrentNavTab} unreadCount={2} />

//       {/* Main Content Layout Container */}
//       <div className="w-full max-w-7xl flex justify-between md:pl-16 group-hover:md:pl-60 transition-all duration-300">
        
//         {/* ========================================================= */}
//         {/* CENTER FEED STREAM (Instagram Style Focus)               */}
//         {/* ========================================================= */}
//         <main className="flex-1 max-w-[620px] mx-auto p-4 sm:p-6 pb-20 md:pb-8 space-y-5">
          
//           {/* Mobile Top Header */}
//           <div className="md:hidden flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
//             <span className="font-extrabold text-lg tracking-tight">
//               <span className="text-[#0F2952] dark:text-zinc-100">IPEC</span>
//               <span className="text-[#0284C7]">apture</span>
//             </span>
//             <div className="flex items-center gap-3">
//               <Search className="w-5 h-5 text-zinc-500" />
//               <div className="w-7 h-7 rounded-full bg-[#0F2952] text-white flex items-center justify-center text-xs font-mono font-bold">
//                 HG
//               </div>
//             </div>
//           </div>

//           {/* Feed Mood Switcher Tabs */}
//           <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
//             {[
//               { id: "all", label: "🚀 All Campus" },
//               { id: "my_course", label: "📚 My BCA Sem 3" },
//               { id: "pyqs", label: "📄 Solved PYQs" },
//               { id: "memes", label: "🔥 Campus Memes" },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 type="button"
//                 onClick={() => setActiveMoodTab(tab.id as any)}
//                 className={`px-3.5 py-2 rounded-full whitespace-nowrap font-medium transition ${
//                   activeMoodTab === tab.id
//                     ? "bg-black text-white dark:bg-white dark:text-black shadow-sm font-semibold"
//                     : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Quick Creator Box */}
//           <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3">
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-full bg-[#0F2952] text-white flex items-center justify-center font-bold text-xs font-mono shrink-0">
//                 HG
//               </div>
//               <input
//                 type="text"
//                 placeholder="Share a campus moment or upload notes..."
//                 className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
//               />
//             </div>
//             <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80 text-xs text-zinc-500">
//               <div className="flex items-center gap-4">
//                 <button type="button" className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition">
//                   <Camera className="w-4 h-4 text-[#0284C7]" />
//                   <span>Photo / Meme</span>
//                 </button>
//                 <button type="button" className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition">
//                   <FileText className="w-4 h-4 text-emerald-500" />
//                   <span>Upload PDF</span>
//                 </button>
//               </div>
//               <button type="button" className="bg-black text-white dark:bg-white dark:text-black text-xs font-semibold px-3 py-1.5 rounded-lg">
//                 Post
//               </button>
//             </div>
//           </div>

//           {/* POSTS STREAM */}
//           <div className="space-y-6">
//             {filteredPosts.map((post) => (
//               <article
//                 key={post.id}
//                 className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition"
//               >
//                 {/* Post Author Header */}
//                 <div className="p-3.5 flex items-center justify-between">
//                   <div className="flex items-center gap-2.5">
//                     <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#0F2952] to-[#0284C7]">
//                       <div className="w-full h-full rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs font-mono">
//                         {post.author_name.charAt(0)}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="flex items-center gap-1.5">
//                         <span className="font-bold text-xs text-zinc-950 dark:text-zinc-50">{post.author_name}</span>
//                         {post.type === "academic" && <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7]" />}
//                       </div>
//                       <p className="text-[10px] text-zinc-400 flex items-center gap-1">
//                         <MapPin className="w-2.5 h-2.5" />
//                         <span>{post.location || "IPEC Campus"}</span>
//                       </p>
//                     </div>
//                   </div>
//                   <span className="text-[10px] font-mono text-zinc-400">2h ago</span>
//                 </div>

//                 {/* POST CONTENT: TYPE A - MEME / CAMPUS MOMENT */}
//                 {post.type === "meme" && (
//                   <div className="space-y-3">
//                     <div className="px-4 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
//                       {post.caption}
//                     </div>
//                     <div className="h-64 sm:h-72 w-full bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center p-6 text-center border-y border-zinc-100 dark:border-zinc-900">
//                       <span className="font-mono text-xs text-zinc-400 mb-2">[ Campus Life Photograph / Meme ]</span>
//                       <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 max-w-sm italic">
//                         &ldquo;Attendance 74.9% vs ERP portal sessional admit card gatekeeper&rdquo;
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* POST CONTENT: TYPE B - ACADEMIC SOLVED PAPER */}
//                 {post.type === "academic" && (
//                   <div className="p-4 space-y-3">
//                     <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-2.5">
//                       <div className="flex items-center justify-between">
//                         <span className="font-mono text-xs font-bold text-[#0F2952] dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
//                           {post.subject_code}
//                         </span>
//                         <span className="text-[10px] font-mono text-zinc-400">{post.file_size}</span>
//                       </div>
//                       <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">{post.subject_name}</h4>
//                       <p className="text-xs text-zinc-600 dark:text-zinc-400">{post.caption}</p>
                      
//                       <div className="pt-2 flex gap-2">
//                         <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition">
//                           <Eye className="w-3.5 h-3.5" />
//                           <span>Read in Browser</span>
//                         </button>
//                         <button type="button" className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
//                           <Download className="w-3.5 h-3.5" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Instagram Action Interaction Bar */}
//                 <div className="p-3.5 pt-2 flex items-center justify-between text-zinc-700 dark:text-zinc-300">
//                   <div className="flex items-center gap-4 text-xs font-medium">
//                     <button type="button" className="flex items-center gap-1.5 hover:text-rose-500 transition">
//                       <Heart className="w-4 h-4" />
//                       <span>{post.likes_count}</span>
//                     </button>
//                     <button type="button" className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition">
//                       <MessageCircle className="w-4 h-4" />
//                       <span>{post.comments_count}</span>
//                     </button>
//                     <button type="button" className="hover:text-black dark:hover:text-white transition">
//                       <Send className="w-4 h-4" />
//                     </button>
//                   </div>
//                   <Bookmark className="w-4 h-4 hover:text-black dark:hover:text-white cursor-pointer transition" />
//                 </div>
//               </article>
//             ))}
//           </div>

//         </main>

//         {/* 3. Right Sidebar (Desktop only) */}
//         <RightSidebar notices={notices} />

//       </div>

//       {/* 4. Mobile Bottom Navigation */}
//       <MobileNav currentTab={currentNavTab} onTabChange={setCurrentNavTab} unreadCount={2} />

//     </div>
//   );
// }



"use client";

import React, { useState, useEffect, useRef } from "react";
import {
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

interface Story {
  id: string;
  author_name: string;
  author_username: string;
  author_avatar?: string | null;
  media_url: string;
  caption?: string;
  created_at: string;
  likes_count?: number;
}

export default function MainFeedPage() {
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
      // 1. Record view for someone else's story
      supabase.from("story_views").insert([{
        story_id: currentStory.id,
        viewer_username: currentUser.username,
        viewer_name: currentUser.full_name,
        viewer_avatar: currentUser.avatar_url,
      }]).then(() => {});
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
              onChange={handleStoryUpload} 
              accept="image/*" 
              className="hidden" 
            />

            <div className="flex items-center gap-3.5 overflow-x-auto scrollbar-none py-2.5 px-1">
              
              {/* CURRENT USER STORY (HAMESHA '+' ICON RAHEGA MULTIPLE STORIES KE LIYE) */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 group">
                <div className="relative">
                  
                  {/* Story Watch Circle */}
                  <div 
                    onClick={() => {
                      if (userHasActiveStory) {
                        setActiveStoryUsername(currentUser?.username);
                        setCurrentStoryIndex(0);
                      } else {
                        storyInputRef.current?.click();
                      }
                    }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 duration-200 cursor-pointer ${
                      userHasActiveStory 
                        ? "p-[2.5px] bg-gradient-to-tr from-[#0F2952] via-[#0284C7] to-[#38BDF8]" 
                        : "p-[1px] border border-dashed border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px] overflow-hidden flex items-center justify-center">
                      <UserAvatar avatarUrl={currentUser?.avatar_url} name={currentUser?.full_name} size="md" />
                    </div>
                  </div>

                  {/* '+' Button (HAMESHA VISIBLE - Multi-Story Upload) */}
                  <button
                    type="button"
                    title="Add story"
                    onClick={(e) => {
                      e.stopPropagation(); // Story open nahi hogi, seedha upload picker khulega
                      storyInputRef.current?.click();
                    }}
                    className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#0284C7] hover:bg-[#0ea5e9] text-white flex items-center justify-center border-2 border-white dark:border-black shadow-md cursor-pointer transition hover:scale-110 active:scale-95"
                  >
                    <Plus className="w-2.5 h-2.5 stroke-[3]" />
                  </button>

                </div>
                
                <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[62px]">
                  {userHasActiveStory ? "Your Story" : "Add Story"}
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
                          onClick={() => setIsMenuOpen(true)}
                          className="p-1 text-white/80 hover:text-white transition hover:scale-110 active:scale-90"
                        >
                          <MoreVertical className="w-4 h-4" />
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
                          storyViewers.map((viewer) => (
                            <div key={viewer.viewer_username} className="flex items-center justify-between text-white py-1 hover:bg-white/5 px-2 rounded-xl transition">
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
                          storyComments.map((c) => (
                            <div key={c.id} className="text-xs text-white py-1 px-2 rounded-xl bg-white/5 space-y-0.5">
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