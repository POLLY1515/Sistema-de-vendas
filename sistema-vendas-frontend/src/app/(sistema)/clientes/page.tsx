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
import { ClienteForm } from "@/features/clientes/components/ClienteForm";
import type { ClienteFormData } from "@/features/clientes/clienteSchema";
import { ClienteTable } from "@/features/clientes/components/ClienteTable";
import {
  atualizarCliente,
  buscarClientes,
  criarCliente,
  excluirCliente,
} from "@/features/clientes/services/clienteService";
import type { Cliente } from "@/features/clientes/types";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useDebounce } from "@/hooks/useDebounce";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function ClientesPage() {
  const [clientes, setClientes] =
    useState<Cliente[]>([]);
  const [clienteEditando, setClienteEditando] =
    useState<Cliente | null>(null);
  const [clienteParaExcluir, setClienteParaExcluir] =
    useState<Cliente | null>(null);
  const [termo, setTermo] = useState("");
  const [termoAplicado, setTermoAplicado] =
    useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] =
    useState(0);
  const [totalElementos, setTotalElementos] =
    useState(0);
  const [carregando, setCarregando] =
    useState(false);
  const [excluindoId, setExcluindoId] =
    useState<number | null>(null);
  const [erro, setErro] = useState("");

  const termoDebounced = useDebounce(termo, 500);
  const salvarAction = useAsyncAction();
  const excluirAction = useAsyncAction();

  useEffect(() => {
    const valor = termoDebounced.trim();

    if (valor === termoAplicado) {
      return;
    }

    setPagina(0);
    setTermoAplicado(valor);
  }, [termoDebounced, termoAplicado]);

  const carregarClientes = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await buscarClientes({
        termo: termoAplicado,
        pagina,
        tamanho: 10,
      });

      setClientes(resposta.content);
      setTotalPaginas(resposta.totalPages);
      setTotalElementos(resposta.totalElements);
    } catch (error) {
      setErro(
        getErrorMessage(
          error,
          "Não foi possível carregar os clientes."
        )
      );
    } finally {
      setCarregando(false);
    }
  }, [pagina, termoAplicado]);

  useEffect(() => {
    void carregarClientes();
  }, [carregarClientes]);

  const editarCliente = useCallback(
    (cliente: Cliente) => {
      setClienteEditando(cliente);
      setErro("");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    []
  );

  const prepararExclusao = useCallback(
    (cliente: Cliente) => {
      setClienteParaExcluir(cliente);
    },
    []
  );

  async function salvarCliente(
    dados: ClienteFormData
  ): Promise<boolean> {
    const editando = Boolean(clienteEditando);

    const resultado = await salvarAction.execute(
      async () => {
        if (clienteEditando) {
          await atualizarCliente(
            clienteEditando.id,
            dados
          );
        } else {
          await criarCliente(dados);
        }

        if (pagina !== 0) {
          setPagina(0);
        } else {
          await carregarClientes();
        }

        return true;
      },
      {
        successMessage: editando
          ? "Cliente atualizado com sucesso."
          : "Cliente cadastrado com sucesso.",
        errorMessage:
          "Não foi possível salvar o cliente.",
      }
    );

    if (resultado.ok && editando) {
      setClienteEditando(null);
    }

    return resultado.ok;
  }

  async function confirmarExclusao() {
    if (!clienteParaExcluir) return;

    const cliente = clienteParaExcluir;
    setExcluindoId(cliente.id);

    const resultado = await excluirAction.execute(
      async () => {
        await excluirCliente(cliente.id);

        if (
          clientes.length === 1 &&
          pagina > 0
        ) {
          setPagina((valor) => valor - 1);
        } else {
          await carregarClientes();
        }

        return cliente;
      },
      {
        successMessage: (item) =>
          `Cliente "${item.nome}" excluído com sucesso.`,
        errorMessage:
          "Não foi possível excluir o cliente.",
      }
    );

    setExcluindoId(null);

    if (resultado.ok) {
      setClienteParaExcluir(null);
    }
  }

  function pesquisar(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setPagina(0);
    setTermoAplicado(termo.trim());
  }

  function limparBusca() {
    setTermo("");
    setPagina(0);
    setTermoAplicado("");
  }

  return (
    <main className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Cadastre, edite, pesquise e acompanhe os clientes do sistema."
        actions={
          <span className="text-sm text-slate-500">
            {totalElementos}{" "}
            {totalElementos === 1
              ? "cliente"
              : "clientes"}
          </span>
        }
      />

      <ErrorAlert message={erro} />

      <ClienteForm
        clienteEditando={clienteEditando}
        salvando={salvarAction.loading}
        onSave={salvarCliente}
        onCancelEdit={() =>
          setClienteEditando(null)
        }
      />

      <Card>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Lista de clientes
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              A busca é aplicada automaticamente após
              500 ms sem digitação.
            </p>
          </div>

          <form
            onSubmit={pesquisar}
            className="flex w-full flex-col gap-2 sm:flex-row sm:items-end lg:w-auto"
          >
            <div className="sm:w-80">
              <Input
                label="Pesquisar"
                value={termo}
                onChange={(event) =>
                  setTermo(event.target.value)
                }
                placeholder="Nome, e-mail ou CPF"
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
            >
              Buscar agora
            </Button>

            {(termo || termoAplicado) && (
              <Button
                type="button"
                variant="ghost"
                onClick={limparBusca}
              >
                Limpar
              </Button>
            )}
          </form>
        </div>

        {carregando ? (
          <LoadingState text="Carregando clientes..." />
        ) : (
          <ClienteTable
            clientes={clientes}
            excluindoId={excluindoId}
            onEdit={editarCliente}
            onDelete={prepararExclusao}
          />
        )}

        <Pagination
          page={pagina}
          totalPages={totalPaginas}
          onPageChange={setPagina}
        />
      </Card>

      <ConfirmModal
        open={Boolean(clienteParaExcluir)}
        title="Excluir cliente"
        description={
          clienteParaExcluir
            ? `Deseja realmente excluir o cliente "${clienteParaExcluir.nome}"?`
            : ""
        }
        confirmText="Excluir"
        loading={excluirAction.loading}
        onCancel={() => {
          if (!excluirAction.loading) {
            setClienteParaExcluir(null);
          }
        }}
        onConfirm={() =>
          void confirmarExclusao()
        }
      />
    </main>
  );
}
