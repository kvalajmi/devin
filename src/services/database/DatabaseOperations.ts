import { DatabaseStore } from '../../types/DatabaseTypes'
import { DatabaseCRUDOperations } from './DatabaseCRUDOperations'
import { DatabaseQueryOperations } from './DatabaseQueryOperations'
import { DatabaseBatchOperations } from './DatabaseBatchOperations'

/**
 * العمليات الأساسية لقاعدة البيانات المحلية - واجهة موحدة
 * تم تقسيم الملف الأصلي إلى خدمات متخصصة حسب القاعدة الذهبية
 */
export class DatabaseOperations {
  static async addItem<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    item: Omit<T, 'id'>
  ): Promise<number> {
    return DatabaseCRUDOperations.addItem(db, storeName, item)
  }

  static async getItem<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    id: number
  ): Promise<T | null> {
    return DatabaseCRUDOperations.getItem(db, storeName, id)
  }

  static async getAllItems<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore
  ): Promise<T[]> {
    return DatabaseCRUDOperations.getAllItems(db, storeName)
  }

  static async updateItem<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    item: T
  ): Promise<void> {
    return DatabaseCRUDOperations.updateItem(db, storeName, item)
  }

  static async deleteItem(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    id: number
  ): Promise<void> {
    return DatabaseCRUDOperations.deleteItem(db, storeName, id)
  }

  static async getItemsByIndex<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    indexName: string, 
    value: any
  ): Promise<T[]> {
    return DatabaseQueryOperations.getItemsByIndex(db, storeName, indexName, value)
  }

  static async countItems(
    db: IDBDatabase, 
    storeName: DatabaseStore
  ): Promise<number> {
    return DatabaseQueryOperations.countItems(db, storeName)
  }

  static async searchItems<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    searchCriteria: (item: T) => boolean
  ): Promise<T[]> {
    return DatabaseQueryOperations.searchItems(db, storeName, searchCriteria)
  }

  static async updateMultipleItems<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    items: T[]
  ): Promise<void> {
    return DatabaseBatchOperations.updateMultipleItems(db, storeName, items)
  }

  static async addMultipleItems<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    items: Omit<T, 'id'>[]
  ): Promise<number[]> {
    return DatabaseBatchOperations.addMultipleItems(db, storeName, items)
  }

  static async deleteMultipleItems(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    ids: number[]
  ): Promise<void> {
    return DatabaseBatchOperations.deleteMultipleItems(db, storeName, ids)
  }
}

// تصدير الخدمات المتخصصة للاستخدام المباشر عند الحاجة
export { DatabaseCRUDOperations, DatabaseQueryOperations, DatabaseBatchOperations }
