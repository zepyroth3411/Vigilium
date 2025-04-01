// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken')

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1] // Formato: "Bearer TOKEN"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vigilium_secret_2025')
    req.usuario = decoded // Guardamos el usuario decodificado en la request
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' })
  }
}

module.exports = verificarToken
