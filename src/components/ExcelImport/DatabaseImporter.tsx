import { SupabaseDatabase } from '../../utils/supabase-simple'
import { ImportedClient } from './DataParser'

/**
 * فئة استيراد البيانات إلى قاعدة البيانات
 */
export class DatabaseImporter {
  private onProgress: (progress: number, step: string) => void
  private investorId?: string

  constructor(onProgress: (progress: number, step: string) => void, investorId?: string) {
    this.onProgress = onProgress
    this.investorId = investorId
  }

  /**
   * استيراد جميع العملاء إلى قاعدة البيانات
   */
  async importClients(clients: ImportedClient[]): Promise<void> {
    if (clients.length === 0) {
      throw new Error('لا توجد بيانات عملاء للاستيراد')
    }

    this.onProgress(50, 'بدء استيراد البيانات إلى قاعدة البيانات...')

    for (let i = 0; i < clients.length; i++) {
      const client = clients[i]
      const progress = 50 + ((i + 1) / clients.length) * 45
      
      this.onProgress(
        progress, 
        `استيراد العميل ${i + 1} من ${clients.length}: ${client.name}`
      )

      try {
        await this.importSingleClient(client)
        console.log(`✅ تم استيراد العميل: ${client.name}`)
      } catch (error) {
        console.error(`❌ خطأ في استيراد العميل ${client.name}:`, error)
        throw new Error(`فشل في استيراد العميل: ${client.name}`)
      }
    }

    this.onProgress(95, 'جاري الانتهاء من الاستيراد...')
  }

  /**
   * استيراد عميل واحد مع جميع بياناته
   */
  private async importSingleClient(client: ImportedClient): Promise<void> {
    try {
      // 1. إدراج العميل
      const clientId = await this.insertClient(client)
      
      // 2. إدراج المدفوعات
      if (client.payments.length > 0) {
        await this.insertPayments(clientId, client.payments)
      }
      
      // 3. إدراج المصروفات
      if (client.expenses.length > 0) {
        await this.insertExpenses(clientId, client.expenses)
      }
      
      // 4. إدراج أتعاب المحامي
      if (client.lawyerFees.length > 0) {
        await this.insertLawyerFees(clientId, client.lawyerFees)
      }
      
    } catch (error) {
      console.error('خطأ في استيراد العميل:', error)
      throw error
    }
  }

  /**
   * إدراج بيانات العميل الأساسية
   */
  private async insertClient(client: ImportedClient): Promise<number> {
    try {
      const clientData = {
        transaction_code: client.transactionCode,
        name: client.name,
        civil_id: client.civilId,
        phone_number: client.phoneNumber,
        pension_date: client.pensionDate,
        guarantee: client.guarantee,
        payment_period: client.paymentPeriod,
        loan_amount: client.loanAmount,
        profit: client.profit,
        additional_amount: client.additionalAmount,
        financing_date: client.financingDate,
        installment_value: client.installmentValue,
        first_installment_date: client.firstInstallmentDate,
        transaction_expenses: client.transactionExpenses,
        investor_id: this.investorId ? parseInt(this.investorId) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const result = await SupabaseDatabase.addClient(clientData)
      if (!result) {
        throw new Error('فشل في إضافة العميل')
      }
      return result
    } catch (error) {
      console.error('خطأ في إدراج العميل:', error)
      throw error
    }
  }

  /**
   * إدراج المدفوعات
   */
  private async insertPayments(clientId: number, payments: any[]): Promise<void> {
    try {
      const now = new Date().toISOString()
      const currentUser = 'مستورد من Excel'

      const paymentRecords = payments.map(payment => ({
        client_id: clientId,
        amount: payment.amount,
        date: payment.date,
        notes: payment.notes,
        type: 'installment'
      }))

      for (const payment of paymentRecords) {
        await SupabaseDatabase.addPaymentRecord(payment)
      }
    } catch (error) {
      console.error('خطأ في إدراج المدفوعات:', error)
      throw error
    }
  }

  /**
   * إدراج المصروفات
   */
  private async insertExpenses(clientId: number, expenses: any[]): Promise<void> {
    try {
      const now = new Date().toISOString()
      const currentUser = 'مستورد من Excel'

      const expenseRecords = expenses.map(expense => ({
        client_id: clientId,
        amount: expense.amount,
        expense_date: expense.date,
        description: expense.description,
        entry_user: currentUser,
        entry_date_time: now,
        created_at: now,
        updated_at: now
      }))

      for (const expense of expenseRecords) {
        await SupabaseDatabase.addTransactionExpense(expense)
      }
    } catch (error) {
      console.error('خطأ في إدراج المصروفات:', error)
      throw error
    }
  }

  /**
   * إدراج أتعاب المحامي
   */
  private async insertLawyerFees(clientId: number, lawyerFees: any[]): Promise<void> {
    try {
      const now = new Date().toISOString()
      const currentUser = 'مستورد من Excel'

      const feeRecords = lawyerFees.map(fee => ({
        client_id: clientId,
        amount: fee.amount,
        fee_date: fee.date,
        description: fee.description,
        entry_user: currentUser,
        entry_date_time: now,
        created_at: now,
        updated_at: now
      }))

      for (const fee of feeRecords) {
        await SupabaseDatabase.addLawyerFee(fee)
      }
    } catch (error) {
      console.error('خطأ في إدراج أتعاب المحامي:', error)
      throw error
    }
  }
}
