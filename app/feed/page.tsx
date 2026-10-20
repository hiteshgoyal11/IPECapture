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
  Loader2
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

  // Story Viewer Modal State
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);

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

  // Upload Story (24-Hour Persistence)
  const handleStoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Media = reader.result as string;
      const newStoryRecord = {
        author_name: currentUser.full_name,
        author_username: currentUser.username,
        author_avatar: currentUser.avatar_url,
        media_url: base64Media,
        caption: "Campus Moment",
      };

      try {
        const { data, error } = await supabase.from("stories").insert([newStoryRecord]).select().single();
        if (!error && data) {
          setStories(prev => [data, ...prev]);
        }
      } catch (err) {
        console.error("Story upload failed:", err);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
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

            <div className="flex items-center gap-3.5 overflow-x-auto scrollbar-none py-1">
              
              {/* CURRENT USER STORY / ADD STORY BUBBLE */}
              <div 
                onClick={() => userHasActiveStory ? setActiveStory(stories.find(s => s.author_username === currentUser?.username) || null) : storyInputRef.current?.click()}
                className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
              >
                <div className="relative">
                  {/* Blue Gradient Ring ONLY IF USER HAS ACTIVE STORY */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 duration-200 ${
                    userHasActiveStory 
                      ? "p-[2.5px] bg-gradient-to-tr from-[#0F2952] via-[#0284C7] to-[#38BDF8]" 
                      : "p-[1px] border border-dashed border-zinc-300 dark:border-zinc-700"
                  }`}>
                    <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px] overflow-hidden flex items-center justify-center">
                      <UserAvatar avatarUrl={currentUser?.avatar_url} name={currentUser?.full_name} size="md" />
                    </div>
                  </div>

                  {/* Plus Badge if no story */}
                  {!userHasActiveStory && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#0284C7] text-white flex items-center justify-center border-2 border-white dark:border-black">
                      <Plus className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[62px]">
                  {userHasActiveStory ? "Your Story" : "Add Story"}
                </span>
              </div>

              {/* OTHER CAMPUS STUDENTS ACTIVE STORIES */}
              {stories.filter(s => s.author_username !== currentUser?.username).map((story) => (
                <div 
                  key={story.id} 
                  onClick={() => setActiveStory(story)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
                >
                  {/* Blue IPECapture Signature Ring for Active Stories */}
                  <div className="w-14 h-14 rounded-full p-[2.5px] bg-gradient-to-tr from-[#0F2952] via-[#0284C7] to-[#38BDF8] flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
                    <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px] overflow-hidden flex items-center justify-center">
                      <UserAvatar avatarUrl={story.author_avatar} name={story.author_name} size="md" />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 truncate max-w-[64px]">
                    {story.author_username.split("_")[0]}
                  </span>
                </div>
              ))}

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
      {/* 24-HOUR STORY VIEWER MODAL (INSTAGRAM PARITY)             */}
      {/* ========================================================= */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col justify-between h-[520px]">
            
            {/* Top 24-Hour Story Progress Bar */}
            <div className="p-4 pb-0 space-y-3 z-10 bg-gradient-to-b from-black/80 to-transparent">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-[progress_5s_linear_forwards] rounded-full"></div>
              </div>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="p-[1.5px] rounded-full bg-gradient-to-tr from-[#0F2952] to-[#0284C7]">
                    <UserAvatar avatarUrl={activeStory.author_avatar} name={activeStory.author_name} size="sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none">{activeStory.author_name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">@{activeStory.author_username}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setActiveStory(null)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Story Image Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={activeStory.media_url} alt="Story" className="w-full h-full object-cover" />
            </div>

            {/* Bottom Caption Overlay */}
            {activeStory.caption && (
              <div className="p-4 z-10 bg-gradient-to-t from-black/80 to-transparent text-white text-xs font-medium text-center">
                {activeStory.caption}
              </div>
            )}

          </div>
        </div>
      )}

      {/* 4. Mobile Bottom Navigation */}
      <MobileNav currentTab={currentNavTab} onTabChange={setCurrentNavTab} unreadCount={2} />

    </div>
  );
}