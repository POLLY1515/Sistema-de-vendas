import { apiFetch } from "@/lib/apiFetch";
import type {
  ApiResponse,
  PageResponse,
  Produto,
  ProdutoRequest,
} from "@/types/produto";

type PaginaBackend<T> = {
  conteudo?: T[];
  paginaAtual?: number;
  tamanhoPagina?: number;
  totalElementos?: number;
  totalPaginas?: number;
  primeira?: boolean;
  ultima?: boolean;
  content?: T[];
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
};

function possuiDados<T>(valor: unknown): valor is ApiResponse<T> {
  return (
    typeof valor === "object" &&
    valor !== null &&
    "dados" in valor
  );
}

function extrairDados<T>(valor: T | ApiResponse<T>): T {
  return possuiDados<T>(valor) ? valor.dados : valor;
}

function normalizarPagina<T>(pagina: PaginaBackend<T>): PageResponse<T> {
  return {
    content: pagina.content ?? pagina.conteudo ?? [],
    totalElements: pagina.totalElements ?? pagina.totalElementos ?? 0,
    totalPages: pagina.totalPages ?? pagina.totalPaginas ?? 0,
    number: pagina.number ?? pagina.paginaAtual ?? 0,
    size: pagina.size ?? pagina.tamanhoPagina ?? 10,
  };
}

export async function listarProdutos(
  pagina = 0,
  tamanho = 10,
  busca = ""
): Promise<PageResponse<Produto>> {
  const termo = busca.trim();
  const params = new URLSearchParams({
    pagina: String(pagina),
    tamanho: String(tamanho),
    ordenarPor: "nome",
    direcao: "asc",
  });

  const endpoint = termo
    ? `/produtos/buscar?nome=${encodeURIComponent(termo)}&${params.toString()}`
    : `/produtos/paginado?${params.toString()}`;

  const resposta = await apiFetch<
    PaginaBackend<Produto> | ApiResponse<PaginaBackend<Produto>>
  >(endpoint);

  return normalizarPagina(extrairDados(resposta));
}

export async function criarProduto(
  produto: ProdutoRequest
): Promise<Produto> {
  const resposta = await apiFetch<Produto | ApiResponse<Produto>>(
    "/produtos",
    {
      method: "POST",
      body: JSON.stringify(produto),
    }
  );

  return extrairDados(resposta);
}

export async function atualizarProduto(
  id: number,
  produto: ProdutoRequest
): Promise<Produto> {
  const resposta = await apiFetch<Produto | ApiResponse<Produto>>(
    `/produtos/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(produto),
    }
  );

  return extrairDados(resposta);
}

export async function excluirProduto(id: number): Promise<void> {
  await apiFetch<void | ApiResponse<null>>(`/produtos/${id}`, {
    method: "DELETE",
  });
}
