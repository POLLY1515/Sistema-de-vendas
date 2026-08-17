'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { usuario, logout } = useAuth()

  function sair() {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-950 p-6 text-white">
        <h1 className="text-xl font-bold">Vendas Pro</h1>

        <nav className="mt-8 flex flex-col gap-3 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/produtos">Produtos</Link>
          <Link href="/clientes">Clientes</Link>
          <Link href="/pedidos">Pedidos</Link>
        </nav>
      </aside>

      <main className="ml-64 min-h-screen">
        <header className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Usuário logado</p>
            <strong>{usuario?.nome}</strong>
          </div>

          <button
            onClick={sair}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Sair
          </button>
        </header>

        <section className="p-8">{children}</section>
      </main>
    </div>
  )
}
