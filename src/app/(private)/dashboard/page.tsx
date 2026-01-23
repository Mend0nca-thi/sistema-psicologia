'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Atendimento = {
  id: string
  data_atendimento: string
  valor_consulta: number
  valor_recebido: number | null
}

export default function DashboardPage() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAtendimentos = async () => {
      const { data, error } = await supabase
        .from('atendimentos')
        .select('id, data_atendimento, valor_consulta, valor_recebido')

      if (!error) {
        setAtendimentos(data || [])
      }

      setLoading(false)
    }

    fetchAtendimentos()
  }, [])

  if (loading) return <p>Carregando dashboard...</p>

  // 🔢 Cálculos
  const totalPrevisto = atendimentos.reduce(
    (sum, a) => sum + a.valor_consulta,
    0
  )

  const totalRecebido = atendimentos.reduce(
    (sum, a) => sum + (a.valor_recebido ?? 0),
    0
  )

  const totalPendente = totalPrevisto - totalRecebido

  // 📊 Dados do gráfico
  const chartData = [
    { nome: 'Previsto', valor: totalPrevisto },
    { nome: 'Recebido', valor: totalRecebido },
    { nome: 'Pendente', valor: totalPendente },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard Financeiro</h1>

      <div style={{ marginTop: 20 }}>
        <p><strong>Total previsto:</strong> R$ {totalPrevisto.toFixed(2)}</p>
        <p><strong>Total recebido:</strong> R$ {totalRecebido.toFixed(2)}</p>
        <p><strong>Pendente:</strong> R$ {totalPendente.toFixed(2)}</p>
      </div>

      <div style={{ width: '100%', height: 300, marginTop: 40 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="valor" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
