import { useEffect, useState } from 'react'
import {
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { API_URL } from '@/utils/config'

export default function RecentEvents() {
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    const fetchRecientes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/eventos/recientes-dashboard`)
        const data = await res.json()

        const eventosFormateados = data.map(e => ({
          id: e.id_evento,
          tipo: e.tipo_evento,
          dispositivo: e.id_dispositivo,
          fecha: new Date(e.fecha_atencion).toLocaleDateString(),
          hora: new Date(e.fecha_atencion).toLocaleTimeString()
        }))

        setEventos(eventosFormateados)
      } catch (err) {
        console.error('❌ Error al cargar eventos recientes para dashboard:', err)
      }
    }

    fetchRecientes()
  }, [])

  if (eventos.length === 0) return null

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <ClipboardDocumentListIcon className="w-5 h-5" /> Últimos eventos atendidos
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border rounded-md overflow-hidden">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Dispositivo</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Hora</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map(evento => (
              <tr key={evento.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{evento.tipo}</td>
                <td className="px-4 py-2">{evento.dispositivo}</td>
                <td className="px-4 py-2">{evento.fecha}</td>
                <td className="px-4 py-2">{evento.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}