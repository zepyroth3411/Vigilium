import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { logout } from '@/utils/auth'
import { jwtDecode } from 'jwt-decode'

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('vigilium_token') : null
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUserRole(decoded.rol)
      } catch (err) {
        console.error('Error decoding token', err)
      }
    }
  }, [])

  // Links visibles por rol
  const visibleLinks = [
    { href: '/dashboard/admin', label: 'Dashboard', roles: ['admin'] },
    { href: '/dashboard/monitorist', label: 'Dashboard', roles: ['monitorista'] },
    { href: '/dashboard/technical', label: 'Dashboard', roles: ['tecnico'] },
    { href: '/devices', label: 'Dispositivos', roles: ['admin', 'monitorista', 'tecnico'] },
    { href: '/events', label: 'Eventos', roles: ['admin', 'monitorista'] },
    { href: '/client', label: 'Clientes', roles: ['admin', 'monitorista', 'tecnico'] },
  ]

  return (
    <nav className="mx-4 mt-4 rounded-xl bg-white shadow-md border border-orange-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary tracking-tight">Vigilium</h1>

        <div className="hidden md:flex space-x-6 items-center text-sm font-medium text-gray-700">
          {visibleLinks
            .filter(link => link.roles.includes(userRole))
            .map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 rounded-md transition-all duration-300 ${
                  router.pathname === link.href
                    ? 'bg-orange-100 text-primary font-semibold'
                    : 'hover:bg-orange-50 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}

          {/* Administración según rol */}
          {(userRole === 'admin' || userRole === 'monitorista' || userRole === 'tecnico') && (
            <div className="relative group">
              <span
                className={`px-3 py-1 rounded-md cursor-pointer transition-all duration-300 ${
                  router.pathname.startsWith('/admin')
                    ? 'bg-orange-100 text-primary font-semibold'
                    : 'hover:bg-orange-50 hover:text-primary'
                }`}
              >
                Administración
              </span>
              <div className="absolute hidden group-hover:block bg-white border mt-2 rounded-md shadow-md w-48 z-10">
                {userRole === 'admin' && (
                  <>
                    <Link href="/admin/users" className="block px-4 py-2 hover:bg-orange-50 text-sm">👥 Usuarios</Link>
                    <Link href="/admin/roles" className="block px-4 py-2 hover:bg-orange-50 text-sm">🔐 Roles</Link>
                  </>
                )}
                <Link href="/admin/password" className="block px-4 py-2 hover:bg-orange-50 text-sm">🔑 Cambiar contraseña</Link>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="px-3 py-1 rounded-md text-sm text-red-600 hover:bg-red-50 transition-all duration-300"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Hamburguesa móvil */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <ul className="md:hidden px-6 pb-4 space-y-2 text-sm font-medium text-gray-700">
          {visibleLinks
            .filter(link => link.roles.includes(userRole))
            .map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-3 py-2 rounded-md transition-all duration-300 ${
                    router.pathname === link.href
                      ? 'bg-orange-100 text-primary font-semibold'
                      : 'hover:bg-orange-50 hover:text-primary'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

          {(userRole === 'admin' || userRole === 'monitorista' || userRole === 'tecnico') && (
            <>
              {userRole === 'admin' && (
                <>
                  <li><Link href="/admin/users" className="block px-3 py-2">👥 Usuarios</Link></li>
                  <li><Link href="/admin/roles" className="block px-3 py-2">🔐 Roles</Link></li>
                </>
              )}
              <li><Link href="/admin/password" className="block px-3 py-2">🔑 Cambiar contraseña</Link></li>
            </>
          )}

          <li>
            <button
              onClick={logout}
              className="block px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      )}
    </nav>
  )
}
