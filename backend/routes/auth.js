// routes/auth.js
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = express.Router()

// Usuario simulado
const usuarios = [
  {
    id: 1,
    email: 'admin@vigilium.com',
    password: bcrypt.hashSync('123456', 10), // Contraseña hasheada
    rol: 'admin'
  }
]

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const usuario = usuarios.find(u => u.email === email)

  if (!usuario) {
    return res.status(401).json({ message: 'Usuario no encontrado' })
  }

  const validPass = bcrypt.compareSync(password, usuario.password)
  if (!validPass) {
    return res.status(401).json({ message: 'Contraseña incorrecta' })
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET || 'secreto123',
    { expiresIn: '2h' }
  )

  res.json({ token })
})

module.exports = router
