"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { LoadingState } from "@/components/ui/LoadingState";
import { Pagination } from "@/components/ui/Pagination";
import { PedidoDetailsModal } from "@/features/pedidos/components/PedidoDetailsModal";
import { PedidoFilters } from "@/features/pedidos/components/PedidoFilters";
import { PedidoTable } from "@/features/pedidos/components/PedidoTable";
import {
  buscarPedidoPorId,
  buscarPedidos,
  cancelarPedido,
} from "@/features/pedidos/services/pedidoService";
import type {
  PedidoDetalhes,
  PedidoFiltros,
  PedidoLista,
  PedidoPage,
} from "@/features/pedidos/types";

const filtrosIniciais: PedidoFiltros = {
  status: "",
  cliente: "",
  dataInicio: "",
  dataFim: "",
};

const paginaInicial: PedidoPage = {
  content: [],
  number: 0,
  totalPages: 0,
  totalElements: 0,
  size: 10,
};

export default function VendasPage() {
  const [page, setPage] = useState(0);
  const [filtros, setFiltros] =
    useState<PedidoFiltros>(filtrosIniciais);
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<PedidoFiltros>(filtrosIniciais);
  const [dados, setDados] =
    useState<PedidoPage>(paginaInicial);
  const [pedidoDetalhe, setPedidoDetalhe] =
    useState<PedidoDetalhes | null>(null);
  const [pedidoParaCancelar, setPedidoParaCancelar] =
    useState<PedidoLista | null>(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);
  const [cancelandoId, setCancelandoId] =
    useState<number | null>(null);
  const [mensagem, setMensagem] = useState("");

  const carregarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setErro("");

      const resposta = await buscarPedidos({
        page,
        filtros: filtrosAplicados,
      });

      setDados(resposta);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar pedidos."
      );
    } finally {
      setLoading(false);
    }
  }, [page, filtrosAplicados]);

  useEffect(() => {
    void carregarPedidos();
  }, [carregarPedidos]);

  function aplicarFiltros() {
    if (
      filtros.dataInicio &&
      filtros.dataFim &&
      filtros.dataInicio > filtros.dataFim
    ) {
      setErro(
        "A data inicial não pode ser maior que a data final."
      );
      return;
    }

    setErro("");
    setMensagem("");
    setPedidoDetalhe(null);
    setPage(0);
    setFiltrosAplicados({
      ...filtros,
      cliente: filtros.cliente.trim(),
    });
  }

  function limparFiltros() {
    setFiltros(filtrosIniciais);
    setFiltrosAplicados(filtrosIniciais);
    setPedidoDetalhe(null);
    setMensagem("");
    setErro("");
    setPage(0);
  }

  async function abrirDetalhes(pedido: PedidoLista) {
    try {
      setLoadingDetalhe(true);
      setErro("");

      const detalhe = await buscarPedidoPorId(pedido.id);
      setPedidoDetalhe(detalhe);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar detalhes do pedido."
      );
    } finally {
      setLoadingDetalhe(false);
    }
  }

  async function confirmarCancelamento() {
    if (!pedidoParaCancelar) return;

    try {
      setCancelandoId(pedidoParaCancelar.id);
      setErro("");
      setMensagem("");

      await cancelarPedido(pedidoParaCancelar.id);

      setMensagem(
        `Pedido #${pedidoParaCancelar.id} cancelado com sucesso.`
      );
      setPedidoParaCancelar(null);
      setPedidoDetalhe(null);
      await carregarPedidos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao cancelar pedido."
      );
    } finally {
      setCancelandoId(null);
    }
  }

  return (
    <main className="space-y-6">
      <PageHeader
        title="Vendas"
        description="Consulte, filtre, veja detalhes e cancele pedidos."
        actions={
          <span className="text-sm text-slate-500">
            {dados.totalElements}{" "}
            {dados.totalElements === 1 ? "pedido" : "pedidos"}
          </span>
        }
      />

      <ErrorAlert message={erro} />

      {mensagem && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          {mensagem}
        </div>
      )}

      <PedidoFilters
        filtros={filtros}
        loading={loading}
        onChange={setFiltros}
        onBuscar={aplicarFiltros}
        onLimpar={limparFiltros}
      />

      {loading ? (
        <LoadingState text="Carregando pedidos..." />
      ) : (
        <PedidoTable
          pedidos={dados.content}
          cancelandoId={cancelandoId}
          onVerDetalhes={(pedido) =>
            void abrirDetalhes(pedido)
          }
          onCancelar={setPedidoParaCancelar}
        />
      )}

      <Pagination
        page={dados.number}
        totalPages={dados.totalPages}
        onPageChange={setPage}
      />

      <PedidoDetailsModal
        pedido={pedidoDetalhe}
        loading={loadingDetalhe}
        onClose={() => setPedidoDetalhe(null)}
      />

      <ConfirmModal
        open={Boolean(pedidoParaCancelar)}
        title="Cancelar pedido"
        description={
          pedidoParaCancelar
            ? `Deseja realmente cancelar o pedido #${pedidoParaCancelar.id}? O backend deverá devolver os itens ao estoque.`
            : ""
        }
        confirmText="Cancelar pedido"
        loading={cancelandoId !== null}
        onCancel={() => {
          if (cancelandoId === null) {
            setPedidoParaCancelar(null);
          }
        }}
        onConfirm={() => void confirmarCancelamento()}
      />
    </main>
  );
}
