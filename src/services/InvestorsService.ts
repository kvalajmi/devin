// واجهة موحدة لخدمات المستثمرين
// تم تقسيم الملف الأصلي إلى خدمات متخصصة حسب القاعدة الذهبية

import { InvestorOperations } from './investors/InvestorOperations'
import { FundingOperations } from './investors/FundingOperations'

/**
 * خدمة إدارة المستثمرين الموحدة
 * تعمل كواجهة للخدمات المتخصصة
 */
export class InvestorsService {
  // عمليات المستثمرين الأساسية
  static async getInvestors(): Promise<any[]> {
    return InvestorOperations.getInvestors()
  }

  static async addInvestor(investor: any): Promise<number | null> {
    return InvestorOperations.addInvestor(investor)
  }

  static async updateInvestor(investorId: number, updates: any): Promise<boolean> {
    return InvestorOperations.updateInvestor(investorId, updates)
  }

  static async deleteInvestor(investorId: number): Promise<boolean> {
    return InvestorOperations.deleteInvestor(investorId)
  }

  static async getInvestorById(investorId: number): Promise<any | null> {
    return InvestorOperations.getInvestorById(investorId)
  }

  static async searchInvestors(searchTerm: string): Promise<any[]> {
    return InvestorOperations.searchInvestors(searchTerm)
  }

  static async deleteAllInvestors(): Promise<boolean> {
    return InvestorOperations.deleteAllInvestors()
  }

  // عمليات التمويل والسحوبات
  static async addFundingRecord(record: any): Promise<number | null> {
    return FundingOperations.addFundingRecord(record)
  }

  static async getFundingRecords(investorId?: number): Promise<any[]> {
    return FundingOperations.getFundingRecords(investorId)
  }

  static async addWithdrawalRecord(record: any): Promise<number | null> {
    return FundingOperations.addWithdrawalRecord(record)
  }

  static async getWithdrawalRecords(investorId?: number): Promise<any[]> {
    return FundingOperations.getWithdrawalRecords(investorId)
  }

  static async addPartnerWithdrawalRecord(record: any): Promise<number | null> {
    return FundingOperations.addPartnerWithdrawalRecord(record)
  }

  static async getPartnerWithdrawalRecords(investorId?: number): Promise<any[]> {
    return FundingOperations.getPartnerWithdrawalRecords(investorId)
  }

  // العمليات المالية المتقدمة
  static async getTotalFunding(investorId: number): Promise<number> {
    return FundingOperations.getTotalFunding(investorId)
  }

  static async getTotalWithdrawals(investorId: number): Promise<number> {
    return FundingOperations.getTotalWithdrawals(investorId)
  }

  static async getAvailableBalance(investorId: number): Promise<number> {
    return FundingOperations.getAvailableBalance(investorId)
  }

  /**
   * الحصول على ملخص مالي شامل للمستثمر
   */
  static async getInvestorFinancialSummary(investorId: number): Promise<{
    totalFunding: number
    totalWithdrawals: number
    availableBalance: number
    fundingRecordsCount: number
    withdrawalRecordsCount: number
    partnerWithdrawalRecordsCount: number
  }> {
    try {
      const [
        totalFunding,
        totalWithdrawals,
        fundingRecords,
        withdrawalRecords,
        partnerWithdrawalRecords
      ] = await Promise.all([
        this.getTotalFunding(investorId),
        this.getTotalWithdrawals(investorId),
        this.getFundingRecords(investorId),
        this.getWithdrawalRecords(investorId),
        this.getPartnerWithdrawalRecords(investorId)
      ])

      return {
        totalFunding,
        totalWithdrawals,
        availableBalance: totalFunding - totalWithdrawals,
        fundingRecordsCount: fundingRecords.length,
        withdrawalRecordsCount: withdrawalRecords.length,
        partnerWithdrawalRecordsCount: partnerWithdrawalRecords.length
      }
    } catch (error) {
      console.error('❌ خطأ في getInvestorFinancialSummary:', error)
      return {
        totalFunding: 0,
        totalWithdrawals: 0,
        availableBalance: 0,
        fundingRecordsCount: 0,
        withdrawalRecordsCount: 0,
        partnerWithdrawalRecordsCount: 0
      }
    }
  }

  /**
   * التحقق من صحة بيانات المستثمر
   */
  static validateInvestorData(investor: any): { isValid: boolean, errors: string[] } {
    const errors: string[] = []

    if (!investor.investorName || investor.investorName.trim().length === 0) {
      errors.push('اسم المستثمر مطلوب')
    }

    if (!investor.civilId || investor.civilId.trim().length === 0) {
      errors.push('الرقم المدني مطلوب')
    }

    if (investor.civilId && investor.civilId.length !== 12) {
      errors.push('الرقم المدني يجب أن يكون 12 رقماً')
    }

    if (!investor.partnerName || investor.partnerName.trim().length === 0) {
      errors.push('اسم الشريك مطلوب')
    }

    if (!investor.partnerPercentage || investor.partnerPercentage < 0 || investor.partnerPercentage > 100) {
      errors.push('نسبة الشريك يجب أن تكون بين 0 و 100')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}