import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { logout } from '@/utils/auth'
import { jwtDecode } from 'jwt-decode'
import { TOKEN_KEY } from '@/utils/config'

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState(null)

  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUserRole(decoded.rol)
      } catch (err) {
        console.error('Error decoding token', err)
      }
    }
  }, [])

  const visibleLinks = [
    { href: '/dashboard/admin', label: 'Dashboard', roles: ['admin'] },
    { href: '/dashboard/monitorist', label: 'Dashboard', roles: ['monitorista'] },
    { href: '/dashboard/technical', label: 'Dashboard', roles: ['tecnico'] },
    { href: '/devices', label: 'Dispositivos', roles: ['admin', 'monitorista', 'tecnico'] },
    { href: '/events', label: 'Eventos', roles: ['admin', 'monitorista'] },
    { href: '/client', label: 'Clientes', roles: ['admin', 'monitorista', 'tecnico'] },
  ]

  const adminLinks = [
    ...(userRole === 'admin' ? [
      { href: '/admin/users', label: '👥 Usuarios' },
      // { href: '/admin/roles', label: '🔐 Roles' },
    ] : []),
    { href: '/admin/password', label: '🔑 Cambiar contraseña' },
  ]

  return (
    <nav className="mx-4 mt-4 rounded-xl bg-white shadow-md border border-orange-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <image
            src="/logo.png"
            alt="Logo Vigilium"
            className="h-8 w-auto"
          />
          <span className="text-2xl font-bold text-primary tracking-tight">Vigilium</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center text-sm font-medium text-gray-700">
          {visibleLinks
            .filter(link => link.roles.includes(userRole))
            .map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 rounded-md transition-all duration-300 ${router.pathname === link.href
                  ? 'bg-orange-100 text-primary font-semibold'
                  : 'hover:bg-orange-50 hover:text-primary'
                  }`}
              >
                {link.label}
              </Link>
            ))}

          {(userRole === 'admin' || userRole === 'monitorista' || userRole === 'tecnico') && (
            <div className="relative">
              <button
                onClick={toggleAdminMenu}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 focus:outline-none ${router.pathname.startsWith('/admin')
                  ? 'bg-orange-100 text-primary font-semibold'
                  : 'hover:bg-orange-50 hover:text-primary'
                  }`}
              >
                Administración
              </button>

              {adminMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-md z-50">
                  {adminLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-2 text-sm hover:bg-orange-50 ${router.pathname === item.href ? 'font-semibold text-primary' : ''}`}
                      onClick={() => setAdminMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={logout}
            className="px-3 py-1 rounded-md text-sm text-red-600 hover:bg-red-50 transition-all duration-300"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden px-6 pb-4 space-y-2 text-sm font-medium text-gray-700">
          {visibleLinks
            .filter(link => link.roles.includes(userRole))
            .map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-3 py-2 rounded-md transition-all duration-300 ${router.pathname === link.href
                    ? 'bg-orange-100 text-primary font-semibold'
                    : 'hover:bg-orange-50 hover:text-primary'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

          {adminLinks.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-3 py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}

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