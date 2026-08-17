"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  buscarUsuarioLogado,
  fazerLogout,
} from "@/lib/authService";

import { buscarToken } from "@/lib/authStorage";
import type { UsuarioLogado } from "@/types/auth";

type AuthContextType = {
  usuario: UsuarioLogado | null;
  carregando: boolean;
  atualizarUsuario: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [usuario, setUsuario] =
    useState<UsuarioLogado | null>(null);

  const [carregando, setCarregando] = useState(true);

  async function atualizarUsuario() {
    const token = buscarToken();

    if (!token) {
      setUsuario(null);
      setCarregando(false);
      return;
    }

    try {
      const usuarioAtual = await buscarUsuarioLogado();
      setUsuario(usuarioAtual);
    } catch {
      fazerLogout();
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }

  function logout() {
    fazerLogout();
    setUsuario(null);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void atualizarUsuario();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        atualizarUsuario,
        logout,
      }}
    >
      {children}
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