import { useEffect, useState } from 'react'
import LiveFaultsCard from './LiveFaultCards'
import RecentEvents from './RecentEvents'
import {
  UserIcon,
  DevicePhoneMobileIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  HomeIcon,
  EyeIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'
import { API_URL, TOKEN_KEY } from '@/utils/config'

export default function RoleOverview() {
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY)
        const res = await fetch(`${API_URL}/api/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
        setDashboardData(data)
      } catch (error) {
        console.error('❌ Error cargando dashboard:', error)
      }
    }

    fetchDashboard()
  }, [])

  if (!dashboardData) return null

  const { rol } = dashboardData

  let resumen = []

  if (rol === 'admin') {
    resumen = [
      { titulo: 'Usuarios totales', valor: dashboardData.total_usuarios ?? '—', icono: <UserIcon className="w-6 h-6 text-primary" /> },
      { titulo: 'Dispositivos totales', valor: dashboardData.total_dispositivos ?? '—', icono: <DevicePhoneMobileIcon className="w-6 h-6 text-primary" /> },
      { titulo: 'Eventos totales', valor: dashboardData.total_eventos ?? '—', icono: <ClipboardDocumentListIcon className="w-6 h-6 text-primary" /> },
      { titulo: 'Último usuario agregado', valor: dashboardData.ultimo_usuario_nombre ?? '—', icono: <UserGroupIcon className="w-6 h-6 text-primary" /> },
      { titulo: 'Último evento registrado', valor: dashboardData.ultimo_evento_desc ?? '—', icono: <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" /> },
      { titulo: 'Dispositivos conectados', valor: dashboardData.dispositivos_conectados ?? '—', icono: <CheckCircleIcon className="w-6 h-6 text-green-500" /> },
    ]
  } else if (rol === 'tecnico') {
    resumen = [
      { titulo: 'Dispositivos conectados', valor: dashboardData.dispositivos_conectados ?? '—', icono: <CheckCircleIcon className="w-6 h-6 text-green-500" /> },
      { titulo: 'Dispositivos desconectados', valor: dashboardData.dispositivos_desconectados ?? '—', icono: <XCircleIcon className="w-6 h-6 text-red-500" /> },
      { titulo: 'Clientes registrados', valor: dashboardData.total_clientes ?? '—', icono: <HomeIcon className="w-6 h-6 text-primary" /> },
      { titulo: 'Dispositivos totales', valor: dashboardData.total_dispositivos ?? '—', icono: <DevicePhoneMobileIcon className="w-6 h-6 text-primary" /> },
    ]
  } else if (rol === 'monitorista') {
    resumen = [
      { titulo: 'Alertas críticas', valor: dashboardData.alertas_criticas ?? '—', icono: <ExclamationTriangleIcon className="w-6 h-6 text-red-600" /> },
      { titulo: 'Eventos totales', valor: dashboardData.total_eventos ?? '—', icono: <ClipboardDocumentListIcon className="w-6 h-6 text-primary" /> },
      { titulo: 'Último evento atendido', valor: dashboardData.ultimo_evento_atendido ?? '—', icono: <EyeIcon className="w-6 h-6 text-indigo-500" /> },
      { titulo: 'Eventos activos', valor: dashboardData.eventos_activos ?? '—', icono: <BoltIcon className="w-6 h-6 text-yellow-500" /> },
    ]
  }
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resumen.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-xl shadow-sm p-5 flex flex-col gap-2"
          >
            <div className="w-8 h-8">{item.icono}</div>
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
  
      {(rol === 'admin' || rol === 'monitorista') && (
        <RecentEvents />
      )}
    </>
  )
}