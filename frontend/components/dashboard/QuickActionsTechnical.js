export default function QuickActionsTecnico() {
    return (
      <div className="bg-white shadow rounded-xl p-6 border space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">⚡ Acciones Rápidas (Técnico)</h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-3 px-4 rounded transition-all">
            🔍 Diagnóstico rápido
          </button>
  
          <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-medium py-3 px-4 rounded transition-all">
            🧰 Herramientas técnicas
          </button>
  
          <button className="bg-green-100 hover:bg-green-200 text-green-700 font-medium py-3 px-4 rounded transition-all">
            📝 Bitácora de revisiones
          </button>
  
          <button className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-3 px-4 rounded transition-all">
            🚧 Reportar falla
          </button>
        </div>
      </div>
    )
  }
  