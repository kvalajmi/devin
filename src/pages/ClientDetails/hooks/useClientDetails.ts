import { useState, useEffect } from 'react'
import { Client } from '../../../types/DatabaseTypes'
import { ClientDataService } from '../services/ClientDataService'

interface NotificationState {
  show: boolean
  type: string
  message: string
}

/**
 * خطاف مخصص لإدارة بيانات العميل
 */
export const useClientDetails = (clientId: string | undefined) => {
  // حالات أساسية
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<NotificationState>({
    show: false, 
    type: '', 
    message: ''
  })

  // تحميل بيانات العميل
  useEffect(() => {
    const loadData = async () => {
      if (!clientId) return

      try {
        setIsLoading(true)
        setError(null)
        
        const clientData = await ClientDataService.loadClientData(clientId)
        
        if (clientData) {
          setClient(clientData)
        } else {
          setError('لم يتم العثور على العميل')
        }
      } catch (error) {
        console.error('خطأ في تحميل بيانات العميل:', error)
        setError('حدث خطأ في تحميل بيانات العميل')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [clientId])

  // دالة إظهار الإشعار
  const showNotification = (type: string, message: string) => {
    setNotification({ show: true, type, message })
  }

  // دالة إخفاء الإشعار
  const hideNotification = () => {
    setNotification({ show: false, type: '', message: '' })
  }

  // دالة تحديث العميل
  const updateClient = (updatedClient: Client) => {
    setClient(updatedClient)
  }

  return {
    client,
    isLoading,
    error,
    notification,
    showNotification,
    hideNotification,
    updateClient
  }
}
