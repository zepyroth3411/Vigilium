export default function Dashboard() {
  const alertas = [
    { id: "TL280-01", tipo: "Batería baja", fecha: "2025-03-22", estado: "Pendiente" },
    { id: "TL280-02", tipo: "Desconexión", fecha: "2025-03-21", estado: "Resuelto" },
    { id: "TL280-03", tipo: "Zona abierta", fecha: "2025-03-20", estado: "Pendiente" },
  ];

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      {/* Título */}
      <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
      <p className="text-gray-600 mt-1">Resumen general del sistema</p>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Card title="Conectados" icon="🟢" value="12" />
        <Card title="Desconectados" icon="🔴" value="3" />
        <Card title="Alertas Activas" icon="🚨" value={alertas.length} />
        <Card title="Eventos Hoy" icon="📅" value="29" />
      </div>

      {/* Tabla de alertas */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-primary mb-4">Alertas recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse bg-white shadow-md rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-orange-100 text-left text-gray-700">
                <th className="p-3">Dispositivo</th>
                <th className="p-3">Tipo de alerta</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {alertas.map((alerta, i) => (
                <tr key={i} className="border-t hover:bg-orange-50 transition">
                  <td className="p-3">{alerta.id}</td>
                  <td className="p-3">{alerta.tipo}</td>
                  <td className="p-3">{alerta.fecha}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      alerta.estado === 'Pendiente'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-green-200 text-green-800'
                    }`}>
                      {alerta.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Placeholder para gráfica o actividad */}
      <div className="mt-10 p-6 bg-white rounded-xl shadow text-center text-gray-400">
        📈 Aquí aparecerá la gráfica de actividad cuando se conecte el backend
      </div>
    </div>
  );
}

function Card({ title, icon, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
      <div className="text-4xl">{icon}</div>
      <div className="mt-2 text-gray-600 text-sm">{title}</div>
      <div className="text-2xl font-bold text-primary">{value}</div>
    </div>
  );
}
