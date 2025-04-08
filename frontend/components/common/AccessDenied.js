import { ShieldExclamationIcon } from '@heroicons/react/24/solid'
export default function AccesoDenegado() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600 flex items-center gap-2"> <ShieldExclamationIcon className='w-6 h-6'/>
        Acceso denegado
        </h1>
        <p className="mt-2 text-gray-600">No tienes permiso para acceder a esta sección.</p>
      </div>
    )
  }