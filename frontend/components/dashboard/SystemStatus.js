import { useEffect, useState } from 'react'

export default function SystemStatus() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const obtenerEstadisticas = async () => {
      try {
        const token = localStorage.getItem('vigilium_token')
        const res = await fetch('http://localhost:4000/api/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error('❌ Error al obtener estadísticas:', error)
      }
    }

    obtenerEstadisticas()
  }, [])

  if (!stats) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.rol === 'admin' && (
        <>
          <StatusCard title="Usuarios" value={stats.total_usuarios} icon="👥" />
          <StatusCard title="Dispositivos" value={stats.total_dispositivos} icon="💻" />
          <StatusCard title="Eventos" value={stats.total_eventos} icon="📋" />
        </>
      )}

      {stats.rol === 'tecnico' && (
        <>
          <StatusCard title="Clientes" value={stats.total_clientes} icon="🏢" />
          <StatusCard title="Dispositivos" value={stats.total_dispositivos} icon="💻" />
        </>
      )}

      {stats.rol === 'monitorista' && (
        <>
          <StatusCard title="Eventos totales" value={stats.total_eventos} icon="📋" />
          <StatusCard title="Alertas críticas" value={stats.alertas_criticas} icon="🚨" />
        </>
      )}
    </div>
  )
}

function StatusCard({ title, value, icon }) {
  return (
    <div className="bg-white border shadow-sm rounded-xl p-5 flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-semibold text-primary">{value}</p>
      </div>
    </div>
  )
}
