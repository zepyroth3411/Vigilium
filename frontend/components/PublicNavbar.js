// components/PublicNavbar.js
import Link from 'next/link'
import Image from 'next/image'
import { HomeIcon, LightBulbIcon, EyeIcon, HeartIcon } from '@heroicons/react/24/outline'

export default function PublicNavbar() {
    return (
        <nav className="bg-white shadow-md border-b border-orange-100">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Image
                        src="/pet.png"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                    />
                    <span className="text-xl font-bold text-primary">Vigilium</span>
                </div>

                <div className="hidden md:flex space-x-6 items-center text-sm font-medium text-gray-700">
                    <a href="#inicio" className="hover:text-primary flex items-center space-x-1">
                        <HomeIcon className="h-5 w-5" /> <span>Inicio</span>
                    </a>
                    <a href="#mision" className="hover:text-primary flex items-center space-x-1">
                        <LightBulbIcon className="h-5 w-5" /> <span>Misión</span>
                    </a>
                    <a href="#vision" className="hover:text-primary flex items-center space-x-1">
                        <EyeIcon className="h-5 w-5" /> <span>Visión</span>
                    </a>
                    <a href="#valores" className="hover:text-primary flex items-center space-x-1">
                        <HeartIcon className="h-5 w-5" /> <span>Valores</span>
                    </a>
                    <Link href="/login" className="bg-primary text-white px-3 py-1 rounded-md hover:bg-blue-900 transition">
                        Ingresar
                    </Link>
                </div>
            </div>
        </nav>
    )
}
