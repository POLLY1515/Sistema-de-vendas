import Link from "next/link";

export default function SemPermissaoPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
          !
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Acesso não permitido
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Você está autenticado, mas seu perfil não
          possui permissão para acessar esta função.
          Sua sessão continua ativa.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Voltar ao dashboard
        </Link>
      </section>
    </main>
  );
}
