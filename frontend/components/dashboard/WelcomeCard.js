import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

export default function WelcomeCard() {
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('vigilium_token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setNombre(decoded.nombre)
        setRol(decoded.rol)
      } catch (err) {
        console.error('Error al decodificar el token:', err)
      }
    }
  }, [])

  return (
    <div className="bg-white border shadow-sm rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-primary">👋 ¡Bienvenido, {nombre}!</h2>
      <p className="text-gray-600 mt-1 text-sm">Rol: <span className="capitalize font-medium">{rol}</span></p>
    </div>
  )
}
