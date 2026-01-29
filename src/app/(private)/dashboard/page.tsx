'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useHeader } from '@/contexts/HeaderContext'

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
 const { setTitle } = useHeader()

  useEffect(() => {
    setTitle('Dashboard Financeiro')
  }, [setTitle])}
<div className="bg-red-600 text-white p-4 text-xl">
  ATUALIZOU AGORA
</div>