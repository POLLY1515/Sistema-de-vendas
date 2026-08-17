'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { fazerLogin } from '@/lib/authService'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { atualizarUsuario } = useAuth()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  async function entrar(evento: React.FormEvent) {
    evento.preventDefault()
    setErro('')

    try {
      await fazerLogin({ email, senha })
      await atualizarUsuario()
      router.push('/dashboard')
    } catch {
      setErro('E-mail ou senha inválidos')
    }
  }

  return (
    <form onSubmit={entrar} className="mx-auto mt-24 w-full max-w-sm rounded-2xl bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold">Entrar no sistema</h1>

      {erro && <p className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{erro}</p>}

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail"
        className="mb-3 w-full rounded border p-3"
      />

      <input
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
        type="password"
        className="mb-4 w-full rounded border p-3"
      />

      <button className="w-full rounded bg-blue-600 p-3 font-semibold text-white">
        Entrar
      </button>
    </form>
  )
}
