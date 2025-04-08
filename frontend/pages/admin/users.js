import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { UserGroupIcon } from '@heroicons/react/24/outline'
import { API_URL, TOKEN_KEY } from '@/utils/config'

export default function UserManagement() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState([])
  const [rolesDisponibles, setRolesDisponibles] = useState([])
  const [idUsuario, setIdUsuario] = useState('')
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const [rolId, setRolId] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [editIndex, setEditIndex] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [editRolId, setEditRolId] = useState('')
  const [editPassword, setEditPassword] = useState('')

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      router.push('/dashboard')
      return
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      if (decoded.rol !== 'admin') {
        router.push('/login')
        return
      }
    } catch (error) {
      console.error('Token inválido', error)
      router.push('/login')
      return
    }

    const fetchUsuarios = async () => {
      try {
        const res = await fetch(`${API_URL}/api/usuarios`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('No autorizado')
        const data = await res.json()
        setUsuarios(data)
      } catch (err) {
        setError(err.message)
      }
    }

    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_URL}/api/roles`)
        const data = await res.json()
        setRolesDisponibles(data)
      } catch (err) {
        console.error('Error al obtener roles:', err)
      }
    }

    fetchUsuarios()
    fetchRoles()
  }, [])

  const handleAgregarUsuario = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem(TOKEN_KEY)

    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_usuario: idUsuario.trim(),
          nombre: nombre.trim(),
          password,
          rol_id: rolId
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al agregar usuario')

      setUsuarios(prev => [...prev, {
        id_usuario: idUsuario,
        nombre,
        rol: rolesDisponibles.find(r => r.id === parseInt(rolId))?.nombre || ''
      }])

      setSuccess('✅ Usuario agregado correctamente')
      setError(null)
      setIdUsuario('')
      setNombre('')
      setPassword('')
      setRolId('')
    } catch (err) {
      setError(err.message)
      setSuccess(null)
    }
  }

  const handleGuardarCambios = async (idUsuario, index) => {
    const token = localStorage.getItem(TOKEN_KEY)
    const payload = {
      nombre: editNombre.trim(),
      rol_id: parseInt(editRolId)
    }

    if (editPassword.trim() !== '') {
      payload.password = editPassword.trim()
    }

    try {
      const res = await fetch(`${API_URL}/api/usuarios/${idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('No se pudo actualizar el usuario')

      const updatedUsers = [...usuarios]
      const rolNombre = rolesDisponibles.find(r => r.id === parseInt(editRolId))?.nombre || ''
      updatedUsers[index] = { ...updatedUsers[index], nombre: editNombre, rol: rolNombre }

      setUsuarios(updatedUsers)
      setEditIndex(null)
      setEditPassword('')
      setSuccess('Usuario actualizado correctamente')
      setError(null)
    } catch (err) {
      setError(err.message)
      setSuccess(null)
    }
  }

  const handleEliminarUsuario = async (idUsuario) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return

    try {
      const res = await fetch(`${API_URL}/api/usuarios/${idUsuario}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al eliminar usuario')

      setUsuarios(prev => prev.filter(user => user.id_usuario !== idUsuario))
      setSuccess('🗑️ Usuario eliminado correctamente')
      setError(null)
    } catch (err) {
      setError(err.message)
      setSuccess(null)
    }
  }

  return (
    <div className="p-6 min-h-screen bg-[#f9fafb] space-y-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
        <UserGroupIcon className="w-7 h-7" /> Gestión de Usuarios
      </h1>
      <p className="text-gray-600">Aquí puedes ver, crear y administrar los usuarios del sistema</p>

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
              {usuarios.map((usuario, index) => (
                <tr key={usuario.id_usuario} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{usuario.id_usuario}</td>
                  <td className="px-4 py-2">
                    {editIndex === index ? (
                      <input
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      usuario.nombre
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editIndex === index ? (
                      <select
                        value={editRolId}
                        onChange={(e) => setEditRolId(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      >
                        {rolesDisponibles.map((rol) => (
                          <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                        ))}
                      </select>
                    ) : (
                      usuario.rol
                    )}
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    {editIndex === index ? (
                      <>
                        <input
                          type="password"
                          placeholder="Nueva contraseña (opcional)"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm mr-2"
                        />
                        <button onClick={() => handleGuardarCambios(usuario.id_usuario, index)} className="text-green-600 text-sm hover:underline">Guardar</button>
                        <button onClick={() => { setEditIndex(null); setEditPassword('') }} className="text-gray-500 text-sm hover:underline">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => {
                          setEditIndex(index)
                          setEditNombre(usuario.nombre)
                          setEditPassword('')
                          const rol = rolesDisponibles.find(r => r.nombre === usuario.rol)
                          setEditRolId(rol?.id || '')
                        }} className="text-blue-600 text-sm hover:underline">Editar</button>
                        <button onClick={() => handleEliminarUsuario(usuario.id_usuario)} className="text-red-600 text-sm hover:underline ml-3">Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Agregar nuevo usuario</h2>
        <form onSubmit={handleAgregarUsuario} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <button type="submit" className="bg-primary hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm">
              Agregar usuario
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
