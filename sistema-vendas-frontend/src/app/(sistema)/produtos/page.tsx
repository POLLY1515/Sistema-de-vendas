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
import {
  atualizarProduto,
  buscarProdutos,
  criarProduto,
  excluirProduto,
} from "@/features/produtos/services/produtoService";
import {
  produtoInicial,
  type Produto,
  type ProdutoRequest,
} from "@/features/produtos/types";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState<ProdutoRequest>(produtoInicial);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(null);
  const [busca, setBusca] = useState("");
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const carregarProdutos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const resultado = await buscarProdutos(pagina, 10, buscaAplicada);

      setProdutos(resultado.content);
      setTotalPaginas(resultado.totalPages);
      setTotalElementos(resultado.totalElements);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os produtos."
      );
    } finally {
      setCarregando(false);
    }
  }, [pagina, buscaAplicada]);

  useEffect(() => {
    void carregarProdutos();
  }, [carregarProdutos]);

  function alterarCampo(campo: keyof ProdutoRequest, valor: string) {
    setForm((estadoAtual) => ({
      ...estadoAtual,
      [campo]:
        campo === "preco" || campo === "quantidadeEstoque"
          ? Number(valor)
          : valor,
    }));
  }

  function limparFormulario() {
    setForm(produtoInicial);
    setProdutoEditando(null);
  }

  function prepararEdicao(produto: Produto) {
    setProdutoEditando(produto);
    setForm({
      nome: produto.nome,
      preco: produto.preco,
      quantidadeEstoque: produto.quantidadeEstoque,
    });
    setErro("");
    setMensagem("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function salvarProduto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.nome.trim()) {
      setErro("Informe o nome do produto.");
      return;
    }

    if (form.preco <= 0) {
      setErro("O preço deve ser maior que zero.");
      return;
    }

    if (form.quantidadeEstoque < 0) {
      setErro("O estoque não pode ser negativo.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");
      setMensagem("");

      const dados: ProdutoRequest = {
        nome: form.nome.trim(),
        preco: form.preco,
        quantidadeEstoque: form.quantidadeEstoque,
      };

      if (produtoEditando) {
        await atualizarProduto(produtoEditando.id, dados);
        setMensagem("Produto atualizado com sucesso.");
      } else {
        await criarProduto(dados);
        setMensagem("Produto cadastrado com sucesso.");
      }

      limparFormulario();

      if (pagina !== 0) {
        setPagina(0);
      } else {
        await carregarProdutos();
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o produto."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!produtoParaExcluir) return;

    try {
      setExcluindoId(produtoParaExcluir.id);
      setErro("");
      setMensagem("");

      await excluirProduto(produtoParaExcluir.id);
      setMensagem("Produto excluído com sucesso.");
      setProdutoParaExcluir(null);

      if (produtos.length === 1 && pagina > 0) {
        setPagina((valor) => valor - 1);
      } else {
        await carregarProdutos();
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o produto."
      );
    } finally {
      setExcluindoId(null);
    }
  }

  function pesquisarProdutos(event: FormEvent<HTMLFormElement>) {
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
            {totalElementos} {totalElementos === 1 ? "produto" : "produtos"}
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

      <ProdutoForm
        form={form}
        editando={Boolean(produtoEditando)}
        salvando={salvando}
        onChange={alterarCampo}
        onSubmit={salvarProduto}
        onCancelEdit={limparFormulario}
      />

      <Card>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Lista de produtos
            </h2>
            {buscaAplicada && (
              <p className="mt-1 text-xs text-slate-500">
                Resultado da busca por &quot;{buscaAplicada}&quot;
              </p>
            )}
          </div>

          <form
            onSubmit={pesquisarProdutos}
            className="flex w-full flex-col gap-2 sm:flex-row sm:items-end lg:w-auto"
          >
            <div className="sm:w-72">
              <Input
                label="Pesquisar"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Pesquisar por nome"
              />
            </div>

            <Button type="submit" variant="secondary">
              Pesquisar
            </Button>

            {(busca || buscaAplicada) && (
              <Button type="button" variant="ghost" onClick={limparBusca}>
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
            onDelete={setProdutoParaExcluir}
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
        loading={excluindoId !== null}
        onCancel={() => {
          if (excluindoId === null) {
            setProdutoParaExcluir(null);
          }
        }}
        onConfirm={() => void confirmarExclusao()}
      />
    </main>
  );
}
