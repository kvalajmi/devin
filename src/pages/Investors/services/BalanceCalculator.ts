import { SupabaseDatabase } from '../../../utils/supabase-simple'

/**
 * خدمة حساب الرصيد الأساسية
 * مسؤولية واحدة: حساب الرصيد وفقاً للمعادلة المحددة
 */
export class BalanceCalculator {
  /**
   * حساب الرصيد الحالي للمستثمر
   */
  static async calculateCurrentBalance(investorId: number): Promise<{
    currentBalance: number
    breakdown: {
      actualFunding: number
      totalCollection: number
      totalLoanAmount: number
      partnerWithdrawals: number
      investorWithdrawals: number
      totalExpenses: number
      totalLawyerFees: number
    }
  }> {
    try {
      console.log('💰 بدء حساب الرصيد الحالي للمستثمر:', investorId)

      // جلب جميع البيانات المطلوبة بشكل متوازي
      const [
        fundingRecords,
        withdrawalRecords,
        partnerWithdrawalRecords,
        clients,
        payments,
        expenses,
        lawyerFees
      ] = await Promise.all([
        SupabaseDatabase.getFundingRecords(investorId),
        SupabaseDatabase.getWithdrawalRecords(investorId),
        SupabaseDatabase.getPartnerWithdrawalRecords(investorId),
        SupabaseDatabase.getClients(),
        SupabaseDatabase.getPayments(),
        SupabaseDatabase.getTransactionExpenses(),
        SupabaseDatabase.getLawyerFees()
      ])

      // 1. التمويل الفعلي
      const actualFunding = fundingRecords.reduce((sum, record) => sum + (record.amount || 0), 0)

      const investorClients = clients.filter(client => client.investor_id === investorId)
      const clientIds = investorClients.map(client => client.id)

      // 3. إجمالي التحصيل (المدفوعات للعملاء التابعين لهذا المستثمر)
      const investorPayments = payments.filter(payment => clientIds.includes(payment.clientId))
      const totalCollection = investorPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)

      // 4. إجمالي مبلغ القروض (للعملاء التابعين لهذا المستثمر)
      const totalLoanAmount = investorClients.reduce((sum, client) => sum + (client.loanAmount || 0), 0)

      // 5. مسحوبات الشريك
      const partnerWithdrawals = partnerWithdrawalRecords.reduce((sum, record) => sum + (record.amount || 0), 0)

      // 6. مسحوبات المستثمر
      const investorWithdrawals = withdrawalRecords.reduce((sum, record) => sum + (record.amount || 0), 0)

      // 7. المصاريف العادية (للعملاء التابعين لهذا المستثمر)
      const investorExpenses = expenses.filter(expense => clientIds.includes(expense.clientId))
      const totalExpenses = investorExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)

      // 8. أتعاب المحامي (للعملاء التابعين لهذا المستثمر)
      const investorLawyerFees = lawyerFees.filter(fee => clientIds.includes(fee.clientId))
      const totalLawyerFees = investorLawyerFees.reduce((sum, fee) => sum + (fee.amount || 0), 0)

      // حساب الرصيد النهائي
      const currentBalance = actualFunding + totalCollection - totalLoanAmount - partnerWithdrawals - investorWithdrawals - totalExpenses - totalLawyerFees

      const result = {
        currentBalance,
        breakdown: {
          actualFunding,
          totalCollection,
          totalLoanAmount,
          partnerWithdrawals,
          investorWithdrawals,
          totalExpenses,
          totalLawyerFees
        }
      }

      console.log('✅ تم حساب الرصيد بنجاح:', result)
      return result

    } catch (error) {
      console.error('❌ خطأ في حساب الرصيد:', error)
      return {
        currentBalance: 0,
        breakdown: {
          actualFunding: 0,
          totalCollection: 0,
          totalLoanAmount: 0,
          partnerWithdrawals: 0,
          investorWithdrawals: 0,
          totalExpenses: 0,
          totalLawyerFees: 0
        }
      }
    }
  }
}
