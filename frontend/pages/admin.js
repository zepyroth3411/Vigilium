import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Configuracion() {
  const [nombreSistema, setNombreSistema] = useState('Vigilium')
  const [horarioInicio, setHorarioInicio] = useState('07:00')
  const [horarioFin, setHorarioFin] = useState('18:00')
  const [modo, setModo] = useState('producción')
  const [usuarios, setUsuarios] = useState([])
  const [idUsuario, setIdUsuario] = useState('')
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('monitorista')
  const [error, setError] = useState(null)

  const router = useRouter()

  const handleGuardar = () => {
    alert('⚙️ Configuración guardada (simulado)')
  }

  useEffect(() => {
    const token = localStorage.getItem('vigilium_token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch('http://localhost:4000/api/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Acceso restringido')
        return res.json()
      })
      .then(data => setUsuarios(data))
      .catch(err => setError(err.message))
  }, [])

  const handleAgregarUsuario = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('vigilium_token')

    try {
      const res = await fetch('http://localhost:4000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id_usuario: idUsuario, nombre, password, rol })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setUsuarios([...usuarios, { id_usuario: idUsuario, nombre, rol }])
      setIdUsuario('')
      setNombre('')
      setPassword('')
      setRol('monitorista')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen space-y-10">
      <div className="max-w-2xl bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h1 className="text-3xl font-bold text-primary">Configuración</h1>
        <p className="text-gray-600">Ajustes generales del sistema de monitoreo</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del sistema</label>
          <input
            type="text"
            value={nombreSistema}
            onChange={(e) => setNombreSistema(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horario de inicio</label>
            <input
              type="time"
              value={horarioInicio}
              onChange={(e) => setHorarioInicio(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horario de fin</label>
            <input
              type="time"
              value={horarioFin}
              onChange={(e) => setHorarioFin(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modo de operación</label>
          <select
            value={modo}
            onChange={(e) => setModo(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
          >
            <option value="producción">Producción</option>
            <option value="desarrollo">Desarrollo</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            onClick={handleGuardar}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-900 text-sm"
          >
            Guardar cambios
          </button>
        </div>
      </div>

      {/* Gestión de usuarios */}
      <div className="max-w-4xl bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gestión de Usuarios</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <table className="w-full text-sm text-left border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID de Usuario</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario} className="border-t">
                <td className="px-4 py-2">{usuario.id_usuario}</td>
                <td className="px-4 py-2">{usuario.nombre}</td>
                <td className="px-4 py-2 capitalize">{usuario.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>

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
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
          >
            <option value="monitorista">Monitorista</option>
            <option value="admin">Admin</option>
          </select>
          <div className="md:col-span-2 text-right pt-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Agregar usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}