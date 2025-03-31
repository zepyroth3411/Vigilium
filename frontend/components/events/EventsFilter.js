import { useEffect, useRef, useState } from 'react'

export default function EventsFilter({ filtro, setFiltro, dispositivos }) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {/* Tipo de evento */}
      <select
        value={filtro.tipo}
        onChange={(e) => setFiltro(prev => ({ ...prev, tipo: e.target.value }))}
        className="border rounded px-3 py-2 text-sm shadow-sm"
      >
        <option value="">Todos los tipos</option>
        <option value="ALERTA CRÍTICA">🔴 Alerta Crítica</option>
        <option value="NOTIFICACIÓN">🔵 Notificación</option>
      </select>

      {/* Dispositivo */}
      <select
        value={filtro.dispositivo}
        onChange={(e) => setFiltro(prev => ({ ...prev, dispositivo: e.target.value }))}
        className="border rounded px-3 py-2 text-sm shadow-sm"
      >
        <option value="">Todos los dispositivos</option>
        {dispositivos.map((d, i) => (
          <option key={i} value={d}>{d}</option>
        ))}
      </select>

      {/* Fecha inicio */}
      <input
        type="date"
        value={filtro.fechaInicio}
        onChange={(e) => setFiltro(prev => ({ ...prev, fechaInicio: e.target.value }))}
        className="border rounded px-3 py-2 text-sm shadow-sm"
      />

      {/* Fecha fin */}
      <input
        type="date"
        value={filtro.fechaFin}
        onChange={(e) => setFiltro(prev => ({ ...prev, fechaFin: e.target.value }))}
        className="border rounded px-3 py-2 text-sm shadow-sm"
      />
    </div>
  )
}