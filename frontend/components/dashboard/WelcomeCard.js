import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import {
  FaceSmileIcon
} from '@heroicons/react/24/outline'
import { TOKEN_KEY } from '@/utils/config'

export default function WelcomeCard() {
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState('')

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setNombre(decoded.nombre || '')
        setRol(decoded.rol || '')
      } catch (err) {
        console.error('❌ Error al decodificar el token en WelcomeCard:', err)
      }
    }
  }, [])

  return (
    <div className="bg-white border shadow-sm rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
        <FaceSmileIcon className="w-6 h-6" /> ¡Bienvenido, {nombre}!
      </h2>
      <p className="text-gray-600 mt-1 text-sm">
        Rol: <span className="capitalize font-medium">{rol}</span>
      </p>
    </div>
  )
}
