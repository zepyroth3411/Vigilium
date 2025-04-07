const express = require('express')
const router = express.Router()
const pool = require('../db')
const verifyToken = require('../middlewares/authMiddleware')

// ✅ GET /api/devices - Obtener todos los dispositivos
router.get('/devices', verifyToken, async (req, res) => {
  const sql = `
    SELECT d.*, c.nombre AS nombre_cliente
    FROM dispositivos d
    LEFT JOIN clientes c ON d.id_cliente = c.id_cliente
  `

  try {
    const [results] = await pool.query(sql)
    res.json(results)
  } catch (err) {
    console.error('❌ Error al obtener dispositivos:', err)
    res.status(500).json({ message: 'Error al obtener dispositivos' })
  }
})

// ✅ POST /api/devices - Crear dispositivo
router.post('/devices', verifyToken, async (req, res) => {
  const { id_dispositivo, nombre_dispositivo, id_cliente } = req.body

  console.log('📥 Dispositivo recibido:', req.body)

  if (!id_dispositivo || !nombre_dispositivo || !id_cliente) {
    return res.status(400).json({ message: 'Faltan datos del dispositivo' })
  }

  const nuevo = {
    id_dispositivo,
    nombre_dispositivo,
    id_cliente,
    estado: 'desconectado',
    activo: true
  }

  try {
    const [result] = await pool.query('INSERT INTO dispositivos SET ?', [nuevo])
    res.status(201).json({ message: 'Dispositivo creado correctamente', id: result.insertId })
  } catch (err) {
    console.error('❌ Error al insertar en DB:', err)
    res.status(500).json({ message: 'Error al crear dispositivo' })
  }
})

// ✅ PUT /api/devices/:id - Editar un dispositivo
router.put('/devices/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  const { id_cliente } = req.body

  if (!id_cliente) {
    return res.status(400).json({ message: 'Faltan datos para actualizar' })
  }

  try {
    const [result] = await pool.query('UPDATE dispositivos SET id_cliente = ? WHERE id_dispositivo = ?', [id_cliente, id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' })
    }
    res.json({ message: 'Dispositivo actualizado correctamente' })
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar dispositivo' })
  }
})

// ✅ DELETE /api/devices/:id - Eliminar un dispositivo
router.delete('/devices/:id', verifyToken, async (req, res) => {
  const { id } = req.params

  try {
    await pool.query('DELETE FROM eventos WHERE id_dispositivo = ?', [id])
    const [result] = await pool.query('DELETE FROM dispositivos WHERE id_dispositivo = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' })
    }

    res.json({ message: 'Dispositivo eliminado correctamente' })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar dispositivo' })
  }
})

// ✅ PATCH /api/devices/:id/estado - Cambiar estado o recepción de eventos
router.patch('/devices/:id/estado', verifyToken, async (req, res) => {
  const { id } = req.params
  const { estado, recibir_eventos } = req.body

  if (estado === undefined && recibir_eventos === undefined) {
    return res.status(400).json({ message: 'No se especificaron cambios' })
  }

  const campos = []
  const valores = []

  if (estado !== undefined) {
    campos.push('estado = ?')
    valores.push(estado)
  }

  if (recibir_eventos !== undefined) {
    campos.push('recibir_eventos = ?')
    valores.push(recibir_eventos)
  }

  valores.push(id)

  const sql = `UPDATE dispositivos SET ${campos.join(', ')} WHERE id_dispositivo = ?`

  try {
    const [result] = await pool.query(sql, valores)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' })
    }
    res.json({ message: 'Estado del dispositivo actualizado correctamente' })
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar estado' })
  }
})

module.exports = router
