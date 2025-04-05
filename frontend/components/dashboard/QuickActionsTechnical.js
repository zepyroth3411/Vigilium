import { useRouter } from 'next/router'

export default function QuickActionsTecnico() {
  const router = useRouter()

  return (
    <div className="bg-white shadow rounded-xl p-6 border space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">⚡ Acciones Rápidas (Técnico)</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <button
          onClick={() => router.push('/tool/logbook')}
          className="bg-green-100 hover:bg-green-200 text-green-700 font-medium py-3 px-4 rounded transition-all"
        >
          📝 Bitácora de revisiones
        </button>

        <button
          onClick={() => router.push('/tool/report')}
          className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-3 px-4 rounded transition-all"
        >
          🚧 Reportar falla
        </button>
      </div>
    </div>
  )
}
