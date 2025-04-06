import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { tienePermiso } from '@/utils/permissions'
import AccessDenied from '@/components/common/AccessDenied'
import DiagnosticModal from '@/components/devices/DiagnosticModal'
import DeviceFormModal from '@/components/devices/DeviceFormModal'
import { API_URL, TOKEN_KEY } from '@/utils/config'

export default function Dispositivos() {
  const [rolUsuario, setRolUsuario] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [dispositivos, setDispositivos] = useState([])
  const [clientes, setClientes] = useState([])
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState(null)
  const [mostrarDiagnostico, setMostrarDiagnostico] = useState(false)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(null)

  const router = useRouter()

  // Obtener token y rol
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        setRolUsuario(decoded.rol)
      } catch (err) {
        console.error('Token inválido', err)
        router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }, [])

  // Cargar datos desde backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDispositivos = await fetch(`${API_URL}/api/devices`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
          }
        })
        const dispositivosData = await resDispositivos.json()
        setDispositivos(Array.isArray(dispositivosData) ? dispositivosData : [])

        const resClientes = await fetch(`${API_URL}/api/clientes`)
        const clientesData = await resClientes.json()
        setClientes(Array.isArray(clientesData) ? clientesData : [])
      } catch (err) {
        console.error('🔥 Error cargando datos:', err)
      }
    }

    fetchData()
  }, [])

  // Validación de permisos
  if (rolUsuario && !tienePermiso(rolUsuario, 'ver_dispositivos')) {
    return <AccessDenied />
  }

  const filtrados = Array.isArray(dispositivos)
    ? (filtro === 'todos' ? dispositivos : dispositivos.filter(d => d.estado === filtro))
    : []

  const handleEliminarDispositivo = async (id_dispositivo) => {
    const confirmar = confirm(`¿Estás seguro de eliminar el dispositivo ${id_dispositivo}?`)
    if (!confirmar) return

    try {
      const token = localStorage.getItem(TOKEN_KEY)
      const res = await fetch(`${API_URL}/api/devices/${id_dispositivo}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      // Actualizar lista en frontend
      setDispositivos(dispositivos.filter(d => d.id_dispositivo !== id_dispositivo))
    } catch (err) {
      alert('Error al eliminar dispositivo: ' + err.message)
    }
  }

  const handleToggleRecepcion = async (id, nuevoEstado) => {
    const token = localStorage.getItem(TOKEN_KEY)

    try {
      const res = await fetch(`${API_URL}/api/devices/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ recibir_eventos: nuevoEstado })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setDispositivos(prev =>
        prev.map(d =>
          d.id_dispositivo === id ? { ...d, recibir_eventos: nuevoEstado } : d
        )
      )
    } catch (err) {
      console.error('❌ Error al cambiar estado de recepción:', err)
      alert('No se pudo cambiar el estado de recepción del dispositivo')
    }
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Dispositivos</h1>
      <p className="text-gray-600 mt-1">Monitoreo de comunicadores TL280 asignados a clientes</p>

      <div className="mt-6 mb-4 flex flex-wrap justify-between items-center">
        <div className="space-x-2">
          {['todos', 'conectado', 'desconectado', 'alerta'].map(est => (
            <button
              key={est}
              onClick={() => setFiltro(est)}
              className={`px-3 py-1 rounded-full text-sm border font-medium transition
                ${filtro === est
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
              {est.charAt(0).toUpperCase() + est.slice(1)}
            </button>
          ))}
        </div>

        {tienePermiso(rolUsuario, 'crear_dispositivo') && (
          <button
            onClick={() => {
              setModoEdicion(null)
              setMostrarFormulario(true)
            }}
            className="mt-3 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            ➕ Agregar Dispositivo
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Última señal</th>
              <th className="p-3 text-left">Recibe eventos</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((d, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">{d.id_dispositivo}</td>
                  <td className="p-3">{d.nombre_cliente || '—'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold capitalize
                      ${d.estado === 'conectado' ? 'bg-green-100 text-green-700'
                        : d.estado === 'desconectado' ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'}`}>
                      {d.estado}
                    </span>
                  </td>
                  <td className="p-3">{d.ultima_senal || '—'}</td>
                  <td className="p-3 text-sm font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                       ${d.recibir_eventos ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {d.recibir_eventos ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        onClick={() => {
                          setDispositivoSeleccionado(d)
                          setMostrarDiagnostico(true)
                        }}
                        className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition h-8"
                      >
                        🔍 Ver detalles
                      </button>

                      {tienePermiso(rolUsuario, 'editar_dispositivo') && (
                        <>
                          <button
                            onClick={() => {
                              setModoEdicion(d)
                              setMostrarFormulario(true)
                            }}
                            className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition h-8"
                          >
                            ✏️ Editar
                          </button>

                          <button
                            onClick={() => handleEliminarDispositivo(d.id_dispositivo)}
                            className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition h-8"
                          >
                            🗑 Eliminar
                          </button>

                          <div className="relative inline-block w-11 h-6 ml-1">
                            <input
                              type="checkbox"
                              id={`switch-${d.id_dispositivo}`}
                              className="peer sr-only"
                              checked={d.recibir_eventos}
                              onChange={() => handleToggleRecepcion(d.id_dispositivo, !d.recibir_eventos)}
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                            <label
                              htmlFor={`switch-${d.id_dispositivo}`}
                              className="absolute left-1 top-1 w-4 h-4 bg-white border border-slate-300 rounded-full shadow-sm transition-transform duration-300 peer-checked:translate-x-5 cursor-pointer"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 p-4">
                  No hay dispositivos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarDiagnostico && dispositivoSeleccionado && (
        <DiagnosticModal
          dispositivo={dispositivoSeleccionado}
          onClose={() => setMostrarDiagnostico(false)}
        />
      )}

      {mostrarFormulario && (
        <DeviceFormModal
          modo={modoEdicion ? 'editar' : 'crear'}
          dispositivo={modoEdicion}
          clientes={clientes}
          onClose={() => {
            setMostrarFormulario(false)
            setModoEdicion(null)
          }}
          onSuccess={async () => {
            const token = localStorage.getItem(TOKEN_KEY)
            const res = await fetch(`${API_URL}/api/devices`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            const data = await res.json()
            setDispositivos(data)
          }}
        />
      )}
    </div>
  )
}