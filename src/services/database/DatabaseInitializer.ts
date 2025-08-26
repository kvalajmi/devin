import { DATABASE_CONFIG } from '../../utils/DatabaseConfig'

/**
 * خدمة تهيئة قاعدة البيانات المحلية
 */
export class DatabaseInitializer {
  /**
   * تهيئة قاعدة البيانات
   */
  static async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_CONFIG.name, DATABASE_CONFIG.version)

      request.onerror = () => {
        reject(new Error('فشل في فتح قاعدة البيانات'))
      }

      request.onsuccess = () => {
        const db = request.result
        console.log('✅ تم تهيئة قاعدة البيانات المحلية بنجاح')
        resolve(db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        console.log('🔧 ترقية قاعدة البيانات...')

        this.createStores(db)
      }
    })
  }

  /**
   * إنشاء جداول البيانات
   */
  private static createStores(db: IDBDatabase): void {
    DATABASE_CONFIG.stores.forEach(storeConfig => {
      if (!db.objectStoreNames.contains(storeConfig.name)) {
        const store = db.createObjectStore(storeConfig.name, {
          keyPath: storeConfig.keyPath,
          autoIncrement: storeConfig.autoIncrement
        })

        // إنشاء الفهارس
        this.createIndexes(store, storeConfig.indexes || [])

        console.log(`✅ تم إنشاء جدول ${storeConfig.name}`)
      }
    })
  }

  /**
   * إنشاء الفهارس
   */
  private static createIndexes(store: IDBObjectStore, indexes: any[]): void {
    indexes.forEach(indexConfig => {
      try {
        store.createIndex(indexConfig.name, indexConfig.keyPath, {
          unique: indexConfig.unique
        })
        console.log(`✅ تم إنشاء فهرس ${indexConfig.name}`)
      } catch (error) {
        console.warn(`⚠️ فشل في إنشاء فهرس ${indexConfig.name}:`, error)
      }
    })
  }

  /**
   * التحقق من وجود قاعدة البيانات
   */
  static async checkDatabaseExists(): Promise<boolean> {
    try {
      const databases = await indexedDB.databases()
      return databases.some(db => db.name === DATABASE_CONFIG.name)
    } catch (error) {
      console.warn('لا يمكن التحقق من وجود قاعدة البيانات:', error)
      return false
    }
  }

  /**
   * حذف قاعدة البيانات
   */
  static async deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(DATABASE_CONFIG.name)
      
      deleteRequest.onsuccess = () => {
        console.log('✅ تم حذف قاعدة البيانات بنجاح')
        resolve()
      }
      
      deleteRequest.onerror = () => {
        reject(new Error('فشل في حذف قاعدة البيانات'))
      }
      
      deleteRequest.onblocked = () => {
        console.warn('⚠️ حذف قاعدة البيانات محجوب - أغلق جميع الاتصالات أولاً')
        reject(new Error('حذف قاعدة البيانات محجوب'))
      }
    })
  }

  /**
   * الحصول على معلومات قاعدة البيانات
   */
  static async getDatabaseInfo(): Promise<{
    name: string
    version: number
    size: number
    storeCount: number
  }> {
    const db = await this.init()
    
    const info = {
      name: db.name,
      version: db.version,
      size: 0, // حجم تقديري
      storeCount: db.objectStoreNames.length
    }
    
    db.close()
    return info
  }
}
