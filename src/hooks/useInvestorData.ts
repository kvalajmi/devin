import { useState, useCallback, useEffect } from 'react'
import { SupabaseDatabase } from '../utils/supabase-simple'
import { Investor } from '../pages/Investors/types'

/**
 * Hook مخصص لإدارة بيانات المستثمرين
 * مسؤولية واحدة: إدارة البيانات فقط
 */
export const useInvestorData = () => {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // جلب البيانات من قاعدة البيانات
  const loadInvestors = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await SupabaseDatabase.getInvestors()

      // تحويل البيانات من تنسيق Supabase إلى تنسيق المكون
      const convertedInvestors: Investor[] = data.map(item => ({
        id: item.id,
        investorName: item.investor_name || '',
        partnerName: item.partner_name || '',
        partnershipType: item.partnership_type || 'نسبة',
        investorPercentage: item.investor_percentage || 50,
        partnerPercentage: item.partner_percentage || 50,
        civilId: item.civil_id || '',
        joinDate: item.join_date || ''
      }))

      setInvestors(convertedInvestors)
      console.log(`✅ تم جلب ${convertedInvestors.length} مستثمر من قاعدة البيانات`)
    } catch (error) {
      console.error('خطأ في جلب المستثمرين:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // تحميل البيانات عند بدء التشغيل
  useEffect(() => {
    loadInvestors()
  }, [loadInvestors])

  // دوال إدارة المستثمرين
  const addInvestor = useCallback(async (newInvestorData: Omit<Investor, 'id'>) => {
    try {
      // التحقق من صحة البيانات
      if (!newInvestorData.investorName.trim() || !newInvestorData.partnerName.trim() || !newInvestorData.civilId.trim()) {
        throw new Error('يرجى ملء جميع الحقول المطلوبة')
      }

      // التحقق من عدم تكرار الرقم المدني
      if (investors.some(inv => inv.civilId === newInvestorData.civilId)) {
        throw new Error('الرقم المدني موجود مسبقاً')
      }

      // إضافة المستثمر الجديد إلى قاعدة البيانات
      const investorId = await SupabaseDatabase.addInvestor({
        investor_name: newInvestorData.investorName,
        partner_name: newInvestorData.partnerName,
        partnership_type: newInvestorData.partnershipType,
        investor_percentage: newInvestorData.investorPercentage,
        partner_percentage: 100 - newInvestorData.investorPercentage,
        civil_id: newInvestorData.civilId,
        join_date: newInvestorData.joinDate
      })

      if (investorId) {
        const newInvestor: Investor = {
          id: investorId,
          ...newInvestorData,
          partnerPercentage: 100 - newInvestorData.investorPercentage
        }

        setInvestors(prev => [...prev, newInvestor])
        console.log('✅ تم إضافة المستثمر الجديد:', newInvestor)
        return true
      } else {
        throw new Error('فشل في إضافة المستثمر')
      }
    } catch (error) {
      console.error('خطأ في إضافة المستثمر:', error)
      throw error
    }
  }, [investors])

  const updateInvestor = useCallback(async (investorId: number, updates: Partial<Investor>) => {
    try {
      // تحويل البيانات إلى تنسيق Supabase
      const supabaseUpdates: any = {}
      
      if (updates.investorName) supabaseUpdates.investor_name = updates.investorName
      if (updates.partnerName) supabaseUpdates.partner_name = updates.partnerName
      if (updates.partnershipType) supabaseUpdates.partnership_type = updates.partnershipType
      if (updates.investorPercentage !== undefined) {
        supabaseUpdates.investor_percentage = updates.investorPercentage
        supabaseUpdates.partner_percentage = 100 - updates.investorPercentage
      }
      if (updates.civilId) supabaseUpdates.civil_id = updates.civilId
      if (updates.joinDate) supabaseUpdates.join_date = updates.joinDate

      const success = await SupabaseDatabase.updateInvestor(investorId, supabaseUpdates)
      
      if (success) {
        setInvestors(prev => prev.map(inv => 
          inv.id === investorId 
            ? { ...inv, ...updates, partnerPercentage: updates.investorPercentage ? 100 - updates.investorPercentage : inv.partnerPercentage }
            : inv
        ))
        console.log('✅ تم تحديث بيانات المستثمر:', updates)
        return true
      } else {
        throw new Error('فشل في تحديث بيانات المستثمر')
      }
    } catch (error) {
      console.error('خطأ في تحديث المستثمر:', error)
      throw error
    }
  }, [])

  const deleteInvestor = useCallback(async (investorId: number) => {
    try {
      const success = await SupabaseDatabase.deleteInvestor(investorId)
      
      if (success) {
        setInvestors(prev => prev.filter(inv => inv.id !== investorId))
        console.log('✅ تم حذف المستثمر بنجاح')
        return true
      } else {
        throw new Error('فشل في حذف المستثمر')
      }
    } catch (error) {
      console.error('خطأ في حذف المستثمر:', error)
      throw error
    }
  }, [])

  return {
    // البيانات
    investors,
    isLoading,
    
    // الوظائف
    loadInvestors,
    addInvestor,
    updateInvestor,
    deleteInvestor
  }
}
