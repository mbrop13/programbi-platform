"use client";

import { useState, createContext, useContext, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

/* ── Toast Context ── */
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg shadow-lift border min-w-[280px] max-w-[380px] backdrop-blur-sm
                ${t.type === "success" ? "bg-ok-bg border-ok-border" : ""}
                ${t.type === "error" ? "bg-danger-bg border-danger-border" : ""}
                ${t.type === "info" ? "bg-surface border-border" : ""}
                ${t.type === "warning" ? "bg-warn-bg border-warn-border" : ""}
              `}
            >
              <ToastIcon type={t.type} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${
                  t.type === "success" ? "text-ok" :
                  t.type === "error" ? "text-danger" :
                  t.type === "warning" ? "text-warn" :
                  "text-text"
                }`}>{t.title}</p>
                {t.message && (
                  <p className="text-xs text-text-secondary mt-0.5">{t.message}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-text-muted hover:text-text transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastIcon({ type }: { type: ToastType }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-ok shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-danger shrink-0" />,
    info: <Info className="w-5 h-5 text-text shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-warn shrink-0" />,
  };
  return icons[type];
}
