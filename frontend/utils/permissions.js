const permisosPorRol = {
  monitorista: [
    'ver_dashboard',
    'ver_eventos',
    'atender_eventos',
    'editar_descripcion_evento',
    'ver_dispositivos',
    'ver_clientes',
    'cambiar_contraseña',
  ],
  // técnico, admin y supervisor los agregaremos conforme avancemos
}

export const tienePermiso = (rol, permiso) => {
  return permisosPorRol[rol]?.includes(permiso)
}


