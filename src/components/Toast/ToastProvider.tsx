'use client';

import React, { createContext, useContext, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 3500) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

// ── Premium toast styles ────────────────────────────────────────────────────────
const TOAST_CONFIG: Record<ToastType, { bar: string; icon: React.ReactNode; label: string }> = {
  success: { bar: 'bg-green-500',  icon: <Check className="w-4 h-4 text-green-500" />,    label: 'Success' },
  error:   { bar: 'bg-red-500',    icon: <AlertCircle className="w-4 h-4 text-red-500" />, label: 'Error'   },
  info:    { bar: 'bg-blue-500',   icon: <Info className="w-4 h-4 text-blue-500" />,       label: 'Info'    },
  warning: { bar: 'bg-amber-500',  icon: <AlertTriangle className="w-4 h-4 text-amber-500" />, label: 'Warning' },
};

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] pointer-events-none flex flex-col gap-2 items-end"
      role="region"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {toasts.map(toast => {
          const cfg = TOAST_CONFIG[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-900/8 overflow-hidden pointer-events-auto cursor-pointer max-w-[300px]"
              onClick={() => onRemove(toast.id)}
              role="alert"
              aria-label={`${cfg.label}: ${toast.message}`}
            >
              <div className={`w-1 self-stretch flex-shrink-0 ${cfg.bar}`} />
              <div className="flex-shrink-0 py-3">{cfg.icon}</div>
              <span className="flex-1 text-sm font-medium text-gray-800 leading-snug py-3 pr-1">{toast.message}</span>
              <button
                onClick={e => { e.stopPropagation(); onRemove(toast.id); }}
                aria-label="Dismiss notification"
                className="flex-shrink-0 p-3 text-gray-300 hover:text-gray-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
