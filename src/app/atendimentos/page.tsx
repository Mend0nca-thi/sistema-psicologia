'use client'

import { ProtectedRoute } from '@/app/components/ProtectedRoute'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Cliente = {
  id: string
  nome: string
}

type Atendimento = {
  id: string
  data_atendimento: string
  valor_consulta: number
  valor_recebido: number
  observacao: string | null
  clientes: {
    nome: string
  }[]
}

export default function AtendimentosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteId, setClienteId] = useState('')
  const [data, setData] = useState('')
  const [valorConsulta, setValorConsulta] = useState('')
  const [valorRecebido, setValorRecebido] = useState('')
  const [observacao, setObservacao] = useState('')
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([])

  async function carregarClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nome')
      .order('nome')

    if (!error) setClientes(data || [])
  }

  async function carregarAtendimentos() {
    const { data, error } = await supabase
      .from('atendimentos')
      .select(`
        id,
        data_atendimento,
        valor_consulta,
        valor_recebido,
        observacao,
        clientes ( nome )
      `)
      .order('data_atendimento', { ascending: false })

    if (!error) setAtendimentos(data || [])
  }

  async function cadastrarAtendimento(e: React.FormEvent) {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return alert('Usuário não autenticado')

    const { error } = await supabase.from('atendimentos').insert({
      user_id: user.id,
      cliente_id: clienteId,
      data_atendimento: data,
      valor_consulta: Number(valorConsulta),
      valor_recebido: Number(valorRecebido),
      observacao: observacao || null,
    })

    if (error) {
      alert(error.message)
    } else {
      setClienteId('')
      setData('')
      setValorConsulta('')
      setValorRecebido('')
      setObservacao('')
      carregarAtendimentos()
    }
  }

  useEffect(() => {
    carregarClientes()
    carregarAtendimentos()
  }, [])

  return (
    <ProtectedRoute>
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <h1>Atendimentos</h1>

      <form onSubmit={cadastrarAtendimento} style={{ marginBottom: 30 }}>
        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          required
        >
          <option value="">Selecione o cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />

        <input
          placeholder="Valor da consulta"
          type="number"
          step="0.01"
          value={valorConsulta}
          onChange={(e) => setValorConsulta(e.target.value)}
          required
        />

        <input
          placeholder="Valor recebido"
          type="number"
          step="0.01"
          value={valorRecebido}
          onChange={(e) => setValorRecebido(e.target.value)}
          required
        />

        <textarea
          placeholder="Observação (opcional)"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />

        <button type="submit">Cadastrar atendimento</button>
      </form>

      <h2>Histórico</h2>

      <ul>
        {atendimentos.map((a) => (
          <li key={a.id}>
            <strong>{a.clientes.length > 0 ? a.clientes[0].nome : 'Sem cliente'}</strong> — {a.data_atendimento}
            <br />
            Consulta: R$ {a.valor_consulta.toFixed(2)} | Recebido: R$ {a.valor_recebido.toFixed(2)}
            {a.observacao && <p>{a.observacao}</p>}
          </li>
        ))}
      </ul>
    </div>
    </ProtectedRoute>
  )
}
