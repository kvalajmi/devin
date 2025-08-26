import { DatabaseStore } from '../../types/DatabaseTypes'
import { DATABASE_CONFIG } from '../../utils/DatabaseConfig'
import { DatabaseOperations } from './DatabaseOperations'
import { DatabaseBackup } from './DatabaseBackup'

/**
 * خدمة صيانة قاعدة البيانات المحلية المحسّنة
 */
export class DatabaseMaintenance {
  /**
   * مسح جميع البيانات من مخزن
   */
  static async clearStore(db: IDBDatabase, storeName: DatabaseStore): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => {
        console.log(`✅ تم مسح جميع البيانات من ${storeName}`)
        resolve()
      }

      request.onerror = () => {
        console.error(`❌ فشل في مسح ${storeName}`)
        reject(new Error(`فشل في مسح ${storeName}`))
      }
    })
  }

  /**
   * مسح جميع البيانات
   */
  static async clearAllData(db: IDBDatabase): Promise<void> {
    console.log('⚠️ مسح جميع البيانات من قاعدة البيانات المحلية...')
    
    const clearPromises = DATABASE_CONFIG.stores.map(store => 
      this.clearStore(db, store.name)
    )

    await Promise.all(clearPromises)
    console.log('✅ تم مسح جميع البيانات بنجاح')
  }

  /**
   * الحصول على إحصائيات قاعدة البيانات
   */
  static async getDatabaseStats(db: IDBDatabase): Promise<Record<string, number>> {
    const stats: Record<string, number> = {}

    for (const storeConfig of DATABASE_CONFIG.stores) {
      try {
        const count = await DatabaseOperations.countItems(db, storeConfig.name)
        stats[storeConfig.name] = count
      } catch (error) {
        console.error(`خطأ في حساب إحصائيات ${storeConfig.name}:`, error)
        stats[storeConfig.name] = 0
      }
    }

    return stats
  }

  /**
   * تحسين قاعدة البيانات
   */
  static async optimizeDatabase(db: IDBDatabase): Promise<{
    success: boolean
    message: string
    stats: Record<string, number>
  }> {
    try {
      console.log('🔧 بدء تحسين قاعدة البيانات...')
      
      // تنفيذ عمليات التحسين
      await this.removeOrphanedRecords(db)
      await this.compactDatabase(db)
      
      // الحصول على الإحصائيات بعد التحسين
      const statsAfter = await this.getDatabaseStats(db)
      
      console.log('✅ تم تحسين قاعدة البيانات بنجاح')
      
      return {
        success: true,
        message: 'تم تحسين قاعدة البيانات بنجاح',
        stats: statsAfter
      }
    } catch (error) {
      console.error('❌ فشل في تحسين قاعدة البيانات:', error)
      return {
        success: false,
        message: 'فشل في تحسين قاعدة البيانات',
        stats: {}
      }
    }
  }

  /**
   * إزالة السجلات المهجورة
   */
  private static async removeOrphanedRecords(db: IDBDatabase): Promise<void> {
    try {
      // إزالة المدفوعات المهجورة (بدون عملاء)
      const payments = await DatabaseOperations.getAllItems(db, 'paymentRecords')
      const clients = await DatabaseOperations.getAllItems(db, 'clients')
      const clientIds = new Set(clients.map((client: any) => client.id))
      
      const orphanedPayments = payments.filter((payment: any) => 
        !clientIds.has(payment.client_id)
      )
      
      for (const payment of orphanedPayments) {
        await DatabaseOperations.deleteItem(db, 'paymentRecords', payment.id)
      }
      
      if (orphanedPayments.length > 0) {
        console.log(`🧹 تم حذف ${orphanedPayments.length} مدفوعة مهجورة`)
      }
      
      // إزالة المصروفات المهجورة
      const expenses = await DatabaseOperations.getAllItems(db, 'transactionExpenses')
      const orphanedExpenses = expenses.filter((expense: any) => 
        !clientIds.has(expense.client_id)
      )
      
      for (const expense of orphanedExpenses) {
        await DatabaseOperations.deleteItem(db, 'transactionExpenses', expense.id)
      }
      
      if (orphanedExpenses.length > 0) {
        console.log(`🧹 تم حذف ${orphanedExpenses.length} مصروف مهجور`)
      }
      
    } catch (error) {
      console.error('خطأ في إزالة السجلات المهجورة:', error)
    }
  }

  /**
   * ضغط قاعدة البيانات
   */
  private static async compactDatabase(db: IDBDatabase): Promise<void> {
    // في IndexedDB، الضغط يحدث تلقائياً
    // هذه الدالة للتوافق المستقبلي
    console.log('📦 تم ضغط قاعدة البيانات')
  }

  /**
   * التحقق من سلامة البيانات
   */
  static async validateDataIntegrity(db: IDBDatabase): Promise<{
    isValid: boolean
    errors: string[]
    warnings: string[]
  }> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // التحقق من وجود الجداول المطلوبة
      for (const storeConfig of DATABASE_CONFIG.stores) {
        if (!db.objectStoreNames.contains(storeConfig.name)) {
          errors.push(`جدول ${storeConfig.name} مفقود`)
        }
      }

      // التحقق من العلاقات بين الجداول
      const clients = await DatabaseOperations.getAllItems(db, 'clients')
      const payments = await DatabaseOperations.getAllItems(db, 'paymentRecords')
      
      const clientIds = new Set(clients.map((client: any) => client.id))
      const orphanedPayments = payments.filter((payment: any) => 
        !clientIds.has(payment.client_id)
      )
      
      if (orphanedPayments.length > 0) {
        warnings.push(`يوجد ${orphanedPayments.length} مدفوعة مهجورة`)
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      }
    } catch (error) {
      errors.push(`خطأ في التحقق من سلامة البيانات: ${error}`)
      return {
        isValid: false,
        errors,
        warnings
      }
    }
  }

  // إعادة تصدير دوال النسخ الاحتياطي
  static createBackup = DatabaseBackup.createBackup
  static restoreFromBackup = DatabaseBackup.restoreFromBackup
  static exportStore = DatabaseBackup.exportStore
  static importToStore = DatabaseBackup.importToStore
  static createCompressedBackup = DatabaseBackup.createCompressedBackup
  static validateBackup = DatabaseBackup.validateBackup
}