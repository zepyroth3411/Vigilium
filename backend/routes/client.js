const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los clientes
router.get('/clientes', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM clientes');
    res.json(results);
  } catch (err) {
    console.error('❌ Error al obtener clientes:', err);
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
});

// Crear nuevo cliente
router.post('/clientes', async (req, res) => {
  console.log('[🧪 BACKEND] Body recibido:', req.body);
  const { nombre, direccion, telefono, correo } = req.body;

  if (!nombre || !direccion || !telefono || !correo) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const sql = 'INSERT INTO clientes (nombre, direccion, telefono, correo) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(sql, [nombre, direccion, telefono, correo]);
    res.status(201).json({ id_cliente: result.insertId, nombre, direccion, telefono, correo });
  } catch (err) {
    console.error('❌ Error al crear cliente:', err);
    res.status(500).json({ message: 'Error al crear cliente' });
  }
});

// Actualizar cliente
router.put('/clientes/:id_cliente', async (req, res) => {
  const { id_cliente } = req.params;
  const { nombre, direccion, telefono, correo } = req.body;

  try {
    const sql = 'UPDATE clientes SET nombre = ?, direccion = ?, telefono = ?, correo = ? WHERE id_cliente = ?';
    const [result] = await pool.query(sql, [nombre, direccion, telefono, correo, id_cliente]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar cliente:', err);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
});

// Eliminar cliente
router.delete('/clientes/:id_cliente', async (req, res) => {
  const { id_cliente } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id_cliente]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar cliente:', err);
    res.status(500).json({ message: 'Error al eliminar cliente' });
  }
});

module.exports = router;
