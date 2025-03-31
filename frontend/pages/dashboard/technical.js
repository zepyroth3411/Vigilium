import WelcomeCard from '@/components/dashboard/WelcomeCard'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function DashboardTecnico() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('vigilium_token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      if (decoded.rol !== 'tecnico') {
        router.push('/login') // redirige si no es técnico
        return
      }
    } catch (error) {
      console.error('Token inválido', error)
      router.push('/login')
    }
  }, [])

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <WelcomeCard />
      <div className="bg-white shadow rounded-xl p-6 border">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">🔧 Panel Técnico</h2>
        <p className="text-gray-600 text-sm">
          Aquí podrás ver el estado de los dispositivos, clientes asignados y tareas de mantenimiento.
        </p>
        <p className="text-gray-500 mt-2 text-sm">⚙️ Próximamente se integrarán herramientas para pruebas en campo y diagnóstico remoto.</p>
      </div>
    </div>
  )
}
