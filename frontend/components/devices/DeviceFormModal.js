// components/devices/DeviceFormModal.js
import { useState, useEffect } from 'react'

export default function DeviceFormModal({ onClose, onSave, clientes = [], initialData = {} }) {
  const [formData, setFormData] = useState({
    id_dispositivo: '',
    nombre_cliente: '',
    estado: 'desconectado',
    ...initialData
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        id_dispositivo: initialData.id_dispositivo || '',
        nombre_cliente: initialData.nombre_cliente || '',
        estado: initialData.estado || 'desconectado'
      })
    }
  }, [initialData])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!formData.id_dispositivo || !formData.nombre_cliente) return
    onSave(formData)
  }

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
          {initialData.id_dispositivo ? '✏️ Editar Dispositivo' : '➕ Nuevo Dispositivo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block mb-1 text-gray-700">ID del dispositivo (4 dígitos)</label>
            <input
              type="text"
              name="id_dispositivo"
              value={formData.id_dispositivo}
              onChange={handleChange}
              maxLength={4}
              className="w-full border px-3 py-2 rounded"
              required
              disabled={!!initialData.id_dispositivo}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Cliente</label>
            <select
              name="nombre_cliente"
              value={formData.nombre_cliente}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map((c, i) => (
                <option key={i} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="text-right mt-4">
            <button
              type="submit"
               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              💾 Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
