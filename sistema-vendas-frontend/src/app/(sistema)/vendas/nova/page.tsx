"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { NovoPedidoForm } from "@/features/pedidos/components/NovoPedidoForm";
import { useNovoPedido } from "@/features/pedidos/hooks/useNovoPedido";
import { criarPedido } from "@/features/pedidos/services/pedidoService";
import type {
  ClienteResumo,
  ProdutoResumo,
} from "@/features/pedidos/types";
import { buscarClientes } from "@/services/clienteService";
import { listarProdutos } from "@/services/produtoService";
import { formatarMoeda } from "@/utils/formatters";

export default function NovaVendaPage() {
  const pedido = useNovoPedido();

  const [clientes, setClientes] = useState<ClienteResumo[]>([]);
  const [produtos, setProdutos] = useState<ProdutoResumo[]>([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);

  const carregarDados = useCallback(async () => {
    try {
      setCarregandoDados(true);
      setErro("");

      const [clientesPage, produtosPage] = await Promise.all([
        buscarClientes({ pagina: 0, tamanho: 100 }),
        listarProdutos(0, 100, ""),
      ]);

      setClientes(
        clientesPage.content.map((cliente) => ({
          id: cliente.id,
          nome: cliente.nome,
          cpf: cliente.cpf,
          email: cliente.email,
        }))
      );

      setProdutos(
        produtosPage.content
          .filter(
            (produto) => produto.quantidadeEstoque > 0
          )
          .map((produto) => ({
            id: produto.id,
            nome: produto.nome,
            preco: Number(produto.preco),
            quantidadeEstoque: produto.quantidadeEstoque,
          }))
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar clientes e produtos."
      );
    } finally {
      setCarregandoDados(false);
    }
  }, []);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  function adicionarProduto() {
    const produto = produtos.find(
      (item) => item.id === Number(pedido.produtoId)
    );

    try {
      setSucesso("");
      setErro("");

      if (!produto) {
        throw new Error("Selecione um produto.");
      }

      pedido.adicionarProduto(produto);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao adicionar produto."
      );
    }
  }

  async function salvarPedido() {
    try {
      setLoading(true);
      setErro("");
      setSucesso("");

      const request = pedido.montarRequest();
      const criado = await criarPedido(request);

      pedido.limparPedido();
      setSucesso(
        `Venda #${criado.id} registrada com sucesso. Total: ${formatarMoeda(
          criado.total || pedido.total
        )}`
      );

      await carregarDados();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao salvar pedido."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-6">
      <PageHeader
        title="Nova venda"
        description="Selecione o cliente, monte o carrinho e finalize a venda."
      />

      <ErrorAlert message={erro} />

      {sucesso && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          {sucesso}
        </div>
      )}

      <NovoPedidoForm
        clientes={clientes}
        produtos={produtos}
        clienteId={pedido.clienteId}
        produtoId={pedido.produtoId}
        quantidade={pedido.quantidade}
        total={pedido.total}
        itens={pedido.itens}
        loading={loading}
        carregandoDados={carregandoDados}
        onClienteChange={pedido.setClienteId}
        onProdutoChange={pedido.setProdutoId}
        onQuantidadeChange={pedido.setQuantidade}
        onAdicionarProduto={adicionarProduto}
        onRemoverProduto={pedido.removerProduto}
        onSalvarPedido={salvarPedido}
      />
    </main>
  );
}
