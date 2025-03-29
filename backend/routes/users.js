const express = require('express')
const router = express.Router()
const db = require('../db')
const jwt = require('jsonwebtoken')

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

module.exports = router
