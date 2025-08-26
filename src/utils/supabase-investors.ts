import { InvestorsAPI } from './api/InvestorsAPI'

/**
 * خدمة قاعدة البيانات للمستثمرين
 * تم فصلها حسب القاعدة الذهبية
 */
export class SupabaseDatabaseInvestors {
  static async getInvestors(): Promise<any[]> {
    return InvestorsAPI.getInvestors()
  }

  static async addInvestor(investor: any): Promise<number | null> {
    return InvestorsAPI.addInvestor(investor)
  }

  static async updateInvestor(investorId: number, updates: any): Promise<boolean> {
    return InvestorsAPI.updateInvestor(investorId, updates)
  }

  static async deleteInvestor(investorId: number): Promise<boolean> {
    return InvestorsAPI.deleteInvestor(investorId)
  }

  static async getInvestorById(investorId: number): Promise<any | null> {
    return InvestorsAPI.getInvestorById(investorId)
  }

  static async searchInvestors(searchTerm: string): Promise<any[]> {
    return InvestorsAPI.searchInvestors(searchTerm)
  }

  static async addFundingRecord(record: any): Promise<number | null> {
    return InvestorsAPI.addFundingRecord(record)
  }

  static async getFundingRecords(investorId?: number): Promise<any[]> {
    return InvestorsAPI.getFundingRecords(investorId)
  }

  static async addWithdrawalRecord(record: any): Promise<number | null> {
    return InvestorsAPI.addWithdrawalRecord(record)
  }

  static async getWithdrawalRecords(investorId?: number): Promise<any[]> {
    return InvestorsAPI.getWithdrawalRecords(investorId)
  }

  static async addPartnerWithdrawalRecord(record: any): Promise<number | null> {
    return InvestorsAPI.addPartnerWithdrawalRecord(record)
  }

  static async getPartnerWithdrawalRecords(investorId?: number): Promise<any[]> {
    return InvestorsAPI.getPartnerWithdrawalRecords(investorId)
  }

  static async getAvailableBalance(investorId: number): Promise<number> {
    return InvestorsAPI.getAvailableBalance(investorId)
  }
}
