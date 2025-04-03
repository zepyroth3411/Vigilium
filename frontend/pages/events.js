import { useEffect, useRef, useState } from 'react'
import EventsFilter from '@/components/events/EventsFilter'
import { tienePermiso } from '@/utils/permissions'
import socket from '@/utils/socket'
import AccessDenied from '@/components/common/AccessDenied'


export default function Eventos() {
  const [mostrarModal, setMostrarModal] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)
  const [respuestaMonitorista, setRespuestaMonitorista] = useState('')
  const [nombreUsuario, setNombreUsuario] = useState('Monitorista')
  const [idUsuario, setIdUsuario] = useState('monitor01')
  const [eventos, setEventos] = useState([])
  const [historialCritico, setHistorialCritico] = useState([])
  const [rolUsuario, setRolUsuario] = useState('')
  const [filtro, setFiltro] = useState({
    tipo: '',
    dispositivo: '',
    fechaInicio: '',
    fechaFin: ''
  })

  const logRef = useRef(null)

  const eventosSimulados = [
    'Batería baja',
    'Zona abierta',
    'Señal restablecida',
    'Fallo de comunicación',
    'Reconexión de dispositivo',
    'Alarma de pánico',
    'Evento de prueba',
    'FUEGO',
    'MÉDICA',
    'ROBO',
  ]

  const dispositivosSimulados = ['TL280-001', 'TL280-002', 'TL280-003', 'TL280-004']

  // Recuperar usuario y rol
  useEffect(() => {
    const nombre = localStorage.getItem('vigilium_user')
    const id = localStorage.getItem('vigilium_user_id')
    const token = localStorage.getItem('vigilium_token')
    if (nombre) setNombreUsuario(nombre)
    if (id) setIdUsuario(id)
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      setRolUsuario(decoded.rol)
    }
  }, [])

  // Simulación de eventos
  useEffect(() => {
    socket.on('nuevoEvento', (evento) => {
      const esCritico = evento.nivel_critico === 'crítico'
      const hora = new Date(evento.fecha_hora).toLocaleTimeString()

      const nuevo = {
        id: evento.id,
        tipo: esCritico ? 'ALERTA CRÍTICA' : 'NOTIFICACIÓN',
        descripcion: evento.descripcion,
        hora,
        dispositivo: evento.id_dispositivo,
        atendido: false
      }

      setEventos(prev => [...prev.slice(-49), nuevo])

      if (esCritico) {
        const audio = new Audio('/criticalalert.mp3')
        audio.play().catch(err => {
          console.warn('⚠️ No se pudo reproducir sonido:', err)
        })
      }
    })

    return () => {
      socket.off('nuevoEvento')
    }
  }, [])


  // Scroll inteligente
  useEffect(() => {
    const log = logRef.current
    if (!log) return
    const isAtBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 50
    if (isAtBottom) log.scrollTop = log.scrollHeight
  }, [eventos])

  // Sockets
  useEffect(() => {
    socket.on('eventoAtendido', (evento) => {
      setEventos(prev => prev.filter(e => e.id !== evento.id))
      setHistorialCritico(prev => [evento, ...prev])
    })

    socket.on('actualizarDescripcion', (eventoActualizado) => {
      setHistorialCritico(prev =>
        prev.map(e => e.id === eventoActualizado.id ? eventoActualizado : e)
      )
    })

    return () => {
      socket.off('eventoAtendido')
      socket.off('actualizarDescripcion')
    }
  }, [])

  const marcarComoAtendido = (id, detalle) => {
    const evento = eventos.find(e => e.id === id)
    if (evento) {
      const eventoConUsuario = {
        ...evento,
        atendidoPor: nombreUsuario,
        atendidoPorId: idUsuario,
        descripcionAtencion: detalle,
      }
      setHistorialCritico(prev => [eventoConUsuario, ...prev])
      setEventos(prev => prev.filter(e => e.id !== id))
      socket.emit('marcarAtendido', eventoConUsuario)
    }
  }

  const eventosFiltrados = eventos.filter(e => {
    const coincideTipo = !filtro.tipo || e.tipo === filtro.tipo
    const coincideDispositivo = !filtro.dispositivo || e.dispositivo === filtro.dispositivo
    const eventoFecha = new Date(e.fecha)
    const desde = filtro.fechaInicio ? new Date(filtro.fechaInicio) : null
    const hasta = filtro.fechaFin ? new Date(filtro.fechaFin) : null
    const dentroDeRango =
      (!desde || eventoFecha >= desde) &&
      (!hasta || eventoFecha <= hasta)
    return coincideTipo && coincideDispositivo && dentroDeRango
  })


  if (rolUsuario && !tienePermiso(rolUsuario, 'ver_eventos')) {
    return <AccessDenied />
  }

  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Eventos</h1>
      <p className="text-gray-600 mt-1 mb-4">Registro de eventos en tiempo real</p>

      <EventsFilter filtro={filtro} setFiltro={setFiltro} dispositivos={dispositivosSimulados} />

      {/* Eventos activos */}
      <div ref={logRef} className="bg-white h-[400px] overflow-y-auto rounded-xl border border-gray-200 p-4 space-y-3 shadow-sm">
        {eventosFiltrados.map(evento => (
          <div key={evento.id} className="bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{evento.hora}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                ${evento.tipo === 'ALERTA CRÍTICA'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
                }`}>
                {evento.tipo}
              </span>
            </div>
            <div className="mt-1 text-gray-800 text-sm">
              <strong className="text-primary">{evento.dispositivo}</strong> - {evento.descripcion}
            </div>
            {tienePermiso(rolUsuario, 'atender_eventos') && evento.tipo === 'ALERTA CRÍTICA' && (
              <button
                onClick={() => {
                  setEventoSeleccionado(evento)
                  setMostrarModal(true)
                }}
                className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition"
              >
                ✔ Marcar como atendido
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal de atención */}
      {mostrarModal && eventoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md border">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">📝 ¿Cómo se atendió el evento?</h2>
            <p className="text-sm text-gray-600 mb-4">
              <strong className="text-primary">{eventoSeleccionado.dispositivo}</strong> - {eventoSeleccionado.descripcion}
            </p>
            <textarea
              value={respuestaMonitorista}
              onChange={(e) => setRespuestaMonitorista(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              rows={4}
              placeholder="Describe la acción tomada..."
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  marcarComoAtendido(eventoSeleccionado.id, respuestaMonitorista)
                  setMostrarModal(false)
                  setRespuestaMonitorista('')
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historial */}
      {historialCritico.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📜 Historial de Alertas Críticas</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-sm">
            {historialCritico.map(evento => (
              <div key={evento.id} className="border border-gray-100 p-3 rounded bg-gray-50 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{evento.hora}</span>
                  <span className="text-xs font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                    Atendido por: {evento.atendidoPor || '—'} ({evento.atendidoPorId || '—'})
                  </span>
                </div>
                <div className="mt-1 text-gray-800">
                  <strong className="text-primary">{evento.dispositivo}</strong> - {evento.descripcion}
                </div>
                {evento.descripcionAtencion && (
                  <div className="mt-1 text-sm text-gray-600 italic">
                    📝 {evento.descripcionAtencion}
                  </div>
                )}
                {evento.atendidoPorId === idUsuario && tienePermiso(rolUsuario, 'editar_descripcion_evento') && (
                  <button
                    onClick={() => {
                      const nuevaDescripcion = prompt("Editar cómo se atendió:", evento.descripcionAtencion || '')
                      if (nuevaDescripcion) {
                        const actualizado = {
                          ...evento,
                          descripcionAtencion: nuevaDescripcion
                        }
                        setHistorialCritico(prev =>
                          prev.map(e => e.id === evento.id ? actualizado : e)
                        )
                        socket.emit('actualizarDescripcion', actualizado)
                      }
                    }}
                    className="mt-2 text-xs text-blue-600 hover:underline"
                  >
                    ✏️ Editar descripción
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
