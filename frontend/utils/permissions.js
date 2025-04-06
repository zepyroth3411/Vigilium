// utils/permissions.js

/**
 * Mapa de permisos por rol.
 * Aquí se definen todos los permisos que cada tipo de usuario puede realizar.
 */
const permisosPorRol = {
  monitorista: [
    'ver_dashboard',
    'ver_eventos',
    'atender_eventos',
    'editar_descripcion_evento',
    'ver_dispositivos',
    'ver_clientes',
    'cambiar_password',
  ],

  tecnico: [
    'ver_dispositivos',
    'crear_dispositivo',
    'editar_dispositivo',
    'ver_clientes',
    'crear_cliente',
    'editar_cliente',
    'cambiar_password',
  ],

  admin: [
    // Dashboard
    'ver_dashboard',

    // Eventos
    'ver_eventos',
    'atender_eventos',
    'editar_descripcion_evento',

    // Dispositivos
    'ver_dispositivos',
    'crear_dispositivo',
    'editar_dispositivo',
    'eliminar_dispositivo',
    'desconectar_dispositivo',

    // Clientes
    'ver_clientes',
    'crear_cliente',
    'editar_cliente',
    'eliminar_cliente',

    // Usuarios
    'ver_usuarios',
    'crear_usuario',
    'editar_usuario',
    'eliminar_usuario',

    // Roles
    'ver_roles',
    'crear_rol',
    'editar_rol',
    'eliminar_rol',

    // Contraseñas
    'cambiar_password',            // cambiar su propia contraseña
    'cambiar_password_usuarios',   // cambiar la de cualquier usuario
  ],

  // Otros roles como 'supervisor' pueden agregarse aquí más adelante
}

/**
 * ✅ Función utilitaria global para verificar si un rol tiene cierto permiso.
 * @param {string} rol - Rol del usuario (admin, tecnico, monitorista...)
 * @param {string} permiso - Permiso a validar
 * @returns {boolean} true si tiene permiso, false si no
 */
export const tienePermiso = (rol, permiso) => {
  return permisosPorRol[rol]?.includes(permiso)
}
