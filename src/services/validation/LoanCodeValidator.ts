import { SupabaseDatabase } from '../../utils/supabase-simple'

export class LoanCodeValidator {
  static async validateLoanCodeUniqueness(loanCode: string, excludeClientId?: number): Promise<{
    isValid: boolean
    message: string
  }> {
    try {
      if (!loanCode || loanCode.length !== 5) {
        return { isValid: false, message: 'كود القرض يجب أن يكون 5 أرقام بالضبط' }
      }

      const clients = await SupabaseDatabase.getClients()
      const existingClient = clients.find(client => 
        client.loan_code === loanCode && client.id !== excludeClientId
      )

      if (existingClient) {
        return { 
          isValid: false, 
          message: `كود القرض ${loanCode} مستخدم بالفعل للعميل: ${existingClient.name}` 
        }
      }

      return { isValid: true, message: 'كود القرض متاح' }
    } catch (error) {
      return { isValid: false, message: 'حدث خطأ في التحقق من كود القرض' }
    }
  }
}
