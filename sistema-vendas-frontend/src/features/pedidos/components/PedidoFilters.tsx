import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { PedidoFiltros } from "../types";

type Props = {
  filtros: PedidoFiltros;
  loading?: boolean;
  onChange: (filtros: PedidoFiltros) => void;
  onBuscar: () => void;
  onLimpar: () => void;
};

export function PedidoFilters({
  filtros,
  loading = false,
  onChange,
  onBuscar,
  onLimpar,
}: Props) {
  function alterarCampo(
    campo: keyof PedidoFiltros,
    valor: string
  ) {
    onChange({ ...filtros, [campo]: valor });
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-5">
      <Select
        label="Status"
        value={filtros.status}
        onChange={(event) =>
          alterarCampo("status", event.target.value)
        }
      >
        <option value="">Todos</option>
        <option value="ABERTO">Aberto</option>
        <option value="FINALIZADO">Finalizado</option>
        <option value="CANCELADO">Cancelado</option>
      </Select>

      <Input
        label="Cliente"
        value={filtros.cliente}
        onChange={(event) =>
          alterarCampo("cliente", event.target.value)
        }
        placeholder="Nome do cliente"
      />

      <Input
        label="Data inicial"
        type="date"
        value={filtros.dataInicio}
        onChange={(event) =>
          alterarCampo("dataInicio", event.target.value)
        }
      />

      <Input
        label="Data final"
        type="date"
        value={filtros.dataFim}
        onChange={(event) =>
          alterarCampo("dataFim", event.target.value)
        }
      />

      <div className="flex items-end gap-2">
        <Button
          type="button"
          onClick={onBuscar}
          loading={loading}
        >
          Buscar
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onLimpar}
          disabled={loading}
        >
          Limpar
        </Button>
      </div>
    </div>
  );
}
