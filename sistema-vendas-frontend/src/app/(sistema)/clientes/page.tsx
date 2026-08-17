"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  atualizarCliente,
  buscarClientes,
  criarCliente,
  excluirCliente,
} from "@/services/clienteService";
import type { Cliente, ClienteRequest } from "@/types/cliente";

const clienteInicial: ClienteRequest = {
  nome: "",
  email: "",
  cpf: "",
  telefone: "",
};

function somenteNumeros(valor: string) {
  return valor.replace(/\D/g, "");
}

function formatarCpf(cpf: string) {
  const numeros = somenteNumeros(cpf).slice(0, 11);
  return numeros.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    "$1.$2.$3-$4"
  );
}

function formatarTelefone(telefone?: string | null) {
  if (!telefone) return "-";

  const numeros = somenteNumeros(telefone);
  if (numeros.length === 11) {
    return numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }
  if (numeros.length === 10) {
    return numeros.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }

  return telefone;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState<ClienteRequest>(clienteInicial);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [termo, setTermo] = useState("");
  const [termoAplicado, setTermoAplicado] = useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
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
        error instanceof Error
          ? error.message
          : "Nao foi possivel carregar os clientes."
      );
    } finally {
      setCarregando(false);
    }
  }, [pagina, termoAplicado]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void carregarClientes();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [carregarClientes]);

  function alterarCampo(campo: keyof ClienteRequest, valor: string) {
    const novoValor =
      campo === "cpf"
        ? somenteNumeros(valor).slice(0, 11)
        : campo === "telefone"
          ? somenteNumeros(valor).slice(0, 11)
          : valor;

    setForm((estadoAtual) => ({
      ...estadoAtual,
      [campo]: novoValor,
    }));
  }

  function limparFormulario() {
    setForm(clienteInicial);
    setClienteEditando(null);
  }

  function editarCliente(cliente: Cliente) {
    setClienteEditando(cliente);
    setForm({
      nome: cliente.nome,
      email: cliente.email,
      cpf: somenteNumeros(cliente.cpf),
      telefone: somenteNumeros(cliente.telefone ?? ""),
    });
    setMensagem("");
    setErro("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function salvarCliente(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nome = form.nome.trim();
    const email = form.email.trim().toLowerCase();
    const cpf = somenteNumeros(form.cpf);
    const telefone = somenteNumeros(form.telefone);

    if (nome.length < 3) {
      setErro("Informe um nome com pelo menos 3 caracteres.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErro("Informe um e-mail valido.");
      return;
    }

    if (cpf.length !== 11) {
      setErro("O CPF deve conter exatamente 11 numeros.");
      return;
    }

    if (telefone && !/^\d{10,11}$/.test(telefone)) {
      setErro("O telefone deve conter 10 ou 11 numeros.");
      return;
    }

    const dados: ClienteRequest = {
      nome,
      email,
      cpf,
      telefone,
    };

    try {
      setSalvando(true);
      setErro("");
      setMensagem("");

      if (clienteEditando) {
        await atualizarCliente(clienteEditando.id, dados);
        setMensagem("Cliente atualizado com sucesso.");
      } else {
        await criarCliente(dados);
        setMensagem("Cliente cadastrado com sucesso.");
      }

      limparFormulario();
      setPagina(0);
      await carregarClientes();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar o cliente."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function removerCliente(id: number) {
    const confirmou = window.confirm(
      "Deseja realmente excluir este cliente?"
    );

    if (!confirmou) return;

    try {
      setExcluindoId(id);
      setErro("");
      setMensagem("");

      await excluirCliente(id);
      setMensagem("Cliente excluido com sucesso.");

      if (clientes.length === 1 && pagina > 0) {
        setPagina((valor) => valor - 1);
      } else {
        await carregarClientes();
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Nao foi possivel excluir o cliente."
      );
    } finally {
      setExcluindoId(null);
    }
  }

  function pesquisar(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-600">
            Cadastre, edite, pesquise e acompanhe os clientes do sistema.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          {totalElementos} {totalElementos === 1 ? "cliente" : "clientes"}
        </div>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {erro}
        </div>
      )}

      {mensagem && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          {mensagem}
        </div>
      )}

      <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {clienteEditando ? "Editar cliente" : "Novo cliente"}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {clienteEditando
              ? `Editando o cliente #${clienteEditando.id}`
              : "Preencha os dados para adicionar um cliente."}
          </p>
        </div>

        <form onSubmit={salvarCliente} className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Nome
            <input
              required
              maxLength={120}
              value={form.nome}
              onChange={(event) => alterarCampo("nome", event.target.value)}
              placeholder="Ex.: Maria da Silva"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            E-mail
            <input
              required
              type="email"
              maxLength={150}
              value={form.email}
              onChange={(event) => alterarCampo("email", event.target.value)}
              placeholder="maria@email.com"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            CPF
            <input
              required
              inputMode="numeric"
              maxLength={11}
              value={form.cpf}
              onChange={(event) => alterarCampo("cpf", event.target.value)}
              placeholder="Somente 11 numeros"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Telefone
            <input
              inputMode="tel"
              maxLength={11}
              value={form.telefone}
              onChange={(event) => alterarCampo("telefone", event.target.value)}
              placeholder="DDD + numero"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={salvando}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando
                ? "Salvando..."
                : clienteEditando
                  ? "Atualizar cliente"
                  : "Cadastrar cliente"}
            </button>

            {clienteEditando && (
              <button
                type="button"
                onClick={limparFormulario}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar edicao
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
            className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto"
          >
            <input
              value={termo}
              onChange={(event) => setTermo(event.target.value)}
              placeholder="Buscar por nome, e-mail ou CPF"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-72"
            />
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Buscar
            </button>
            {(termo || termoAplicado) && (
              <button
                type="button"
                onClick={limparBusca}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
              >
                Limpar
              </button>
            )}
          </form>
        </div>

        {carregando ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Carregando clientes...
          </div>
        ) : clientes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <p className="font-medium text-slate-700">Nenhum cliente encontrado.</p>
            <p className="mt-1 text-sm text-slate-500">
              Cadastre um novo cliente ou ajuste a pesquisa.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Nome</th>
                  <th className="px-4 py-3 text-left font-semibold">E-mail</th>
                  <th className="px-4 py-3 text-left font-semibold">CPF</th>
                  <th className="px-4 py-3 text-left font-semibold">Telefone</th>
                  <th className="px-4 py-3 text-right font-semibold">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      #{cliente.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {cliente.nome}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{cliente.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {formatarCpf(cliente.cpf)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {formatarTelefone(cliente.telefone)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => editarCliente(cliente)}
                        className="mr-3 font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={excluindoId === cliente.id}
                        onClick={() => void removerCliente(cliente.id)}
                        className="font-medium text-red-600 hover:text-red-800 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {excluindoId === cliente.id ? "Excluindo..." : "Excluir"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-slate-500">
            Pagina {pagina + 1} de {Math.max(totalPaginas, 1)}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagina === 0 || carregando}
              onClick={() => setPagina((valor) => Math.max(valor - 1, 0))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={pagina + 1 >= totalPaginas || carregando}
              onClick={() => setPagina((valor) => valor + 1)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proxima
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
