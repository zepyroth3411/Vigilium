import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { logout } from '@/utils/auth'

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/devices', label: 'Dispositivos' },
    { href: '/events', label: 'Eventos' },
    { href: '/client', label: 'Clientes' },
    { href: '/admin', label: 'Administración' },
  ]

  return (
    <nav className="mx-4 mt-4 rounded-xl bg-white shadow-md border border-orange-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-primary tracking-tight">Vigilium</h1>

        {/* Botón hamburguesa */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Menú escritorio */}
        <ul className="hidden md:flex space-x-4 text-sm font-medium text-gray-700 items-center">
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
          {/* Botón cerrar sesión (escritorio) */}
          <li>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-md text-sm text-red-600 hover:underline transition"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>

      {/* Menú móvil */}
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
          {/* Botón cerrar sesión (móvil) */}
          <li>
            <button
              onClick={() => {
                setMenuOpen(false)
                logout()
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:underline transition"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      )}
    </nav>
  )
}
