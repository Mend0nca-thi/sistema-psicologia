'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded ${
      pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`

  return (
    <aside className="w-64 bg-white border-r p-4">
      <nav className="space-y-2">
        <Link href="/dashboard" className={linkClass('/dashboard')}>
          Dashboard
        </Link>

        <Link href="/atendimentos" className={linkClass('/atendimentos')}>
          Atendimentos
        </Link>

        <Link href="/relatorios" className={linkClass('/relatorios')}>
          Relatórios
        </Link>
      </nav>
    </aside>
  )
}


