export const permisosPorRol = {
    admin: ['ver_todo', 'editar_todo'],
    monitorista: ['ver_eventos', 'atender_eventos'],
    tecnico: ['ver_dispositivos'],
    supervisor: ['ver_eventos', 'ver_dispositivos'],
  }
  
  export function tienePermiso(rol, permiso) {
    const permisos = permisosPorRol[rol] || []
    return permisos.includes(permiso)
  }
  