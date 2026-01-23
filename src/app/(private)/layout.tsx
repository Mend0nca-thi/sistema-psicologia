import ProtectedRoute from '@/components/ProtectedRoute'

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
