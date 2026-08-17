"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  buscarPedidoPorId,
  listarPedidos,
} from "@/services/pedidoService";
import type {
  PageResponse,
  PedidoDetalhe,
  PedidoResumo,
} from "@/types/pedido";

const statusOptions = ["", "ABERTO", "FINALIZADO", "CANCELADO"];

const resultadoInicial: PageResponse<PedidoResumo> = {
  content: [],
  totalPages: 0,
  totalElements: 0,
  number: 0,
  size: 10,
};

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function formatarData(valor: string, comHora = false) {
  if (!valor) return "-";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return valor;

  return comHora
    ? data.toLocaleString("pt-BR")
    : data.toLocaleDateString("pt-BR");
}

export default function VendasPage() {
  const [status, setStatus] = useState("");
  const [cliente, setCliente] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    status: "",
    cliente: "",
    dataInicio: "",
    dataFim: "",
  });
  const [page, setPage] = useState(0);
  const [resultado, setResultado] =
    useState<PageResponse<PedidoResumo>>(resultadoInicial);
  const [pedidoDetalhe, setPedidoDetalhe] = useState<PedidoDetalhe | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [erro, setErro] = useState("");

  const carregarPedidos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const dados = await listarPedidos({
        ...filtrosAplicados,
        page,
        size: 10,
      });

      setResultado(dados);
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao buscar vendas."
      );
    } finally {
      setCarregando(false);
    }
  }, [filtrosAplicados, page]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void carregarPedidos();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [carregarPedidos]);

  function aplicarFiltros(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (dataInicio && dataFim && dataInicio > dataFim) {
      setErro("A data inicial nao pode ser maior que a data final.");
      return;
    }

    setErro("");
    setPedidoDetalhe(null);
    setPage(0);
    setFiltrosAplicados({
      status,
      cliente: cliente.trim(),
      dataInicio,
      dataFim,
    });
  }

  function limparFiltros() {
    setStatus("");
    setCliente("");
    setDataInicio("");
    setDataFim("");
    setPedidoDetalhe(null);
    setPage(0);
    setFiltrosAplicados({
      status: "",
      cliente: "",
      dataInicio: "",
      dataFim: "",
    });
  }

  async function abrirDetalhes(id: number) {
    try {
      setCarregandoDetalhe(true);
      setErro("");
      const detalhe = await buscarPedidoPorId(id);
      setPedidoDetalhe(detalhe);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Nao foi possivel carregar os detalhes do pedido."
      );
    } finally {
      setCarregandoDetalhe(false);
    }
  }

  const totalDaPagina = useMemo(
    () =>
      resultado.content.reduce((soma, pedido) => soma + pedido.total, 0),
    [resultado.content]
  );

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendas</h1>
          <p className="text-sm text-slate-600">
            Consulte pedidos, aplique filtros e visualize os itens vendidos.
          </p>
        </div>
        <span className="text-sm text-slate-500">
          {resultado.totalElements} {resultado.totalElements === 1 ? "pedido" : "pedidos"}
        </span>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {erro}
        </div>
      )}

      <form
        onSubmit={aplicarFiltros}
        className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {statusOptions.map((opcao) => (
                <option key={opcao || "TODOS"} value={opcao}>
                  {opcao || "Todos os status"}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Cliente
            <input
              value={cliente}
              onChange={(event) => setCliente(event.target.value)}
              placeholder="Nome do cliente"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Data inicial
            <input
              type="date"
              value={dataInicio}
              onChange={(event) => setDataInicio(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Data final
            <input
              type="date"
              value={dataFim}
              onChange={(event) => setDataFim(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={limparFiltros}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            Limpar filtros
          </button>
        </div>
      </form>

      <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Pedidos encontrados
          </h2>
          <span className="text-sm text-slate-600">
            Total desta pagina: {formatarMoeda(totalDaPagina)}
          </span>
        </div>

        {carregando ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Carregando vendas...
          </p>
        ) : resultado.content.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhuma venda encontrada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="p-3">ID</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Total</th>
                  <th className="p-3 text-right">Acao</th>
                </tr>
              </thead>
              <tbody>
                {resultado.content.map((pedido) => (
                  <tr key={pedido.id} className="border-b">
                    <td className="p-3 font-medium">#{pedido.id}</td>
                    <td className="p-3">{pedido.clienteNome}</td>
                    <td className="p-3">{formatarData(pedido.dataCriacao)}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {pedido.status}
                      </span>
                    </td>
                    <td className="p-3 font-medium">
                      {formatarMoeda(pedido.total)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => void abrirDetalhes(pedido.id)}
                        disabled={carregandoDetalhe}
                        className="font-semibold text-slate-900 underline disabled:opacity-50"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {resultado.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>
              Pagina {resultado.number + 1} de {resultado.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 0 || carregando}
                onClick={() => setPage((valor) => Math.max(valor - 1, 0))}
                className="rounded-lg border px-3 py-2 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={page + 1 >= resultado.totalPages || carregando}
                onClick={() => setPage((valor) => valor + 1)}
                className="rounded-lg border px-3 py-2 disabled:opacity-50"
              >
                Proxima
              </button>
            </div>
          </div>
        )}
      </section>

      {pedidoDetalhe && (
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Pedido #{pedidoDetalhe.id}
              </h2>
              <p className="text-sm text-slate-600">
                Cliente: {pedidoDetalhe.clienteNome}
                {pedidoDetalhe.clienteEmail
                  ? ` - ${pedidoDetalhe.clienteEmail}`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPedidoDetalhe(null)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              Fechar
            </button>
          </div>

          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <span className="text-xs text-slate-500">Status</span>
              <p className="font-semibold text-slate-900">
                {pedidoDetalhe.status}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <span className="text-xs text-slate-500">Data</span>
              <p className="font-semibold text-slate-900">
                {formatarData(pedidoDetalhe.dataCriacao, true)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <span className="text-xs text-slate-500">Total</span>
              <p className="font-semibold text-slate-900">
                {formatarMoeda(pedidoDetalhe.total)}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="p-3">Produto</th>
                  <th className="p-3">Qtd.</th>
                  <th className="p-3">Preco</th>
                  <th className="p-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedidoDetalhe.itens.map((item, indice) => (
                  <tr key={`${item.produtoId}-${indice}`} className="border-b">
                    <td className="p-3 font-medium">{item.produtoNome}</td>
                    <td className="p-3">{item.quantidade}</td>
                    <td className="p-3">
                      {formatarMoeda(item.precoUnitario)}
                    </td>
                    <td className="p-3">{formatarMoeda(item.subtotal)}</td>
                  </tr>
                ))}

                {pedidoDetalhe.itens.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-5 text-center text-slate-500">
                      O backend nao retornou itens para este pedido.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
