import { z } from "zod";

export const produtoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),

  preco: z
    .number()
    .positive("O preço deve ser maior que zero."),

  quantidadeEstoque: z
    .number()
    .int("O estoque deve ser um número inteiro.")
    .min(0, "O estoque não pode ser negativo."),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
