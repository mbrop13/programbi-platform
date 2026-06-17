import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  const cleanUrl = url.split("?")[0].toLowerCase();
  return (
    cleanUrl.endsWith(".mp4") ||
    cleanUrl.endsWith(".webm") ||
    cleanUrl.endsWith(".ogg") ||
    url.includes("/videos/") ||
    url.includes("/video/")
  );
}

export function getOptimizedShareImage(url?: string): string {
  if (!url) return "/default-og.png";
  if (url.startsWith("/")) return url;
  
  // Use Next.js native image optimization endpoint to compress images to < 100KB
  return `/_next/image?url=${encodeURIComponent(url)}&w=1200&q=75`;
}

