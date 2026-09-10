"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export default function EmptyState({ icon: Icon, title, description, ctaLabel, onCtaClick }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md mx-auto"
    >
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-500 mb-5">{description}</p>
      {ctaLabel && onCtaClick && (
        <button
          onClick={onCtaClick}
          className="px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium"
        >
          {ctaLabel}
        </button>
      )}
    </motion.div>
  );
}
