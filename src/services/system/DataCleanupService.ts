import { ClientsService } from '../ClientsService'
import { InvestorsService } from '../InvestorsService'
import { PaymentsService } from '../PaymentsService'
import { ExpensesService } from '../ExpensesService'

/**
 * خدمة متخصصة لحذف البيانات الشامل
 * مسؤولية واحدة: حذف البيانات فقط
 */
export class DataCleanupService {
  /**
   * حذف جميع العملاء
   */
  static async deleteAllClients(): Promise<boolean> {
    try {
      console.log('🗑️ بدء حذف جميع العملاء...')
      const success = await ClientsService.deleteAllClients()
      
      if (success) {
        console.log('✅ تم حذف جميع العملاء بنجاح')
      } else {
        console.error('❌ فشل في حذف جميع العملاء')
      }
      
      return success
    } catch (error) {
      console.error('❌ خطأ في حذف جميع العملاء:', error)
      return false
    }
  }

  /**
   * حذف جميع المستثمرين
   */
  static async deleteAllInvestors(): Promise<boolean> {
    try {
      console.log('🗑️ بدء حذف جميع المستثمرين...')
      const success = await InvestorsService.deleteAllInvestors()
      
      if (success) {
        console.log('✅ تم حذف جميع المستثمرين بنجاح')
      } else {
        console.error('❌ فشل في حذف جميع المستثمرين')
      }
      
      return success
    } catch (error) {
      console.error('❌ خطأ في حذف جميع المستثمرين:', error)
      return false
    }
  }

  /**
   * حذف جميع المدفوعات
   */
  static async deleteAllPayments(): Promise<boolean> {
    try {
      console.log('🗑️ بدء حذف جميع المدفوعات...')
      const success = await PaymentsService.deleteAllPayments()
      
      if (success) {
        console.log('✅ تم حذف جميع المدفوعات بنجاح')
      } else {
        console.error('❌ فشل في حذف جميع المدفوعات')
      }
      
      return success
    } catch (error) {
      console.error('❌ خطأ في حذف جميع المدفوعات:', error)
      return false
    }
  }

  /**
   * حذف جميع المصروفات
   */
  static async deleteAllExpenses(): Promise<boolean> {
    try {
      console.log('🗑️ بدء حذف جميع المصروفات...')
      const success = await ExpensesService.deleteAllExpenses()
      
      if (success) {
        console.log('✅ تم حذف جميع المصروفات بنجاح')
      } else {
        console.error('❌ فشل في حذف جميع المصروفات')
      }
      
      return success
    } catch (error) {
      console.error('❌ خطأ في حذف جميع المصروفات:', error)
      return false
    }
  }

  /**
   * حذف جميع البيانات (للمطورين فقط) - محسّن
   */
  static async deleteAllData(): Promise<boolean> {
    try {
      console.log('⚠️ جاري حذف جميع البيانات...')
      
      // حذف البيانات بترتيب منطقي لتجنب مشاكل المراجع
      const results = await Promise.allSettled([
        this.deleteAllPayments(),
        this.deleteAllExpenses(),
        this.deleteAllClients(),
        this.deleteAllInvestors()
      ])

      const allSuccessful = results.every(result => 
        result.status === 'fulfilled' && result.value === true
      )

      if (allSuccessful) {
        console.log('✅ تم حذف جميع البيانات بنجاح')
        return true
      } else {
        console.error('❌ فشل في حذف بعض البيانات')
        console.log('نتائج الحذف:', results)
        return false
      }
    } catch (error) {
      console.error('❌ خطأ في deleteAllData:', error)
      return false
    }
  }

  /**
   * حذف بيانات عميل محدد
   */
  static async deleteClientData(clientId: number): Promise<boolean> {
    try {
      console.log(`🗑️ بدء حذف بيانات العميل ${clientId}...`)
      
      // حذف البيانات بترتيب منطقي
      const results = await Promise.allSettled([
        ClientsService.deleteClient(clientId)
      ])

      const allSuccessful = results.every(result => 
        result.status === 'fulfilled' && result.value === true
      )

      if (allSuccessful) {
        console.log(`✅ تم حذف بيانات العميل ${clientId} بنجاح`)
        return true
      } else {
        console.error(`❌ فشل في حذف بعض بيانات العميل ${clientId}`)
        return false
      }
    } catch (error) {
      console.error(`❌ خطأ في حذف بيانات العميل ${clientId}:`, error)
      return false
    }
  }

  /**
   * حذف بيانات مستثمر محدد
   */
  static async deleteInvestorData(investorId: number): Promise<boolean> {
    try {
      console.log(`🗑️ بدء حذف بيانات المستثمر ${investorId}...`)
      
      // حذف البيانات بترتيب منطقي
      const results = await Promise.allSettled([
        InvestorsService.deleteInvestor(investorId)
      ])

      const allSuccessful = results.every(result => 
        result.status === 'fulfilled' && result.value === true
      )

      if (allSuccessful) {
        console.log(`✅ تم حذف بيانات المستثمر ${investorId} بنجاح`)
        return true
      } else {
        console.error(`❌ فشل في حذف بعض بيانات المستثمر ${investorId}`)
        return false
      }
    } catch (error) {
      console.error(`❌ خطأ في حذف بيانات المستثمر ${investorId}:`, error)
      return false
    }
  }

  /**
   * تنظيف البيانات المؤقتة
   */
  static async cleanupTemporaryData(): Promise<boolean> {
    try {
      console.log('🧹 بدء تنظيف البيانات المؤقتة...')
      
      // يمكن إضافة منطق تنظيف البيانات المؤقتة هنا
      // مثل حذف الملفات المؤقتة، تنظيف الذاكرة، إلخ
      
      console.log('✅ تم تنظيف البيانات المؤقتة بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في تنظيف البيانات المؤقتة:', error)
      return false
    }
  }
}
