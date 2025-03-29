import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Simulación temporal (en el siguiente paso hacemos real)
    if (email === 'admin@vigilium.com' && password === '123456') {
      localStorage.setItem('vigilium_token', 'demo_token_123')
      router.push('/dashboard')
    } else {
      alert('Credenciales incorrectas')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-primary mb-6">Iniciar sesión en Vigilium</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
  )
}
