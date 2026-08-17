import { apiFetch } from "@/lib/apiFetch";
import type {
  ApiResponse,
  Cliente,
  ClientePage,
  ClienteRequest,
} from "@/types/cliente";

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
  return typeof valor === "object" && valor !== null && "dados" in valor;
}

function extrairDados<T>(valor: T | ApiResponse<T>): T {
  return possuiDados<T>(valor) ? valor.dados : valor;
}

function ehPagina<T>(valor: unknown): valor is PaginaBackend<T> {
  return (
    typeof valor === "object" &&
    valor !== null &&
    ("content" in valor || "conteudo" in valor)
  );
}

function normalizarPagina<T>(pagina: PaginaBackend<T>): ClientePage {
  return {
    content: (pagina.content ?? pagina.conteudo ?? []) as Cliente[],
    totalElements: pagina.totalElements ?? pagina.totalElementos ?? 0,
    totalPages: pagina.totalPages ?? pagina.totalPaginas ?? 0,
    number: pagina.number ?? pagina.paginaAtual ?? 0,
    size: pagina.size ?? pagina.tamanhoPagina ?? 10,
  };
}

function filtrarClientes(clientes: Cliente[], termo: string) {
  const busca = termo.trim().toLocaleLowerCase("pt-BR");
  if (!busca) return clientes;

  const somenteNumeros = termo.replace(/\D/g, "");

  return clientes.filter((cliente) => {
    const nome = cliente.nome.toLocaleLowerCase("pt-BR");
    const email = cliente.email.toLocaleLowerCase("pt-BR");
    const cpf = (cliente.cpf ?? "").replace(/\D/g, "");

    return (
      nome.includes(busca) ||
      email.includes(busca) ||
      (somenteNumeros.length > 0 && cpf.includes(somenteNumeros))
    );
  });
}

export async function buscarClientes({
  termo = "",
  pagina = 0,
  tamanho = 10,
}: {
  termo?: string;
  pagina?: number;
  tamanho?: number;
} = {}): Promise<ClientePage> {
  const params = new URLSearchParams({
    pagina: String(pagina),
    tamanho: String(tamanho),
  });

  if (termo.trim()) {
    params.set("termo", termo.trim());
  }

  const resposta = await apiFetch<
    | Cliente[]
    | PaginaBackend<Cliente>
    | ApiResponse<Cliente[]>
    | ApiResponse<PaginaBackend<Cliente>>
  >(`/clientes?${params.toString()}`);

  const dados = extrairDados(resposta);

  if (Array.isArray(dados)) {
    const filtrados = filtrarClientes(dados, termo);
    const inicio = pagina * tamanho;
    const content = filtrados.slice(inicio, inicio + tamanho);

    return {
      content,
      totalElements: filtrados.length,
      totalPages: Math.ceil(filtrados.length / tamanho),
      number: pagina,
      size: tamanho,
    };
  }

  if (ehPagina<Cliente>(dados)) {
    return normalizarPagina(dados);
  }

  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: pagina,
    size: tamanho,
  };
}

export async function criarCliente(dados: ClienteRequest): Promise<Cliente> {
  const resposta = await apiFetch<Cliente | ApiResponse<Cliente>>("/clientes", {
    method: "POST",
    body: JSON.stringify(dados),
  });

  return extrairDados(resposta);
}

export async function atualizarCliente(
  id: number,
  dados: ClienteRequest
): Promise<Cliente> {
  const resposta = await apiFetch<Cliente | ApiResponse<Cliente>>(
    `/clientes/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(dados),
    }
  );

  return extrairDados(resposta);
}

export async function excluirCliente(id: number): Promise<void> {
  await apiFetch<void | ApiResponse<null>>(`/clientes/${id}`, {
    method: "DELETE",
  });
}
