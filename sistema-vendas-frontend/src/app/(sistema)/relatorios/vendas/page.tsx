"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RelatorioRow } from "@/features/relatorios/components/RelatorioRow";
import { relatorioService } from "@/services/relatorioService";
import type {
  FiltrosRelatorioVendas,
  ResumoRelatorioVendas,
  VendaRelatorio,
} from "@/types/relatorio";
import { exportarVendasParaCsv } from "@/utils/exportCsv";
import { formatarMoeda } from "@/utils/formatters";

const filtrosIniciais: FiltrosRelatorioVendas = {
  dataInicio: "",
  dataFim: "",
  status: "",
};

export default function RelatorioVendasPage() {
  const [filtros, setFiltros] =
    useState<FiltrosRelatorioVendas>(
      filtrosIniciais
    );
  const [vendas, setVendas] =
    useState<VendaRelatorio[]>([]);
  const [carregando, setCarregando] =
    useState(true);
  const [erro, setErro] = useState("");

  const carregarRelatorio = useCallback(
    async (
      filtrosDaBusca: FiltrosRelatorioVendas
    ) => {
      try {
        setCarregando(true);
        setErro("");
        const dados =
          await relatorioService.buscarVendas(
            filtrosDaBusca
          );
        setVendas(dados);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o relatório de vendas."
        );
      } finally {
        setCarregando(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void carregarRelatorio(
        filtrosIniciais
      );
    }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [carregarRelatorio]);

  const resumo =
    useMemo<ResumoRelatorioVendas>(() => {
      const vendasConsideradas =
        vendas.filter(
          (venda) =>
            venda.status !== "CANCELADO"
        );

      const quantidadeVendas =
        vendasConsideradas.length;

      const faturamentoTotal =
        vendasConsideradas.reduce(
          (total, venda) =>
            total +
            Number(venda.total ?? 0),
          0
        );

      const ticketMedio =
        quantidadeVendas > 0
          ? faturamentoTotal /
            quantidadeVendas
          : 0;

      return {
        quantidadeVendas,
        faturamentoTotal,
        ticketMedio,
      };
    }, [vendas]);

  function atualizarFiltro(
    campo: keyof FiltrosRelatorioVendas,
    valor: string
  ) {
    setFiltros((atuais) => ({
      ...atuais,
      [campo]: valor,
    }));
  }

  function filtrar() {
    if (
      filtros.dataInicio &&
      filtros.dataFim &&
      filtros.dataInicio >
        filtros.dataFim
    ) {
      setErro(
        "A data inicial não pode ser maior que a data final."
      );
      return;
    }

    void carregarRelatorio(filtros);
  }

  function limparFiltros() {
    setFiltros(filtrosIniciais);
    void carregarRelatorio(
      filtrosIniciais
    );
  }

  function exportarCsv() {
    if (vendas.length === 0) {
      window.alert(
        "Não existem vendas para exportar."
      );
      return;
    }

    exportarVendasParaCsv(vendas);
  }

  return (
    <main className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">
          Relatório de vendas
        </h1>
        <p className="text-sm text-slate-500">
          Filtre as vendas por período e status,
          acompanhe os indicadores e exporte o
          resultado para CSV.
        </p>
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Data inicial
          </label>
          <input
            type="date"
            value={filtros.dataInicio}
            onChange={(event) =>
              atualizarFiltro(
                "dataInicio",
                event.target.value
              )
            }
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Data final
          </label>
          <input
            type="date"
            value={filtros.dataFim}
            onChange={(event) =>
              atualizarFiltro(
                "dataFim",
                event.target.value
              )
            }
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            value={filtros.status}
            onChange={(event) =>
              atualizarFiltro(
                "status",
                event.target.value
              )
            }
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            <option value="ABERTO">
              Aberto
            </option>
            <option value="FINALIZADO">
              Finalizado
            </option>
            <option value="CANCELADO">
              Cancelado
            </option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={filtrar}
            disabled={carregando}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={limparFiltros}
            disabled={carregando}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
          >
            Limpar
          </button>
        </div>
      </section>

      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {erro}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Faturamento
          </p>
          <strong className="mt-1 block text-2xl text-slate-900">
            {formatarMoeda(
              resumo.faturamentoTotal
            )}
          </strong>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Quantidade de vendas
          </p>
          <strong className="mt-1 block text-2xl text-slate-900">
            {resumo.quantidadeVendas}
          </strong>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Ticket médio
          </p>
          <strong className="mt-1 block text-2xl text-slate-900">
            {formatarMoeda(
              resumo.ticketMedio
            )}
          </strong>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Vendas encontradas
            </h2>
            <p className="text-sm text-slate-500">
              {vendas.length} registro(s) no
              resultado atual.
            </p>
          </div>

          <button
            type="button"
            onClick={exportarCsv}
            disabled={
              carregando ||
              vendas.length === 0
            }
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Exportar CSV
          </button>
        </div>

        {carregando ? (
          <p className="py-6 text-sm text-slate-500">
            Carregando relatório...
          </p>
        ) : vendas.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhuma venda encontrada para os
            filtros informados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2">
                    ID
                  </th>
                  <th className="px-3 py-2">
                    Cliente
                  </th>
                  <th className="px-3 py-2">
                    Status
                  </th>
                  <th className="px-3 py-2">
                    Data
                  </th>
                  <th className="px-3 py-2">
                    Itens
                  </th>
                  <th className="px-3 py-2 text-right">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {vendas.map((venda) => (
                  <RelatorioRow
                    key={venda.id}
                    venda={venda}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
