import { FiAlertCircle, FiClock, FiCheckCircle, FiMessageCircle } from 'react-icons/fi'

export default function Eventos() {
  const eventos = [
    {
      id: 1,
      tipo: 'Alerta crítica',
      descripcion: 'Batería baja en dispositivo TL280-001',
      hora: '2025-03-29 08:32',
      dispositivo: 'TL280-001',
      estado: 'pendiente'
    },
    {
      id: 2,
      tipo: 'Notificación',
      descripcion: 'Dispositivo TL280-002 volvió a conectarse',
      hora: '2025-03-29 08:28',
      dispositivo: 'TL280-002',
      estado: 'resuelto'
    },
    {
      id: 3,
      tipo: 'Alerta crítica',
      descripcion: 'Zona abierta en dispositivo TL280-003',
      hora: '2025-03-29 08:20',
      dispositivo: 'TL280-003',
      estado: 'pendiente'
    },
  ]

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Eventos</h1>
      <p className="text-gray-600 mt-1">Monitoreo en tiempo real de eventos críticos del sistema</p>

      <div className="mt-6 space-y-4">
        {eventos.map(evento => (
          <div
            key={evento.id}
            className={`flex items-start p-4 rounded-xl border shadow-sm bg-white space-x-4 ${
              evento.estado === 'pendiente' ? 'border-red-300' : 'border-gray-200'
            }`}
          >
            <div className="text-red-600 mt-1 text-xl">
              {evento.estado === 'pendiente' ? <FiAlertCircle /> : <FiCheckCircle className="text-green-600" />}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-800">{evento.tipo}</h2>
              <p className="text-sm text-gray-600">{evento.descripcion}</p>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                <FiClock className="inline-block" /> {evento.hora} | Dispositivo: <strong>{evento.dispositivo}</strong>
              </div>
            </div>
            {evento.estado === 'pendiente' && (
              <button
                className="text-sm flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition"
                onClick={() => alert('Mensaje enviado ⚠️')}
              >
                <FiMessageCircle /> Enviar mensaje
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
