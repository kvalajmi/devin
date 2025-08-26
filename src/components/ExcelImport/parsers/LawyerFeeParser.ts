import { formatDate, parseNumericValue, cleanText } from '../DateFormatter'

export interface LawyerFeeRecord {
  date: string
  amount: number
  description: string
}

/**
 * محلل أتعاب المحامي من Excel
 */
export class LawyerFeeParser {
  /**
   * تحليل أتعاب المحامي من صفوف Excel
   */
  static parseLawyerFees(rows: any[]): LawyerFeeRecord[] {
    const lawyerFees: LawyerFeeRecord[] = []
    
    rows.forEach((row, index) => {
      try {
        const feeColumns = this.findLawyerFeeColumns(row)
        lawyerFees.push(...feeColumns)
      } catch (error) {
        console.warn(`خطأ في تحليل أتعاب المحامي في الصف ${index + 1}:`, error)
      }
    })

    return this.sortLawyerFeesByDate(lawyerFees)
  }

  /**
   * العثور على أعمدة أتعاب المحامي في الصف
   */
  private static findLawyerFeeColumns(row: any): LawyerFeeRecord[] {
    const lawyerFees: LawyerFeeRecord[] = []

    // البحث عن أتعاب المحامي المرقمة
    for (let i = 1; i <= 10; i++) {
      const feeAmount = row[`أتعاب ${i}`] || row[`أتعاب محامي ${i}`]
      const feeDate = row[`تاريخ أتعاب ${i}`]
      const feeDesc = row[`وصف أتعاب ${i}`] || `أتعاب محامي ${i}`

      if (feeAmount && parseNumericValue(feeAmount) > 0) {
        lawyerFees.push({
          date: formatDate(feeDate) || new Date().toISOString().split('T')[0],
          amount: parseNumericValue(feeAmount),
          description: cleanText(feeDesc)
        })
      }
    }

    // البحث عن أعمدة أتعاب المحامي العامة
    const lawyerFeeKeys = Object.keys(row).filter(key => 
      key.includes('أتعاب') || 
      key.includes('محامي') ||
      key.includes('قانوني')
    )

    lawyerFeeKeys.forEach(key => {
      if (!key.includes('تاريخ') && !key.includes('وصف')) {
        const amount = parseNumericValue(row[key])
        if (amount > 0) {
          lawyerFees.push({
            date: new Date().toISOString().split('T')[0],
            amount,
            description: this.translateLawyerFeeType(key)
          })
        }
      }
    })

    return lawyerFees
  }

  /**
   * ترجمة نوع أتعاب المحامي
   */
  private static translateLawyerFeeType(key: string): string {
    if (key.includes('استشارة')) return 'استشارة قانونية'
    if (key.includes('عقد')) return 'صياغة عقود'
    if (key.includes('محكمة')) return 'تمثيل في المحكمة'
    return 'أتعاب قانونية'
  }

  /**
   * ترتيب أتعاب المحامي حسب التاريخ
   */
  private static sortLawyerFeesByDate(lawyerFees: LawyerFeeRecord[]): LawyerFeeRecord[] {
    return lawyerFees.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  /**
   * التحقق من صحة بيانات أتعاب المحامي
   */
  static validateLawyerFee(lawyerFee: LawyerFeeRecord): { isValid: boolean, errors: string[] } {
    const errors: string[] = []

    if (!lawyerFee.date) {
      errors.push('تاريخ الأتعاب مطلوب')
    }

    if (lawyerFee.amount <= 0) {
      errors.push('مبلغ الأتعاب يجب أن يكون أكبر من صفر')
    }

    if (!lawyerFee.description.trim()) {
      errors.push('وصف الأتعاب مطلوب')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * تحويل أتعاب المحامي إلى تنسيق قاعدة البيانات
   */
  static convertToDbFormat(lawyerFees: LawyerFeeRecord[], clientId: number): any[] {
    return lawyerFees.map(fee => ({
      client_id: clientId,
      fee_date: fee.date,
      amount: fee.amount,
      description: fee.description,
      entry_user: 'مستورد من Excel',
      entry_date_time: new Date().toISOString()
    }))
  }

  /**
   * حساب إحصائيات أتعاب المحامي
   */
  static calculateStats(lawyerFees: LawyerFeeRecord[]): {
    totalAmount: number
    feeCount: number
    averageFee: number
    mostCommonType: string
  } {
    if (lawyerFees.length === 0) {
      return {
        totalAmount: 0,
        feeCount: 0,
        averageFee: 0,
        mostCommonType: 'غير محدد'
      }
    }

    const totalAmount = lawyerFees.reduce((sum, fee) => sum + fee.amount, 0)
    
    // العثور على النوع الأكثر شيوعاً
    const typeCount: Record<string, number> = {}
    lawyerFees.forEach(fee => {
      typeCount[fee.description] = (typeCount[fee.description] || 0) + 1
    })
    
    const mostCommonType = Object.entries(typeCount).reduce((max, [type, count]) => 
      count > max.count ? { type, count } : max, 
      { type: 'غير محدد', count: 0 }
    ).type

    return {
      totalAmount,
      feeCount: lawyerFees.length,
      averageFee: totalAmount / lawyerFees.length,
      mostCommonType
    }
  }
}
