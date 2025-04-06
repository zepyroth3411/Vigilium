const express = require('express')
const router = express.Router()
const db = require('../db')

// POST /api/fault-reporting - Registrar reporte de falla
router.post('/', async (req, res) => {
  const { id_dispositivo, tecnico, tipo_falla, descripcion, urgente } = req.body

  if (!id_dispositivo || !tecnico || !tipo_falla || !descripcion) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  try {
    const [result] = await db.promise().query(
      `INSERT INTO fallas_reportadas 
        (id_dispositivo, tecnico, tipo_falla, descripcion, urgente) 
        VALUES (?, ?, ?, ?, ?)`,
      [id_dispositivo, tecnico, tipo_falla, descripcion, urgente]
    )

    const nuevaFalla = {
      id: result.insertId,
      id_dispositivo,
      tecnico,
      tipo_falla,
      descripcion,
      urgente,
      fecha: new Date()
    }

    // Emitir evento de nueva falla
    const io = req.app.get('io')
    io.emit('nueva-falla', nuevaFalla)

    res.status(201).json({ message: 'Falla reportada exitosamente', data: nuevaFalla })
  } catch (err) {
    console.error('❌ Error al registrar la falla:', err)
    res.status(500).json({ error: 'Error al registrar la falla' })
  }
})

// GET /api/fault-reporting - Obtener todas las fallas no atendidas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT * FROM fallas_reportadas 
       WHERE atendida IS NULL OR atendida = 0 
       ORDER BY fecha DESC`
    )
    res.json(rows)
  } catch (err) {
    console.error('❌ Error al obtener fallas:', err)
    res.status(500).json({ error: 'Error al obtener fallas' })
  }
})

// GET /api/fault-reporting/pendientes - Alias del anterior (puedes comentar si es redundante)
router.get('/pendientes', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT * FROM fallas_reportadas 
       WHERE atendida IS NULL OR atendida = 0 
       ORDER BY fecha DESC`
    )
    res.json(rows)
  } catch (err) {
    console.error('❌ Error al obtener fallas pendientes:', err)
    res.status(500).json({ error: 'Error al obtener fallas pendientes' })
  }
})

// PUT /api/fault-reporting/:id/atender - Marcar falla como atendida
router.put('/:id/atender', async (req, res) => {
  const { id } = req.params
  const { atendida_por, solucion } = req.body

  if (!atendida_por || !solucion) {
    return res.status(400).json({ error: 'Faltan datos para marcar como atendida' })
  }

  try {
    await db.promise().query(
      `UPDATE fallas_reportadas 
       SET atendida = 1, atendida_por = ?, solucion = ?, fecha_atendida = NOW() 
       WHERE id = ?`,
      [atendida_por, solucion, id]
    )

    const io = req.app.get('io')
    io.emit('falla-atendida', { id, atendida_por, solucion })

    res.json({ message: 'Falla marcada como atendida' })
  } catch (err) {
    console.error('❌ Error al marcar como atendida:', err)
    res.status(500).json({ error: 'Error al actualizar falla' })
  }
})

module.exports = router
