import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { TOKEN_KEY } from '@/utils/config'
import WelcomeCard from '@/components/dashboard/WelcomeCard'
import QuickActionsTechnical from '@/components/dashboard/QuickActionsTechnical'
import RoleOverview from '@/components/dashboard/RoleOverview'

export default function DashboardTecnico() {
  const router = useRouter()
  const [rolUsuario, setRolUsuario] = useState('')

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return router.push('/login')

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      if (decoded.rol !== 'tecnico') {
        router.push('/login')
        return
      }
      setRolUsuario(decoded.rol)
    } catch (error) {
      console.error('Token inválido', error)
      router.push('/login')
    }
  }, [])

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <WelcomeCard />
      <RoleOverview />
      <QuickActionsTechnical />
    </div>
  )
}
