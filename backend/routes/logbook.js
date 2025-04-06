const express = require('express')
const router = express.Router()
const db = require('../db')

// GET /api/logbook/clientes
router.get('/clientes', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT id_cliente, nombre, direccion, telefono, correo FROM clientes'
    )
    res.json(rows)
  } catch (err) {
    console.error('❌ Error al obtener clientes:', err)
    res.status(500).json({ error: 'Error al obtener clientes' })
  }
})

// GET /api/logbook/dispositivos
router.get('/dispositivos', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT id_dispositivo, nombre_dispositivo FROM dispositivos'
    )
    res.json(rows)
  } catch (err) {
    console.error('❌ Error al obtener dispositivos:', err)
    res.status(500).json({ error: 'Error al obtener dispositivos' })
  }
})

// POST /api/logbook/clientes
router.post('/clientes', async (req, res) => {
  const { nombre, direccion, telefono, correo } = req.body

  if (!nombre || !correo) {
    return res.status(400).json({ error: 'Nombre y correo son obligatorios' })
  }

  try {
    const [result] = await db.promise().query(
      'INSERT INTO clientes (nombre, direccion, telefono, correo) VALUES (?, ?, ?, ?)',
      [nombre, direccion, telefono, correo]
    )

    res.status(201).json({
      message: 'Cliente creado',
      id_cliente: result.insertId,
      nombre
    })
  } catch (err) {
    console.error('❌ Error al crear cliente:', err)
    res.status(500).json({ error: 'Error al crear cliente' })
  }
})

// POST /api/logbook/dispositivos
router.post('/dispositivos', async (req, res) => {
  const { id_dispositivo, nombre_dispositivo, id_cliente } = req.body

  if (!id_dispositivo || !nombre_dispositivo || !id_cliente) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  try {
    await db.promise().query(
      'INSERT INTO dispositivos (id_dispositivo, nombre_dispositivo, id_cliente) VALUES (?, ?, ?)',
      [id_dispositivo, nombre_dispositivo, id_cliente]
    )

    res.status(201).json({
      message: 'Dispositivo creado',
      id_dispositivo
    })
  } catch (err) {
    console.error('❌ Error al crear dispositivo:', err)
    res.status(500).json({ error: 'Error al crear dispositivo' })
  }
})

// POST /api/logbook/bitacora
router.post('/bitacora', async (req, res) => {
  const {
    id_cliente,
    id_dispositivo,
    tecnico,
    diagnostico,
    recomendaciones,
    finalizado
  } = req.body

  if (!id_cliente || !id_dispositivo || !tecnico) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }

  try {
    await db.promise().query(
      `INSERT INTO bitacoras 
      (id_cliente, id_dispositivo, tecnico, diagnostico, recomendaciones, finalizado) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [id_cliente, id_dispositivo, tecnico, diagnostico, recomendaciones, finalizado]
    )

    res.status(201).json({ message: 'Bitácora registrada exitosamente' })
  } catch (err) {
    console.error('❌ Error al registrar bitácora:', err)
    res.status(500).json({ error: 'Error al registrar bitácora' })
  }
})

// GET /api/logbook/tecnicos
router.get('/tecnicos', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT id_usuario, nombre FROM usuarios WHERE rol_id = 3'
    )
    res.json(rows)
  } catch (err) {
    console.error('❌ Error al obtener técnicos:', err)
    res.status(500).json({ error: 'Error al obtener técnicos' })
  }
})

module.exports = router
