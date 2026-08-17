import { obterMensagemErro } from "@/lib/apiError";
import {
  atualizarCliente as atualizarClienteBase,
  buscarClientes as buscarClientesBase,
  criarCliente as criarClienteBase,
  excluirCliente as excluirClienteBase,
} from "@/services/clienteService";
import type { ClienteRequest } from "../types";

export async function buscarClientes(params: {
  termo?: string;
  pagina?: number;
  tamanho?: number;
}) {
  try {
    return await buscarClientesBase(params);
  } catch (error) {
    throw new Error(
      obterMensagemErro(
        error,
        "Não foi possível carregar os clientes."
      )
    );
  }
}

export async function criarCliente(data: ClienteRequest) {
  try {
    return await criarClienteBase(data);
  } catch (error) {
    throw new Error(
      obterMensagemErro(
        error,
        "Não foi possível cadastrar o cliente."
      )
    );
  }
}

export async function atualizarCliente(
  id: number,
  data: ClienteRequest
) {
  try {
    return await atualizarClienteBase(id, data);
  } catch (error) {
    throw new Error(
      obterMensagemErro(
        error,
        "Não foi possível atualizar o cliente."
      )
    );
  }
}

export async function excluirCliente(id: number) {
  try {
    return await excluirClienteBase(id);
  } catch (error) {
    throw new Error(
      obterMensagemErro(
        error,
        "Não foi possível excluir o cliente."
      )
    );
  }
}
