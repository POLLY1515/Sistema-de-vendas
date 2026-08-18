"use client";

type SessionExpiredModalProps = {
  open: boolean;
  onGoToLogin: () => void;
};

export function SessionExpiredModal({
  open,
  onGoToLogin,
}: SessionExpiredModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl">
          !
        </div>

        <h2
          id="session-expired-title"
          className="text-xl font-bold text-slate-900"
        >
          Sessão expirada
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Seu acesso expirou por segurança. Faça login
          novamente para continuar usando o sistema.
        </p>

        <button
          type="button"
          onClick={onGoToLogin}
          className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Ir para o login
        </button>
      </div>
    </div>
  );
}
