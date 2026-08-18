"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { SessionExpiredModal } from "@/components/auth/SessionExpiredModal";
import {
  buscarUsuarioLogado,
  fazerLogout,
} from "@/lib/authService";
import { observarSessaoExpirada } from "@/lib/authEvents";
import { buscarToken } from "@/lib/authStorage";
import { ApiHttpError } from "@/lib/apiFetch";
import type { UsuarioLogado } from "@/types/auth";

type AuthContextType = {
  usuario: UsuarioLogado | null;
  carregando: boolean;
  sessaoExpirada: boolean;
  atualizarUsuario: () => Promise<void>;
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<UsuarioLogado | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [sessaoExpirada, setSessaoExpirada] =
    useState(false);

  async function atualizarUsuario() {
    const token = buscarToken();

    if (!token) {
      setUsuario(null);
      setCarregando(false);
      return;
    }

    try {
      const usuarioAtual =
        await buscarUsuarioLogado();

      setUsuario(usuarioAtual);
      setSessaoExpirada(false);
    } catch (error) {
      if (
        error instanceof ApiHttpError &&
        error.status === 401
      ) {
        setUsuario(null);
        return;
      }

      fazerLogout();
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }

  function logout() {
    fazerLogout();
    setUsuario(null);
    setSessaoExpirada(false);
    setCarregando(false);
  }

  function voltarParaLogin() {
    setSessaoExpirada(false);
    router.replace(
      "/login?motivo=sessao-expirada"
    );
  }

  useEffect(() => {
    const pararDeObservar =
      observarSessaoExpirada(() => {
        setUsuario(null);
        setCarregando(false);
        setSessaoExpirada(true);
      });

    const timer = window.setTimeout(() => {
      void atualizarUsuario();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      pararDeObservar();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        sessaoExpirada,
        atualizarUsuario,
        logout,
      }}
    >
      {children}

      <SessionExpiredModal
        open={sessaoExpirada}
        onGoToLogin={voltarParaLogin}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      "useAuth deve ser usado dentro de AuthProvider."
    );
  }

  return contexto;
}
