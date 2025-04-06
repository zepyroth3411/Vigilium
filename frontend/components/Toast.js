import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'error', onClose = () => {} }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  const toastStyles = {
    error: 'bg-red-600',
    success: 'bg-green-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-500 text-black'
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg text-sm transition-all
        text-white ${toastStyles[type] || toastStyles.error}
      `}
    >
      {message}
    </div>
  )
}

