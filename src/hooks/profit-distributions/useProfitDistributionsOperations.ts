import { useState, useCallback } from 'react'
import { ProfitCalculationService } from '../../pages/ProfitDistributions/ProfitCalculationService'

interface ProfitDistribution {
  investorId: number
  investorName: string
  availableProfit: number
  distributedAmount: string
  partnerProfit: number
  partnerAmount: string
}

/**
 * Hook مخصص لعمليات توزيعات الأرباح (حفظ وتصدير)
 */
export const useProfitDistributionsOperations = (distributions: ProfitDistribution[]) => {
  const [isSaving, setIsSaving] = useState(false)

  /**
   * حفظ التوزيعات
   */
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true)
      
      // التحقق من صحة البيانات
      const validation = ProfitCalculationService.validateDistributions(distributions)
      if (!validation.isValid) {
        return {
          success: false,
          message: `خطأ في البيانات: ${validation.errors.join(', ')}`
        }
      }

      // حفظ التوزيعات
      const saveResult = await ProfitCalculationService.saveDistributions(distributions)
      
      if (saveResult.success) {
        return {
          success: true,
          message: 'تم حفظ التوزيعات بنجاح'
        }
      } else {
        return {
          success: false,
          message: saveResult.message || 'فشل في حفظ التوزيعات'
        }
      }
    } catch (error) {
      console.error('خطأ في حفظ التوزيعات:', error)
      return {
        success: false,
        message: 'حدث خطأ أثناء حفظ التوزيعات'
      }
    } finally {
      setIsSaving(false)
    }
  }, [distributions])

  /**
   * تصدير التوزيعات
   */
  const handleExport = useCallback(() => {
    try {
      const exportResult = ProfitCalculationService.exportDistributions(distributions)
      
      if (exportResult.success) {
        return {
          success: true,
          message: 'تم تصدير البيانات بنجاح'
        }
      } else {
        return {
          success: false,
          message: exportResult.message || 'فشل في تصدير البيانات'
        }
      }
    } catch (error) {
      console.error('خطأ في تصدير التوزيعات:', error)
      return {
        success: false,
        message: 'حدث خطأ أثناء تصدير البيانات'
      }
    }
  }, [distributions])

  return {
    isSaving,
    handleSave,
    handleExport
  }
}
