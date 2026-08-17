"use client";

import type { ToastType } from "./FeedbackProvider";

type ToastProps = {
  id: number;
  type: ToastType;
  message: string;
  onClose: (id: number) => void;
};

const styles: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

const labels: Record<ToastType, string> = {
  success: "Sucesso",
  error: "Erro",
  warning: "Atenção",
  info: "Informação",
};

export function Toast({
  id,
  type,
  message,
  onClose,
}: ToastProps) {
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`pointer-events-auto w-full max-w-sm rounded-xl border p-4 shadow-lg ${styles[type]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold">{labels[type]}</p>
          <p className="mt-1 text-sm leading-5">{message}</p>
        </div>

        <button
          type="button"
          onClick={() => onClose(id)}
          className="rounded-md px-2 py-1 text-xs font-bold opacity-70 transition hover:bg-black/5 hover:opacity-100"
          aria-label="Fechar mensagem"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
