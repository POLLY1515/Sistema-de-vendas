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
import { obterMensagemErro } from "@/lib/apiError";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteEditando, setClienteEditando] =
    useState<Cliente | null>(null);
  const [clienteParaExcluir, setClienteParaExcluir] =
    useState<Cliente | null>(null);
  const [termo, setTermo] = useState("");
  const [termoAplicado, setTermoAplicado] = useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [excluindoId, setExcluindoId] =
    useState<number | null>(null);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

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
        obterMensagemErro(
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

  function editarCliente(cliente: Cliente) {
    setClienteEditando(cliente);
    setMensagem("");
    setErro("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function salvarCliente(
    dados: ClienteFormData
  ): Promise<boolean> {
    try {
      setErro("");
      setMensagem("");

      if (clienteEditando) {
        await atualizarCliente(clienteEditando.id, dados);
        setClienteEditando(null);
        setMensagem("Cliente atualizado com sucesso.");
      } else {
        await criarCliente(dados);
        setMensagem("Cliente cadastrado com sucesso.");
      }

      if (pagina !== 0) {
        setPagina(0);
      } else {
        await carregarClientes();
      }

      return true;
    } catch (error) {
      setErro(
        obterMensagemErro(
          error,
          "Não foi possível salvar o cliente."
        )
      );
      return false;
    }
  }

  async function confirmarExclusao() {
    if (!clienteParaExcluir) return;

    try {
      setExcluindoId(clienteParaExcluir.id);
      setErro("");
      setMensagem("");

      await excluirCliente(clienteParaExcluir.id);
      setMensagem("Cliente excluído com sucesso.");
      setClienteParaExcluir(null);

      if (clientes.length === 1 && pagina > 0) {
        setPagina((valor) => valor - 1);
      } else {
        await carregarClientes();
      }
    } catch (error) {
      setErro(
        obterMensagemErro(
          error,
          "Não foi possível excluir o cliente."
        )
      );
    } finally {
      setExcluindoId(null);
    }
  }

  function pesquisar(event: FormEvent<HTMLFormElement>) {
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
            {totalElementos === 1 ? "cliente" : "clientes"}
          </span>
        }
      />

      <ErrorAlert message={erro} />

      {mensagem && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          {mensagem}
        </div>
      )}

      <ClienteForm
        clienteEditando={clienteEditando}
        onSave={salvarCliente}
        onCancelEdit={() => setClienteEditando(null)}
      />

      <Card>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Lista de clientes
            </h2>
            {termoAplicado && (
              <p className="mt-1 text-xs text-slate-500">
                Resultado da busca por &quot;{termoAplicado}&quot;
              </p>
            )}
          </div>

          <form
            onSubmit={pesquisar}
            className="flex w-full flex-col gap-2 sm:flex-row sm:items-end lg:w-auto"
          >
            <div className="sm:w-80">
              <Input
                label="Pesquisar"
                value={termo}
                onChange={(event) => setTermo(event.target.value)}
                placeholder="Nome, e-mail ou CPF"
              />
            </div>

            <Button type="submit" variant="secondary">
              Buscar
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
            onDelete={setClienteParaExcluir}
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
        loading={excluindoId !== null}
        onCancel={() => {
          if (excluindoId === null) {
            setClienteParaExcluir(null);
          }
        }}
        onConfirm={() => void confirmarExclusao()}
      />
    </main>
  );
}
