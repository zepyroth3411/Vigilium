import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'error', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg text-white text-sm transition-all
      ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}
    `}>
      {message}
    </div>
  )
}
