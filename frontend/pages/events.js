import { useEffect, useRef, useState } from 'react'

export default function Eventos() {
  const [eventos, setEventos] = useState([])
  const logRef = useRef(null)

  const eventosSimulados = [
    'Batería baja',
    'Zona abierta',
    'Señal restablecida',
    'Fallo de comunicación',
    'Reconexión de dispositivo',
    'Alarma de pánico',
    'Evento de prueba',
  ]

  const dispositivosSimulados = ['TL280-001', 'TL280-002', 'TL280-003', 'TL280-004']

  useEffect(() => {
    const intervalo = setInterval(() => {
      const nuevoEvento = {
        id: Date.now(),
        tipo: Math.random() < 0.5 ? 'ALERTA CRÍTICA' : 'NOTIFICACIÓN',
        descripcion: eventosSimulados[Math.floor(Math.random() * eventosSimulados.length)],
        hora: new Date().toLocaleTimeString(),
        dispositivo: dispositivosSimulados[Math.floor(Math.random() * dispositivosSimulados.length)],
      }

      setEventos(prev => [...prev.slice(-49), nuevoEvento])
    }, 3000)

    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [eventos])

  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Eventos</h1>
      <p className="text-gray-600 mt-1 mb-4">Registro de eventos en tiempo real</p>

      <div
        ref={logRef}
        className="bg-white h-[400px] overflow-y-auto rounded-xl border border-gray-200 p-4 space-y-3 shadow-sm"
      >
        {eventos.map(evento => (
          <div
            key={evento.id}
            className="bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{evento.hora}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                ${evento.tipo === 'ALERTA CRÍTICA'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
                }`}
              >
                {evento.tipo}
              </span>
            </div>
            <div className="mt-1 text-gray-800 text-sm">
              <strong className="text-primary">{evento.dispositivo}</strong> - {evento.descripcion}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
