export default function RecentEvents() {
    // Simulación de eventos recientes
    const eventos = [
      { id: 1, tipo: 'Alarma', descripcion: 'Sensor de movimiento activado', fecha: '2025-03-31', hora: '14:10' },
      { id: 2, tipo: 'Conexión', descripcion: 'Comunicador TL280 conectado', fecha: '2025-03-31', hora: '13:47' },
      { id: 3, tipo: 'Desconexión', descripcion: 'Panel PC1864 desconectado', fecha: '2025-03-30', hora: '22:02' }
    ]
  
    return (
      <div className="bg-white border rounded-xl shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Eventos recientes</h2>
  
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border rounded-md overflow-hidden">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Hora</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map(evento => (
                <tr key={evento.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{evento.tipo}</td>
                  <td className="px-4 py-2">{evento.descripcion}</td>
                  <td className="px-4 py-2">{evento.fecha}</td>
                  <td className="px-4 py-2">{evento.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  