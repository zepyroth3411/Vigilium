const express = require('express')
const router = express.Router()
const db = require('../db')
const verifyToken = require('../middlewares/authMiddleware')

// ✅ GET /api/devices - Obtener todos los dispositivos
router.get('/devices', verifyToken, (req, res) => {
  const sql = `
    SELECT d.*, c.nombre AS nombre_cliente
    FROM dispositivos d
    LEFT JOIN clientes c ON d.id_cliente = c.id_cliente
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener dispositivos' })
    res.json(results)
  })
})

// ✅ POST /api/devices - Crear un nuevo dispositivo
router.post('/devices', verifyToken, (req, res) => {
  const { id_dispositivo, id_cliente } = req.body

  if (!id_dispositivo || !id_cliente) {
    return res.status(400).json({ message: 'Faltan datos del dispositivo' })
  }

  const nuevo = {
    id_dispositivo,
    id_cliente,
    estado: 'desconectado',
    recibir_eventos: true
  }

  const sql = 'INSERT INTO dispositivos SET ?'
  db.query(sql, nuevo, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al crear dispositivo' })
    res.status(201).json({ message: 'Dispositivo creado correctamente', id: result.insertId })
  })
})

// PUT /api/devices/:id - Editar un dispositivo existente
router.put('/devices/:id', verifyToken, (req, res) => {
    const id = req.params.id
    const { id_cliente } = req.body
  
    if (!id_cliente) {
      return res.status(400).json({ message: 'Faltan datos para actualizar' })
    }
  
    const sql = 'UPDATE dispositivos SET id_cliente = ? WHERE id_dispositivo = ?'
    db.query(sql, [id_cliente, id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al actualizar dispositivo' })
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Dispositivo no encontrado' })
      }
      res.json({ message: 'Dispositivo actualizado correctamente' })
    })
  })

  // DELETE /api/devices/:id - Eliminar un dispositivo
router.delete('/devices/:id', verifyToken, (req, res) => {
    const id = req.params.id
  
    const sql = 'DELETE FROM dispositivos WHERE id_dispositivo = ?'
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al eliminar dispositivo' })
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Dispositivo no encontrado' })
      }
      res.json({ message: 'Dispositivo eliminado correctamente' })
    })
  })
  
// PATCH /api/devices/:id/estado - Cambiar estado del dispositivo o si recibe eventos
router.patch('/devices/:id/estado', verifyToken, (req, res) => {
    const id = req.params.id
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
  
    db.query(sql, valores, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al actualizar estado' })
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Dispositivo no encontrado' })
      }
      res.json({ message: 'Estado del dispositivo actualizado correctamente' })
    })
  })
  


module.exports = router
