import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState([])
  const [rolesDisponibles, setRolesDisponibles] = useState([])
  const [idUsuario, setIdUsuario] = useState('')
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const [rolId, setRolId] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('vigilium_token')
    if (!token) {
      router.push('/login')
      return
    }

    // Obtener usuarios
    fetch('http://localhost:4000/api/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Acceso restringido')
        return res.json()
      })
      .then(data => setUsuarios(data))
      .catch(err => setError(err.message))

    // Obtener roles
    fetch('http://localhost:4000/api/roles')
      .then(res => res.json())
      .then(data => setRolesDisponibles(data))
      .catch(err => console.error('Error al obtener roles:', err))
  }, [])

  const handleAgregarUsuario = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('vigilium_token')

    try {
      const res = await fetch('http://localhost:4000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_usuario: idUsuario, nombre, password, rol_id: rolId })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Error al agregar usuario')
      }

      setSuccess('✅ Usuario agregado correctamente')
      setError(null)
      setIdUsuario('')
      setNombre('')
      setPassword('')
      setRolId('')

      // Actualiza la lista de usuarios
      setUsuarios(prev => [...prev, { id_usuario: idUsuario, nombre, rol: rolesDisponibles.find(r => r.id === parseInt(rolId))?.nombre || '' }])
    } catch (err) {
      setError(err.message)
      setSuccess(null)
    }
  }

  return (
    <div className="p-6 min-h-screen bg-[#f9fafb] space-y-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-primary">👥 Gestión de Usuarios</h1>
      <p className="text-gray-600">Aquí puedes ver, crear y administrar los usuarios del sistema</p>

      {/* Tabla de usuarios */}
      <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Usuarios registrados</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Rol</th>
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
        </div>
      </section>

      {/* Formulario */}
      <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Agregar nuevo usuario</h2>
        <form
          onSubmit={handleAgregarUsuario}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            value={idUsuario}
            onChange={(e) => setIdUsuario(e.target.value)}
            placeholder="ID de usuario"
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
          />
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
          />
          <select
            value={rolId}
            onChange={(e) => setRolId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
            required
          >
            <option value="">Selecciona un rol</option>
            {rolesDisponibles.map((rol) => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-primary hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm"
            >
              Agregar usuario
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
