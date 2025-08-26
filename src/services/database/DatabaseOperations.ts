import { DatabaseStore } from '../../types/DatabaseTypes'

/**
 * العمليات الأساسية لقاعدة البيانات المحلية
 */
export class DatabaseOperations {
  /**
   * إضافة عنصر إلى المخزن
   */
  static async addItem<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    item: Omit<T, 'id'>
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(item)

      request.onsuccess = () => {
        console.log(`✅ تم إضافة عنصر جديد إلى ${storeName}`)
        resolve(request.result as number)
      }

      request.onerror = () => {
        console.error(`❌ فشل في إضافة عنصر إلى ${storeName}`)
        reject(new Error(`فشل في إضافة العنصر إلى ${storeName}`))
      }
    })
  }

  /**
   * الحصول على عنصر بالمعرف
   */
  static async getItem<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    id: number
  ): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onsuccess = () => {
        resolve(request.result || null)
      }

      request.onerror = () => {
        reject(new Error(`فشل في جلب العنصر من ${storeName}`))
      }
    })
  }

  /**
   * الحصول على جميع العناصر
   */
  static async getAllItems<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        reject(new Error(`فشل في جلب العناصر من ${storeName}`))
      }
    })
  }

  /**
   * تحديث عنصر
   */
  static async updateItem<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    item: T
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(item)

      request.onsuccess = () => {
        console.log(`✅ تم تحديث عنصر في ${storeName}`)
        resolve()
      }

      request.onerror = () => {
        console.error(`❌ فشل في تحديث عنصر في ${storeName}`)
        reject(new Error(`فشل في تحديث العنصر في ${storeName}`))
      }
    })
  }

  /**
   * حذف عنصر
   */
  static async deleteItem(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    id: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => {
        console.log(`✅ تم حذف عنصر من ${storeName}`)
        resolve()
      }

      request.onerror = () => {
        console.error(`❌ فشل في حذف عنصر من ${storeName}`)
        reject(new Error(`فشل في حذف العنصر من ${storeName}`))
      }
    })
  }

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
    const allItems = await this.getAllItems<T>(db, storeName)
    return allItems.filter(searchCriteria)
  }

  /**
   * تحديث متعدد
   */
  static async updateMultipleItems<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    items: T[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      let completedCount = 0
      const totalItems = items.length

      if (totalItems === 0) {
        resolve()
        return
      }

      items.forEach(item => {
        const request = store.put(item)
        
        request.onsuccess = () => {
          completedCount++
          if (completedCount === totalItems) {
            console.log(`✅ تم تحديث ${totalItems} عنصر في ${storeName}`)
            resolve()
          }
        }
        
        request.onerror = () => {
          reject(new Error(`فشل في تحديث عنصر في ${storeName}`))
        }
      })
    })
  }
}
