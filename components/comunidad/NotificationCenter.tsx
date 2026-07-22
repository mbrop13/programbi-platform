"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MessageCircle,
  Radio,
  Trophy,
  BookOpen,
  Star,
  CheckCheck,
  Loader2,
  Inbox,
  GraduationCap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/supabase/comunidad";

/* ── Notification type config ── */
const NOTIF_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  announcement: { icon: Star, color: "text-text", bg: "bg-surface-hover" },
  live: { icon: Radio, color: "text-rose-500", bg: "bg-rose-50/60 dark:bg-rose-950/20" },
  lesson: { icon: BookOpen, color: "text-text", bg: "bg-surface-hover" },
  achievement: { icon: Trophy, color: "text-text", bg: "bg-surface-hover" },
  comment: { icon: MessageCircle, color: "text-text", bg: "bg-surface-hover" },
  course: { icon: GraduationCap, color: "text-text", bg: "bg-surface-hover" },
  default: { icon: Bell, color: "text-text-secondary", bg: "bg-surface-hover" },
};

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  link?: string;
  user_id?: string;
}
import { cn } from "@/lib/utils";

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number | ((prev: number) => number)) => void;
  collapsed?: boolean;
}

export default function NotificationCenter({ open, onClose, onUnreadChange, collapsed = false }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Load notifications from server ── */
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data as Notification[]);
      const unread = (data as Notification[]).filter((n) => !n.read).length;
      onUnreadChange?.(unread);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  /* ── Supabase Realtime subscription ── */
  useEffect(() => {
    const supabase = createClient();

    const channelId = `notifications_realtime_${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        async (payload) => {
          // Get current user to filter
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const newNotif = payload.new as Notification;
          if (newNotif.user_id !== user.id) return;

          // Add to state if panel is open
          setNotifications((prev) => [newNotif, ...prev]);
          onUnreadChange?.((prev: number) => prev + (newNotif.read ? 0 : 1));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
        },
        async (payload) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const updated = payload.new as Notification;
          if (updated.user_id !== user.id) return;

          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (open) {
      setTimeout(() => document.addEventListener("mousedown", handler), 100);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onUnreadChange?.(0);
    await markAllNotificationsRead();
  };

  const handleMarkRead = async (notif: Notification) => {
    if (!notif.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
      onUnreadChange?.((prev: number) => Math.max(0, prev - 1));
      await markNotificationRead(notif.id);
    }
    // Navigate if link exists
    if (notif.link) {
      window.location.href = notif.link;
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "fixed z-[100] flex flex-col bg-surface rounded-xl shadow-lift border border-border overflow-hidden w-[360px] max-h-[500px]",
            collapsed
              ? "bottom-16 left-4 md:left-[76px]"
              : "bottom-16 left-4 md:left-[264px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <h3 className="font-bold text-sm text-text flex items-center gap-2">
              <Bell className="w-4 h-4 text-text-muted" />
              Notificaciones
              {unreadCount > 0 && (
                <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-semibold text-text hover:text-text-secondary transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar todas
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-text-muted animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Inbox className="w-10 h-10 text-text-muted mb-2" />
                <p className="text-sm text-text-secondary">No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => {
                  const config = NOTIF_CONFIG[notif.type] || NOTIF_CONFIG.default;
                  const Icon = config.icon;
                  return (
                    <button
                      key={notif.id}
                      onClick={() => handleMarkRead(notif)}
                      className={`w-full text-left px-5 py-4 hover:bg-surface-hover transition-colors flex gap-3.5
                        ${!notif.read ? "bg-accent-soft" : ""}`}
                    >
                      <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-sm font-semibold truncate ${!notif.read ? "text-text" : "text-text-secondary"}`}>
                            {notif.title}
                          </span>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-text-secondary line-clamp-2">{notif.body}</p>
                        <span className="text-[10px] text-text-muted font-medium mt-1 block">
                          {getNotifTime(notif.created_at)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function getNotifTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin}m`;
  if (diffHr < 24) return `Hace ${diffHr}h`;
  return `Hace ${diffDay}d`;
}
