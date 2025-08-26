import { useState, useCallback } from 'react'
import { AlertState } from '../pages/Investors/types'

/**
 * Hook مخصص لإدارة تنبيهات المستثمرين
 * مسؤولية واحدة: إدارة التنبيهات فقط
 */
export const useInvestorAlerts = () => {
  // State للتنبيهات
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    message: ''
  })

  // دوال المساعدة
  const showAlert = useCallback((type: 'success' | 'error' | 'warning', message: string) => {
    setAlert({ show: true, type, message })
    setTimeout(() => setAlert({ show: false, type: 'success', message: '' }), 5000)
  }, [])

  const closeAlert = useCallback(() => {
    setAlert({ show: false, type: 'success', message: '' })
  }, [])

  return {
    // State للتنبيهات
    alert,
    
    // دوال إدارة التنبيهات
    showAlert,
    closeAlert
  }
}
