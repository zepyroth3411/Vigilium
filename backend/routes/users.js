const express = require('express')
const router = express.Router()
const db = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Middleware para verificar el token y el rol admin
function verificarAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token requerido' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vigilium_super_secret_2025')
    if (decoded.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso restringido' })
    }
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' })
  }
}

// GET /api/usuarios → Lista de usuarios (solo admin)
router.get('/usuarios', verificarAdmin, (req, res) => {
  db.query('SELECT id_usuario, nombre, rol FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener usuarios' })
    res.json(results)
  })
})

// POST /api/usuarios → Crear nuevo usuario (solo admin)
router.post('/usuarios', verificarAdmin, async (req, res) => {
  const { id_usuario, nombre, password, rol } = req.body

  if (!id_usuario || !nombre || !password || !rol) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' })
  }

  db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al verificar usuario' })
    if (result.length > 0) {
      return res.status(409).json({ message: 'El usuario ya existe' })
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10)

      db.query(
        'INSERT INTO usuarios (id_usuario, nombre, password, rol) VALUES (?, ?, ?, ?)',
        [id_usuario, nombre, hashedPassword, rol],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Error al insertar usuario' })
          res.status(201).json({ message: 'Usuario creado exitosamente' })
        }
      )
    } catch (error) {
      res.status(500).json({ message: 'Error al hashear la contraseña' })
    }
  })
})

module.exports = router
