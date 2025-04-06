const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcryptjs')
const verifyToken = require('../middlewares/authMiddleware')

// PATCH /api/password
router.patch('/password', verifyToken, async (req, res) => {
  const { id_usuario, nuevaPassword } = req.body

  if (!id_usuario || !nuevaPassword) {
    return res.status(400).json({ message: 'Faltan datos' })
  }

  try {
    const hash = await bcrypt.hash(nuevaPassword, 10)

    const [result] = await db.promise().query(
      'UPDATE usuarios SET password = ? WHERE id_usuario = ?',
      [hash, id_usuario]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    return res.json({ message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    console.error('❌ Error al actualizar contraseña:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

module.exports = router
