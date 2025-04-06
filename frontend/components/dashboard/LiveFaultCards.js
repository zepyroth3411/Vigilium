import { useEffect, useState } from 'react'
import socket from '@/utils/socket'
import FaultsModal from './FaultsModal'
import { API_URL } from '@/utils/config'

export default function LiveFaultsCard() {
  const [fallas, setFallas] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchFallas = async () => {
      try {
        const res = await fetch(`${API_URL}/api/fault-reporting`)
        const data = await res.json()
        setFallas(data)
      } catch (err) {
        console.error('❌ Error al cargar fallas pendientes:', err)
      }
    }

    fetchFallas()
  }, [])

  useEffect(() => {
    const handleNuevaFalla = (nuevaFalla) => {
      setFallas((prev) => [...prev, nuevaFalla])
    }

    const handleFallaAtendida = ({ id }) => {
      setFallas((prev) => prev.filter(f => f.id !== id))
    }

    socket.on('nueva-falla', handleNuevaFalla)
    socket.on('falla-atendida', handleFallaAtendida)

    return () => {
      socket.off('nueva-falla', handleNuevaFalla)
      socket.off('falla-atendida', handleFallaAtendida)
    }
  }, [])

  return (
    <>
      <div
        className="bg-white border border-red-400 rounded-xl shadow-sm p-5 cursor-pointer hover:bg-red-50 transition"
        onClick={() => setShowModal(true)}
      >
        <div className="text-3xl">🚧</div>
        <p className="text-sm text-gray-600">Fallas técnicas activas</p>
        <p className="text-lg font-semibold text-red-600">{fallas.length}</p>
      </div>

      {showModal && (
        <FaultsModal
          fallas={fallas}
          setFallas={setFallas}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
