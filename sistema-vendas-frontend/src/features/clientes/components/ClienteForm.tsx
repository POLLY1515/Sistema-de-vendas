"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { FormError } from "@/components/ui/FormError";
import {
  clienteSchema,
  type ClienteFormData,
} from "../clienteSchema";
import type { Cliente } from "../types";

type ClienteFormProps = {
  clienteEditando: Cliente | null;
  onSave: (dados: ClienteFormData) => Promise<boolean>;
  onCancelEdit: () => void;
};

const valoresIniciais: ClienteFormData = {
  nome: "",
  email: "",
  cpf: "",
  telefone: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function somenteNumeros(valor?: string | null) {
  return (valor ?? "").replace(/\D/g, "");
}

export function ClienteForm({
  clienteEditando,
  onSave,
  onCancelEdit,
}: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: valoresIniciais,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (clienteEditando) {
      reset({
        nome: clienteEditando.nome,
        email: clienteEditando.email,
        cpf: somenteNumeros(clienteEditando.cpf),
        telefone: somenteNumeros(clienteEditando.telefone),
      });
      return;
    }

    reset(valoresIniciais);
  }, [clienteEditando, reset]);

  async function enviar(dados: ClienteFormData) {
    const dadosNormalizados: ClienteFormData = {
      ...dados,
      nome: dados.nome.trim(),
      email: dados.email.trim().toLowerCase(),
      cpf: somenteNumeros(dados.cpf),
      telefone: somenteNumeros(dados.telefone),
    };

    const salvou = await onSave(dadosNormalizados);

    if (salvou && !clienteEditando) {
      reset(valoresIniciais);
    }
  }

  function cancelarEdicao() {
    reset(valoresIniciais);
    onCancelEdit();
  }

  return (
    <Card>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {clienteEditando ? "Editar cliente" : "Novo cliente"}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Corrija os campos destacados antes de enviar.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(enviar)}
        noValidate
        className="mt-4 grid gap-4 md:grid-cols-2"
      >
        <div>
          <FieldLabel htmlFor="cliente-nome">Nome</FieldLabel>
          <input
            id="cliente-nome"
            maxLength={120}
            autoComplete="name"
            placeholder="Ex.: Maria da Silva"
            className={inputClass}
            aria-invalid={Boolean(errors.nome)}
            {...register("nome")}
          />
          <FormError message={errors.nome?.message} />
        </div>

        <div>
          <FieldLabel htmlFor="cliente-email">E-mail</FieldLabel>
          <input
            id="cliente-email"
            type="email"
            maxLength={150}
            autoComplete="email"
            placeholder="maria@email.com"
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          <FormError message={errors.email?.message} />
        </div>

        <div>
          <FieldLabel htmlFor="cliente-cpf">CPF</FieldLabel>
          <input
            id="cliente-cpf"
            inputMode="numeric"
            maxLength={11}
            autoComplete="off"
            placeholder="Somente 11 números"
            className={inputClass}
            aria-invalid={Boolean(errors.cpf)}
            {...register("cpf")}
          />
          <FormError message={errors.cpf?.message} />
        </div>

        <div>
          <FieldLabel htmlFor="cliente-telefone">
            Telefone
          </FieldLabel>
          <input
            id="cliente-telefone"
            inputMode="tel"
            maxLength={11}
            autoComplete="tel"
            placeholder="DDD + número"
            className={inputClass}
            aria-invalid={Boolean(errors.telefone)}
            {...register("telefone")}
          />
          <FormError message={errors.telefone?.message} />
        </div>

        <div className="flex flex-wrap gap-2 md:col-span-2">
          <Button type="submit" loading={isSubmitting}>
            {clienteEditando
              ? "Atualizar cliente"
              : "Cadastrar cliente"}
          </Button>

          {clienteEditando && (
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
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
