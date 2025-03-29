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

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/devices', label: 'Dispositivos' },
    { href: '/events', label: 'Eventos' },
    { href: '/client', label: 'Clientes' },
  ]

  return (
    <nav className="mx-4 mt-4 rounded-xl bg-white shadow-md border border-orange-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-primary tracking-tight">Vigilium</h1>

        {/* Menú en escritorio */}
        <div className="hidden md:flex space-x-6 items-center text-sm font-medium text-gray-700">
          {links.map(link => (
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

          {/* Dropdown Administración */}
          {userRole === 'admin' && (
            <div className="relative group">
              <span
                className={`px-3 py-1 rounded-md cursor-pointer transition-all duration-300 ${
                  router.pathname.startsWith('/admin')
                    ? 'bg-orange-100 text-primary font-semibold'
                    : 'hover:bg-orange-50 hover:text-primary'
                }`}
              >
                Administración ⌄
              </span>
              <div className="absolute hidden group-hover:block bg-white border mt-2 rounded-md shadow-md w-48 z-10">
                <Link href="/admin/users" className="block px-4 py-2 hover:bg-orange-50 text-sm">👥 Usuarios</Link>
                <Link href="/admin/roles" className="block px-4 py-2 hover:bg-orange-50 text-sm">🔐 Roles</Link>
                <Link href="/admin/password" className="block px-4 py-2 hover:bg-orange-50 text-sm">🔑 Cambiar contraseña</Link>
              </div>
            </div>
          )}

          {/* Botón Cerrar sesión */}
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline ml-4"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Botón Hamburguesa para móviles */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Menú desplegable para móvil */}
      {menuOpen && (
        <ul className="md:hidden px-6 pb-4 space-y-2 text-sm font-medium text-gray-700">
          {links.map(link => (
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

          {userRole === 'admin' && (
            <>
              <li><Link href="/admin/users" className="block px-3 py-2">👥 Usuarios</Link></li>
              <li><Link href="/admin/roles" className="block px-3 py-2">🔐 Roles</Link></li>
              <li><Link href="/admin/password" className="block px-3 py-2">🔑 Cambiar contraseña</Link></li>
            </>
          )}

          <li>
            <button onClick={logout} className="block px-3 py-2 text-red-600 text-left">Cerrar sesión</button>
          </li>
        </ul>
      )}
    </nav>
  )
}
