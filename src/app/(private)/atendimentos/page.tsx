'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

/* =========================
   TIPOS
========================= */

type Cliente = {
  id: string
  nome: string
}

// Tipo como vem do Supabase (JOIN retorna array)
type AtendimentoDB = {
  id: string
  data_atendimento: string
  valor_consulta: number
  valor_recebido: number
  observacao: string | null
  clientes: {
    nome: string
  }[]
}

// Tipo usado no React (normalizado)
type Atendimento = {
  id: string
  data_atendimento: string
  valor_consulta: number
  valor_recebido: number
  observacao: string | null
  cliente_nome: string | null
}

/* =========================
   COMPONENTE
========================= */

export default function AtendimentosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([])

  const [clienteId, setClienteId] = useState('')
  const [data, setData] = useState('')
  const [valorConsulta, setValorConsulta] = useState('')
  const [valorRecebido, setValorRecebido] = useState('')
  const [observacao, setObservacao] = useState('')

  /* =========================
     LOADERS
  ========================= */

  async function carregarClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nome')
      .order('nome')

    if (!error && data) {
      setClientes(data)
    }
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
        clientes!inner (
          nome
        )
      `)
      .order('data_atendimento', { ascending: false })

    if (error || !data) return

    // NORMALIZAÇÃO
const normalizado: Atendimento[] = (data as AtendimentoDB[]).map((a) => ({
  id: a.id,
  data_atendimento: a.data_atendimento,
  valor_consulta: a.valor_consulta,
  valor_recebido: a.valor_recebido,
  observacao: a.observacao,
  cliente_nome: a.clientes[0]?.nome ?? null,
}))


    setAtendimentos(normalizado)
  }

  /* =========================
     CREATE
  ========================= */

  async function cadastrarAtendimento(e: React.FormEvent) {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Usuário não autenticado')
      return
    }

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
      return
    }

    // reset
    setClienteId('')
    setData('')
    setValorConsulta('')
    setValorRecebido('')
    setObservacao('')

    carregarAtendimentos()
  }

  /* =========================
     EFFECT
  ========================= */

  useEffect(() => {
    carregarClientes()
    carregarAtendimentos()
  }, [])

  /* =========================
     UI
  ========================= */

  return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Atendimentos</h1>

        <form
          onSubmit={cadastrarAtendimento}
          className="space-y-3 mb-8"
        >
          <select
            className="w-full border rounded p-2"
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
            className="w-full border rounded p-2"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />

          <input
            type="number"
            step="0.01"
            placeholder="Valor da consulta"
            className="w-full border rounded p-2"
            value={valorConsulta}
            onChange={(e) => setValorConsulta(e.target.value)}
            required
          />

          <input
            type="number"
            step="0.01"
            placeholder="Valor recebido"
            className="w-full border rounded p-2"
            value={valorRecebido}
            onChange={(e) => setValorRecebido(e.target.value)}
            required
          />

          <textarea
            placeholder="Observação (opcional)"
            className="w-full border rounded p-2"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Cadastrar atendimento
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-4">Histórico</h2>

        <ul className="space-y-4">
          {atendimentos.map((a) => (
            <li key={a.id} className="border rounded p-4">
              <strong>
                {a.cliente_nome ?? 'Sem cliente'}
              </strong>{' '}
              — {a.data_atendimento}
              <br />
              Consulta: R$ {a.valor_consulta.toFixed(2)} | Recebido: R${' '}
              {a.valor_recebido.toFixed(2)}
              {a.observacao && (
                <p className="text-sm text-gray-600 mt-2">
                  {a.observacao}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
  )
}
