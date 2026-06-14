"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ArticleLikeButtonProps {
  articleId: string;
  initialLikes?: number;
  theme?: "light" | "sepia" | "dark";
}

interface LikeParticle {
  id: number;
  x: number;
  y: number;
  scale: number;
}

export default function ArticleLikeButton({ 
  articleId, 
  initialLikes = 0, 
  theme = "light" 
}: ArticleLikeButtonProps) {
  const [totalLikes, setTotalLikes] = useState(initialLikes);
  const [userLikes, setUserLikes] = useState(0); // Likes given by this browser (0 to 5)
  const [particles, setParticles] = useState<LikeParticle[]>([]);
  const [animateHeart, setAnimateHeart] = useState(false);
  
  const accumulatedClicksRef = useRef(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const particleIdRef = useRef(0);
  
  // Sync database total likes if initialLikes changes
  useEffect(() => {
    setTotalLikes(initialLikes);
  }, [initialLikes]);

  // Load user's previous likes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`programbi-likes-${articleId}`);
    if (saved) {
      setUserLikes(parseInt(saved, 10) || 0);
    }
  }, [articleId]);

  // Fetch current database likes on mount to ensure freshness
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("newsletter_articles")
      .select("likes")
      .eq("id", articleId)
      .single()
      .then(({ data }) => {
        if (data && typeof data.likes === "number") {
          setTotalLikes(data.likes);
        }
      });
  }, [articleId]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const handleLike = () => {
    if (userLikes >= 5) {
      // Limit reached, trigger a shake animation
      setAnimateHeart(true);
      setTimeout(() => setAnimateHeart(false), 500);
      return;
    }

    // 1. Optimistic updates
    const newLikes = userLikes + 1;
    setUserLikes(newLikes);
    setTotalLikes((prev) => prev + 1);
    localStorage.setItem(`programbi-likes-${articleId}`, newLikes.toString());

    // 2. Trigger heart scale pulse
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 300);

    // 3. Spawn floating particles
    const id = particleIdRef.current++;
    const angle = (Math.random() * 40 - 20) * (Math.PI / 180); // random angle between -20 and 20 degrees
    const x = Math.sin(angle) * -40;
    const y = -60 - Math.random() * 40;
    
    setParticles((prev) => [...prev, { id, x, y, scale: Math.random() * 0.4 + 0.8 }]);
    
    // Auto-remove particle after 1s
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1000);

    // 4. Batch DB updates via debounced RPC
    accumulatedClicksRef.current += 1;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      const clicksToSend = accumulatedClicksRef.current;
      accumulatedClicksRef.current = 0;

      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("increment_article_likes", {
          article_id: articleId,
          increment_by: clicksToSend,
        });

        if (error) {
          console.error("Failed to update likes in DB:", error);
        } else if (typeof data === "number") {
          // Sync exact total likes from DB return
          setTotalLikes(data);
        }
      } catch (err) {
        console.error("Error calling increment RPC:", err);
      }
    }, 800);
  };

  // SVG circular progress calculation
  // Radius = 28, Circumference = 2 * PI * 28 = 175.93
  const radius = 28;
  const strokeWidth = 2.5;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (userLikes / 5) * circ;

  // Theme styling configurations
  const themeStyles = {
    light: {
      buttonBg: "bg-white hover:bg-slate-50 border-slate-200/80 shadow-md",
      progressBg: "stroke-slate-100",
      progressStroke: "stroke-[#FF4D4F]",
      heartStroke: "text-[#FF4D4F]",
      heartFill: "fill-[#FF4D4F]",
      text: "text-slate-600",
      count: "text-slate-900",
      particleColor: "text-[#FF4D4F]"
    },
    sepia: {
      buttonBg: "bg-[#FDFBF7] hover:bg-[#F9F5EA] border-[#DECFA9] shadow-md",
      progressBg: "stroke-[#E8DCBF]",
      progressStroke: "stroke-[#A13E3E]",
      heartStroke: "text-[#A13E3E]",
      heartFill: "fill-[#A13E3E]",
      text: "text-[#8C6D53]",
      count: "text-[#5B4636]",
      particleColor: "text-[#A13E3E]"
    },
    dark: {
      buttonBg: "bg-slate-900 hover:bg-slate-800 border-slate-800 shadow-xl shadow-black/30",
      progressBg: "stroke-slate-850",
      progressStroke: "stroke-red-500",
      heartStroke: "text-red-500",
      heartFill: "fill-red-500",
      text: "text-slate-400",
      count: "text-white",
      particleColor: "text-red-500"
    }
  }[theme];

  return (
    <div className="flex flex-col items-center select-none py-6">
      <div className="relative">
        
        {/* Floating Particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0.2, x: 0, y: 0 }}
              animate={{ opacity: 0, scale: p.scale, x: p.x, y: p.y }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 font-bold text-sm pointer-events-none ${themeStyles.particleColor}`}
            >
              ❤️ +1
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Large Circular Button */}
        <motion.button
          onClick={handleLike}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          animate={animateHeart && userLikes >= 5 ? {
            x: [0, -4, 4, -4, 4, 0],
            transition: { duration: 0.4 }
          } : {}}
          className={`w-[66px] h-[66px] rounded-full border flex items-center justify-center transition-colors cursor-pointer relative z-15 ${themeStyles.buttonBg}`}
        >
          {/* Progress Circular Ring Wrapper */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            {/* Background static gray ring */}
            <circle
              cx="33"
              cy="33"
              r={radius}
              strokeWidth={strokeWidth}
              fill="transparent"
              className={themeStyles.progressBg}
            />
            {/* Animated progress ring */}
            <motion.circle
              cx="33"
              cy="33"
              r={radius}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circ}
              animate={{ strokeDashoffset: offset }}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
              className={themeStyles.progressStroke}
              strokeLinecap="round"
            />
          </svg>

          {/* Heart Icon with progressive filled state */}
          <motion.div
            animate={animateHeart && userLikes < 5 ? {
              scale: [1, 1.25, 0.95, 1.05, 1],
              transition: { duration: 0.3 }
            } : {}}
          >
            <Heart 
              className={`w-6 h-6 transition-all duration-300 ${
                userLikes > 0 
                  ? `${themeStyles.heartFill} ${themeStyles.heartStroke}` 
                  : "text-slate-400 group-hover:text-slate-600"
              }`}
              style={{
                fillOpacity: userLikes > 0 ? userLikes / 5 : 0
              }}
            />
          </motion.div>
        </motion.button>
      </div>

      {/* Dynamic count label */}
      <span className={`text-[11px] font-extrabold uppercase tracking-widest mt-3.5 transition-colors duration-300 ${themeStyles.text}`}>
        Likes dados: <span className={themeStyles.count}>{userLikes}/5</span>
        <span className="mx-2">•</span>
        Total: <span className={themeStyles.count}>{totalLikes}</span>
      </span>
    </div>
  );
}
