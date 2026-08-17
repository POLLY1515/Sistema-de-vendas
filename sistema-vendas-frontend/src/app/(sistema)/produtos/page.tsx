"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { Pagination } from "@/components/ui/Pagination";
import { ProdutoForm } from "@/features/produtos/components/ProdutoForm";
import { ProdutoTable } from "@/features/produtos/components/ProdutoTable";
import type { ProdutoFormData } from "@/features/produtos/produtoSchema";
import {
  atualizarProduto,
  buscarProdutos,
  criarProduto,
  excluirProduto,
} from "@/features/produtos/services/produtoService";
import type { Produto } from "@/features/produtos/types";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useDebounce } from "@/hooks/useDebounce";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoEditando, setProdutoEditando] =
    useState<Produto | null>(null);
  const [produtoParaExcluir, setProdutoParaExcluir] =
    useState<Produto | null>(null);
  const [busca, setBusca] = useState("");
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [excluindoId, setExcluindoId] =
    useState<number | null>(null);
  const [erro, setErro] = useState("");

  const buscaDebounced = useDebounce(busca, 500);
  const salvarAction = useAsyncAction();
  const excluirAction = useAsyncAction();

  useEffect(() => {
    const valor = buscaDebounced.trim();

    if (valor === buscaAplicada) {
      return;
    }

    setPagina(0);
    setBuscaAplicada(valor);
  }, [buscaDebounced, buscaAplicada]);

  const carregarProdutos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const resultado = await buscarProdutos(
        pagina,
        10,
        buscaAplicada
      );

      setProdutos(resultado.content);
      setTotalPaginas(resultado.totalPages);
      setTotalElementos(resultado.totalElements);
    } catch (error) {
      setErro(
        getErrorMessage(
          error,
          "Não foi possível carregar os produtos."
        )
      );
    } finally {
      setCarregando(false);
    }
  }, [pagina, buscaAplicada]);

  useEffect(() => {
    void carregarProdutos();
  }, [carregarProdutos]);

  const prepararEdicao = useCallback(
    (produto: Produto) => {
      setProdutoEditando(produto);
      setErro("");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    []
  );

  const prepararExclusao = useCallback(
    (produto: Produto) => {
      setProdutoParaExcluir(produto);
    },
    []
  );

  async function salvarProduto(
    dados: ProdutoFormData
  ): Promise<boolean> {
    const editando = Boolean(produtoEditando);

    const resultado = await salvarAction.execute(
      async () => {
        if (produtoEditando) {
          await atualizarProduto(
            produtoEditando.id,
            dados
          );
        } else {
          await criarProduto(dados);
        }

        if (pagina !== 0) {
          setPagina(0);
        } else {
          await carregarProdutos();
        }

        return true;
      },
      {
        successMessage: editando
          ? "Produto atualizado com sucesso."
          : "Produto cadastrado com sucesso.",
        errorMessage:
          "Não foi possível salvar o produto.",
      }
    );

    if (resultado.ok && editando) {
      setProdutoEditando(null);
    }

    return resultado.ok;
  }

  async function confirmarExclusao() {
    if (!produtoParaExcluir) return;

    const produto = produtoParaExcluir;
    setExcluindoId(produto.id);

    const resultado = await excluirAction.execute(
      async () => {
        await excluirProduto(produto.id);

        if (
          produtos.length === 1 &&
          pagina > 0
        ) {
          setPagina((valor) => valor - 1);
        } else {
          await carregarProdutos();
        }

        return produto;
      },
      {
        successMessage: (item) =>
          `Produto "${item.nome}" excluído com sucesso.`,
        errorMessage:
          "Não foi possível excluir o produto.",
      }
    );

    setExcluindoId(null);

    if (resultado.ok) {
      setProdutoParaExcluir(null);
    }
  }

  function pesquisarProdutos(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setPagina(0);
    setBuscaAplicada(busca.trim());
  }

  function limparBusca() {
    setBusca("");
    setPagina(0);
    setBuscaAplicada("");
  }

  return (
    <main className="space-y-6">
      <PageHeader
        title="Produtos"
        description="Cadastre, edite e acompanhe o estoque dos produtos disponíveis para venda."
        actions={
          <span className="text-sm text-slate-500">
            {totalElementos}{" "}
            {totalElementos === 1
              ? "produto"
              : "produtos"}
          </span>
        }
      />

      <ErrorAlert message={erro} />

      <ProdutoForm
        produtoEditando={produtoEditando}
        salvando={salvarAction.loading}
        onSave={salvarProduto}
        onCancelEdit={() =>
          setProdutoEditando(null)
        }
      />

      <Card>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Lista de produtos
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              A busca é aplicada automaticamente após
              500 ms sem digitação.
            </p>
          </div>

          <form
            onSubmit={pesquisarProdutos}
            className="flex w-full flex-col gap-2 sm:flex-row sm:items-end lg:w-auto"
          >
            <div className="sm:w-72">
              <Input
                label="Pesquisar"
                value={busca}
                onChange={(event) =>
                  setBusca(event.target.value)
                }
                placeholder="Pesquisar por nome"
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
            >
              Pesquisar agora
            </Button>

            {(busca || buscaAplicada) && (
              <Button
                type="button"
                variant="ghost"
                onClick={limparBusca}
              >
                Limpar
              </Button>
            )}
          </form>
        </div>

        {carregando ? (
          <LoadingState text="Carregando produtos..." />
        ) : (
          <ProdutoTable
            produtos={produtos}
            excluindoId={excluindoId}
            onEdit={prepararEdicao}
            onDelete={prepararExclusao}
          />
        )}

        <Pagination
          page={pagina}
          totalPages={totalPaginas}
          onPageChange={setPagina}
        />
      </Card>

      <ConfirmModal
        open={Boolean(produtoParaExcluir)}
        title="Excluir produto"
        description={
          produtoParaExcluir
            ? `Deseja realmente excluir o produto "${produtoParaExcluir.nome}"?`
            : ""
        }
        confirmText="Excluir"
        loading={excluirAction.loading}
        onCancel={() => {
          if (!excluirAction.loading) {
            setProdutoParaExcluir(null);
          }
        }}
        onConfirm={() =>
          void confirmarExclusao()
        }
      />
    </main>
  );
}
