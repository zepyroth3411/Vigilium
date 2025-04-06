import { useEffect, useRef, useState } from 'react'
import EventsFilter from '@/components/events/EventsFilter'
import { tienePermiso } from '@/utils/permissions'
import socket from '@/utils/socket'
import AccessDenied from '@/components/common/AccessDenied'
import {
  API_URL,
  USER_ID_KEY,
  USER_NAME_KEY,
  TOKEN_KEY
} from '@/utils/config'

export default function Eventos() {
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarHistorial, setMostrarHistorial] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)
  const [respuestaMonitorista, setRespuestaMonitorista] = useState('')
  const [nombreUsuario, setNombreUsuario] = useState('Monitorista')
  const [idUsuario, setIdUsuario] = useState('monitor01')
  const [eventos, setEventos] = useState([])
  const [historialCritico, setHistorialCritico] = useState([])
  const [rolUsuario, setRolUsuario] = useState('')
  const [filtro, setFiltro] = useState({ tipo: '', dispositivo: '', fechaInicio: '', fechaFin: '' })

  const logRef = useRef(null)

  useEffect(() => {
    const nombre = localStorage.getItem(USER_NAME_KEY)
    const id = localStorage.getItem(USER_ID_KEY)
    const token = localStorage.getItem(TOKEN_KEY)
    if (nombre) setNombreUsuario(nombre)
    if (id) setIdUsuario(id)
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      setRolUsuario(decoded.rol)
    }
  }, [])

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
        audio.play().catch(err => console.warn('⚠️ No se pudo reproducir sonido:', err))
      }
    })

    return () => {
      socket.off('nuevoEvento')
    }
  }, [])

  useEffect(() => {
    const log = logRef.current
    if (!log) return
    const isAtBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 50
    if (isAtBottom) log.scrollTop = log.scrollHeight
  }, [eventos])

  const cargarEventosRecientes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/eventos/recientes`)
      const data = await res.json()
      const recientes = data.map(evento => ({
        id: evento.id_evento,
        tipo: 'ALERTA CRÍTICA',
        descripcion: evento.descripcion,
        hora: new Date(evento.fecha_atencion).toLocaleTimeString(),
        dispositivo: evento.id_dispositivo,
        atendidoPor: evento.atendido_por,
        atendidoPorId: evento.atendido_por || '—',
        descripcionAtencion: evento.detalle_atencion
      }))
      setHistorialCritico(recientes)
    } catch (err) {
      console.error('❌ Error al cargar historial reciente:', err)
    }
  }

  useEffect(() => {
    socket.on('eventoAtendido', () => {
      cargarEventosRecientes()
      const audio = new Audio('/resolved.mp3')
      audio.play().catch(() => {})
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

  useEffect(() => {
    const cargarEventosActivos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/eventos/activos`)
        const data = await res.json()

        const activos = data.map(evento => ({
          id: evento.id_evento,
          tipo: evento.nivel_critico === 'crítico' ? 'ALERTA CRÍTICA' : 'NOTIFICACIÓN',
          descripcion: evento.descripcion,
          hora: new Date(evento.fecha_hora).toLocaleTimeString(),
          dispositivo: evento.id_dispositivo,
          atendido: false
        }))

        setEventos(activos)
      } catch (err) {
        console.error('❌ Error al cargar eventos activos:', err)
      }
    }

    cargarEventosActivos()
    cargarEventosRecientes()
  }, [])

  const marcarComoAtendido = async (id, detalle) => {
    try {
      await fetch(`${API_URL}/api/eventos/${id}/atender`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atendido_por: nombreUsuario, detalle_atencion: detalle })
      })
      setEventos(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      console.error('❌ Error al marcar evento como atendido:', err)
    }
  }

  const eventosFiltrados = eventos.filter(e => {
    const coincideTipo = !filtro.tipo || e.tipo === filtro.tipo
    const coincideDispositivo = !filtro.dispositivo || e.dispositivo === filtro.dispositivo
    return coincideTipo && coincideDispositivo
  })

  const resumenUsuarios = historialCritico.reduce((acc, evento) => {
    if (!evento.atendidoPor) return acc
    acc[evento.atendidoPor] = (acc[evento.atendidoPor] || 0) + 1
    return acc
  }, {})

  if (rolUsuario && !tienePermiso(rolUsuario, 'ver_eventos')) {
    return <AccessDenied />
  }
  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Eventos</h1>
      <p className="text-gray-600 mt-1 mb-4">Registro de eventos en tiempo real</p>

      <EventsFilter filtro={filtro} setFiltro={setFiltro} dispositivos={[]} />

      <div ref={logRef} className="bg-white h-[400px] overflow-y-auto rounded-xl border border-gray-200 p-4 space-y-3 shadow-sm">
        {eventosFiltrados.map(evento => (
          <div key={evento.id} className="bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{evento.hora}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${evento.tipo === 'ALERTA CRÍTICA' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
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

      {historialCritico.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="font-semibold text-gray-700">🧾 Ultimos {historialCritico.length} eventos críticos atendidos</p>
          <p className="text-sm text-gray-500 mt-1 mb-2">
            👥 Atendidos por:
            {Object.entries(resumenUsuarios).map(([usuario, cantidad]) => (
              <span key={usuario} className="ml-2 text-primary font-semibold">
                {usuario} ({cantidad})
              </span>
            ))}
          </p>
          <button
            onClick={() => setMostrarHistorial(true)}
            className="mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm"
          >
            Ver historial completo
          </button>
        </div>
      )}

      {mostrarHistorial && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-2xl h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">📋 Historial de eventos atendidos</h2>
            <button onClick={() => setMostrarHistorial(false)} className="text-sm text-gray-500 hover:underline mb-3">
              Cerrar
            </button>
            {historialCritico.map(evento => (
              <div key={evento.id} className="border border-gray-100 p-3 rounded bg-gray-50 text-sm mb-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">{evento.hora}</span>
                  <span className="text-xs font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                    Atendido por: {evento.atendidoPor || '—'}
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
