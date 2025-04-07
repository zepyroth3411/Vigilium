const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /login
router.post('/login', async (req, res) => {
  const { id_usuario, password } = req.body;

  if (!id_usuario || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  const query = `
    SELECT u.*, r.nombre AS rol_nombre
    FROM usuarios u
    LEFT JOIN roles r ON u.rol_id = r.id
    WHERE u.id_usuario = ?
  `;

  try {
    const [results] = await pool.query(query, [id_usuario]);

    if (results.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const usuario = results[0];
    console.log('🔍 Usuario encontrado:', usuario);

    // Validar contraseña
    const isMatch = await bcrypt.compare(password.trim(), usuario.password);
    if (!isMatch) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol_nombre,
      },
      process.env.JWT_SECRET || 'vigilium_secret_2025',
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    console.log('✅ Token generado:', token);
    res.json({ token });

  } catch (err) {
    console.error('❌ Error de base de datos:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
