import { useRouter } from 'next/router'

export default function QuickActions() {
  const router = useRouter()

  const acciones = [
    {
      titulo: '📄 Ver todos los eventos',
      descripcion: 'Consulta el historial completo de eventos registrados.',
      ruta: '/events'
    },
    {
      titulo: '🛰️ Configurar dispositivos',
      descripcion: 'Administra los dispositivos conectados al sistema.',
      ruta: '/devices'
    },
    {
      titulo: '➕ Agregar nuevo cliente',
      descripcion: 'Da de alta a un nuevo cliente en la plataforma.',
      ruta: '/client'
    }
  ]

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">⚡ Accesos rápidos</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {acciones.map((accion, i) => (
          <div
            key={i}
            onClick={() => router.push(accion.ruta)}
            className="cursor-pointer border p-4 rounded-lg hover:bg-orange-50 transition"
          >
            <h3 className="text-sm font-semibold text-primary mb-1">{accion.titulo}</h3>
            <p className="text-gray-600 text-xs">{accion.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
