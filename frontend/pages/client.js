import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AccessDenied from '@/components/common/AccessDenied'
import { tienePermiso } from '@/utils/permissions'
import ClientFormModal from '@/components/clients/ClientFormModal'

export default function Clientes() {
  const [rolUsuario, setRolUsuario] = useState('')
  const [clientes, setClientes] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(null)
  const router = useRouter()

  // Obtener rol desde token
  useEffect(() => {
    const token = localStorage.getItem('vigilium_token')
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

  // Cargar clientes
  useEffect(() => {
    fetch('http://localhost:4000/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.error('Error al cargar clientes:', err))
  }, [])

  if (rolUsuario && !tienePermiso(rolUsuario, 'ver_clientes')) {
    return <AccessDenied />
  }

  const eliminarCliente = async (id_cliente) => {
    if (!confirm('¿Seguro que deseas eliminar este cliente?')) return
    try {
      const res = await fetch(`http://localhost:4000/api/clientes/${id_cliente}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      const actualizados = clientes.filter(c => c.id_cliente !== id_cliente)
      setClientes(actualizados)
    } catch (err) {
      alert('Error al eliminar cliente: ' + err.message)
    }
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Clientes</h1>
      <p className="text-gray-600 mt-1 mb-4">Gestión de clientes registrados en el sistema</p>

      {tienePermiso(rolUsuario, 'crear_cliente') && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => {
              setModoEdicion(null)
              setMostrarFormulario(true)
            }}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
          >
            ➕ Añadir Cliente
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Dirección</th>
              <th className="p-3 text-left">Teléfono</th>
              <th className="p-3 text-left">Correo</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-3">{c.nombre}</td>
                <td className="p-3">{c.direccion}</td>
                <td className="p-3">{c.telefono}</td>
                <td className="p-3">{c.correo}</td>
                <td className="p-3 space-x-2">
                  {tienePermiso(rolUsuario, 'editar_cliente') && (
                    <button
                      onClick={() => {
                        setModoEdicion(c)
                        setMostrarFormulario(true)
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                  )}
                  {tienePermiso(rolUsuario, 'editar_cliente') && (
                    <button
                      onClick={() => eliminarCliente(c.id_cliente)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Crear/Editar */}
      {mostrarFormulario && (
        <ClientFormModal
          modo={modoEdicion ? 'editar' : 'crear'}
          cliente={modoEdicion}
          onClose={() => {
            setMostrarFormulario(false)
            setModoEdicion(null)
          }}
          onSuccess={async () => {
            const res = await fetch('http://localhost:4000/api/clientes')
            const data = await res.json()
            setClientes(data)
          }}
        />
      )}
    </div>
  )
}
