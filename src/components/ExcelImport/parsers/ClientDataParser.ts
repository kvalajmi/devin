import { formatDate, parseNumericValue, cleanText } from '../DateFormatter'

export interface ClientData {
  transactionCode: string
  name: string
  civilId: string
  phoneNumber: string
  pensionDate: string
  guarantee: string
  paymentPeriod: string
  loanAmount: number
  profit: number
  additionalAmount: number
  financingDate: string
  installmentValue: number
  firstInstallmentDate: string
  transactionExpenses: number
}

/**
 * محلل بيانات العملاء من Excel
 */
export class ClientDataParser {
  /**
   * تحليل بيانات عميل واحد من صف Excel
   */
  static parseClientData(row: any, rowIndex: number): ClientData | null {
    try {
      // التحقق من وجود البيانات الأساسية
      const name = cleanText(row['اسم العميل'] || row['الاسم'] || '')
      const civilId = cleanText(row['الرقم المدني'] || row['رقم مدني'] || '')
      
      if (!name || !civilId) {
        console.warn(`تم تخطي الصف ${rowIndex + 1}: بيانات أساسية مفقودة`)
        return null
      }

      // تحليل البيانات الأساسية
      const clientData: ClientData = {
        transactionCode: cleanText(row['كود المعاملة'] || row['رقم المعاملة'] || ''),
        name,
        civilId,
        phoneNumber: cleanText(row['رقم الهاتف'] || row['الهاتف'] || ''),
        pensionDate: formatDate(row['تاريخ التقاعد'] || row['التقاعد'] || ''),
        guarantee: cleanText(row['الضمان'] || row['نوع الضمان'] || ''),
        paymentPeriod: cleanText(row['فترة السداد'] || row['مدة السداد'] || ''),
        loanAmount: parseNumericValue(row['مبلغ القرض'] || row['القرض'] || 0),
        profit: parseNumericValue(row['الربح'] || row['مبلغ الربح'] || 0),
        additionalAmount: parseNumericValue(row['مبلغ إضافي'] || row['إضافي'] || 0),
        financingDate: formatDate(row['تاريخ التمويل'] || row['التمويل'] || ''),
        installmentValue: parseNumericValue(row['قيمة القسط'] || row['القسط'] || 0),
        firstInstallmentDate: formatDate(row['تاريخ أول قسط'] || row['أول قسط'] || ''),
        transactionExpenses: parseNumericValue(row['مصروفات المعاملة'] || row['المصروفات'] || 0)
      }

      return clientData
    } catch (error) {
      console.error(`خطأ في تحليل بيانات العميل في الصف ${rowIndex + 1}:`, error)
      return null
    }
  }

  /**
   * التحقق من صحة بيانات العميل
   */
  static validateClientData(clientData: ClientData): { isValid: boolean, errors: string[] } {
    const errors: string[] = []

    // التحقق من البيانات المطلوبة
    if (!clientData.name.trim()) {
      errors.push('اسم العميل مطلوب')
    }

    if (!clientData.civilId.trim()) {
      errors.push('الرقم المدني مطلوب')
    }

    if (clientData.civilId.length !== 12) {
      errors.push('الرقم المدني يجب أن يكون 12 رقماً')
    }

    // التحقق من المبالغ
    if (clientData.loanAmount <= 0) {
      errors.push('مبلغ القرض يجب أن يكون أكبر من صفر')
    }

    if (clientData.profit < 0) {
      errors.push('الربح لا يمكن أن يكون سالباً')
    }

    if (clientData.installmentValue <= 0) {
      errors.push('قيمة القسط يجب أن تكون أكبر من صفر')
    }

    // التحقق من التواريخ
    if (clientData.financingDate && !this.isValidDate(clientData.financingDate)) {
      errors.push('تاريخ التمويل غير صحيح')
    }

    if (clientData.firstInstallmentDate && !this.isValidDate(clientData.firstInstallmentDate)) {
      errors.push('تاريخ أول قسط غير صحيح')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * التحقق من صحة التاريخ
   */
  private static isValidDate(dateString: string): boolean {
    if (!dateString) return false
    const date = new Date(dateString)
    return !isNaN(date.getTime()) && date.getFullYear() > 1900 && date.getFullYear() < 2100
  }

  /**
   * تنسيق بيانات العميل للعرض
   */
  static formatClientForDisplay(clientData: ClientData): any {
    return {
      ...clientData,
      formattedLoanAmount: clientData.loanAmount.toLocaleString('ar-KW') + ' د.ك',
      formattedProfit: clientData.profit.toLocaleString('ar-KW') + ' د.ك',
      formattedInstallmentValue: clientData.installmentValue.toLocaleString('ar-KW') + ' د.ك',
      formattedTransactionExpenses: clientData.transactionExpenses.toLocaleString('ar-KW') + ' د.ك',
      totalAmount: clientData.loanAmount + clientData.profit + clientData.additionalAmount
    }
  }

  /**
   * استخراج معلومات إضافية من البيانات
   */
  static extractAdditionalInfo(clientData: ClientData): {
    totalAmount: number
    monthlyPayment: number
    estimatedPayoffDate: string | null
  } {
    const totalAmount = clientData.loanAmount + clientData.profit + clientData.additionalAmount
    const monthlyPayment = clientData.installmentValue
    
    let estimatedPayoffDate: string | null = null
    if (monthlyPayment > 0 && clientData.firstInstallmentDate) {
      const monthsToPayoff = Math.ceil(totalAmount / monthlyPayment)
      const startDate = new Date(clientData.firstInstallmentDate)
      const payoffDate = new Date(startDate)
      payoffDate.setMonth(payoffDate.getMonth() + monthsToPayoff)
      estimatedPayoffDate = payoffDate.toISOString().split('T')[0]
    }

    return {
      totalAmount,
      monthlyPayment,
      estimatedPayoffDate
    }
  }
}
