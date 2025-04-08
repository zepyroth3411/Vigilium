// pages/tools/bitacora.js
import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { API_URL } from '@/utils/config'

export default function BitacoraServicio() {
  const [clientes, setClientes] = useState([])
  const [dispositivos, setDispositivos] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [tecnico, setTecnico] = useState('')
  const [form, setForm] = useState({
    cliente: '',
    nuevoCliente: false,
    nombreCliente: '',
    direccion: '',
    telefono: '',
    correo: '',
    dispositivo: '',
    nuevoDispositivo: false,
    idDispositivo: '',
    nombreDispositivo: '',
    clienteAsignado: '',
    diagnostico: '',
    recomendaciones: '',
    finalizado: false
  })

  useEffect(() => {
    fetchClientes()
    fetchDispositivos()
    fetchTecnicos()
  }, [])

  const fetchClientes = async () => {
    const res = await fetch(`${API_URL}/api/logbook/clientes`)
    const data = await res.json()
    setClientes(data)
  }

  const fetchDispositivos = async () => {
    const res = await fetch(`${API_URL}/api/logbook/dispositivos`)
    const data = await res.json()
    setDispositivos(data)
  }

  const fetchTecnicos = async () => {
    const res = await fetch(`${API_URL}/api/logbook/tecnicos`)
    const data = await res.json()
    setTecnicos(data)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const crearCliente = async () => {
    if (form.nombreCliente && form.direccion && form.telefono && form.correo) {
      const res = await fetch(`${API_URL}/api/logbook/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombreCliente,
          direccion: form.direccion,
          telefono: form.telefono,
          correo: form.correo
        })
      })
      const nuevo = await res.json()
      await fetchClientes()
      setForm({ ...form, cliente: nuevo.id_cliente, nuevoCliente: false })
    } else {
      alert('Completa todos los campos del nuevo cliente antes de crear.')
    }
  }

  const crearDispositivo = async () => {
    if (form.idDispositivo && form.nombreDispositivo && form.clienteAsignado) {
      const res = await fetch(`${API_URL}/api/logbook/dispositivos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_dispositivo: form.idDispositivo,
          nombre_dispositivo: form.nombreDispositivo,
          id_cliente: parseInt(form.clienteAsignado)
        })
      })
      const nuevo = await res.json()
      await fetchDispositivos()
      setForm({ ...form, dispositivo: nuevo.id_dispositivo, nuevoDispositivo: false })
    } else {
      alert('Completa todos los campos del nuevo dispositivo.')
    }
  }

  const generarPDF = () => {
    const doc = new jsPDF()
    const img = new Image()
    img.src = '/logo.png'

    img.onload = async () => {
      doc.addImage(img, 'PNG', 10, 10, 30, 30)
      const fechaActual = new Date().toLocaleDateString()

      doc.setFontSize(16)
      doc.text('VIGILIUM – CENTRAL DE MONITOREO INTEGRAL', 50, 20)
      doc.setFontSize(10)
      doc.text('"Tecnología que protege lo que más importa"', 50, 26)
      doc.text(`Fecha: ${fechaActual}`, 150, 10)

      const clienteSeleccionado = clientes.find(c => c.id_cliente == form.cliente)

      autoTable(doc, {
        startY: 40,
        head: [['Cliente', 'Correo', 'Dispositivo', 'Dirección', 'Teléfono']],
        body: [[
          form.nombreCliente || clienteSeleccionado?.nombre || '—',
          form.correo || clienteSeleccionado?.correo || '—',
          form.nombreDispositivo || form.dispositivo,
          form.direccion || clienteSeleccionado?.direccion || '—',
          form.telefono || clienteSeleccionado?.telefono || '—'
        ]]
      })

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Diagnóstico Realizado']],
        body: [[form.diagnostico]]
      })

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Recomendaciones']],
        body: [[form.recomendaciones]]
      })

      doc.text(`Trabajo finalizado: ${form.finalizado ? 'Sí' : 'No'}`, 14, doc.lastAutoTable.finalY + 20)
      doc.text(`Técnico responsable: ${tecnico}`, 14, doc.lastAutoTable.finalY + 35)
      doc.text('Firma del cliente: __________________________', 14, doc.lastAutoTable.finalY + 45)

      doc.save('orden_servicio_vigilium.pdf')

      await fetch(`${API_URL}/api/logbook/bitacora`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente: parseInt(form.cliente),
          id_dispositivo: form.dispositivo,
          tecnico,
          diagnostico: form.diagnostico,
          recomendaciones: form.recomendaciones,
          finalizado: form.finalizado
        })
      })
    }
  }
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📝 Bitácora de Servicio</h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <div>
          <label className="font-semibold">Cliente:</label>
          <select name="cliente" onChange={handleChange} value={form.cliente} className="w-full border p-2 rounded">
            <option value="">Selecciona un cliente</option>
            {clientes.map((c) => (
              <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>
            ))}
          </select>
          <label className="inline-flex items-center mt-2">
            <input type="checkbox" name="nuevoCliente" checked={form.nuevoCliente} onChange={handleChange} className="mr-2" />
            Crear nuevo cliente
          </label>
          {form.nuevoCliente && (
            <>
              <input type="text" name="nombreCliente" placeholder="Nombre" onChange={handleChange} className="w-full border p-2 mt-2 rounded" />
              <input type="text" name="direccion" placeholder="Dirección" onChange={handleChange} className="w-full border p-2 mt-2 rounded" />
              <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} className="w-full border p-2 mt-2 rounded" />
              <input type="email" name="correo" placeholder="Correo electrónico" onChange={handleChange} className="w-full border p-2 mt-2 rounded" />
              <button onClick={crearCliente} className="bg-green-600 text-white mt-2 px-4 py-2 rounded hover:bg-green-700">Crear cliente</button>
            </>
          )}
        </div>

        <div>
          <label className="font-semibold">Dispositivo:</label>
          <select name="dispositivo" onChange={handleChange} value={form.dispositivo} className="w-full border p-2 rounded">
            <option value="">Selecciona un dispositivo</option>
            {dispositivos.map((d) => (
              <option key={d.id_dispositivo} value={d.id_dispositivo}>{d.nombre_dispositivo}</option>
            ))}
          </select>
          <label className="inline-flex items-center mt-2">
            <input type="checkbox" name="nuevoDispositivo" checked={form.nuevoDispositivo} onChange={handleChange} className="mr-2" />
            Crear nuevo dispositivo
          </label>
          {form.nuevoDispositivo && (
            <>
              <input type="text" name="idDispositivo" placeholder="ID del dispositivo" onChange={handleChange} className="w-full border p-2 mt-2 rounded" />
              <input type="text" name="nombreDispositivo" placeholder="Nombre del dispositivo" onChange={handleChange} className="w-full border p-2 mt-2 rounded" />
              <label className="block font-medium mt-2">Cliente asignado:</label>
              <select name="clienteAsignado" onChange={handleChange} value={form.clienteAsignado} className="w-full border p-2 rounded">
                <option value="">Selecciona cliente</option>
                {clientes.map((c) => (
                  <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>
                ))}
              </select>
              <button onClick={crearDispositivo} className="bg-green-600 text-white mt-2 px-4 py-2 rounded hover:bg-green-700">Crear dispositivo</button>
            </>
          )}
        </div>

        <div>
          <label className="font-semibold">Técnico responsable:</label>
          <select value={tecnico} onChange={(e) => setTecnico(e.target.value)} className="w-full border p-2 rounded">
            <option value="">Selecciona técnico</option>
            {Array.isArray(tecnicos) && tecnicos.map((t) => (
              <option key={t.id_usuario} value={t.nombre}>{t.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">Diagnóstico realizado:</label>
          <textarea name="diagnostico" onChange={handleChange} className="w-full border p-2 rounded mt-1" rows={3}></textarea>
        </div>

        <div>
          <label className="font-semibold">Recomendaciones:</label>
          <textarea name="recomendaciones" onChange={handleChange} className="w-full border p-2 rounded mt-1" rows={3}></textarea>
        </div>

        <label className="inline-flex items-center">
          <input type="checkbox" name="finalizado" checked={form.finalizado} onChange={handleChange} className="mr-2" />
          Trabajo finalizado
        </label>

        <div className="flex justify-end">
          <button onClick={generarPDF} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5" /> Generar PDF
          </button>
        </div>
      </div>
    </div>
  )
}
