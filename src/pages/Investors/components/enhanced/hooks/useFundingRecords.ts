import { useState, useEffect } from 'react'
import { FundingRecord } from '../../../types'
import { SupabaseDatabase } from '../../../../../utils/supabase-simple'

/**
 * Hook مخصص لإدارة سجلات التمويل
 * مسؤولية واحدة: جلب وإدارة سجلات التمويل
 */
export const useFundingRecords = (investorId: number) => {
  const [records, setRecords] = useState<FundingRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRecords = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await SupabaseDatabase.getFundingRecords(investorId)
      
      // تحويل البيانات إلى التنسيق المطلوب
      const convertedRecords: FundingRecord[] = data.map(item => ({
        id: item.id,
        investorId: item.investor_id,
        amount: item.amount,
        date: item.date,
        notes: item.notes || ''
      }))
      
      setRecords(convertedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (error) {
      console.error('خطأ في تحميل سجلات التمويل:', error)
      setError('فشل في تحميل سجلات التمويل')
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
      await SupabaseDatabase.addFundingRecord({
        investor_id: investorId,
        amount: recordData.amount,
        date: recordData.date,
        notes: recordData.notes
      })

      // إعادة تحميل البيانات
      await loadRecords()
      return true
    } catch (error) {
      console.error('خطأ في إضافة سجل التمويل:', error)
      throw new Error('فشل في إضافة السجل')
    }
  }

  const getTotalFunding = () => {
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
    getTotalFunding,
    refreshRecords: loadRecords
  }
}
