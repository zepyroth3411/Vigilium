import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { redirectByRole } from '@/utils/redirectByRole'
import { TOKEN_KEY } from '@/utils/config'

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    redirectByRole(token, router)
  }, [])

  return null
}
