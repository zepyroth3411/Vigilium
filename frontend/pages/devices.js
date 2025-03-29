import { useState } from 'react'

export default function Dispositivos() {
  const [filtro, setFiltro] = useState('todos')

  const dispositivos = [
    { id: 'TL280-001', cliente: 'Juan Pérez', estado: 'conectado', ultima: '2025-03-29 08:23' },
    { id: 'TL280-002', cliente: 'María Gómez', estado: 'desconectado', ultima: '2025-03-28 19:02' },
    { id: 'TL280-003', cliente: 'Carlos Ruiz', estado: 'alerta', ultima: '2025-03-29 07:45' },
    { id: 'TL280-004', cliente: 'Ana López', estado: 'conectado', ultima: '2025-03-29 08:00' },
  ]

  const filtrados = filtro === 'todos'
    ? dispositivos
    : dispositivos.filter(d => d.estado === filtro)

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Dispositivos</h1>
      <p className="text-gray-600 mt-1">Monitoreo de comunicadores TL280 asignados a clientes</p>

      {/* Filtros */}
      <div className="mt-6 mb-4 space-x-2">
        {['todos', 'conectado', 'desconectado', 'alerta'].map(est => (
          <button
            key={est}
            onClick={() => setFiltro(est)}
            className={`px-3 py-1 rounded-full text-sm border transition
              ${filtro === est
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}
            `}
          >
            {est.charAt(0).toUpperCase() + est.slice(1)}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Última señal</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((d, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-3">{d.id}</td>
                <td className="p-3">{d.cliente}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold capitalize
                    ${d.estado === 'conectado' ? 'bg-green-100 text-green-700'
                    : d.estado === 'desconectado' ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'}`}>
                    {d.estado}
                  </span>
                </td>
                <td className="p-3">{d.ultima}</td>
                <td className="p-3">
                  <button className="text-sm text-primary hover:underline">Ver detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}