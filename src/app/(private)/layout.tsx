'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Sidebar from '@/components/auth/layout/Sidebar'
import Header from '@/components/auth/layout/Header'
import { HeaderProvider } from '@/contexts/HeaderContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <HeaderProvider>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />

          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </HeaderProvider>
    </ProtectedRoute>
  )
}
