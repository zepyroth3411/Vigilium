import { useEffect, useState } from 'react'
import AccessDenied from '@/components/common/AccessDenied'
import { tienePermiso } from '@/utils/permissions'

export default function Clientes() {
  const [rolUsuario, setRolUsuario] = useState('')

  // Simulación de clientes
  const clientes = [
    { id: 1, nombre: 'Juan Pérez', ubicacion: 'CDMX', estado: 'Activo' },
    { id: 2, nombre: 'María Gómez', ubicacion: 'Monterrey', estado: 'Suspendido' },
  ]

  useEffect(() => {
    const token = localStorage.getItem('vigilium_token')
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      setRolUsuario(decoded.rol)
    }
  }, [])

  if (rolUsuario && !tienePermiso(rolUsuario, 'ver_clientes')) {
    return <AccessDenied />
  }

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Clientes</h1>
      <p className="text-gray-600 mt-1 mb-4">Listado de clientes registrados</p>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Ubicación</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{cliente.id}</td>
                <td className="p-3">{cliente.nombre}</td>
                <td className="p-3">{cliente.ubicacion}</td>
                <td className="p-3">{cliente.estado}</td>
                <td className="p-3">
                  {tienePermiso(rolUsuario, 'editar_clientes') ? (
                    <button className="text-primary hover:underline text-sm">✏️ Editar</button>
                  ) : (
                    <span className="text-gray-400 italic text-sm">Solo lectura</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
