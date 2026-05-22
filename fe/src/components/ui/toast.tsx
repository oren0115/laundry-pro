/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type ToastVariant = "default" | "success" | "error";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  toasts: ToastItem[];
  toast: (item: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...item, id }]);
    window.setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  const value = React.useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function Toaster({
  toasts,
  dismiss,
}: {
  toasts: ToastItem[];
  dismiss: (id: string) => void;
}) {
  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-20 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-4"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto animate-in slide-in-from-right-4 fade-in rounded-xl border bg-card p-4 shadow-lg duration-300",
            t.variant === "success" && "border-primary/30",
            t.variant === "error" && "border-destructive/30"
          )}
          role="status"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
              )}
            </div>
            <button
              type="button"
              className="rounded-md p-1 text-muted-foreground hover:bg-muted"
              onClick={() => dismiss(t.id)}
              aria-label="Tutup"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
