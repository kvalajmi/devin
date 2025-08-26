import { useState, useCallback } from 'react'
import { Investor } from '../pages/Investors/types'

/**
 * Hook مخصص لإدارة نماذج المستثمرين
 * مسؤولية واحدة: إدارة النماذج فقط
 */
export const useInvestorForms = () => {
  // State للنماذج والعرض
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDetailsForm, setShowDetailsForm] = useState(false)
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)

  // دوال إدارة النماذج
  const toggleAddForm = useCallback(() => {
    setShowAddForm(prev => !prev)
    if (showAddForm) {
      setShowDetailsForm(false)
      setSelectedInvestor(null)
    }
  }, [showAddForm])

  const openInvestorDetails = useCallback((investor: Investor) => {
    setSelectedInvestor(investor)
    setShowDetailsForm(true)
    setShowAddForm(false)
  }, [])

  const closeAllForms = useCallback(() => {
    setShowAddForm(false)
    setShowDetailsForm(false)
    setSelectedInvestor(null)
  }, [])

  return {
    // State للنماذج
    showAddForm,
    showDetailsForm,
    selectedInvestor,
    
    // دوال إدارة النماذج
    toggleAddForm,
    openInvestorDetails,
    closeAllForms
  }
}
