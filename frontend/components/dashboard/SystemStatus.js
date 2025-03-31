import { useEffect, useState } from 'react'

export default function SystemStatus() {
  const [stats, setStats] = useState({
    usuarios: 0,
    dispositivos: 0,
    eventos: 0
  })

  useEffect(() => {
    // 🔄 Aquí podrías hacer llamadas reales a tu backend cuando tengas los endpoints
    const obtenerEstadisticas = async () => {
      // Datos simulados
      setStats({
        usuarios: 6,
        dispositivos: 12,
        eventos: 37
      })
    }

    obtenerEstadisticas()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatusCard title="Usuarios" value={stats.usuarios} icon="👥" />
      <StatusCard title="Dispositivos" value={stats.dispositivos} icon="💻" />
      <StatusCard title="Eventos" value={stats.eventos} icon="📋" />
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
