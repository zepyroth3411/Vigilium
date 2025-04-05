import { useEffect, useState } from 'react'
import LiveFaultsCard from './LiveFaultCards'

export default function RoleOverview() {
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
        console.error('Error cargando dashboard:', error)
      }
    }

    fetchDashboard()
  }, [])

  if (!dashboardData) return null

  const { rol } = dashboardData

  let resumen = []

  if (rol === 'admin') {
    resumen = [
      { titulo: 'Usuarios totales', valor: dashboardData.total_usuarios ?? '—', icono: '👤' },
      { titulo: 'Dispositivos totales', valor: dashboardData.total_dispositivos ?? '—', icono: '📡' },
      { titulo: 'Eventos totales', valor: dashboardData.total_eventos ?? '—', icono: '📋' },
      { titulo: 'Último usuario agregado', valor: dashboardData.ultimo_usuario_nombre ?? '—', icono: '🧑‍💼' },
      { titulo: 'Último evento registrado', valor: dashboardData.ultimo_evento_desc ?? '—', icono: '🚨' },
      { titulo: 'Dispositivos conectados', valor: dashboardData.dispositivos_conectados ?? '—', icono: '✅' }
    ]
  } else if (rol === 'tecnico') {
    resumen = [
      { titulo: 'Dispositivos conectados', valor: dashboardData.dispositivos_conectados ?? '—', icono: '✅' },
      { titulo: 'Dispositivos desconectados', valor: dashboardData.dispositivos_desconectados ?? '—', icono: '❌' },
      { titulo: 'Clientes registrados', valor: dashboardData.total_clientes ?? '—', icono: '🏠' },
      { titulo: 'Dispositivos totales', valor: dashboardData.total_dispositivos ?? '—', icono: '🔢' },
    ]
  } else if (rol === 'monitorista') {
    resumen = [
      { titulo: 'Alertas críticas', valor: dashboardData.alertas_criticas ?? '—', icono: '🚨' },
      { titulo: 'Eventos totales', valor: dashboardData.total_eventos ?? '—', icono: '📋' },
      { titulo: 'Último evento atendido', valor: dashboardData.ultimo_evento_atendido ?? '—', icono: '👁' },
      { titulo: 'Tiempo promedio de atención', valor: dashboardData.promedio_atencion ?? '—', icono: '⏱' },
      { titulo: 'Eventos activos', valor: dashboardData.eventos_activos ?? '—', icono: '🔴' }
    ]
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      {(rol === 'admin' || rol === 'tecnico') && (
        <div className="col-span-1">
          <LiveFaultsCard />
        </div>
      )}
    </div>
  )
}
