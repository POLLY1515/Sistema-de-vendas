import { Select } from "@/components/ui/Select";
import type { ClienteResumo } from "../types";

type Props = {
  clientes: ClienteResumo[];
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function ClienteSelect({
  clientes,
  value,
  disabled = false,
  onChange,
}: Props) {
  return (
    <Select
      label="Cliente"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">
        {disabled ? "Carregando clientes..." : "Selecione um cliente"}
      </option>

      {clientes.map((cliente) => (
        <option key={cliente.id} value={cliente.id}>
          {cliente.nome}
          {cliente.email ? ` - ${cliente.email}` : ""}
        </option>
      ))}
    </Select>
  );
}
