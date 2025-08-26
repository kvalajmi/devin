import { DatabaseStore } from '../../types/DatabaseTypes'

/**
 * عمليات البحث والاستعلام في قاعدة البيانات المحلية
 */
export class DatabaseQueryOperations {
  /**
   * البحث بالفهرس
   */
  static async getItemsByIndex<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    indexName: string, 
    value: any
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.getAll(value)

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        reject(new Error(`فشل في البحث في ${storeName} بالفهرس ${indexName}`))
      }
    })
  }

  /**
   * عد العناصر في المخزن
   */
  static async countItems(
    db: IDBDatabase, 
    storeName: DatabaseStore
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.count()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(new Error(`فشل في عد العناصر في ${storeName}`))
      }
    })
  }

  /**
   * البحث المتقدم بمعايير متعددة
   */
  static async searchItems<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    searchCriteria: (item: T) => boolean
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        const allItems = request.result || []
        const filteredItems = allItems.filter(searchCriteria)
        resolve(filteredItems)
      }

      request.onerror = () => {
        reject(new Error(`فشل في البحث في ${storeName}`))
      }
    })
  }
}
