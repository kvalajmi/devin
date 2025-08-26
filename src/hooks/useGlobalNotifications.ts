import { useState, useCallback } from 'react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export const useGlobalNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string, duration = 3000) => {
    const id = Date.now().toString()
    const notification: Notification = { id, type, message, duration }
    
    setNotifications(prev => [...prev, notification])
    
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, duration)
    }
    
    return id
  }, [])

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    showNotification,
    hideNotification,
    clearAllNotifications
  }
}
