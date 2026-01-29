export function Toast({ message }: { message: string }) {
  return (
    <div style={{ background: '#000', color: '#fff', padding: 10 }}>
      {message}
    </div>
  )
}
