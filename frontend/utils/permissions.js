export const permisos = {
  admin: ['ver_eventos', 'editar_eventos', 'ver_dispositivos', 'ver_clientes', 'administrar_usuarios'],
  monitorista: ['ver_eventos', 'editar_eventos', 'ver_dispositivos', 'ver_clientes'],
  tecnico: ['ver_dispositivos', 'ver_clientes'],
  supervisor: ['ver_eventos', 'ver_dispositivos', 'ver_clientes'],
}

export function tienePermiso(rol, permiso) {
  return permisos[rol]?.includes(permiso)
}