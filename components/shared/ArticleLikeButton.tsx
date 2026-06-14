"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ArticleLikeButtonProps {
  articleId: string;
  initialLikes?: number;
  theme?: "light" | "sepia" | "dark";
  className?: string;
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
  theme = "light",
  className = "fixed bottom-6 right-6" 
}: ArticleLikeButtonProps) {
  const [totalLikes, setTotalLikes] = useState(initialLikes);
  const [userLikes, setUserLikes] = useState(0); // Likes given by this browser (0 to 5)
  const [particles, setParticles] = useState<LikeParticle[]>([]);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
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
    setTimeout(() => setAnimateHeart(false), 350);

    // 3. Spawn floating particles
    const id = particleIdRef.current++;
    const angle = (Math.random() * 50 - 25) * (Math.PI / 180); // random angle between -25 and 25 degrees
    const x = Math.sin(angle) * -35;
    const y = -50 - Math.random() * 30;
    
    setParticles((prev) => [...prev, { id, x, y, scale: Math.random() * 0.3 + 0.75 }]);
    
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
  // Radius = 20, Center = 24, Circumference = 2 * PI * 20 = 125.66
  const radius = 20;
  const strokeWidth = 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (userLikes / 5) * circ;

  // Resolve RGB values based on theme for inline styles
  const getThemeRgb = () => {
    if (theme === "dark") return "239, 68, 68"; // red-500
    if (theme === "sepia") return "161, 62, 62"; // #A13E3E
    return "255, 77, 79"; // #FF4D4F
  };

  // Static button styles (always return to normal color at rest)
  const getButtonStyles = () => {
    const isDark = theme === "dark";
    const isSepia = theme === "sepia";
    
    return isDark 
      ? "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 shadow-xl shadow-black/30" 
      : isSepia 
      ? "bg-[#FDFBF7] border-[#DECFA9] text-[#8C6D53] hover:bg-[#F9F5EA] shadow-md" 
      : "bg-white border-slate-200 text-slate-450 hover:bg-slate-50 shadow-md";
  };

  // Pulse animation styles for the heart icon (temporarily fill with red on click)
  const getHeartStyle = () => {
    const rgb = getThemeRgb();
    if (animateHeart && userLikes < 5) {
      return {
        color: `rgb(${rgb})`,
        fill: `rgba(${rgb}, 0.85)`
      };
    }
    return {};
  };

  const getRingInlineStyle = () => {
    const rgb = getThemeRgb();
    return {
      stroke: userLikes > 0 ? `rgba(${rgb}, 0.95)` : "transparent"
    };
  };

  // Static themes mapping for generic layout elements
  const themeStaticStyles = {
    light: {
      progressBg: "stroke-slate-100",
      tooltipBg: "bg-slate-950 text-white",
      badgeBg: "bg-[#FF4D4F] text-white shadow-md shadow-red-500/20",
      particleColor: "text-[#FF4D4F]"
    },
    sepia: {
      progressBg: "stroke-[#E8DCBF]",
      tooltipBg: "bg-[#5B4636] text-[#F4ECD8]",
      badgeBg: "bg-[#A13E3E] text-[#F4ECD8] shadow-md shadow-red-800/20",
      particleColor: "text-[#A13E3E]"
    },
    dark: {
      progressBg: "stroke-slate-800/60",
      tooltipBg: "bg-white text-slate-950",
      badgeBg: "bg-red-500 text-white shadow-md shadow-red-500/40",
      particleColor: "text-red-500"
    }
  }[theme];

  return (
    <div 
      className={`${className} z-40 select-none flex flex-col items-center`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
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
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 font-bold text-xs pointer-events-none ${themeStaticStyles.particleColor}`}
            >
              ❤️ +1
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Hover/Click Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
              className={`absolute bottom-full left-1/2 mb-3 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide shadow-md whitespace-nowrap pointer-events-none z-50 text-center ${themeStaticStyles.tooltipBg}`}
            >
              Valoración: {userLikes}/5 • Total: {totalLikes}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Total Likes Badge bubble */}
        {totalLikes > 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1.5 -right-1.5 z-30 font-black text-[9px] px-1.5 py-0.5 rounded-full select-none ${themeStaticStyles.badgeBg}`}
          >
            {totalLikes}
          </motion.div>
        )}

        {/* Circular Floating Button */}
        <motion.button
          onClick={handleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={animateHeart && userLikes >= 5 ? {
            x: [0, -3, 3, -3, 3, 0],
            transition: { duration: 0.4 }
          } : {}}
          className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer relative z-25 ${
            getButtonStyles()
          }`}
        >
          {/* Circular SVG Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            {/* Background ring */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              strokeWidth={strokeWidth}
              fill="transparent"
              className={themeStaticStyles.progressBg}
            />
            {/* Dynamic progress ring */}
            <motion.circle
              cx="24"
              cy="24"
              r={radius}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circ}
              animate={{ strokeDashoffset: offset }}
              style={getRingInlineStyle()}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
              strokeLinecap="round"
            />
          </svg>

          {/* Heart icon */}
          <motion.div
            animate={animateHeart && userLikes < 5 ? {
              scale: [1, 1.35, 0.9, 1.1, 1],
              transition: { duration: 0.35 }
            } : {}}
          >
            <Heart 
              className="w-4.5 h-4.5 transition-all duration-300"
              style={getHeartStyle()}
            />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
