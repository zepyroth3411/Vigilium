// utils/redirectByRole.js

import { DASHBOARD_ROUTES } from './config'

export function redirectByRole(token, router) {
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]))
    const ruta = DASHBOARD_ROUTES[decoded.rol] || '/login'
    router.push(ruta)
  } catch (err) {
    console.error('🔒 Token inválido:', err)
    router.push('/login')
  }
}
