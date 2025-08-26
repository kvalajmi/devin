/**
 * خدمة تحويل بيانات العملاء بين التنسيقات المختلفة
 */
export class ClientDataTransformer {
  /**
   * تحويل البيانات من Supabase إلى النظام المحلي
   */
  static convertSupabaseToClient(supabaseClient: any): any {
    return {
      id: supabaseClient.id,
      name: supabaseClient.name,
      civilId: supabaseClient.civil_id,
      phoneNumber: supabaseClient.phone_number,
      pensionDate: supabaseClient.pension_date,
      guarantee: supabaseClient.guarantee,
      paymentPeriod: supabaseClient.payment_period,
      loanAmount: supabaseClient.loan_amount,
      profit: supabaseClient.profit,
      fundingDate: supabaseClient.funding_date || '2023-01-15',
      installmentValue: supabaseClient.installment_value,
      firstInstallmentDate: supabaseClient.first_installment_date || '2023-02-15',
      totalAmount: supabaseClient.total_amount,
      totalPaid: supabaseClient.total_paid,
      totalRemaining: supabaseClient.total_remaining,
      transaction_code: supabaseClient.transaction_code,
      job: supabaseClient.job,
      address: supabaseClient.address,
      governorate: supabaseClient.governorate,
      area: supabaseClient.area,
      block: supabaseClient.block,
      street: supabaseClient.street,
      avenue: supabaseClient.avenue,
      houseNumber: supabaseClient.house_number
    }
  }

  /**
   * تحويل البيانات من النظام المحلي إلى Supabase
   */
  static convertClientToSupabase(localClient: any): any {
    return {
      id: localClient.id,
      name: localClient.name,
      civil_id: localClient.civilId,
      phone_number: localClient.phoneNumber,
      pension_date: localClient.pensionDate,
      guarantee: localClient.guarantee,
      payment_period: localClient.paymentPeriod,
      loan_amount: localClient.loanAmount,
      profit: localClient.profit,
      funding_date: localClient.fundingDate,
      installment_value: localClient.installmentValue,
      first_installment_date: localClient.firstInstallmentDate,
      total_amount: localClient.totalAmount,
      total_paid: localClient.totalPaid,
      total_remaining: localClient.totalRemaining,
      transaction_code: localClient.transaction_code,
      job: localClient.job,
      address: localClient.address,
      governorate: localClient.governorate,
      area: localClient.area,
      block: localClient.block,
      street: localClient.street,
      avenue: localClient.avenue,
      house_number: localClient.houseNumber
    }
  }

  /**
   * تحويل مجموعة من العملاء من Supabase
   */
  static convertMultipleSupabaseToClient(supabaseClients: any[]): any[] {
    return supabaseClients.map(client => this.convertSupabaseToClient(client))
  }

  /**
   * تحويل مجموعة من العملاء إلى Supabase
   */
  static convertMultipleClientToSupabase(localClients: any[]): any[] {
    return localClients.map(client => this.convertClientToSupabase(client))
  }

  /**
   * استخراج البيانات الأساسية للعميل
   */
  static extractBasicClientInfo(client: any): any {
    return {
      id: client.id,
      name: client.name || client.civil_id,
      civilId: client.civil_id || client.civilId,
      phoneNumber: client.phone_number || client.phoneNumber,
      loanAmount: client.loan_amount || client.loanAmount,
      totalAmount: client.total_amount || client.totalAmount,
      totalPaid: client.total_paid || client.totalPaid,
      totalRemaining: client.total_remaining || client.totalRemaining
    }
  }

  /**
   * استخراج معلومات العنوان
   */
  static extractAddressInfo(client: any): any {
    return {
      address: client.address,
      governorate: client.governorate,
      area: client.area,
      block: client.block,
      street: client.street,
      avenue: client.avenue,
      houseNumber: client.house_number || client.houseNumber
    }
  }

  /**
   * تنظيف البيانات وإزالة القيم الفارغة
   */
  static cleanClientData(client: any): any {
    const cleaned: any = {}
    
    Object.keys(client).forEach(key => {
      const value = client[key]
      if (value !== null && value !== undefined && value !== '') {
        cleaned[key] = value
      }
    })

    return cleaned
  }

  /**
   * التحقق من صحة بيانات العميل
   */
  static validateClientData(client: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // التحقق من الحقول الإجبارية
    if (!client.name || client.name.trim() === '') {
      errors.push('اسم العميل مطلوب')
    }

    if (!client.civil_id && !client.civilId) {
      errors.push('الرقم المدني مطلوب')
    }

    if (!client.phone_number && !client.phoneNumber) {
      errors.push('رقم الهاتف مطلوب')
    }

    // التحقق من صحة الرقم المدني (12 رقم)
    const civilId = client.civil_id || client.civilId
    if (civilId && !/^\d{12}$/.test(civilId)) {
      errors.push('الرقم المدني يجب أن يكون 12 رقم')
    }

    // التحقق من صحة رقم الهاتف (8 أرقام)
    const phoneNumber = client.phone_number || client.phoneNumber
    if (phoneNumber && !/^\d{8}$/.test(phoneNumber)) {
      errors.push('رقم الهاتف يجب أن يكون 8 أرقام')
    }

    // التحقق من القيم الرقمية
    const numericFields = ['loan_amount', 'loanAmount', 'profit', 'total_amount', 'totalAmount']
    numericFields.forEach(field => {
      const value = client[field]
      if (value !== undefined && value !== null && (isNaN(value) || value < 0)) {
        errors.push(`${field} يجب أن يكون رقم موجب`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
