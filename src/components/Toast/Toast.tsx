import { useEffect, useState } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  duration?: number
  onClose: () => void
}

export function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        flex items-center gap-3 rounded-lg
        border border-green-700 bg-green-900/90 backdrop-blur-sm
        px-4 py-3 text-green-100 shadow-lg
        transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <CheckCircle className="h-5 w-5 text-green-400" />
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="ml-2 text-green-400 hover:text-green-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
