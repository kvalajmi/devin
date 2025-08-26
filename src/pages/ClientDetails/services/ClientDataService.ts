import { Client } from '../../../utils/database'
import { SupabaseDatabase } from '../../../utils/supabase-simple'

/**
 * خدمة إدارة بيانات العميل
 */
export class ClientDataService {
  /**
   * تحميل بيانات العميل
   */
  static async loadClientData(clientId: string): Promise<Client | null> {
    try {
      console.log('🔍 تحميل بيانات العميل ID:', clientId)
      
      const foundClient = await SupabaseDatabase.getClientById(parseInt(clientId))
      
      if (foundClient) {
        const convertedClient = SupabaseDatabase.convertSupabaseToClient(foundClient)
        console.log('✅ تم تحميل بيانات العميل بنجاح:', convertedClient.name)
        return convertedClient
      } else {
        console.warn('⚠️ لم يتم العثور على العميل')
        return null
      }
    } catch (error) {
      console.error('❌ خطأ في تحميل بيانات العميل:', error)
      throw error
    }
  }

  /**
   * تحديث بيانات العميل
   */
  static async updateClient(clientId: number, updates: Partial<Client>): Promise<boolean> {
    try {
      console.log('📝 تحديث بيانات العميل ID:', clientId)
      
      const success = await SupabaseDatabase.updateClient(clientId, updates)
      
      if (success) {
        console.log('✅ تم تحديث بيانات العميل بنجاح')
      } else {
        console.error('❌ فشل في تحديث بيانات العميل')
      }
      
      return success
    } catch (error) {
      console.error('❌ خطأ في تحديث بيانات العميل:', error)
      throw error
    }
  }

  /**
   * حذف العميل
   */
  static async deleteClient(clientId: number): Promise<boolean> {
    try {
      console.log('🗑️ حذف العميل ID:', clientId)
      
      const success = await SupabaseDatabase.deleteClient(clientId)
      
      if (success) {
        console.log('✅ تم حذف العميل بنجاح')
      } else {
        console.error('❌ فشل في حذف العميل')
      }
      
      return success
    } catch (error) {
      console.error('❌ خطأ في حذف العميل:', error)
      throw error
    }
  }

  /**
   * حساب الإحصائيات المالية للعميل
   */
  static calculateClientStats(
    payments: any[], 
    expenses: any[], 
    lawyerFees: any[], 
    client: Client | null
  ): {
    totalPaid: number
    totalExpenses: number
    totalLawyerFees: number
    netPaid: number
    remainingAmount: number
    paymentProgress: number
  } {
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalLawyerFees = lawyerFees.reduce((sum, fee) => sum + fee.amount, 0)
    const netPaid = totalPaid - totalExpenses - totalLawyerFees
    
    const totalAmount = client?.totalAmount || 0
    const remainingAmount = Math.max(totalAmount - netPaid, 0)
    const paymentProgress = totalAmount > 0 ? (netPaid / totalAmount) * 100 : 0

    return {
      totalPaid,
      totalExpenses,
      totalLawyerFees,
      netPaid,
      remainingAmount,
      paymentProgress: Math.min(paymentProgress, 100)
    }
  }

  /**
   * التحقق من صحة بيانات العميل
   */
  static validateClientData(client: Partial<Client>): { isValid: boolean, errors: string[] } {
    const errors: string[] = []

    if (!client.name || client.name.trim().length === 0) {
      errors.push('اسم العميل مطلوب')
    }

    if (!client.civilId || client.civilId.trim().length === 0) {
      errors.push('الرقم المدني مطلوب')
    }

    if (!client.phoneNumber || client.phoneNumber.trim().length === 0) {
      errors.push('رقم الهاتف مطلوب')
    }

    if (client.loanAmount && client.loanAmount <= 0) {
      errors.push('مبلغ القرض يجب أن يكون أكبر من صفر')
    }

    if (client.profit && client.profit < 0) {
      errors.push('الربح لا يمكن أن يكون سالباً')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * إنشاء كود معاملة جديد
   */
  static generateTransactionCode(clientId: number): string {
    const timestamp = Date.now().toString().slice(-6)
    return `k${clientId.toString().padStart(5, '0')}-${timestamp}`
  }

  /**
   * تنسيق بيانات العميل للعرض
   */
  static formatClientForDisplay(client: Client): any {
    return {
      ...client,
      formattedLoanAmount: client.loanAmount?.toLocaleString('ar-KW') + ' د.ك',
      formattedProfit: client.profit?.toLocaleString('ar-KW') + ' د.ك',
      formattedTotalAmount: client.totalAmount?.toLocaleString('ar-KW') + ' د.ك',
      formattedTotalPaid: client.totalPaid?.toLocaleString('ar-KW') + ' د.ك',
      formattedTotalRemaining: client.totalRemaining?.toLocaleString('ar-KW') + ' د.ك',
      formattedFundingDate: new Date(client.fundingDate).toLocaleDateString('ar-KW'),
      formattedFirstInstallmentDate: new Date(client.firstInstallmentDate).toLocaleDateString('ar-KW')
    }
  }
}
