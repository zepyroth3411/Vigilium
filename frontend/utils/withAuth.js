// utils/withAuth.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { TOKEN_KEY } from './config'

const withAuth = (WrappedComponent) => {
  return function ProtectedComponent(props) {
    const router = useRouter()

    useEffect(() => {
      const token = localStorage.getItem(TOKEN_KEY)

      if (!token) {
        console.warn('🚫 No hay token, redirigiendo al login')
        router.push('/login')
        return
      }

      try {
        const payloadBase64 = token.split('.')[1]
        const decoded = JSON.parse(atob(payloadBase64))
        const now = Math.floor(Date.now() / 1000)

        if (decoded.exp && decoded.exp < now) {
          console.warn('⏳ Token expirado, redirigiendo al login')
          localStorage.removeItem(TOKEN_KEY)
          router.push('/login')
        }
      } catch (error) {
        console.error('❌ Token inválido:', error)
        localStorage.removeItem(TOKEN_KEY)
        router.push('/login')
      }
    }, [])

    return <WrappedComponent {...props} />
  }
}

export default withAuth
