import { FiCpu, FiAlertTriangle, FiPower, FiCalendar } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

/*Grafica dashboard */
const eventosPorDia = [
  { dia: 'Lun', eventos: 10 },
  { dia: 'Mar', eventos: 14 },
  { dia: 'Mié', eventos: 9 },
  { dia: 'Jue', eventos: 20 },
  { dia: 'Vie', eventos: 15 },
  { dia: 'Sáb', eventos: 5 },
]

const estadoDispositivos = [
  { name: 'Conectados', value: 12 },
  { name: 'Desconectados', value: 3 },
  { name: 'Con alerta', value: 5 },
]

const colores = ['#16a34a', '#dc2626', '#facc15']

export default function Dashboard() {
  const alertas = [
    { id: "TL280-01", tipo: "Batería baja", fecha: "2025-03-29", estado: "Pendiente" },
    { id: "TL280-02", tipo: "Desconexión", fecha: "2025-03-29", estado: "Resuelto" },
    { id: "TL280-03", tipo: "Zona abierta", fecha: "2025-03-28", estado: "Pendiente" },
  ]

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen">
      {/* Título */}
      <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
      <p className="text-gray-600 mt-1">Panel de resumen del sistema Vigilium</p>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Card title="Dispositivos conectados" icon={<FiCpu />} value="12" />
        <Card title="Desconectados" icon={<FiPower />} value="3" />
        <Card title="Alertas activas" icon={<FiAlertTriangle />} value={alertas.length} />
        <Card title="Eventos hoy" icon={<FiCalendar />} value="29" />
      </div>

      {/* Tabla de alertas */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-primary mb-4">Alertas recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white border rounded-xl shadow-sm overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Dispositivo</th>
                <th className="p-3 text-left">Tipo de alerta</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {alertas.map((alerta, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">{alerta.id}</td>
                  <td className="p-3">{alerta.tipo}</td>
                  <td className="p-3">{alerta.fecha}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${alerta.estado === 'Pendiente'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
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

      {/* Placeholder para gráfica */}
      <div className="mt-10 p-6 bg-white rounded-xl border text-center text-gray-400 shadow-sm">
        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* Gráfica de barras */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-primary mb-4">Eventos por día</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={eventosPorDia}>
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="eventos" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico circular */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-primary mb-4">Estado de dispositivos</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={estadoDispositivos}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {estadoDispositivos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>


      </div>
    </div>
  )
}

function Card({ title, icon, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4 hover:shadow-md transition">
      <div className="text-3xl text-primary">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
      </div>
    </div>
  )
}
