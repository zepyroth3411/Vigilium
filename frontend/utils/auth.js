// utils/auth.js
import { jwtDecode } from 'jwt-decode'
import { TOKEN_KEY, USER_NAME_KEY, USER_ID_KEY } from './config'

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export const isAuthenticated = () => !!getToken()

export const getUserData = () => {
  try {
    const token = getToken()
    if (!token) return null
    return jwtDecode(token)
  } catch (err) {
    console.error('❌ Token inválido', err)
    return null
  }
}

export const getUserRole = () => getUserData()?.rol || null
export const getUserName = () => getUserData()?.nombre || localStorage.getItem(USER_NAME_KEY) || null
export const getUserId = () => getUserData()?.id || localStorage.getItem(USER_ID_KEY) || null

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_NAME_KEY)
    localStorage.removeItem(USER_ID_KEY)
    window.location.href = '/login'
  }
}
