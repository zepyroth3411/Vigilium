import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { API_URL, TOKEN_KEY } from '@/utils/config'

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState(null)
  const [token, setToken] = useState(null)

  const router = useRouter()

  useEffect(() => {
    const tkn = localStorage.getItem(TOKEN_KEY)
    if (!tkn) {
      router.push('/login')
      return
    }

    setToken(tkn)

    fetch(`${API_URL}/api/usuarios`, {
      headers: { Authorization: `Bearer ${tkn}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Acceso restringido')
        return res.json()
      })
      .then(data => setUsuarios(data))
      .catch(err => setError(err.message))
  }, [])

  return (
    <div className="p-6 min-h-screen bg-[#f9fafb] space-y-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-primary">Administración</h1>
      <p className="text-gray-600">Gestión interna del personal y permisos del sistema</p>

      {/* 👥 Gestión de Usuarios */}
      <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">👥 Gestión de Usuarios</h2>
        {error && <p className="text-red-600">{error}</p>}
        <table className="w-full text-sm text-left border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{usuario.id_usuario}</td>
                <td className="px-4 py-2">{usuario.nombre}</td>
                <td className="px-4 py-2 capitalize">{usuario.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 🔐 Roles y Permisos */}
      <section className="bg-white p-6 rounded-xl shadow-sm border space-y-2">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">🔐 Roles y Accesos</h2>
        <ul className="text-sm text-gray-700 list-disc list-inside">
          <li><strong>admin</strong>: acceso total a todas las secciones, puede crear y modificar usuarios.</li>
          <li><strong>monitorista</strong>: acceso solo a dashboard, eventos, dispositivos y clientes.</li>
        </ul>
        <p className="text-sm text-gray-500 italic">* Los accesos están definidos por rol desde el backend.</p>
      </section>

      {/* 🔑 Cambiar Contraseña */}
      <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">🔑 Cambiar Contraseña</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            alert('Funcionalidad próximamente 🛠')
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="password"
            placeholder="Contraseña actual"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
            required
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
            required
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm md:col-span-2"
            required
          />
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-primary hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm"
            >
              Guardar contraseña
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}