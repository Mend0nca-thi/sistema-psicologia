'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push('/login')
      } else {
        setAuthorized(true)
      }

      setLoading(false)
    }

    checkUser()
  }, [router])

  if (loading) return <p>Carregando...</p>

  if (!authorized) return null

  return <>{children}</>
}
