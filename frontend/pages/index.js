// pages/index.js
import Image from 'next/image'
import Link from 'next/link'
import { LightBulbIcon, EyeIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function LandingPage() {
  return (
    <div className="bg-[#f9fafb] text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10 bg-white shadow-sm">
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary">Sistema de Monitoreo Inteligente</h1>
          <p className="text-lg text-gray-600">Supervisa tus instalaciones, dispositivos y eventos en tiempo real con seguridad y eficiencia.</p>
          <Link href="/login">
            <button className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-900 transition">
              Iniciar sesión
            </button>
          </Link>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          <Image
            src="https://res.cloudinary.com/dnmjrnxey/image/upload/v1744134682/banner_x6cxll.png"
            alt="Banner principal"
            width={600}
            height={300}
            className="mx-auto w-full h-auto"
          />
        </div>
      </section>

      {/* Misión, Visión y Valores */}
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">Nuestra Filosofía</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Misión */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <LightBulbIcon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Misión</h3>
            <p className="text-gray-600 mb-4">Brindar soluciones integrales de monitoreo y seguridad que ayuden a optimizar la gestión y prevención de eventos críticos.</p>
            <Image
              src="https://res.cloudinary.com/dnmjrnxey/image/upload/v1744131330/mision_frwlvy.png"
              alt="Misión"
              width={400}
              height={200}
              className="mx-auto"
            />
          </div>

          {/* Visión */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <EyeIcon className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Visión</h3>
            <p className="text-gray-600 mb-4">Ser líderes en soluciones tecnológicas de monitoreo, adaptándonos a las necesidades cambiantes de seguridad del futuro.</p>
            <Image
              src="https://res.cloudinary.com/dnmjrnxey/image/upload/v1744131330/vision_bguzyu.png"
              alt="Visión"
              width={426}
              height={200}
              className="mx-auto"
            />
          </div>

          {/* Valores */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <SparklesIcon className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Valores</h3>
            <p className="text-gray-600 mb-4">Compromiso, responsabilidad, innovación y transparencia en cada servicio que brindamos.</p>
            <Image
              src="https://res.cloudinary.com/dnmjrnxey/image/upload/v1744131330/valores_lvpnsj.png"
              alt="Valores"
              width={438}
              height={200}
              className="mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Imagen Ilustrativa Extra */}
      <section className="py-16 px-6 md:px-20 text-center bg-white">
        <h2 className="text-3xl font-bold text-primary mb-6">Tecnología en acción</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-8">
          Integramos hardware y software para crear un ecosistema de seguridad robusto y confiable. Esta es nuestra visión: llevar el monitoreo inteligente al siguiente nivel.
        </p>
        <Image
          src="https://res.cloudinary.com/dnmjrnxey/image/upload/v1744131330/20250407_1704_Drag%C3%B3n_de_Vigilancia_remix_01jr97ytz0fmptvgbm604ye0ss_lv4pxs.png"
          alt="Monitoreo inteligente"
          width={700}
          height={400}
          className="mx-auto rounded-xl shadow-md"
        />
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-500 mt-8">
        <p>&copy; {new Date().getFullYear()} Vigilium. Todos los derechos reservados.</p>
        <p className="mt-2">Contacto: contacto@vigilium.com</p>
      </footer>
    </div>
  )
}
