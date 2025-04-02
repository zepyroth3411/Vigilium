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
    'cambiar_password'
  ],
  // técnico, admin y supervisor los agregaremos conforme avancemos
}

export const tienePermiso = (rol, permiso) => {
  return permisosPorRol[rol]?.includes(permiso)
}


