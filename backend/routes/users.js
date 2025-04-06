const express = require('express')
const router = express.Router()
const db = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const verificarToken = require('../middlewares/authMiddleware')
const permitirRoles = require('../middlewares/roleMiddleware')

// Middleware para verificar token y rol admin
function verificarAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token requerido' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso restringido' })
    }
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' })
  }
}

// ✅ GET /api/usuarios
router.get('/usuarios', verificarAdmin, async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT u.id_usuario, u.nombre, r.nombre AS rol
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
    `)
    res.json(results)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' })
  }
})

// ✅ POST /api/usuarios
router.post('/usuarios', verificarAdmin, async (req, res) => {
  const { id_usuario, nombre, password, rol_id } = req.body
  if (!id_usuario || !nombre || !password || !rol_id) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' })
  }

  try {
    const [existing] = await db.promise().query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario])
    if (existing.length > 0) return res.status(409).json({ message: 'El usuario ya existe' })

    const hashedPassword = await bcrypt.hash(password, 10)
    await db.promise().query(
      'INSERT INTO usuarios (id_usuario, nombre, password, rol_id) VALUES (?, ?, ?, ?)',
      [id_usuario, nombre, hashedPassword, rol_id]
    )
    res.status(201).json({ message: 'Usuario creado exitosamente' })
  } catch (err) {
    res.status(500).json({ message: 'Error al crear usuario' })
  }
})

// ✅ PUT /api/usuarios/:id
router.put('/usuarios/:id', verificarAdmin, async (req, res) => {
  const { id_usuario, nombre, rol_id, password } = req.body
  const { id } = req.params

  if (!id_usuario || !nombre || !rol_id) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' })
  }

  try {
    let query = 'UPDATE usuarios SET id_usuario = ?, nombre = ?, rol_id = ?'
    const params = [id_usuario, nombre, rol_id]

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10)
      query += ', password = ?'
      params.push(hashedPassword)
    }

    query += ' WHERE id_usuario = ?'
    params.push(id)

    const [result] = await db.promise().query(query, params)

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json({ message: '✅ Usuario actualizado correctamente' })
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario' })
  }
})

// ✅ GET /api/roles
router.get('/roles', async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT id, nombre FROM roles')
    res.json(results)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener roles' })
  }
})

// ❌ Ruta duplicada innecesaria (la misma que /usuarios con validación)
// Puedes eliminar esta si ya tienes la anterior
/*
router.get('/usuarios', verificarToken, permitirRoles('admin'), (req, res) => {
  res.json({ message: 'Solo el admin ve esto 😎' })
})
*/

// ✅ DELETE /api/usuarios/:id
router.delete('/usuarios/:id', verificarAdmin, async (req, res) => {
  const { id } = req.params

  try {
    const [result] = await db.promise().query('DELETE FROM usuarios WHERE id_usuario = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json({ message: '🗑️ Usuario eliminado correctamente' })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario' })
  }
})

module.exports = router
