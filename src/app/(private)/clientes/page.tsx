'use client'

import { ProtectedRoute } from '@/app/components/ProtectedRoute'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Cliente = {
  id: string
  nome: string
  cpf: string
  celular: string | null
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [celular, setCelular] = useState('')
  const [loading, setLoading] = useState(false)

  async function carregarClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nome, cpf, celular')
      .order('nome')

    if (error) {
      alert(error.message)
      return
    }

    setClientes(data || [])
  }

  async function cadastrarCliente(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Usuário não autenticado')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('clientes').insert({
      user_id: user.id,
      nome,
      cpf,
      celular: celular || null,
    })

    if (error) {
      alert(error.message)
    } else {
      setNome('')
      setCpf('')
      setCelular('')
      carregarClientes()
    }

    setLoading(false)
  }

  useEffect(() => {
    carregarClientes()
  }, [])

  return (
    <ProtectedRoute>
          <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Clientes</h1>
      <form onSubmit={cadastrarCliente} style={{ marginBottom: 30 }}>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />

        <input
          placeholder="Celular"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>

      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            <strong>{cliente.nome}</strong> — {cliente.cpf}
            {cliente.celular && ` | ${cliente.celular}`}
          </li>
        ))}
      </ul>
    </div>
    </ProtectedRoute>
  )
}