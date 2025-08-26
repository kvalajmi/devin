import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfirmationContext } from '../components/ConfirmationProvider'
import { createDeleteConfirm } from '../utils/confirmation-helpers'
import { useInvestorData } from './useInvestorData'
import { useInvestorForms } from './useInvestorForms'
import { useGlobalNotifications } from './useGlobalNotifications'
import { useInvestorStats } from './useInvestorStats'
import { Investor } from '../pages/Investors/types'

/**
 * Hook مخصص لإدارة المستثمرين - محسّن
 * يستخدم hooks متخصصة منفصلة
 */
export const useInvestorManagement = () => {
  const navigate = useNavigate()
  const { showConfirm } = useConfirmationContext()
  const deleteConfirm = createDeleteConfirm(showConfirm)
  
  // استخدام الـ hooks المتخصصة
  const { investors, isLoading, addInvestor, updateInvestor, deleteInvestor } = useInvestorData()
  const { showAddForm, showDetailsForm, selectedInvestor, toggleAddForm, openInvestorDetails, closeAllForms } = useInvestorForms()
  const { showNotification } = useGlobalNotifications()
  const stats = useInvestorStats(investors)

  // دوال التنقل
  const openInvestorTransactions = useCallback((investor: Investor) => {
    navigate(`/investor-transactions/${investor.id}`)
  }, [navigate])

  // دالة حذف المستثمر مع تأكيد
  const handleDeleteInvestor = useCallback(async (investorId: number) => {
    try {
      const success = await deleteConfirm.deleteInvestor()
      if (!success) return false

      showNotification('warning', '⏳ جاري حذف المستثمر...')
      const result = await deleteInvestor(investorId)
      if (result) {
        showNotification('success', '✅ تم حذف المستثمر بنجاح')
      }
      return result
    } catch (error) {
      console.error('خطأ في حذف المستثمر:', error)
      showNotification('error', '❌ حدث خطأ أثناء حذف المستثمر')
      return false
    }
  }, [deleteConfirm, deleteInvestor, showNotification])

  // دالة إضافة مستثمر مع معالجة الأخطاء
  const handleAddInvestor = useCallback(async (newInvestorData: Omit<Investor, 'id'>) => {
    try {
      showNotification('warning', 'جاري إضافة المستثمر...')
      const success = await addInvestor(newInvestorData)
      if (success) {
        showNotification('success', '✅ تم إضافة المستثمر الجديد بنجاح')
        closeAllForms()
      }
      return success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء إضافة المستثمر'
      showNotification('error', `❌ ${errorMessage}`)
      return false
    }
  }, [addInvestor, showNotification, closeAllForms])

  // دالة تحديث مستثمر مع معالجة الأخطاء
  const handleUpdateInvestor = useCallback(async (investorId: number, updates: Partial<Investor>) => {
    try {
      showNotification('warning', '⏳ جاري تحديث البيانات...')
      const success = await updateInvestor(investorId, updates)
      if (success) {
        showNotification('success', '✅ تم تحديث بيانات المستثمر بنجاح')
      }
      return success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث بيانات المستثمر'
      showNotification('error', `❌ ${errorMessage}`)
      return false
    }
  }, [updateInvestor, showNotification])

  return {
    // البيانات
    investors,
    isLoading,
    showAddForm,
    showDetailsForm,
    selectedInvestor,
    alert,

    // الوظائف
    addInvestor: handleAddInvestor,
    deleteInvestor: handleDeleteInvestor,
    updateInvestor: handleUpdateInvestor,
    openInvestorDetails,
    openInvestorTransactions,
    closeAllForms,
    toggleAddForm,

    // إدارة التنبيهات
    showNotification,

    // إحصائيات
    stats
  }
}
