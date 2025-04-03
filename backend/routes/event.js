const express = require('express')
const router = express.Router()
const db = require('../db')

// POST /api/eventos
router.post('/eventos', (req, res) => {
  const { id_dispositivo, codigo } = req.body

  if (!id_dispositivo || !codigo) {
    return res.status(400).json({ message: 'Faltan datos: id_dispositivo o codigo' })
  }

  // Verificar si el dispositivo existe y puede recibir eventos
  const sqlDispositivo = `
    SELECT recibir_eventos 
    FROM dispositivos 
    WHERE id_dispositivo = ? LIMIT 1
  `
  db.query(sqlDispositivo, [id_dispositivo], (err, rows) => {
    if (err) return res.status(500).json({ message: '❌ Error al buscar dispositivo', error: err })

    // Dispositivo no encontrado
    if (rows.length === 0) {
      return res.status(404).json({ message: `⚠️ El dispositivo con ID ${id_dispositivo} no está registrado.` })
    }

    const puedeRecibir = rows[0].recibir_eventos
    if (!puedeRecibir) {
      return res.status(403).json({ message: `🚫 El dispositivo ${id_dispositivo} tiene desactivado el envío de eventos.` })
    }

    // Buscar el código Contact ID
    const sqlBuscar = `
      SELECT descripcion, tipo_evento, nivel_critico 
      FROM eventos_contact_id 
      WHERE codigo = ? LIMIT 1
    `
    db.query(sqlBuscar, [codigo], (err, rowsCodigo) => {
      if (err) return res.status(500).json({ message: '❌ Error al buscar código Contact ID', error: err })

      if (rowsCodigo.length === 0) {
        return res.status(404).json({ message: `⚠️ El código Contact ID ${codigo} no está registrado.` })
      }

      const { descripcion, tipo_evento, nivel_critico } = rowsCodigo[0]

      // Insertar el evento
      const sqlInsertar = `
        INSERT INTO eventos (id_dispositivo, codigo_contact_id, descripcion, tipo_evento, nivel_critico)
        VALUES (?, ?, ?, ?, ?)
      `
      db.query(sqlInsertar, [id_dispositivo, codigo, descripcion, tipo_evento, nivel_critico], (err, result) => {
        if (err) return res.status(500).json({ message: '❌ Error al registrar evento', error: err })

        // Emitir evento en tiempo real
        const nuevoEvento = {
          id: result.insertId,
          id_dispositivo,
          codigo_contact_id: codigo,
          descripcion,
          tipo_evento,
          nivel_critico,
          fecha_hora: new Date()
        }

        req.app.get('io').emit('nuevoEvento', nuevoEvento)

        res.status(201).json({ message: '✅ Evento registrado correctamente', id_evento: result.insertId })
      })
    })
  })
})

module.exports = router