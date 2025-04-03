const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los clientes
router.get('/clientes', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener clientes' });
    res.json(results);
  });
});

// Crear nuevo cliente
router.post('/clientes', (req, res) => {
  const { nombre, direccion, telefono, contacto } = req.body;
  if (!nombre || !direccion || !telefono || !contacto) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  db.query(
    'INSERT INTO clientes (nombre, direccion, telefono, contacto) VALUES (?, ?, ?, ?)',
    [nombre, direccion, telefono, contacto],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al crear cliente' });
      res.json({ id: result.insertId, nombre, direccion, telefono, contacto });
    }
  );
});

// Actualizar cliente
router.put('/clientes/:id_cliente', (req, res) => {
  const { id_cliente } = req.params;
  const { nombre, direccion, telefono, contacto } = req.body;

  db.query(
    'UPDATE clientes SET nombre = ?, direccion = ?, telefono = ?, contacto = ? WHERE id_cliente = ?',
    [nombre, direccion, telefono, contacto, id_cliente],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al actualizar cliente' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      res.json({ message: 'Cliente actualizado correctamente' });
    }
  );
});

// Eliminar cliente
router.delete('/clientes/:id_cliente', (req, res) => {
  const { id_cliente } = req.params;

  db.query('DELETE FROM clientes WHERE id_cliente = ?', [id_cliente], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al eliminar cliente' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente' });
  });
});


module.exports = router;
