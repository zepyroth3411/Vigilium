// components/ClientFormModal.js
import { useState, useEffect } from 'react'
import Dialog from '@/components/common/Dialog'
import { API_URL } from '@/utils/config'

export default function ClientFormModal({ modo, cliente, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
  })

  useEffect(() => {
    if (modo === 'editar' && cliente) {
      setForm({
        nombre: cliente.nombre || '',
        direccion: cliente.direccion || '',
        telefono: cliente.telefono || '',
        correo: cliente.correo || '',
      })
    }
  }, [modo, cliente])

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value.trimStart()
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { nombre, direccion, telefono, correo } = form
    if (!nombre || !direccion || !telefono || !correo) {
      alert('Todos los campos son obligatorios.')
      return
    }

    const url = modo === 'crear'
      ? `${API_URL}/api/clientes`
      : `${API_URL}/api/clientes/${cliente.id_cliente}`

    const method = modo === 'crear' ? 'POST' : 'PUT'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message)
      console.log('✅ Cliente guardado con éxito:', data)

      onSuccess()
      onClose()
    } catch (err) {
      alert('Error al guardar cliente: ' + err.message)
    }
  }

  return (
    <Dialog onClose={onClose}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {modo === 'crear' ? '➕ Nuevo Cliente' : '✏️ Editar Cliente'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded text-sm"
          required
        />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded text-sm"
          required
        />

        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded text-sm"
          required
        />

        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={form.correo}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded text-sm"
          required
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Guardar
          </button>
        </div>
      </form>
    </Dialog>
  )
}
