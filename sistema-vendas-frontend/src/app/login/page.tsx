"use client";

import {
  Suspense,
  useState,
  type FormEvent,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { fazerLogin } from "@/lib/authService";
import { useAuth } from "@/contexts/AuthContext";
import { getErrorMessage } from "@/lib/getErrorMessage";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { atualizarUsuario } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  const motivo = searchParams.get("motivo");

  const mensagemSessao =
    motivo === "sessao-expirada"
      ? "Sua sessão expirou. Entre novamente para continuar."
      : "";

  async function entrar(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();
    setErro("");

    try {
      setEntrando(true);

      await fazerLogin({ email, senha });
      await atualizarUsuario();

      router.replace("/dashboard");
    } catch (error) {
      setErro(
        getErrorMessage(
          error,
          "E-mail ou senha inválidos."
        )
      );
    } finally {
      setEntrando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-slate-900">
          Entrar no sistema
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Informe suas credenciais para acessar o
          Sistema de Vendas.
        </p>

        {mensagemSessao && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {mensagemSessao}
          </div>
        )}

        {erro && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {erro}
          </div>
        )}

        <div className="mt-6">
          <label
            htmlFor="login-email"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            E-mail
          </label>

          <input
            id="login-email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="seu@email.com"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="login-senha"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Senha
          </label>

          <input
            id="login-senha"
            value={senha}
            onChange={(event) =>
              setSenha(event.target.value)
            }
            placeholder="Sua senha"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={entrando}
          className="mt-6 w-full rounded-xl bg-blue-600 p-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {entrando
            ? "Entrando..."
            : "Entrar"}
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">
          Carregando login...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
