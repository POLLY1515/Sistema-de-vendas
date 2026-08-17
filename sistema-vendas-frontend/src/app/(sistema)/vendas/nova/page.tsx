"use client";

import { useEffect, useMemo, useState } from "react";
import { buscarClientes } from "@/services/clienteService";
import { criarPedido } from "@/services/pedidoService";
import { listarProdutos } from "@/services/produtoService";
import type { Cliente } from "@/types/cliente";
import type { ItemCarrinho } from "@/types/pedido";
import type { Produto } from "@/types/produto";

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export default function NovaVendaPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [finalizando, setFinalizando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregarDados() {
    try {
      setCarregandoDados(true);
      setErro("");

      const [clientesDaApi, produtosDaApi] = await Promise.all([
        buscarClientes({ pagina: 0, tamanho: 100 }),
        listarProdutos(0, 100, ""),
      ]);

      setClientes(clientesDaApi.content);
      setProdutos(
        produtosDaApi.content.filter(
          (produto) => produto.quantidadeEstoque > 0
        )
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Nao foi possivel carregar clientes e produtos."
      );
    } finally {
      setCarregandoDados(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void carregarDados();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const total = useMemo(
    () =>
      itens.reduce(
        (soma, item) => soma + item.precoUnitario * item.quantidade,
        0
      ),
    [itens]
  );

  function adicionarItem() {
    setErro("");
    setMensagem("");

    const produto = produtos.find(
      (item) => item.id === Number(produtoId)
    );

    if (!produto) {
      setErro("Selecione um produto.");
      return;
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      setErro("A quantidade deve ser um numero inteiro maior que zero.");
      return;
    }

    const itemExistente = itens.find(
      (item) => item.produtoId === produto.id
    );
    const quantidadeAtual = itemExistente?.quantidade ?? 0;
    const novaQuantidade = quantidadeAtual + quantidade;

    if (novaQuantidade > produto.quantidadeEstoque) {
      setErro(
        `Estoque insuficiente. Disponivel: ${produto.quantidadeEstoque}.`
      );
      return;
    }

    if (itemExistente) {
      setItens((listaAtual) =>
        listaAtual.map((item) =>
          item.produtoId === produto.id
            ? { ...item, quantidade: novaQuantidade }
            : item
        )
      );
    } else {
      setItens((listaAtual) => [
        ...listaAtual,
        {
          produtoId: produto.id,
          nomeProduto: produto.nome,
          precoUnitario: Number(produto.preco),
          quantidade,
          estoqueDisponivel: produto.quantidadeEstoque,
        },
      ]);
    }

    setProdutoId("");
    setQuantidade(1);
  }

  function removerItem(id: number) {
    setItens((listaAtual) =>
      listaAtual.filter((item) => item.produtoId !== id)
    );
  }

  async function finalizarVenda() {
    setErro("");
    setMensagem("");

    if (!clienteId) {
      setErro("Selecione um cliente.");
      return;
    }

    if (itens.length === 0) {
      setErro("Adicione pelo menos um produto ao carrinho.");
      return;
    }

    try {
      setFinalizando(true);

      const pedido = await criarPedido({
        clienteId: Number(clienteId),
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
        })),
      });

      setMensagem(
        `Venda #${pedido.id} criada com sucesso. Total: ${formatarMoeda(
          pedido.total || total
        )}`
      );
      setClienteId("");
      setProdutoId("");
      setQuantidade(1);
      setItens([]);
      await carregarDados();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Nao foi possivel finalizar a venda."
      );
    } finally {
      setFinalizando(false);
    }
  }

  return (
    <main className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Nova venda</h1>
        <p className="text-sm text-slate-500">
          Selecione o cliente, adicione produtos e finalize o pedido.
        </p>
      </section>

      {erro && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {mensagem && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          {mensagem}
        </div>
      )}

      <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <label className="block text-sm font-medium text-slate-700">
          Cliente
        </label>
        <select
          value={clienteId}
          onChange={(event) => setClienteId(event.target.value)}
          disabled={carregandoDados}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">
            {carregandoDados ? "Carregando clientes..." : "Selecione um cliente"}
          </option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome} - {cliente.email}
            </option>
          ))}
        </select>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Adicionar produto
        </h2>

        <div className="grid gap-4 md:grid-cols-[1fr_140px_auto]">
          <select
            value={produtoId}
            onChange={(event) => setProdutoId(event.target.value)}
            disabled={carregandoDados}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">
              {carregandoDados
                ? "Carregando produtos..."
                : "Selecione um produto"}
            </option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome} - {formatarMoeda(Number(produto.preco))} - Estoque {produto.quantidadeEstoque}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            step="1"
            value={quantidade}
            onChange={(event) => setQuantidade(Number(event.target.value))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />

          <button
            type="button"
            onClick={adicionarItem}
            disabled={carregandoDados}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Carrinho</h2>
          <span className="text-sm text-slate-500">
            {itens.length} {itens.length === 1 ? "item" : "itens"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="p-3">Produto</th>
                <th className="p-3">Quantidade</th>
                <th className="p-3">Preco</th>
                <th className="p-3">Subtotal</th>
                <th className="p-3 text-right">Acao</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.produtoId} className="border-b">
                  <td className="p-3 font-medium text-slate-900">
                    {item.nomeProduto}
                  </td>
                  <td className="p-3">{item.quantidade}</td>
                  <td className="p-3">{formatarMoeda(item.precoUnitario)}</td>
                  <td className="p-3">
                    {formatarMoeda(item.precoUnitario * item.quantidade)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => removerItem(item.produtoId)}
                      className="text-red-600 hover:underline"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}

              {itens.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    Nenhum produto adicionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Total da venda</p>
            <strong className="text-2xl text-slate-900">
              {formatarMoeda(total)}
            </strong>
          </div>

          <button
            type="button"
            onClick={() => void finalizarVenda()}
            disabled={finalizando || itens.length === 0}
            className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {finalizando ? "Finalizando..." : "Finalizar venda"}
          </button>
        </div>
      </section>
    </main>
  );
}
