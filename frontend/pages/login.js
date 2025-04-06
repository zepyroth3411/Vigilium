import { useState } from 'react'
import { useRouter } from 'next/router'
import Toast from '@/components/Toast'
import { API_URL, TOKEN_KEY, USER_ID_KEY, USER_NAME_KEY, DASHBOARD_ROUTES } from '@/utils/config'

export default function Login() {
  const [idUsuario, setIdUsuario] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [toast, setToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      const decoded = JSON.parse(atob(data.token.split('.')[1]))
      localStorage.setItem(USER_ID_KEY, decoded.id_usuario)
      localStorage.setItem(USER_NAME_KEY, decoded.nombre)
      localStorage.setItem(TOKEN_KEY, data.token)

      setToast({ message: 'Bienvenido a Vigilium', type: 'success' })

      setTimeout(() => {
        // Redirección dinámica por rol si existe, si no a dashboard por defecto
        router.push(DASHBOARD_ROUTES[decoded.rol] || '/dashboard')
      }, 2000)
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    }
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-primary mb-6">Iniciar sesión en Vigilium</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Correo electrónico</label>
              <input
                type="text"
                value={idUsuario}
                onChange={(e) => setIdUsuario(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-900 transition"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
