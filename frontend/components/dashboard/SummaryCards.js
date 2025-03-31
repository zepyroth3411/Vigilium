export default function SummaryCards() {
    // Puedes reemplazar estos valores por llamadas reales al backend más adelante
    const resumen = [
      {
        titulo: 'Último usuario agregado',
        valor: 'soporte01',
        icono: '🧑‍💼'
      },
      {
        titulo: 'Último evento registrado',
        valor: 'Alarma activada',
        icono: '🚨'
      },
      {
        titulo: 'Último dispositivo conectado',
        valor: 'TL280 DSC',
        icono: '📡'
      }
    ]
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {resumen.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-xl shadow-sm p-5 flex flex-col gap-1"
          >
            <div className="text-3xl">{item.icono}</div>
            <p className="text-sm text-gray-500">{item.titulo}</p>
            <p className="text-lg font-semibold text-primary">{item.valor}</p>
          </div>
        ))}
      </div>
    )
  }
  