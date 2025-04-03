import { useState, useEffect } from 'react'

export default function DeviceFormModal({ onClose, onSuccess, clientes = [], dispositivo = null, modo }) {
  const [formData, setFormData] = useState({
    id_dispositivo: '',
    nombre_dispositivo: '',
    id_cliente: ''
  })

  useEffect(() => {
    if (modo === 'editar' && dispositivo) {
      setFormData({
        id_dispositivo: dispositivo.id_dispositivo || '',
        nombre_dispositivo: dispositivo.nombre_dispositivo || '',
        id_cliente: dispositivo.id_cliente || ''
      })
    }
  }, [dispositivo, modo])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.id_dispositivo || !formData.nombre_dispositivo || !formData.id_cliente) {
      alert('Todos los campos son obligatorios')
      return
    }

    const token = localStorage.getItem('vigilium_token')

    const url = modo === 'editar'
      ? `http://localhost:4000/api/devices/${formData.id_dispositivo}`
      : 'http://localhost:4000/api/devices'

    const method = modo === 'editar' ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      onSuccess()
      onClose()
    } catch (err) {
      alert('Error al guardar el dispositivo: ' + err.message)
    }
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
          {modo === 'crear' ? '➕ Nuevo Dispositivo' : '✏️ Editar Dispositivo'}
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
              disabled={modo === 'editar'}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Nombre del dispositivo</label>
            <input
              type="text"
              name="nombre_dispositivo"
              value={formData.nombre_dispositivo}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Cliente asignado</label>
            <select
              name="id_cliente"
              value={formData.id_cliente}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map((c) => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="text-right mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              💾 Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}