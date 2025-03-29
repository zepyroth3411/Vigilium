import { useState } from 'react'
import { useRouter } from 'next/router'
import Toast from '@/components/Toast'


export default function Login() {
  const [idUsuario, setIdUsuario] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [toast, setToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario, password })
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        throw new Error(data.message)
      }
  
      localStorage.setItem('vigilium_token', data.token)
  
      // 🎉 Mensaje de bienvenida
      setToast({ message: 'Bienvenido a Vigilium', type: 'success' })
  
      // ⏳ Redirección con retraso
      setTimeout(() => {
        router.push('/dashboard')
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
  )}