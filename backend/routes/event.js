const express = require('express')
const router = express.Router()
const db = require('../db')

// POST /api/eventos - Registrar evento desde dispositivo
router.post('/eventos', async (req, res) => {
  const { id_dispositivo, codigo } = req.body

  if (!id_dispositivo || !codigo) {
    return res.status(400).json({ message: 'Faltan datos: id_dispositivo o codigo' })
  }

  try {
    // Verificar si el dispositivo existe y recibe eventos
    const [dispositivos] = await db.promise().query(
      'SELECT recibir_eventos FROM dispositivos WHERE id_dispositivo = ? LIMIT 1',
      [id_dispositivo]
    )

    if (dispositivos.length === 0) {
      return res.status(404).json({ message: `⚠️ Dispositivo ${id_dispositivo} no registrado.` })
    }

    if (!dispositivos[0].recibir_eventos) {
      return res.status(403).json({ message: `🚫 Dispositivo ${id_dispositivo} tiene desactivado el envío de eventos.` })
    }

    // Obtener información del código Contact ID
    const [codigos] = await db.promise().query(
      'SELECT descripcion, tipo_evento, nivel_critico FROM eventos_contact_id WHERE codigo = ? LIMIT 1',
      [codigo]
    )

    if (codigos.length === 0) {
      return res.status(404).json({ message: `⚠️ Código Contact ID ${codigo} no registrado.` })
    }

    const { descripcion, tipo_evento, nivel_critico } = codigos[0]

    // Insertar nuevo evento
    const [insertResult] = await db.promise().query(
      `INSERT INTO eventos (id_dispositivo, codigo_contact_id, descripcion, tipo_evento, nivel_critico)
       VALUES (?, ?, ?, ?, ?)`,
      [id_dispositivo, codigo, descripcion, tipo_evento, nivel_critico]
    )

    // Actualizar estado del dispositivo
    await db.promise().query(
      `UPDATE dispositivos SET estado = 'conectado', ultima_senal = NOW()
       WHERE id_dispositivo = ?`,
      [id_dispositivo]
    )

    console.log(`📡 Dispositivo ${id_dispositivo} marcado como CONECTADO`)
    console.log(`📥 Evento recibido: Código ${codigo} (${descripcion}), tipo ${tipo_evento}, nivel ${nivel_critico}`)

    const nuevoEvento = {
      id: insertResult.insertId,
      id_dispositivo,
      codigo_contact_id: codigo,
      descripcion,
      tipo_evento,
      nivel_critico,
      fecha_hora: new Date()
    }

    req.app.get('io').emit('nuevoEvento', nuevoEvento)

    res.status(201).json({ message: '✅ Evento registrado correctamente', id_evento: insertResult.insertId })

  } catch (err) {
    console.error('❌ Error procesando evento:', err)
    res.status(500).json({ message: 'Error procesando evento', error: err.message })
  }
})

// GET /api/eventos/activos - Obtener eventos no atendidos
router.get('/eventos/activos', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT * FROM eventos WHERE atendido = FALSE ORDER BY fecha_hora DESC`
    )
    res.json(rows)
  } catch (err) {
    console.error('❌ Error al obtener eventos activos:', err)
    res.status(500).json({ message: 'Error al obtener eventos activos' })
  }
})

// GET /api/eventos/recientes - Eventos ya atendidos (últimos 5)
router.get('/eventos/recientes', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT * FROM eventos WHERE atendido = TRUE ORDER BY fecha_atencion DESC LIMIT 5`
    )
    res.json(rows)
  } catch (err) {
    console.error('❌ Error al obtener eventos recientes:', err)
    res.status(500).json({ message: 'Error al obtener eventos recientes' })
  }
})

// PUT /api/eventos/:id/atender - Marcar evento como atendido
router.put('/eventos/:id/atender', async (req, res) => {
  const { id } = req.params
  const { atendido_por, detalle_atencion } = req.body

  if (!atendido_por || !detalle_atencion) {
    return res.status(400).json({ message: 'Faltan datos: atendido_por o detalle_atencion' })
  }

  try {
    await db.promise().query(
      `UPDATE eventos 
       SET atendido = TRUE, atendido_por = ?, detalle_atencion = ?, fecha_atencion = NOW() 
       WHERE id_evento = ?`,
      [atendido_por, detalle_atencion, id]
    )

    req.app.get('io').emit('eventoAtendido', { id_evento: id })

    res.json({ message: '✅ Evento marcado como atendido' })
  } catch (err) {
    console.error('❌ Error al actualizar evento:', err)
    res.status(500).json({ message: 'Error al actualizar evento' })
  }
})

// GET /api/eventos/recientes-dashboard - Eventos para panel
router.get('/eventos/recientes-dashboard', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT id_evento, id_dispositivo, tipo_evento, fecha_atencion 
       FROM eventos 
       WHERE atendido = TRUE 
       ORDER BY fecha_atencion DESC 
       LIMIT 5`
    )
    res.json(rows)
  } catch (err) {
    console.error('❌ Error al obtener eventos recientes para dashboard:', err)
    res.status(500).json({ message: 'Error al obtener eventos recientes' })
  }
})

module.exports = router
