import { useEffect } from 'react'
import { useRouter } from 'next/router'

const withAuth = (WrappedComponent) => {
  return function ProtectedComponent(props) {
    const router = useRouter()

    useEffect(() => {
      const token = localStorage.getItem('vigilium_token')

      if (!token) {
        console.warn('🚫 No hay token, redirigiendo al login')
        router.push('/login')
        return
      }

      try {
        const payloadBase64 = token.split('.')[1]
        const decodedPayload = JSON.parse(atob(payloadBase64))

        const now = Math.floor(Date.now() / 1000)
        if (decodedPayload.exp < now) {
          console.warn('⏳ Token expirado, redirigiendo al login')
          localStorage.removeItem('vigilium_token')
          router.push('/login')
          return
        }
      } catch (error) {
        console.error('❌ Token inválido o mal formado:', error)
        localStorage.removeItem('vigilium_token')
        router.push('/login')
      }
    }, [])

    return <WrappedComponent {...props} />
  }
}

export default withAuth