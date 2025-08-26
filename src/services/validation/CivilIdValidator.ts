import { SupabaseDatabase } from '../../utils/supabase-simple'

export class CivilIdValidator {
  /**
   * التحقق من صحة الرقم المدني
   */
  static validateFormat(civilId: string): { isValid: boolean; message: string } {
    if (!civilId || civilId.trim() === '') {
      return { isValid: false, message: 'الرقم المدني مطلوب' }
    }

    const cleanCivilId = civilId.replace(/\s/g, '')
    
    if (cleanCivilId.length !== 12) {
      return { isValid: false, message: 'الرقم المدني يجب أن يكون 12 رقم بالضبط' }
    }

    if (!/^\d{12}$/.test(cleanCivilId)) {
      return { isValid: false, message: 'الرقم المدني يجب أن يحتوي على أرقام فقط' }
    }

    return { isValid: true, message: 'الرقم المدني صحيح' }
  }

  /**
   * التحقق من تفرد الرقم المدني في قاعدة البيانات
   */
  static async validateUniqueness(
    civilId: string, 
    excludeInvestorId?: number
  ): Promise<{ isValid: boolean; message: string }> {
    try {
      const formatValidation = this.validateFormat(civilId)
      if (!formatValidation.isValid) {
        return formatValidation
      }

      const investors = await SupabaseDatabase.getInvestors()
      const existingInvestor = investors.find(investor => 
        investor.civil_id === civilId && investor.id !== excludeInvestorId
      )

      if (existingInvestor) {
        return { 
          isValid: false, 
          message: `الرقم المدني ${civilId} مستخدم بالفعل للمستثمر: ${existingInvestor.name}` 
        }
      }

      return { isValid: true, message: 'الرقم المدني متاح' }
    } catch (error) {
      return { isValid: false, message: 'حدث خطأ في التحقق من الرقم المدني' }
    }
  }
}
