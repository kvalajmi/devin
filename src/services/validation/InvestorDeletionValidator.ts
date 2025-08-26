import { SupabaseDatabase } from '../../utils/supabase-simple'

export class InvestorDeletionValidator {
  static async canDeleteInvestor(investorId: number): Promise<{
    canDelete: boolean
    message: string
  }> {
    try {
      const [clients, funding, withdrawals] = await Promise.all([
        SupabaseDatabase.getClients(),
        SupabaseDatabase.getFundingRecords(investorId),
        SupabaseDatabase.getWithdrawalRecords(investorId)
      ])

      const hasClients = clients.some(client => client.investor_id === investorId)
      const hasFinancialActivity = funding.length > 0 || withdrawals.length > 0

      if (hasClients || hasFinancialActivity) {
        return {
          canDelete: false,
          message: 'لا يمكن حذف المستثمر لوجود معاملات مالية مرتبطة به'
        }
      }

      return { canDelete: true, message: 'يمكن حذف المستثمر' }
    } catch (error) {
      return { canDelete: false, message: 'حدث خطأ في التحقق من إمكانية الحذف' }
    }
  }
}
