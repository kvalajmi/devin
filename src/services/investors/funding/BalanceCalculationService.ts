import { FundingRecordsService } from './FundingRecordsService'
import { WithdrawalRecordsService } from './WithdrawalRecordsService'

/**
 * خدمة حساب الرصيد المتاح للمستثمرين
 */
export class BalanceCalculationService {
  /**
   * حساب الرصيد المتاح لمستثمر
   */
  static async getAvailableBalance(investorId: number): Promise<number> {
    try {
      console.log('💰 جاري حساب الرصيد المتاح للمستثمر ID:', investorId)
      
      // حساب إجمالي التمويل والسحوبات بشكل متوازي
      const [totalFunding, totalWithdrawals] = await Promise.all([
        FundingRecordsService.getTotalFunding(investorId),
        WithdrawalRecordsService.getTotalWithdrawals(investorId)
      ])

      const availableBalance = Math.max(totalFunding - totalWithdrawals, 0)
      console.log(`✅ الرصيد المتاح للمستثمر ${investorId}: ${availableBalance}`)
      
      return availableBalance
    } catch (error) {
      console.error('❌ خطأ في حساب الرصيد المتاح:', error)
      return 0
    }
  }

  /**
   * حساب إحصائيات التمويل الشاملة لمستثمر
   */
  static async getFundingStats(investorId: number): Promise<{
    totalFunding: number
    totalWithdrawals: number
    availableBalance: number
    fundingCount: number
    withdrawalCount: number
  }> {
    try {
      console.log('📊 جاري حساب إحصائيات التمويل للمستثمر ID:', investorId)
      
      const [
        fundingRecords,
        withdrawalRecords,
        totalFunding,
        totalWithdrawals
      ] = await Promise.all([
        FundingRecordsService.getFundingRecords(investorId),
        WithdrawalRecordsService.getWithdrawalRecords(investorId),
        FundingRecordsService.getTotalFunding(investorId),
        WithdrawalRecordsService.getTotalWithdrawals(investorId)
      ])

      const stats = {
        totalFunding,
        totalWithdrawals,
        availableBalance: Math.max(totalFunding - totalWithdrawals, 0),
        fundingCount: fundingRecords.length,
        withdrawalCount: withdrawalRecords.length
      }

      console.log('✅ إحصائيات التمويل:', stats)
      return stats
    } catch (error) {
      console.error('❌ خطأ في حساب إحصائيات التمويل:', error)
      return {
        totalFunding: 0,
        totalWithdrawals: 0,
        availableBalance: 0,
        fundingCount: 0,
        withdrawalCount: 0
      }
    }
  }
}
