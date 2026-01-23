'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Atendimento = {
  id: string
  data_atendimento: string | null
  valor_consulta: number
  valor_recebido: number
  clientes: {
    nome: string
  }[]
}

export default function RelatoriosPage() {
  const [mes, setMes] = useState(() =>
    new Date().toISOString().slice(0, 7)
  )
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([])
  const [totalPrevisto, setTotalPrevisto] = useState(0)
  const [totalRecebido, setTotalRecebido] = useState(0)

  async function carregarRelatorio() {
    const inicio = `${mes}-01`
    const fim = new Date(mes + '-01')
    fim.setMonth(fim.getMonth() + 1)

    const { data, error } = await supabase
      .from('atendimentos')
      .select(
        `
        id,
        data_atendimento,
        valor_consulta,
        valor_recebido,
        clientes ( nome )
      `
      )
      .gte('data_atendimento', inicio)
      .lt('data_atendimento', fim.toISOString().slice(0, 10))
      .order('data_atendimento')

    if (error) {
      alert(error.message)
      return
    }

    setAtendimentos(data || [])

    let previsto = 0
    let recebido = 0

    data?.forEach((a) => {
      previsto += a.valor_consulta
      recebido += a.valor_recebido
    })

    setTotalPrevisto(previsto)
    setTotalRecebido(recebido)
  }

  useEffect(() => {
    carregarRelatorio()
  }, [mes])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Relatório Financeiro</h1>

      <label>
        Mês:
        <input
          type="month"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        />
      </label>

      <div style={{ marginTop: 20 }}>
        <p><strong>Total previsto:</strong> R$ {totalPrevisto.toFixed(2)}</p>
        <p><strong>Total recebido:</strong> R$ {totalRecebido.toFixed(2)}</p>
        <p>
          <strong>Diferença:</strong> R$ {(totalRecebido - totalPrevisto).toFixed(2)}
        </p>
      </div>

      <h2>Atendimentos</h2>

      <ul>
        {atendimentos.map((a) => (
          <li key={a.id}>
            {a.data_atendimento} — {a.clientes.length > 0 ? a.clientes[0].nome : 'Sem cliente'}
            <br />
            Consulta: R$ {a.valor_consulta.toFixed(2)} | Recebido: R$ {a.valor_recebido.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}
