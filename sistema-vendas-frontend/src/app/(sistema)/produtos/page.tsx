"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  atualizarProduto,
  criarProduto,
  excluirProduto,
  listarProdutos,
} from "@/services/produtoService";
import type { Produto, ProdutoRequest } from "@/types/produto";

const produtoInicial: ProdutoRequest = {
  nome: "",
  preco: 0,
  quantidadeEstoque: 0,
};

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState<ProdutoRequest>(produtoInicial);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
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

      const resultado = await listarProdutos(pagina, 10, buscaAplicada);

      setProdutos(resultado.content);
      setTotalPaginas(resultado.totalPages);
      setTotalElementos(resultado.totalElements);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Nao foi possivel carregar os produtos."
      );
    } finally {
      setCarregando(false);
    }
  }, [pagina, buscaAplicada]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void carregarProdutos();
    }, 0);

    return () => window.clearTimeout(timer);
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
      setErro("O preco deve ser maior que zero.");
      return;
    }

    if (form.quantidadeEstoque < 0) {
      setErro("O estoque nao pode ser negativo.");
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
      setPagina(0);
      await carregarProdutos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar o produto."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function removerProduto(id: number) {
    const confirmou = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmou) return;

    try {
      setExcluindoId(id);
      setErro("");
      setMensagem("");

      await excluirProduto(id);
      setMensagem("Produto excluido com sucesso.");

      if (produtos.length === 1 && pagina > 0) {
        setPagina((valor) => valor - 1);
      } else {
        await carregarProdutos();
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Nao foi possivel excluir o produto."
      );
    } finally {
      setExcluindoId(null);
    }
  }

  function pesquisarProdutos(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produtos</h1>
          <p className="text-sm text-slate-600">
            Cadastre, edite e acompanhe o estoque dos produtos disponiveis para venda.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          {totalElementos} {totalElementos === 1 ? "produto" : "produtos"}
        </div>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {erro}
        </div>
      )}

      {mensagem && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          {mensagem}
        </div>
      )}

      <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {produtoEditando ? "Editar produto" : "Novo produto"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {produtoEditando
                ? `Editando o produto #${produtoEditando.id}`
                : "Preencha os dados para adicionar um produto ao catalogo."}
            </p>
          </div>
        </div>

        <form onSubmit={salvarProduto} className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-1">
            Nome
            <input
              required
              maxLength={120}
              value={form.nome}
              onChange={(event) => alterarCampo("nome", event.target.value)}
              placeholder="Ex.: Teclado mecanico"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Preco
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.preco}
              onChange={(event) => alterarCampo("preco", event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Estoque
            <input
              required
              type="number"
              min="0"
              step="1"
              value={form.quantidadeEstoque}
              onChange={(event) =>
                alterarCampo("quantidadeEstoque", event.target.value)
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <div className="flex flex-wrap gap-2 md:col-span-3">
            <button
              type="submit"
              disabled={salvando}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando
                ? "Salvando..."
                : produtoEditando
                  ? "Atualizar produto"
                  : "Cadastrar produto"}
            </button>

            {produtoEditando && (
              <button
                type="button"
                onClick={limparFormulario}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar edicao
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
            className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto"
          >
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Pesquisar por nome"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
            />
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Pesquisar
            </button>
            {(busca || buscaAplicada) && (
              <button
                type="button"
                onClick={limparBusca}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
              >
                Limpar
              </button>
            )}
          </form>
        </div>

        {carregando ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Carregando produtos...
          </div>
        ) : produtos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <p className="font-medium text-slate-700">Nenhum produto encontrado.</p>
            <p className="mt-1 text-sm text-slate-500">
              Cadastre um novo produto ou ajuste a pesquisa.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Nome</th>
                  <th className="px-4 py-3 text-left font-semibold">Preco</th>
                  <th className="px-4 py-3 text-left font-semibold">Estoque</th>
                  <th className="px-4 py-3 text-right font-semibold">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {produtos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      #{produto.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {produto.nome}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {formatarMoeda(produto.preco)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          produto.quantidadeEstoque === 0
                            ? "bg-red-50 text-red-700"
                            : produto.quantidadeEstoque <= 5
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {produto.quantidadeEstoque}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => prepararEdicao(produto)}
                        className="mr-3 font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={excluindoId === produto.id}
                        onClick={() => void removerProduto(produto.id)}
                        className="font-medium text-red-600 hover:text-red-800 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {excluindoId === produto.id ? "Excluindo..." : "Excluir"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-slate-500">
            Pagina {pagina + 1} de {Math.max(totalPaginas, 1)}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagina === 0 || carregando}
              onClick={() => setPagina((valor) => Math.max(valor - 1, 0))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={pagina + 1 >= totalPaginas || carregando}
              onClick={() => setPagina((valor) => valor + 1)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proxima
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
