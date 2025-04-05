// routes/faultReporting.js
const express = require('express')
const router = express.Router()
const db = require('../db')

router.post('/', (req, res) => {
  const { id_dispositivo, tecnico, tipo_falla, descripcion, urgente } = req.body;

  // ✅ Debugging rápido
  console.log('Datos recibidos desde el frontend:', req.body);

  if (!id_dispositivo || !tecnico || !tipo_falla || !descripcion) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const sql = `
    INSERT INTO fallas_reportadas (id_dispositivo, tecnico, tipo_falla, descripcion, urgente)
    VALUES (?, ?, ?, ?, ?)
  `;

  const urgenteDB = urgente ? 1 : 0;

  db.query(sql, [id_dispositivo, tecnico, tipo_falla, descripcion, urgenteDB], (err) => {
    if (err) {
      console.error('❌ Error al registrar la falla:', err);
      return res.status(500).json({ error: 'Error al registrar la falla' });
    }

    res.status(201).json({ message: 'Falla reportada exitosamente' });
  });
});



module.exports = router