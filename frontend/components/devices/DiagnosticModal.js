import {
  XMarkIcon, BeakerIcon, Battery100Icon, SignalIcon, RssIcon, ExclamationTriangleIcon, ClockIcon
} from '@heroicons/react/24/outline'
export default function DiagnosticModal({ dispositivo, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BeakerIcon className="w-5 h-5 text-indigo-600" /> Diagnóstico: {dispositivo.id}
        </h2>

        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex justify-between">
            <span className="flex items-center gap-1"><Battery100Icon className="w-4 h-4" /> Batería:</span>
            <span className="font-medium text-green-600">Buena (85%)</span>
          </li>
          <li className="flex justify-between">
            <span className="flex items-center gap-1"><SignalIcon className="w-4 h-4" /> Señal:</span>
            <span className="font-medium text-yellow-600">Moderada (60%)</span>
          </li>
          <li className="flex justify-between">
            <span className="flex items-center gap-1"><RssIcon className="w-4 h-4" /> Comunicación:</span>
            <span className="font-medium text-green-600">Estable</span>
          </li>
          <li className="flex justify-between">
            <span className="flex items-center gap-1"><ExclamationTriangleIcon className="w-4 h-4 text-red-500" /> Última falla:</span>
            <span className="font-medium text-red-600">Fallo de comunicación (hace 2 días)</span>
          </li>
          <li className="flex justify-between">
            <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> Última revisión:</span>
            <span className="font-medium text-gray-600">2025-03-28 14:45</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
