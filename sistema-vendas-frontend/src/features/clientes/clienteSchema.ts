import { z } from "zod";

export const clienteSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),

  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido.")
    .max(150, "O e-mail deve ter no máximo 150 caracteres."),

  cpf: z
    .string()
    .trim()
    .regex(/^\d{11}$/, "O CPF deve conter exatamente 11 números."),

  telefone: z
    .string()
    .trim()
    .refine(
      (valor) => valor === "" || /^\d{10,11}$/.test(valor),
      "O telefone deve conter 10 ou 11 números."
    ),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
