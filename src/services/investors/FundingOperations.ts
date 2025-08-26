// واجهة موحدة لعمليات التمويل والسحوبات - محسّنة حسب القاعدة الذهبية
// تم تقسيم الملف الأصلي إلى خدمات متخصصة منفصلة

import { FundingRecordsService } from './funding/FundingRecordsService'
import { WithdrawalRecordsService } from './funding/WithdrawalRecordsService'
import { PartnerWithdrawalService } from './funding/PartnerWithdrawalService'
import { BalanceCalculationService } from './funding/BalanceCalculationService'

/**
 * عمليات التمويل والسحوبات للمستثمرين - واجهة موحدة
 * تعمل كواجهة للخدمات المتخصصة المنفصلة
 */
export class FundingOperations {
  // ===== عمليات التمويل =====
  static async addFundingRecord(record: any): Promise<number | null> {
    return FundingRecordsService.addFundingRecord(record)
  }

  static async getFundingRecords(investorId?: number): Promise<any[]> {
    return FundingRecordsService.getFundingRecords(investorId)
  }

  static async updateFundingRecord(recordId: number, updates: any): Promise<boolean> {
    return FundingRecordsService.updateFundingRecord(recordId, updates)
  }

  static async deleteFundingRecord(recordId: number): Promise<boolean> {
    return FundingRecordsService.deleteFundingRecord(recordId)
  }

  // ===== عمليات السحوبات =====
  static async addWithdrawalRecord(record: any): Promise<number | null> {
    return WithdrawalRecordsService.addWithdrawalRecord(record)
  }

  static async getWithdrawalRecords(investorId?: number): Promise<any[]> {
    return WithdrawalRecordsService.getWithdrawalRecords(investorId)
  }

  static async updateWithdrawalRecord(recordId: number, updates: any): Promise<boolean> {
    return WithdrawalRecordsService.updateWithdrawalRecord(recordId, updates)
  }

  static async deleteWithdrawalRecord(recordId: number): Promise<boolean> {
    return WithdrawalRecordsService.deleteWithdrawalRecord(recordId)
  }

  // ===== عمليات سحوبات الشريك =====
  static async addPartnerWithdrawalRecord(record: any): Promise<number | null> {
    return PartnerWithdrawalService.addPartnerWithdrawalRecord(record)
  }

  static async getPartnerWithdrawalRecords(investorId?: number): Promise<any[]> {
    return PartnerWithdrawalService.getPartnerWithdrawalRecords(investorId)
  }

  static async updatePartnerWithdrawalRecord(recordId: number, updates: any): Promise<boolean> {
    return PartnerWithdrawalService.updatePartnerWithdrawalRecord(recordId, updates)
  }

  static async deletePartnerWithdrawalRecord(recordId: number): Promise<boolean> {
    return PartnerWithdrawalService.deletePartnerWithdrawalRecord(recordId)
  }

  // ===== حسابات الرصيد والإحصائيات =====
  static async getAvailableBalance(investorId: number): Promise<number> {
    return BalanceCalculationService.getAvailableBalance(investorId)
  }

  static async getFundingStats(investorId: number): Promise<{
    totalFunding: number
    totalWithdrawals: number
    availableBalance: number
    fundingCount: number
    withdrawalCount: number
  }> {
    return BalanceCalculationService.getFundingStats(investorId)
  }

  // ===== وظائف مساعدة للتوافق مع الكود القديم =====
  static async getTotalFunding(investorId: number): Promise<number> {
    return FundingRecordsService.getTotalFunding(investorId)
  }

  static async getTotalWithdrawals(investorId: number): Promise<number> {
    return WithdrawalRecordsService.getTotalWithdrawals(investorId)
  }

  static async getTotalPartnerWithdrawals(investorId: number): Promise<number> {
    return PartnerWithdrawalService.getTotalPartnerWithdrawals(investorId)
  }
}
