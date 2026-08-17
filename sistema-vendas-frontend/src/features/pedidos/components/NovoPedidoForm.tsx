"use client";

import { Card } from "@/components/ui/Card";
import { LoadingButton } from "@/components/ui/LoadingButton";
import type {
  CarrinhoItem,
  ClienteResumo,
  ProdutoResumo,
} from "../types";
import { CarrinhoTable } from "./CarrinhoTable";
import { ClienteSelect } from "./ClienteSelect";
import { PedidoResumo } from "./PedidoResumo";
import { ProdutoSelect } from "./ProdutoSelect";

type Props = {
  clientes: ClienteResumo[];
  produtos: ProdutoResumo[];
  clienteId: string;
  produtoId: string;
  quantidade: string;
  total: number;
  itens: CarrinhoItem[];
  loading: boolean;
  carregandoDados: boolean;
  onClienteChange: (value: string) => void;
  onProdutoChange: (value: string) => void;
  onQuantidadeChange: (value: string) => void;
  onAdicionarProduto: () => void;
  onRemoverProduto: (produtoId: number) => void;
  onSalvarPedido: () => void;
};

export function NovoPedidoForm(props: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <Card>
        <div className="space-y-5">
          <ClienteSelect
            clientes={props.clientes}
            value={props.clienteId}
            disabled={props.carregandoDados || props.loading}
            onChange={props.onClienteChange}
          />

          <ProdutoSelect
            produtos={props.produtos}
            produtoId={props.produtoId}
            quantidade={props.quantidade}
            disabled={props.carregandoDados || props.loading}
            onProdutoChange={props.onProdutoChange}
            onQuantidadeChange={props.onQuantidadeChange}
            onAdicionar={props.onAdicionarProduto}
          />

          <CarrinhoTable
            itens={props.itens}
            onRemover={props.onRemoverProduto}
          />
        </div>
      </Card>

      <PedidoResumo
        total={props.total}
        quantidadeItens={props.itens.length}
      >
        <LoadingButton
          type="button"
          onClick={props.onSalvarPedido}
          loading={props.loading}
          loadingText="Finalizando venda..."
          disabled={props.carregandoDados}
          className="w-full"
        >
          Finalizar venda
        </LoadingButton>
      </PedidoResumo>
    </div>
  );
}
