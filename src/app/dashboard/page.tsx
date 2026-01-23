'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      }
    })
  }, [router])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>
      <p>Área protegida</p>
    </div>
  )
}
