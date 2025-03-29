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

// ✅ GET /api/usuarios → Lista de usuarios con JOIN a roles
router.get('/usuarios', verificarAdmin, (req, res) => {
  const query = `
    SELECT u.id_usuario, u.nombre, r.nombre AS rol
    FROM usuarios u
    LEFT JOIN roles r ON u.rol_id = r.id
  `

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener usuarios' })
    res.json(results)
  })
})

// ✅ POST /api/usuarios → Crear nuevo usuario con rol_id
router.post('/usuarios', verificarAdmin, async (req, res) => {
  const { id_usuario, nombre, password, rol_id } = req.body

  if (!id_usuario || !nombre || !password || !rol_id) {
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
        'INSERT INTO usuarios (id_usuario, nombre, password, rol_id) VALUES (?, ?, ?, ?)',
        [id_usuario, nombre, hashedPassword, rol_id],
        (err) => {
          if (err) return res.status(500).json({ message: 'Error al insertar usuario' })
          res.status(201).json({ message: 'Usuario creado exitosamente' })
        }
      )
    } catch (error) {
      res.status(500).json({ message: 'Error al hashear la contraseña' })
    }
  })
})

// ✅ GET /api/roles → Obtener lista de roles
router.get('/roles', (req, res) => {
  db.query('SELECT id, nombre FROM roles', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener roles:', err)
      return res.status(500).json({ message: 'Error al obtener roles' })
    }
    res.json(results)
  })
})

module.exports = router
