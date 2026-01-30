export function gerarLinkGoogleCalendar({
  titulo,
  descricao,
  dataInicio,
  dataFim,
}: {
  titulo: string
  descricao: string
  dataInicio: Date
  dataFim: Date
}) {
  const formatarData = (date: Date) =>
    date.toISOString().replace(/-|:|\.\d+/g, '')

  const inicio = formatarData(dataInicio)
  const fim = formatarData(dataFim)

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    titulo
  )}&details=${encodeURIComponent(
    descricao
  )}&dates=${inicio}/${fim}`
}
