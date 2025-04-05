// pages/tools/reportar.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { jwtDecode } from 'jwt-decode'
import Toast from '@/components/Toast'

export default function ReportarFalla() {
  const router = useRouter()
  const [dispositivos, setDispositivos] = useState([])
  const [tecnico, setTecnico] = useState('')
  const [form, setForm] = useState({
    id_dispositivo: '',
    tipo_falla: '',
    descripcion: '',
    urgente: false
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchDispositivos()
    const nombreTecnico = obtenerTecnicoActual()
    if (nombreTecnico) setTecnico(nombreTecnico)
  }, [])

  const fetchDispositivos = async () => {
    const res = await fetch('http://localhost:4000/api/logbook/dispositivos')
    const data = await res.json()
    setDispositivos(data)
  }

  const obtenerTecnicoActual = () => {
    const token = localStorage.getItem('vigilium_token')
    if (!token) return null
    try {
      const decoded = jwtDecode(token)
      return decoded.nombre
    } catch (error) {
      console.error('Error al decodificar el token:', error)
      return null
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const playSound = () => {
    const audio = new Audio('/notification.mp3') // Asegúrate de tener este archivo
    audio.play()
  }

  const enviarReporte = async () => {
    if (!form.id_dispositivo || !form.tipo_falla || !form.descripcion) {
      setToast({ message: 'Por favor completa todos los campos.', type: 'error' })
      return
    }

    try {
      const res = await fetch('http://localhost:4000/api/fault-reporting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tecnico })
      })

      if (res.ok) {
        setToast({ message: '✅ Falla reportada exitosamente', type: 'success' })
        playSound()
        setTimeout(() => router.push('/dashboard/technical'), 2000)
      } else {
        setToast({ message: '❌ Error al reportar la falla', type: 'error' })
      }
    } catch (err) {
      console.error('Error al enviar el reporte:', err)
      setToast({ message: '❌ Error de red al enviar el reporte', type: 'error' })
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="text-2xl font-bold text-gray-800">🚧 Reportar Falla Técnica</h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <div>
          <label className="font-semibold">Dispositivo:</label>
          <select name="id_dispositivo" value={form.id_dispositivo} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Selecciona un dispositivo</option>
            {dispositivos.map((d) => (
              <option key={d.id_dispositivo} value={d.id_dispositivo}>{d.nombre_dispositivo}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">Tipo de falla:</label>
          <input type="text" name="tipo_falla" value={form.tipo_falla} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Ej. Corte de energía" />
        </div>

        <div>
          <label className="font-semibold">Descripción detallada:</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border p-2 rounded" rows={4}></textarea>
        </div>

        <label className="inline-flex items-center">
          <input type="checkbox" name="urgente" checked={form.urgente} onChange={handleChange} className="mr-2" />
          Marcar como urgente
        </label>

        <div className="flex justify-end">
          <button onClick={enviarReporte} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            🚨 Enviar Reporte
          </button>
        </div>
      </div>
    </div>
  )
}
