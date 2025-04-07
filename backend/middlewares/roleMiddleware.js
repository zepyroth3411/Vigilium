// middlewares/roleMiddleware.js

function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.user // <- Este es el nombre estándar que se usa al decodificar el token

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no autenticado' })
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ message: `Acceso no autorizado para el rol: ${usuario.rol}` })
    }

    next()
  }
}

module.exports = permitirRoles
