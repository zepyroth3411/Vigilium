import { useState } from 'react'
import { API_URL, USER_NAME_KEY } from '@/utils/config'

export default function FaultsModal({ fallas, setFallas, onClose }) {
  const [fallaSeleccionada, setFallaSeleccionada] = useState(null)
  const [solucion, setSolucion] = useState('')

  const nombreTecnico = typeof window !== 'undefined' ? localStorage.getItem(USER_NAME_KEY) : ''

  const confirmarAtencion = async () => {
    if (!solucion.trim()) return alert('Por favor escribe una solución.')

    try {
      const res = await fetch(`${API_URL}/api/fault-reporting/${fallaSeleccionada.id}/atender`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atendida_por: nombreTecnico,
          solucion
        })
      })

      if (res.ok) {
        const audio = new Audio('/notification.mp3')
        audio.play()

        setFallas(prev => prev.filter(f => f.id !== fallaSeleccionada.id))
        setFallaSeleccionada(null)
        setSolucion('')
      } else {
        alert('Error al marcar como atendida')
      }
    } catch (err) {
      console.error('❌ Error al actualizar falla:', err)
      alert('Ocurrió un error al intentar marcar la falla como atendida.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-start justify-center p-6">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 space-y-6 overflow-y-auto max-h-[90vh] relative">
        <h2 className="text-xl font-bold text-red-700">🚨 Fallas Técnicas Activas</h2>
        <button className="absolute top-4 right-6 text-xl text-gray-600 hover:text-black" onClick={onClose}>✖</button>

        {fallaSeleccionada ? (
          <div className="space-y-4">
            <p className="font-semibold text-gray-700">
              🔧 Estás atendiendo la falla del dispositivo <span className="text-blue-600">{fallaSeleccionada.id_dispositivo}</span>
            </p>

            <textarea
              value={solucion}
              onChange={(e) => setSolucion(e.target.value)}
              rows={4}
              placeholder="Describe cómo se resolvió la falla..."
              className="w-full border rounded p-3"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setFallaSeleccionada(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
              <button onClick={confirmarAtencion} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">✅ Confirmar</button>
            </div>
          </div>
        ) : (
          <>
            {fallas.length === 0 ? (
              <p className="text-gray-500">No hay fallas pendientes.</p>
            ) : (
              <div className="space-y-4">
                {fallas.map(f => (
                  <div key={f.id} className="border border-red-200 p-4 rounded-lg shadow-sm bg-white">
                    <p><strong>📡 Dispositivo:</strong> {f.id_dispositivo}</p>
                    <p><strong>🧑 Técnico:</strong> {f.tecnico}</p>
                    <p><strong>⚠️ Tipo:</strong> {f.tipo_falla}</p>
                    <p><strong>📝 Descripción:</strong> {f.descripcion}</p>
                    {f.urgente && <p className="text-red-500 font-bold">🔥 ¡Urgente!</p>}

                    <button
                      onClick={() => setFallaSeleccionada(f)}
                      className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      🛠️ Atender falla
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
