import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatarMoeda } from "@/utils/formatters";
import type { ProdutoResumo } from "../types";

type Props = {
  produtos: ProdutoResumo[];
  produtoId: string;
  quantidade: string;
  disabled?: boolean;
  onProdutoChange: (value: string) => void;
  onQuantidadeChange: (value: string) => void;
  onAdicionar: () => void;
};

export function ProdutoSelect(props: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_130px_auto]">
      <Select
        label="Produto"
        value={props.produtoId}
        disabled={props.disabled}
        onChange={(event) =>
          props.onProdutoChange(event.target.value)
        }
      >
        <option value="">
          {props.disabled
            ? "Carregando produtos..."
            : "Selecione um produto"}
        </option>

        {props.produtos.map((produto) => (
          <option key={produto.id} value={produto.id}>
            {produto.nome} - {formatarMoeda(Number(produto.preco))} -
            Estoque: {produto.quantidadeEstoque}
          </option>
        ))}
      </Select>

      <Input
        label="Qtd."
        type="number"
        min="1"
        step="1"
        value={props.quantidade}
        disabled={props.disabled}
        onChange={(event) =>
          props.onQuantidadeChange(event.target.value)
        }
      />

      <div className="flex items-end">
        <Button
          type="button"
          onClick={props.onAdicionar}
          disabled={props.disabled}
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
}
