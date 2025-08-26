import { DatabaseStore } from '../../types/DatabaseTypes'
import { DATABASE_CONFIG } from '../../utils/DatabaseConfig'
import { DatabaseOperations } from './DatabaseOperations'

/**
 * خدمة النسخ الاحتياطي لقاعدة البيانات
 */
export class DatabaseBackup {
  /**
   * نسخ احتياطي من البيانات
   */
  static async createBackup(db: IDBDatabase): Promise<string> {
    try {
      console.log('💾 بدء إنشاء النسخة الاحتياطية...')
      
      const backup: Record<string, any[]> = {}
      
      for (const storeConfig of DATABASE_CONFIG.stores) {
        console.log(`📦 نسخ بيانات ${storeConfig.name}...`)
        const data = await DatabaseOperations.getAllItems(db, storeConfig.name)
        backup[storeConfig.name] = data
        console.log(`✅ تم نسخ ${data.length} عنصر من ${storeConfig.name}`)
      }
      
      const backupData = {
        version: DATABASE_CONFIG.version,
        timestamp: new Date().toISOString(),
        data: backup,
        metadata: {
          totalStores: DATABASE_CONFIG.stores.length,
          totalRecords: Object.values(backup).reduce((sum, items) => sum + items.length, 0),
          createdBy: 'هارموني المبسط',
          databaseName: DATABASE_CONFIG.name
        }
      }
      
      console.log('✅ تم إنشاء النسخة الاحتياطية بنجاح')
      return JSON.stringify(backupData, null, 2)
    } catch (error) {
      console.error('❌ فشل في إنشاء النسخة الاحتياطية:', error)
      throw error
    }
  }

  /**
   * استعادة من النسخة الاحتياطية
   */
  static async restoreFromBackup(db: IDBDatabase, backupJson: string): Promise<void> {
    try {
      console.log('🔄 بدء استعادة النسخة الاحتياطية...')
      
      const backupData = JSON.parse(backupJson)
      
      // التحقق من صحة النسخة الاحتياطية
      if (!backupData.data || !backupData.version) {
        throw new Error('تنسيق النسخة الاحتياطية غير صحيح')
      }

      // التحقق من توافق الإصدار
      if (backupData.version > DATABASE_CONFIG.version) {
        console.warn('⚠️ النسخة الاحتياطية من إصدار أحدث')
      }

      // مسح البيانات الحالية
      console.log('🧹 مسح البيانات الحالية...')
      await this.clearAllStores(db)
      
      // استعادة البيانات
      for (const [storeName, items] of Object.entries(backupData.data)) {
        if (Array.isArray(items) && items.length > 0) {
          console.log(`📥 استعادة ${items.length} عنصر إلى ${storeName}...`)
          await DatabaseOperations.updateMultipleItems(
            db, 
            storeName as DatabaseStore, 
            items
          )
          console.log(`✅ تم استعادة بيانات ${storeName}`)
        }
      }
      
      console.log('✅ تم استعادة البيانات من النسخة الاحتياطية بنجاح')
    } catch (error) {
      console.error('❌ فشل في استعادة النسخة الاحتياطية:', error)
      throw error
    }
  }

  /**
   * مسح جميع المخازن
   */
  private static async clearAllStores(db: IDBDatabase): Promise<void> {
    const clearPromises = DATABASE_CONFIG.stores.map(store => 
      this.clearStore(db, store.name)
    )
    await Promise.all(clearPromises)
  }

  /**
   * مسح مخزن واحد
   */
  private static async clearStore(db: IDBDatabase, storeName: DatabaseStore): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error(`فشل في مسح ${storeName}`))
      }
    })
  }

  /**
   * تصدير بيانات مخزن معين
   */
  static async exportStore(db: IDBDatabase, storeName: DatabaseStore): Promise<string> {
    try {
      const data = await DatabaseOperations.getAllItems(db, storeName)
      
      const exportData = {
        storeName,
        timestamp: new Date().toISOString(),
        count: data.length,
        data
      }
      
      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error(`❌ فشل في تصدير ${storeName}:`, error)
      throw error
    }
  }

  /**
   * استيراد بيانات إلى مخزن معين
   */
  static async importToStore(db: IDBDatabase, importJson: string): Promise<void> {
    try {
      const importData = JSON.parse(importJson)
      
      if (!importData.storeName || !importData.data) {
        throw new Error('تنسيق بيانات الاستيراد غير صحيح')
      }

      await DatabaseOperations.updateMultipleItems(
        db,
        importData.storeName as DatabaseStore,
        importData.data
      )
      
      console.log(`✅ تم استيراد ${importData.data.length} عنصر إلى ${importData.storeName}`)
    } catch (error) {
      console.error('❌ فشل في الاستيراد:', error)
      throw error
    }
  }

  /**
   * إنشاء نسخة احتياطية مضغوطة
   */
  static async createCompressedBackup(db: IDBDatabase): Promise<Blob> {
    try {
      const backupJson = await this.createBackup(db)
      
      // ضغط البيانات باستخدام gzip (إذا كان متاحاً)
      if ('CompressionStream' in window) {
        const stream = new CompressionStream('gzip')
        const writer = stream.writable.getWriter()
        const reader = stream.readable.getReader()
        
        writer.write(new TextEncoder().encode(backupJson))
        writer.close()
        
        const chunks: Uint8Array[] = []
        let done = false
        
        while (!done) {
          const { value, done: readerDone } = await reader.read()
          done = readerDone
          if (value) {
            chunks.push(value)
          }
        }
        
        return new Blob(chunks, { type: 'application/gzip' })
      } else {
        // إذا لم يكن الضغط متاحاً، إرجاع البيانات كما هي
        return new Blob([backupJson], { type: 'application/json' })
      }
    } catch (error) {
      console.error('❌ فشل في إنشاء النسخة الاحتياطية المضغوطة:', error)
      throw error
    }
  }

  /**
   * التحقق من صحة النسخة الاحتياطية
   */
  static validateBackup(backupJson: string): {
    isValid: boolean
    errors: string[]
    metadata?: any
  } {
    const errors: string[] = []

    try {
      const backupData = JSON.parse(backupJson)
      
      // التحقق من الحقول المطلوبة
      if (!backupData.version) {
        errors.push('رقم الإصدار مفقود')
      }
      
      if (!backupData.timestamp) {
        errors.push('الطابع الزمني مفقود')
      }
      
      if (!backupData.data) {
        errors.push('البيانات مفقودة')
      }
      
      // التحقق من صحة البيانات
      if (backupData.data && typeof backupData.data === 'object') {
        for (const [storeName, items] of Object.entries(backupData.data)) {
          if (!Array.isArray(items)) {
            errors.push(`بيانات ${storeName} ليست مصفوفة`)
          }
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        metadata: backupData.metadata
      }
    } catch (error) {
      errors.push('تنسيق JSON غير صحيح')
      return {
        isValid: false,
        errors
      }
    }
  }
}
