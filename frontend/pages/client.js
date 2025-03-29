export default function Clientes() {
  const clientes = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      ubicacion: 'Monterrey, NL',
      dispositivos: 3,
      estado: 'activo',
    },
    {
      id: 2,
      nombre: 'María Gómez',
      ubicacion: 'Guadalajara, JAL',
      dispositivos: 2,
      estado: 'activo',
    },
    {
      id: 3,
      nombre: 'Carlos Ruiz',
      ubicacion: 'CDMX',
      dispositivos: 1,
      estado: 'inactivo',
    },
  ]

  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Clientes</h1>
      <p className="text-gray-600 mt-1 mb-4">Listado de clientes y sus dispositivos asignados</p>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Ubicación</th>
              <th className="p-3 text-left">Dispositivos</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{cliente.nombre}</td>
                <td className="p-3">{cliente.ubicacion}</td>
                <td className="p-3">{cliente.dispositivos}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold capitalize ${
                    cliente.estado === 'activo'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-300 text-gray-700'
                  }`}>
                    {cliente.estado}
                  </span>
                </td>
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
