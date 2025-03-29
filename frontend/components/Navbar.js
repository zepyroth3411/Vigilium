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

  if (userRole === 'admin') {
    links.push(
      { href: '/admin/users', label: 'Admin - Users' },
      { href: '/admin/roles', label: 'Admin - Roles' },
      { href: '/admin/password', label: 'Change Password' }
    )
  }

  return (
    <nav className="mx-4 mt-4 rounded-xl bg-white shadow-md border border-orange-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-primary tracking-tight">Vigilium</h1>

        {/* Botón Hamburguesa para móviles */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Menú en escritorio */}
        <ul className="hidden md:flex space-x-4 text-sm font-medium text-gray-700">
          {links.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-3 py-1 rounded-md transition-all duration-300 ${
                  router.pathname === link.href
                    ? 'bg-orange-100 text-primary font-semibold'
                    : 'hover:bg-orange-50 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
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
        </ul>
      )}

      <div className="px-6 pb-4 md:pb-0 text-right">
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
