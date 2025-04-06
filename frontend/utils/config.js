// utils/config.js

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Claves para localStorage (centralizado por si cambian en el futuro)
export const TOKEN_KEY = 'vigilium_token'
export const USER_ID_KEY = 'vigilium_user_id'
export const USER_NAME_KEY = 'vigilium_user'

// Rutas por rol (útil si quieres redirecciones automáticas o navegación controlada)
export const DASHBOARD_ROUTES = {
  admin: '/dashboard/admin',
  monitorista: '/dashboard/monitorist',
  tecnico: '/dashboard/technical',
  supervisor: '/dashboard',
}
