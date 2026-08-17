"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Toast } from "./Toast";

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

type FeedbackContextValue = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
};

const FeedbackContext =
  createContext<FeedbackContextValue | null>(null);

type FeedbackProviderProps = {
  children: ReactNode;
};

export function FeedbackProvider({
  children,
}: FeedbackProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const sequence = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((atuais) =>
      atuais.filter((toast) => toast.id !== id)
    );
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      sequence.current += 1;
      const id = Date.now() + sequence.current;

      setToasts((atuais) => [
        ...atuais,
        { id, type, message },
      ]);

      window.setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const value = useMemo<FeedbackContextValue>(
    () => ({
      showSuccess: (message) => addToast("success", message),
      showError: (message) => addToast("error", message),
      showWarning: (message) => addToast("warning", message),
      showInfo: (message) => addToast("info", message),
    }),
    [addToast]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error(
      "useFeedback deve ser usado dentro de FeedbackProvider."
    );
  }

  return context;
}
