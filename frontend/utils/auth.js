// utils/auth.js

// Obtener el token del localStorage
export const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vigilium_token')
    }
    return null
  }
  
  // Verificar si el usuario está autenticado
  export const isAuthenticated = () => {
    return !!getToken()
  }
  
  // Cerrar sesión
  export const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vigilium_token')
      window.location.href = '/login'
    }
  }