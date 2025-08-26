import { useState, useEffect, useCallback } from 'react'
import { FundingRecord, WithdrawalRecord, PartnerWithdrawalRecord, TransactionExpense, LawyerFee } from '../types'
import { SupabaseDatabase } from '../../../utils/supabase-simple'

interface UseInvestorDataProps {
  investorId: number
  showAlert: (type: 'success' | 'error' | 'warning', message: string) => void
}

interface UseInvestorDataReturn {
  fundingRecords: FundingRecord[]
  withdrawalRecords: WithdrawalRecord[]
  partnerWithdrawalRecords: PartnerWithdrawalRecord[]
  transactionExpenses: TransactionExpense[]
  lawyerFees: LawyerFee[]
  totalExpenses: number
  totalLawyerFees: number
  isLoading: boolean
  loadData: () => Promise<void>
}

export const useInvestorData = ({ investorId, showAlert }: UseInvestorDataProps): UseInvestorDataReturn => {
  const [fundingRecords, setFundingRecords] = useState<FundingRecord[]>([])
  const [withdrawalRecords, setWithdrawalRecords] = useState<WithdrawalRecord[]>([])
  const [partnerWithdrawalRecords, setPartnerWithdrawalRecords] = useState<PartnerWithdrawalRecord[]>([])
  const [transactionExpenses, setTransactionExpenses] = useState<TransactionExpense[]>([])
  const [lawyerFees, setLawyerFees] = useState<LawyerFee[]>([])
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [totalLawyerFees, setTotalLawyerFees] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // دالة جلب البيانات بشكل متوازي (أسرع!)
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)

      console.log('🚀 بدء جلب البيانات بشكل متوازي...')
      const startTime = performance.now()

      // جلب جميع البيانات بشكل متوازي بدلاً من متتالي
      const [
        fundingData,
        withdrawalData,
        partnerWithdrawalData,
        expensesData,
        feesData
      ] = await Promise.all([
        SupabaseDatabase.getFundingRecords(investorId),
        SupabaseDatabase.getWithdrawalRecords(investorId),
        SupabaseDatabase.getPartnerWithdrawalRecords(investorId),
        SupabaseDatabase.getTransactionExpenses(),
        SupabaseDatabase.getLawyerFees()
      ])

      // تحويل البيانات
      const convertedFunding: FundingRecord[] = fundingData.map(item => ({
        id: item.id,
        investorId: item.investor_id,
        amount: item.amount || 0,
        date: item.date || '',
        notes: item.notes || ''
      }))

      const convertedWithdrawals: WithdrawalRecord[] = withdrawalData.map(item => ({
        id: item.id,
        investorId: item.investor_id,
        amount: item.amount || 0,
        date: item.date || '',
        notes: item.notes || ''
      }))

      const convertedPartnerWithdrawals: PartnerWithdrawalRecord[] = partnerWithdrawalData.map(item => ({
        id: item.id,
        investorId: item.investor_id,
        amount: item.amount || 0,
        date: item.date || '',
        notes: item.notes || ''
      }))

      // حساب المجاميع
      const totalExpensesAmount = expensesData.reduce((sum, expense) => sum + (expense.amount || 0), 0)
      const totalLawyerFeesAmount = feesData.reduce((sum, fee) => sum + (fee.amount || 0), 0)

      // تحديث جميع الحالات دفعة واحدة لتقليل re-renders
      setFundingRecords(convertedFunding)
      setWithdrawalRecords(convertedWithdrawals)
      setPartnerWithdrawalRecords(convertedPartnerWithdrawals)
      setTransactionExpenses(expensesData)
      setLawyerFees(feesData)
      setTotalExpenses(totalExpensesAmount)
      setTotalLawyerFees(totalLawyerFeesAmount)

      const endTime = performance.now()
      console.log(`⚡ تم جلب البيانات في ${Math.round(endTime - startTime)}ms: ${convertedFunding.length} تمويل، ${convertedWithdrawals.length} سحب مستثمر، ${convertedPartnerWithdrawals.length} سحب شريك`)
      
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error)
      showAlert('error', 'حدث خطأ في جلب البيانات')
    } finally {
      setIsLoading(false)
    }
  }, [investorId, showAlert])

  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    fundingRecords,
    withdrawalRecords,
    partnerWithdrawalRecords,
    transactionExpenses,
    lawyerFees,
    totalExpenses,
    totalLawyerFees,
    isLoading,
    loadData
  }
}
