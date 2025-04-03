export default function DiagnosticModal({ dispositivo, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🧪 Diagnóstico: {dispositivo.id}
          </h2>
  
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex justify-between">
              <span>🔋 Batería:</span>
              <span className="font-medium text-green-600">Buena (85%)</span>
            </li>
            <li className="flex justify-between">
              <span>📶 Señal:</span>
              <span className="font-medium text-yellow-600">Moderada (60%)</span>
            </li>
            <li className="flex justify-between">
              <span>📡 Comunicación:</span>
              <span className="font-medium text-green-600">Estable</span>
            </li>
            <li className="flex justify-between">
              <span>⚠️ Última falla registrada:</span>
              <span className="font-medium text-red-600">Fallo de comunicación (hace 2 días)</span>
            </li>
            <li className="flex justify-between">
              <span>🕒 Última revisión:</span>
              <span className="font-medium text-gray-600">2025-03-28 14:45</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }
  