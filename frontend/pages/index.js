// pages/index.js
import PublicNavbar from '@/components/PublicNavbar'

export default function Landing() {
  return (
    <>
      <PublicNavbar />

      <section id="inicio" className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold text-primary mb-4">Bienvenido a Vigilium</h1>
          <p className="text-gray-700 text-lg max-w-xl mx-auto">
            Plataforma integral para el monitoreo inteligente de eventos críticos en tiempo real.
          </p>
        </div>
      </section>

      <section id="mision" className="py-20 px-6 bg-white text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Nuestra Misión</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Brindar seguridad, monitoreo y respuesta rápida mediante una plataforma confiable y de fácil uso.
        </p>
      </section>

      <section id="vision" className="py-20 px-6 bg-orange-50 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Nuestra Visión</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Ser líderes en soluciones tecnológicas de seguridad preventiva en Latinoamérica.
        </p>
      </section>

      <section id="valores" className="py-20 px-6 bg-white text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Nuestros Valores</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Compromiso, integridad, innovación y servicio a la comunidad.
        </p>
      </section>

      <footer className="bg-orange-100 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Vigilium. Todos los derechos reservados.
      </footer>
    </>
  )
}
