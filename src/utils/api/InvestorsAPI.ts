import { InvestorsService } from '../../services/InvestorsService'

/**
 * واجهة برمجة التطبيقات لإدارة المستثمرين
 */
export class InvestorsAPI {
  // ===== عمليات المستثمرين الأساسية =====
  static async getInvestors(): Promise<any[]> {
    return InvestorsService.getInvestors()
  }

  static async addInvestor(investor: any): Promise<number | null> {
    return InvestorsService.addInvestor(investor)
  }

  static async updateInvestor(investorId: number, updates: any): Promise<boolean> {
    return InvestorsService.updateInvestor(investorId, updates)
  }

  static async deleteInvestor(investorId: number): Promise<boolean> {
    return InvestorsService.deleteInvestor(investorId)
  }

  static async getInvestorById(investorId: number): Promise<any | null> {
    return InvestorsService.getInvestorById(investorId)
  }

  static async searchInvestors(searchTerm: string): Promise<any[]> {
    return InvestorsService.searchInvestors(searchTerm)
  }

  static async deleteAllInvestors(): Promise<boolean> {
    return InvestorsService.deleteAllInvestors()
  }

  // ===== عمليات التمويل والسحوبات =====
  static async addFundingRecord(record: any): Promise<number | null> {
    return InvestorsService.addFundingRecord(record)
  }

  static async getFundingRecords(investorId?: number): Promise<any[]> {
    return InvestorsService.getFundingRecords(investorId)
  }

  static async addWithdrawalRecord(record: any): Promise<number | null> {
    return InvestorsService.addWithdrawalRecord(record)
  }

  static async getWithdrawalRecords(investorId?: number): Promise<any[]> {
    return InvestorsService.getWithdrawalRecords(investorId)
  }

  static async addPartnerWithdrawalRecord(record: any): Promise<number | null> {
    return InvestorsService.addPartnerWithdrawalRecord(record)
  }

  static async getPartnerWithdrawalRecords(investorId?: number): Promise<any[]> {
    return InvestorsService.getPartnerWithdrawalRecords(investorId)
  }

  static async getAvailableBalance(investorId: number): Promise<number> {
    return InvestorsService.getAvailableBalance(investorId)
  }

  static async updateFundingRecord(recordId: number, updates: any): Promise<boolean> {
    return InvestorsService.updateFundingRecord(recordId, updates)
  }

  static async deleteFundingRecord(recordId: number): Promise<boolean> {
    return InvestorsService.deleteFundingRecord(recordId)
  }

  static async updateWithdrawalRecord(recordId: number, updates: any): Promise<boolean> {
    return InvestorsService.updateWithdrawalRecord(recordId, updates)
  }

  static async deleteWithdrawalRecord(recordId: number): Promise<boolean> {
    return InvestorsService.deleteWithdrawalRecord(recordId)
  }

  static async updatePartnerWithdrawalRecord(recordId: number, updates: any): Promise<boolean> {
    return InvestorsService.updatePartnerWithdrawalRecord(recordId, updates)
  }

  static async deletePartnerWithdrawalRecord(recordId: number): Promise<boolean> {
    return InvestorsService.deletePartnerWithdrawalRecord(recordId)
  }
}
