import { useState } from 'react'

export default function Configuracion() {
  const [nombreSistema, setNombreSistema] = useState('Vigilium')
  const [horarioInicio, setHorarioInicio] = useState('07:00')
  const [horarioFin, setHorarioFin] = useState('18:00')
  const [modo, setModo] = useState('producción')

  const handleGuardar = () => {
    alert('⚙️ Configuración guardada (simulado)')
    // Aquí luego harás POST al backend
  }

  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Configuración</h1>
      <p className="text-gray-600 mt-1 mb-6">Ajustes generales del sistema de monitoreo</p>

      <div className="bg-white p-6 rounded-xl shadow-sm border max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del sistema</label>
          <input
            type="text"
            value={nombreSistema}
            onChange={(e) => setNombreSistema(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horario de inicio</label>
            <input
              type="time"
              value={horarioInicio}
              onChange={(e) => setHorarioInicio(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horario de fin</label>
            <input
              type="time"
              value={horarioFin}
              onChange={(e) => setHorarioFin(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modo de operación</label>
          <select
            value={modo}
            onChange={(e) => setModo(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
          >
            <option value="producción">Producción</option>
            <option value="desarrollo">Desarrollo</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            onClick={handleGuardar}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-900 text-sm"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}
