import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { tienePermiso } from '@/utils/permissions'
import WelcomeCard from '@/components/dashboard/WelcomeCard'
import AccessDenied from '@/components/common/AccessDenied'
import RoleOverview from '@/components/dashboard/RoleOverview'
import { TOKEN_KEY } from '@/utils/config'

export default function DashboardMonitorista() {
  const [rolUsuario, setRolUsuario] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return router.push('/login')

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      setRolUsuario(decoded.rol)
    } catch (err) {
      console.error('Token inválido', err)
      router.push('/login')
    }
  }, [])

  if (rolUsuario && !tienePermiso(rolUsuario, 'ver_dashboard')) {
    return <AccessDenied />
  }

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <WelcomeCard />
      <RoleOverview />
    </div>
  )
}
