import type { StatCardProps } from "@/types";

export function StatCard({
  titulo,
  valor,
  descricao,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{titulo}</p>

      <strong className="mt-3 block text-3xl font-bold text-slate-950">
        {valor}
      </strong>

      <p className="mt-2 text-sm text-slate-600">{descricao}</p>
    </div>
  );
}