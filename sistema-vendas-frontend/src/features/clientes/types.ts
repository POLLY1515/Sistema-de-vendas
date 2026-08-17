import type { ClienteRequest } from "@/types/cliente";

export type {
  ApiResponse,
  Cliente,
  ClientePage,
  ClienteRequest,
} from "@/types/cliente";

export const clienteInicial: ClienteRequest = {
  nome: "",
  email: "",
  cpf: "",
  telefone: "",
};
