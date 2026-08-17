"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { FormError } from "@/components/ui/FormError";
import { LoadingButton } from "@/components/ui/LoadingButton";
import {
  produtoSchema,
  type ProdutoFormData,
} from "../produtoSchema";
import type { Produto } from "../types";

type ProdutoFormProps = {
  produtoEditando: Produto | null;
  salvando?: boolean;
  onSave: (dados: ProdutoFormData) => Promise<boolean>;
  onCancelEdit: () => void;
};

const valoresIniciais: ProdutoFormData = {
  nome: "",
  preco: 0,
  quantidadeEstoque: 0,
};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export function ProdutoForm({
  produtoEditando,
  salvando = false,
  onSave,
  onCancelEdit,
}: ProdutoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: valoresIniciais,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (produtoEditando) {
      reset({
        nome: produtoEditando.nome,
        preco: Number(produtoEditando.preco),
        quantidadeEstoque:
          produtoEditando.quantidadeEstoque,
      });
      return;
    }

    reset(valoresIniciais);
  }, [produtoEditando, reset]);

  async function enviar(dados: ProdutoFormData) {
    const salvou = await onSave(dados);

    if (salvou && !produtoEditando) {
      reset(valoresIniciais);
    }
  }

  function cancelarEdicao() {
    reset(valoresIniciais);
    onCancelEdit();
  }

  const carregando = isSubmitting || salvando;

  return (
    <Card>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {produtoEditando
            ? "Editar produto"
            : "Novo produto"}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Os campos são validados antes do envio ao backend.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(enviar)}
        noValidate
        className="mt-4 grid gap-4 md:grid-cols-3"
      >
        <div>
          <FieldLabel htmlFor="produto-nome">
            Nome
          </FieldLabel>
          <input
            id="produto-nome"
            maxLength={120}
            autoComplete="off"
            placeholder="Ex.: Teclado mecânico"
            className={inputClass}
            aria-invalid={Boolean(errors.nome)}
            {...register("nome")}
          />
          <FormError message={errors.nome?.message} />
        </div>

        <div>
          <FieldLabel htmlFor="produto-preco">
            Preço
          </FieldLabel>
          <input
            id="produto-preco"
            type="number"
            min="0.01"
            step="0.01"
            className={inputClass}
            aria-invalid={Boolean(errors.preco)}
            {...register("preco", {
              valueAsNumber: true,
            })}
          />
          <FormError message={errors.preco?.message} />
        </div>

        <div>
          <FieldLabel htmlFor="produto-estoque">
            Estoque
          </FieldLabel>
          <input
            id="produto-estoque"
            type="number"
            min="0"
            step="1"
            className={inputClass}
            aria-invalid={Boolean(
              errors.quantidadeEstoque
            )}
            {...register("quantidadeEstoque", {
              valueAsNumber: true,
            })}
          />
          <FormError
            message={errors.quantidadeEstoque?.message}
          />
        </div>

        <div className="flex flex-wrap gap-2 md:col-span-3">
          <LoadingButton
            type="submit"
            loading={carregando}
            loadingText={
              produtoEditando
                ? "Atualizando..."
                : "Cadastrando..."
            }
          >
            {produtoEditando
              ? "Atualizar produto"
              : "Cadastrar produto"}
          </LoadingButton>

          {produtoEditando && (
            <Button
              type="button"
              variant="secondary"
              disabled={carregando}
              onClick={cancelarEdicao}
            >
              Cancelar edição
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
