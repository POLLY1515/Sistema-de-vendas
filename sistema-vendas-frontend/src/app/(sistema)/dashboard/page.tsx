"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { dashboardService } from "@/services/dashboardService";
import type { DashboardResumo } from "@/types/dashboard";
import {
  formatarDataHora,
  formatarMoeda,
} from "@/utils/formatters";

function statusClasse(status: string) {
  const classes: Record<string, string> = {
    ABERTO:
      "bg-amber-100 text-amber-800",
    PAGO:
      "bg-emerald-100 text-emerald-800",
    FINALIZADO:
      "bg-blue-100 text-blue-800",
    CANCELADO:
      "bg-red-100 text-red-800",
  };

  return (
    classes[status] ??
    "bg-slate-100 text-slate-700"
  );
}

export default function DashboardPage() {
  const [resumo, setResumo] =
    useState<DashboardResumo | null>(null);
  const [carregando, setCarregando] =
    useState(true);
  const [erro, setErro] = useState("");

  const stats = useDashboardStats(resumo);

  const carregarDashboard = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");
      const dados =
        await dashboardService.buscarResumo();
      setResumo(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar o dashboard."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void carregarDashboard();
    }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [carregarDashboard]);

  if (carregando && !resumo) {
    return (
      <p className="text-sm text-slate-500">
        Carregando dashboard...
      </p>
    );
  }

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Acompanhe os principais indicadores do sistema de vendas.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            void carregarDashboard()
          }
          disabled={carregando}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {carregando
            ? "Atualizando..."
            : "Atualizar dados"}
        </button>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {erro}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.cards.map((card) => (
          <article
            key={card.titulo}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {card.titulo}
            </p>
            <strong className="mt-2 block text-2xl font-bold text-slate-900">
              {card.valor}
            </strong>
            <p className="mt-2 text-xs text-slate-500">
              {card.descricao}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              Pedidos por status
            </h2>
            <span className="text-sm text-slate-500">
              {stats.vendasHoje} venda(s) hoje
            </span>
          </div>

          <div className="space-y-3">
            {stats.resumoPorStatus.length ? (
              stats.resumoPorStatus.map(
                (item) => (
                  <div
                    key={item.status}
                    className="rounded-xl border border-slate-100 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasse(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                      <strong className="text-sm text-slate-900">
                        {formatarMoeda(
                          item.valorTotal
                        )}
                      </strong>
                    </div>
                    <p className="text-sm text-slate-500">
                      {item.quantidade} pedido(s)
                      neste status.
                    </p>
                  </div>
                )
              )
            ) : (
              <p className="text-sm text-slate-500">
                Nenhum pedido encontrado.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Últimas vendas
          </h2>

          {stats.ultimasVendas.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left text-slate-600">
                    <th className="px-3 py-2">
                      Código
                    </th>
                    <th className="px-3 py-2">
                      Cliente
                    </th>
                    <th className="px-3 py-2">
                      Data
                    </th>
                    <th className="px-3 py-2">
                      Status
                    </th>
                    <th className="px-3 py-2 text-right">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.ultimasVendas.map(
                    (venda) => (
                      <tr
                        key={venda.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-3 py-3 font-medium text-slate-900">
                          #{venda.id}
                        </td>
                        <td className="px-3 py-3 text-slate-700">
                          {venda.clienteNome}
                        </td>
                        <td className="px-3 py-3 text-slate-500">
                          {formatarDataHora(
                            venda.dataCriacao
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClasse(
                              venda.status
                            )}`}
                          >
                            {venda.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-slate-900">
                          {formatarMoeda(
                            venda.total
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Nenhuma venda recente.
            </p>
          )}
        </article>
      </section>
    </main>
  );
}
