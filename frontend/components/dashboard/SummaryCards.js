import { useEffect, useState } from 'react'

export default function SummaryCards() {
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('vigilium_token')
        const res = await fetch('http://localhost:4000/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
        setDashboardData(data)
      } catch (error) {
        console.error('❌ Error obteniendo dashboard:', error)
      }
    }

    fetchDashboard()
  }, [])

  if (!dashboardData) return null // o un loading spinner si prefieres

  const resumen = [
    {
      titulo: 'Último usuario agregado',
      valor: dashboardData.ultimo_usuario_nombre || '—',
      icono: '🧑‍💼'
    },
    {
      titulo: 'Último evento registrado',
      valor: dashboardData.ultimo_evento_desc || '—',
      icono: '🚨'
    },
    {
      titulo: 'Dispositivos conectados',
      valor: dashboardData.dispositivos_conectados ?? '—',
      icono: '📡'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {resumen.map((item, idx) => (
        <div
          key={idx}
          className="bg-white border rounded-xl shadow-sm p-5 flex flex-col gap-1"
        >
          <div className="text-3xl">{item.icono}</div>
          <p className="text-sm text-gray-500">{item.titulo}</p>
          <p className="text-lg font-semibold text-primary">{item.valor}</p>
        </div>
      ))}
    </div>
  )
}
