import {
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'

import { useRouter } from 'next/router'

export default function QuickActions() {
  const router = useRouter()

  const acciones = [
    {
      titulo: 'Ver todos los eventos',
      descripcion: 'Consulta el historial completo de eventos registrados.',
      ruta: '/events',
      icono: <DocumentDuplicateIcon className="w-6 h-6 text-primary" />
    },
    {
      titulo: 'Configurar dispositivos',
      descripcion: 'Administra los dispositivos conectados al sistema.',
      ruta: '/devices',
      icono: <Cog6ToothIcon className="w-6 h-6 text-primary" />
    },
    {
      titulo: 'Agregar nuevo cliente',
      descripcion: 'Da de alta a un nuevo cliente en la plataforma.',
      ruta: '/client',
      icono: <UserPlusIcon className="w-6 h-6 text-primary" />
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
