'use client'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useHeader } from '@/contexts/HeaderContext'

export default function Header() {
  const router = useRouter()
  const { title } = useHeader()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <span className="text-sm text-gray-600">
        {title || 'Sistema de Atendimento'}
      </span>

      <button
        onClick={logout}
        className="text-sm text-red-600 hover:underline"
      >
        Sair
      </button>
    </header>
  )
}
