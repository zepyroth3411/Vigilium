// components/modals/DeviceFormModal.js
import { useState, useEffect } from 'react'
import { API_URL, TOKEN_KEY } from '@/utils/config'
import { DevicePhoneMobileIcon, PencilSquareIcon, ArrowDownTrayIcon,XMarkIcon } from '@heroicons/react/24/outline'

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
  }, [modo, dispositivo])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { id_dispositivo, nombre_dispositivo, id_cliente } = formData
    if (!id_dispositivo || !nombre_dispositivo || !id_cliente) {
      alert('Todos los campos son obligatorios')
      return
    }

    const token = localStorage.getItem(TOKEN_KEY)
    const url = modo === 'editar'
      ? `${API_URL}/api/devices/${id_dispositivo}`
      : `${API_URL}/api/devices`

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
      if (!res.ok) throw new Error(data.message || 'Error inesperado')

      onSuccess()
      onClose()
    } catch (err) {
      console.error('❌ Error al guardar dispositivo:', err)
      alert('Error al guardar el dispositivo: ' + err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold">
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          {modo === 'crear' ? (
            <>
              <DevicePhoneMobileIcon className="w-5 h-5 text-primary" /> Nuevo Dispositivo
            </>
          ) : (
            <>
              <PencilSquareIcon className="w-5 h-5 text-primary" /> Editar Dispositivo
            </>
          )}
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
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2">
              <ArrowDownTrayIcon className="w-5 h-5" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}