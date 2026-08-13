import { APP_NAME } from "@/lib/constants";
import { StatCard } from "@/components/dashboard/StatCard";

const cards = [
  {
    titulo: "Produtos cadastrados",
    valor: "0",
    descricao: "Nenhum produto carregado ainda.",
  },
  {
    titulo: "Clientes cadastrados",
    valor: "0",
    descricao: "A integração com a API virá nos próximos blocos.",
  },
  {
    titulo: "Pedidos realizados",
    valor: "0",
    descricao: "Resumo inicial do sistema de vendas.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <span className="text-sm font-semibold uppercase text-blue-700">
          Painel administrativo
        </span>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
          {APP_NAME}
        </h1>

        <p className="mt-4 max-w-2xl text-base text-slate-600">
          Bem-vindo ao front-end do sistema. Nesta primeira tela,
          ainda usamos dados fixos apenas para montar a estrutura visual.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <StatCard
              key={card.titulo}
              titulo={card.titulo}
              valor={card.valor}
              descricao={card.descricao}
            />
          ))}
        </div>
      </section>
    </main>
  );
}