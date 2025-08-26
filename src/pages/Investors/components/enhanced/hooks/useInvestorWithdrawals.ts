import { useState, useEffect } from 'react'
import { SupabaseDatabase } from '../../../../../utils/supabase-simple'

interface WithdrawalRecord {
  id: number
  investorId: number
  amount: number
  date: string
  notes: string
}

/**
 * Hook مخصص لإدارة مسحوبات المستثمر
 * مسؤولية واحدة: جلب وإدارة مسحوبات المستثمر
 */
export const useInvestorWithdrawals = (investorId: number) => {
  const [records, setRecords] = useState<WithdrawalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRecords = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await SupabaseDatabase.getWithdrawalRecords(investorId)
      
      // تحويل البيانات إلى التنسيق المطلوب
      const convertedRecords: WithdrawalRecord[] = data.map(item => ({
        id: item.id,
        investorId: item.investor_id,
        amount: item.amount,
        date: item.date,
        notes: item.notes || ''
      }))
      
      setRecords(convertedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (error) {
      console.error('خطأ في تحميل مسحوبات المستثمر:', error)
      setError('فشل في تحميل مسحوبات المستثمر')
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
      await SupabaseDatabase.addWithdrawalRecord({
        investor_id: investorId,
        amount: recordData.amount,
        date: recordData.date,
        notes: recordData.notes
      })

      // إعادة تحميل البيانات
      await loadRecords()
      return true
    } catch (error) {
      console.error('خطأ في إضافة مسحوبات المستثمر:', error)
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
