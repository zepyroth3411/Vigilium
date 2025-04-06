// components/FaultReportForm.js
import { useState } from 'react'
import { API_URL } from '@/utils/config'

export default function FaultReportForm({ dispositivos, tecnico }) {
  const [form, setForm] = useState({
    id_dispositivo: '',
    tipo_falla: '',
    descripcion: '',
    urgente: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.id_dispositivo || !form.tipo_falla || !form.descripcion) {
      alert('❗ Por favor completa todos los campos obligatorios.')
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/fault-reporting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tecnico
        })
      })

      const data = await res.json()
      if (res.ok) {
        alert('✅ Falla registrada correctamente')
        setForm({ id_dispositivo: '', tipo_falla: '', descripcion: '', urgente: false })
      } else {
        alert(`❌ Error: ${data.error || 'No se pudo registrar la falla'}`)
      }
    } catch (error) {
      alert('❌ Error al enviar el reporte')
      console.error('Error al reportar falla:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded space-y-4 max-w-lg mx-auto">
      <h2 className="text-lg font-bold">📋 Reportar Falla Técnica</h2>

      <div>
        <label className="block font-semibold">Dispositivo:</label>
        <select
          name="id_dispositivo"
          value={form.id_dispositivo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Selecciona un dispositivo</option>
          {dispositivos.map((d) => (
            <option key={d.id_dispositivo} value={d.id_dispositivo}>
              {d.nombre_dispositivo}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold">Tipo de Falla:</label>
        <input
          type="text"
          name="tipo_falla"
          value={form.tipo_falla}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Ej. Fuente, Comunicación, Sensor..."
        />
      </div>

      <div>
        <label className="block font-semibold">Descripción:</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
        ></textarea>
      </div>

      <label className="inline-flex items-center">
        <input
          type="checkbox"
          name="urgente"
          checked={form.urgente}
          onChange={handleChange}
          className="mr-2"
        />
        ¿Es urgente?
      </label>

      <div className="text-right">
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          🚨 Reportar Falla
        </button>
      </div>
    </form>
  )
}
