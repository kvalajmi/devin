import { useState, useEffect } from 'react'
import { SupabaseDatabase } from '../../../../../utils/supabase-simple'

interface PartnerWithdrawalRecord {
  id: number
  investorId: number
  amount: number
  date: string
  notes: string
}

/**
 * Hook مخصص لإدارة مسحوبات الشريك
 * مسؤولية واحدة: جلب وإدارة مسحوبات الشريك
 */
export const usePartnerWithdrawals = (investorId: number) => {
  const [records, setRecords] = useState<PartnerWithdrawalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRecords = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await SupabaseDatabase.getPartnerWithdrawalRecords(investorId)
      
      // تحويل البيانات إلى التنسيق المطلوب
      const convertedRecords: PartnerWithdrawalRecord[] = data.map(item => ({
        id: item.id,
        investorId: item.investor_id,
        amount: item.amount,
        date: item.date,
        notes: item.notes || ''
      }))
      
      setRecords(convertedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (error) {
      console.error('خطأ في تحميل مسحوبات الشريك:', error)
      setError('فشل في تحميل مسحوبات الشريك')
    } finally {
      setIsLoading(false)
    }
  }

  const addRecord = async (recordData: {
    amount: number
    date: string
    notes: string
  }) => {
    try {
      await SupabaseDatabase.addPartnerWithdrawalRecord({
        investor_id: investorId,
        amount: recordData.amount,
        date: recordData.date,
        notes: recordData.notes
      })

      // إعادة تحميل البيانات
      await loadRecords()
      return true
    } catch (error) {
      console.error('خطأ في إضافة مسحوبات الشريك:', error)
      throw new Error('فشل في إضافة السحب')
    }
  }

  const getTotalWithdrawals = () => {
    return records.reduce((sum, record) => sum + record.amount, 0)
  }

  useEffect(() => {
    if (investorId) {
      loadRecords()
    }
  }, [investorId])

  return {
    records,
    isLoading,
    error,
    addRecord,
    getTotalWithdrawals,
    refreshRecords: loadRecords
  }
}
