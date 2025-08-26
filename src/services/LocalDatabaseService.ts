import { DatabaseStore } from '../types/DatabaseTypes'
import { DatabaseInitializer } from './database/DatabaseInitializer'
import { DatabaseOperations } from './database/DatabaseOperations'
import { DatabaseMaintenance } from './database/DatabaseMaintenance'

/**
 * خدمة قاعدة البيانات المحلية المحسّنة
 * تم تقسيمها إلى خدمات متخصصة حسب القاعدة الذهبية
 */
export class LocalDatabaseService {
  private db: IDBDatabase | null = null

  /**
   * تهيئة قاعدة البيانات
   */
  async init(): Promise<void> {
    this.db = await DatabaseInitializer.init()
  }

  /**
   * إضافة عنصر إلى المخزن
   */
  async addItem<T>(storeName: DatabaseStore, item: Omit<T, 'id'>): Promise<number> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseOperations.addItem(this.db, storeName, item)
  }

  /**
   * الحصول على عنصر بالمعرف
   */
  async getItem<T>(storeName: DatabaseStore, id: number): Promise<T | null> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseOperations.getItem(this.db, storeName, id)
  }

  /**
   * الحصول على جميع العناصر
   */
  async getAllItems<T>(storeName: DatabaseStore): Promise<T[]> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseOperations.getAllItems(this.db, storeName)
  }

  /**
   * تحديث عنصر
   */
  async updateItem<T>(storeName: DatabaseStore, item: T): Promise<void> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseOperations.updateItem(this.db, storeName, item)
  }

  /**
   * حذف عنصر
   */
  async deleteItem(storeName: DatabaseStore, id: number): Promise<void> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseOperations.deleteItem(this.db, storeName, id)
  }

  /**
   * البحث بالفهرس
   */
  async getItemsByIndex<T>(storeName: DatabaseStore, indexName: string, value: any): Promise<T[]> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseOperations.getItemsByIndex(this.db, storeName, indexName, value)
  }

  /**
   * مسح جميع البيانات من مخزن
   */
  async clearStore(storeName: DatabaseStore): Promise<void> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseMaintenance.clearStore(this.db, storeName)
  }

  /**
   * مسح جميع البيانات
   */
  async clearAllData(): Promise<void> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseMaintenance.clearAllData(this.db)
  }

  /**
   * إغلاق قاعدة البيانات
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
      console.log('📴 تم إغلاق قاعدة البيانات المحلية')
    }
  }

  /**
   * التحقق من حالة قاعدة البيانات
   */
  isInitialized(): boolean {
    return this.db !== null
  }

  /**
   * الحصول على إحصائيات قاعدة البيانات
   */
  async getDatabaseStats(): Promise<Record<string, number>> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseMaintenance.getDatabaseStats(this.db)
  }

  /**
   * تحسين قاعدة البيانات
   */
  async optimizeDatabase(): Promise<{ success: boolean, message: string, stats: Record<string, number> }> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseMaintenance.optimizeDatabase(this.db)
  }

  /**
   * إنشاء نسخة احتياطية
   */
  async createBackup(): Promise<string> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseMaintenance.createBackup(this.db)
  }

  /**
   * استعادة من النسخة الاحتياطية
   */
  async restoreFromBackup(backupJson: string): Promise<void> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseMaintenance.restoreFromBackup(this.db, backupJson)
  }

  /**
   * التحقق من سلامة البيانات
   */
  async validateDataIntegrity(): Promise<{ isValid: boolean, errors: string[], warnings: string[] }> {
    if (!this.db) {
      throw new Error('قاعدة البيانات غير مهيأة')
    }
    return DatabaseMaintenance.validateDataIntegrity(this.db)
  }

  // الدوال الثابتة للوصول المباشر
  static async checkDatabaseExists(): Promise<boolean> {
    return DatabaseInitializer.checkDatabaseExists()
  }

  static async deleteDatabase(): Promise<void> {
    return DatabaseInitializer.deleteDatabase()
  }

  static async getDatabaseInfo(): Promise<{ name: string, version: number, size: number, storeCount: number }> {
    return DatabaseInitializer.getDatabaseInfo()
  }
}