import { useEffect } from 'react'

// استيراد الhooks المقسمة
import {
  useProfitDistributionsData,
  useProfitDistributionsActions,
  useProfitDistributionsOperations,
  useProfitDistributionsStats
} from './profit-distributions'

/**
 * Hook مخصص موحد لإدارة توزيعات الأرباح
 * تم تقسيمه إلى hooks متخصصة حسب القاعدة الذهبية
 */
export const useProfitDistributions = () => {
  // استخدام hooks البيانات
  const {
    distributions,
    setDistributions,
    isLoading,
    error,
    loadDistributionsData,
    reloadData,
    clearError
  } = useProfitDistributionsData()

  // استخدام hooks الإجراءات
  const {
    handleDistributedAmountChange,
    handlePartnerAmountChange,
    handleReset,
    handleAutoDistribute
  } = useProfitDistributionsActions(distributions, setDistributions)

  // استخدام hooks العمليات
  const {
    isSaving,
    handleSave,
    handleExport
  } = useProfitDistributionsOperations(distributions)

  // استخدام hooks الإحصائيات
  const {
    stats,
    isDistributionComplete,
    hasDistributionErrors
  } = useProfitDistributionsStats(distributions)

  // تحميل البيانات عند بدء التشغيل
  useEffect(() => {
    loadDistributionsData()
  }, [loadDistributionsData])

  return {
    // البيانات
    distributions,
    isLoading,
    isSaving,
    error,

    // الإحصائيات
    stats,
    isDistributionComplete,
    hasDistributionErrors,

    // الوظائف
    loadDistributionsData,
    reloadData,
    handleDistributedAmountChange,
    handlePartnerAmountChange,
    handleReset,
    handleAutoDistribute,
    handleSave,
    handleExport,

    // إدارة الأخطاء
    clearError
  }
}
