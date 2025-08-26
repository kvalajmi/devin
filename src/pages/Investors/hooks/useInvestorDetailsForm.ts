import { useState } from 'react'
import { Investor } from '../types'

interface UseInvestorDetailsFormProps {
  investor: Investor
  onUpdate: (investorId: number, updates: Partial<Investor>) => Promise<boolean>
}

/**
 * Hook مخصص لإدارة نموذج تفاصيل المستثمر
 */
export const useInvestorDetailsForm = ({ investor, onUpdate }: UseInvestorDetailsFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Investor>>({
    investorName: investor.investorName,
    partnerName: investor.partnerName,
    partnershipType: investor.partnershipType,
    investorPercentage: investor.investorPercentage,
    civilId: investor.civilId,
    joinDate: investor.joinDate
  })

  /**
   * معالجة تغيير قيم النموذج
   */
  const handleInputChange = (field: keyof Investor, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * معالجة حفظ التغييرات
   */
  const handleSave = async () => {
    try {
      setIsLoading(true)
      const success = await onUpdate(investor.id, formData)
      if (success) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('خطأ في تحديث المستثمر:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * معالجة إلغاء التعديل
   */
  const handleCancel = () => {
    setFormData({
      investorName: investor.investorName,
      partnerName: investor.partnerName,
      partnershipType: investor.partnershipType,
      investorPercentage: investor.investorPercentage,
      civilId: investor.civilId,
      joinDate: investor.joinDate
    })
    setIsEditing(false)
  }

  /**
   * بدء التعديل
   */
  const handleEdit = () => {
    setIsEditing(true)
  }

  return {
    isEditing,
    isLoading,
    formData,
    handleInputChange,
    handleSave,
    handleCancel,
    handleEdit
  }
}
