"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const {
    usuario,
    carregando,
    sessaoExpirada,
  } = useAuth();

  useEffect(() => {
    if (
      !carregando &&
      !usuario &&
      !sessaoExpirada
    ) {
      router.replace("/login");
    }
  }, [
    carregando,
    usuario,
    sessaoExpirada,
    router,
  ]);

  if (carregando) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-500 shadow-sm">
          Verificando sua sessão...
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return <>{children}</>;
}
