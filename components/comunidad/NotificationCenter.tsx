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
  Check,
  CheckCheck,
  Loader2,
  Inbox,
} from "lucide-react";

/* ── Notification type config ── */
const NOTIF_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  announcement: { icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  live: { icon: Radio, color: "text-rose-500", bg: "bg-rose-50" },
  lesson: { icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
  achievement: { icon: Trophy, color: "text-purple-500", bg: "bg-purple-50" },
  comment: { icon: MessageCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
  default: { icon: Bell, color: "text-gray-500", bg: "bg-gray-50" },
};

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  link?: string;
}

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Mock data (will be replaced with server action) ── */
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    // Simulated fetch — replace with getNotifications()
    setTimeout(() => {
      setNotifications([
        {
          id: "1",
          type: "announcement",
          title: "Nuevo anuncio en el muro",
          body: "El administrador publicó un nuevo anuncio sobre la masterclass de esta semana.",
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          id: "2",
          type: "live",
          title: "Masterclass en vivo pronto",
          body: "Tu próxima clase 'Python Avanzado' comienza en 30 minutos.",
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: "3",
          type: "achievement",
          title: "¡Logro desbloqueado!",
          body: "Has completado 10 lecciones. ¡Sigue así!",
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        },
        {
          id: "4",
          type: "comment",
          title: "Nueva respuesta",
          body: "María respondió a tu pregunta en el muro de la comunidad.",
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
      ]);
      setLoading(false);
    }, 300);
  }, [open]);

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

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
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
          className="fixed top-4 right-4 w-[360px] max-h-[500px] bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-[100] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-400" />
              Notificaciones
              {unreadCount > 0 && (
                <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-blue-600 transition-colors"
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
                <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Inbox className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => {
                  const config = NOTIF_CONFIG[notif.type] || NOTIF_CONFIG.default;
                  const Icon = config.icon;
                  return (
                    <button
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex gap-3.5
                        ${!notif.read ? "bg-blue-50/30" : ""}`}
                    >
                      <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-sm font-semibold truncate ${!notif.read ? "text-gray-900" : "text-gray-700"}`}>
                            {notif.title}
                          </span>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-brand-blue shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{notif.body}</p>
                        <span className="text-[10px] text-gray-400 font-medium mt-1 block">
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
