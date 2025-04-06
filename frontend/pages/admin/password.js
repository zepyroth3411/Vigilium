import { useState, useEffect } from 'react'
import AccessDenied from '@/components/common/AccessDenied'
import { tienePermiso } from '@/utils/permissions'
import { API_URL, TOKEN_KEY, USER_ID_KEY } from '@/utils/config'

export default function CambiarPassword() {
  const [passwordActual, setPasswordActual] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [idUsuario, setIdUsuario] = useState('')
  const [rol, setRol] = useState('')

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const id = localStorage.getItem(USER_ID_KEY)
    if (token && id) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        setRol(decoded.rol)
        setIdUsuario(id)
      } catch (err) {
        console.error('Token inválido', err)
      }
    }
  }, [])

  if (rol && !tienePermiso(rol, 'cambiar_password')) {
    return <AccessDenied />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!passwordActual || !nuevaPassword || !confirmarPassword) {
      setMensaje({ tipo: 'error', texto: 'Todos los campos son obligatorios.' })
      return
    }

    if (nuevaPassword !== confirmarPassword) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden.' })
      return
    }

    try {
      const token = localStorage.getItem(TOKEN_KEY)

      const res = await fetch(`${API_URL}/api/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_usuario: idUsuario,
          nuevaPassword
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setMensaje({ tipo: 'success', texto: 'Contraseña actualizada correctamente.' })
      setPasswordActual('')
      setNuevaPassword('')
      setConfirmarPassword('')
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message })
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">🔑 Cambiar contraseña</h2>

      {mensaje && (
        <div className={`mb-4 p-3 rounded text-sm ${
          mensaje.tipo === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Contraseña actual"
          value={passwordActual}
          onChange={e => setPasswordActual(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaPassword}
          onChange={e => setNuevaPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmarPassword}
          onChange={e => setConfirmarPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
        >
          Cambiar contraseña
        </button>
      </form>
    </div>
  )
}
