import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('vigilium_token')
    if (!token) {
      router.push('/login')
      return
    }
  
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      console.log('🔍 Rol detectado:', decoded.rol) // 👈 AÑADE ESTA LÍNEA
  
      switch (decoded.rol) {
        case 'admin':
          router.push('/dashboard/admin')
          break
        case 'monitorista':
          router.push('/dashboard/monitorist')
          break
        case 'tecnico':
          router.push('/dashboard/technical')
          break
        default:
          router.push('/login')
      }
    } catch (err) {
      console.error('Token inválido', err)
      router.push('/login')
    }
  }, [])

  return null // No muestra nada mientras redirige
}
