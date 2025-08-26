import { DatabaseStore } from '../../types/DatabaseTypes'

/**
 * العمليات المجمعة لقاعدة البيانات المحلية
 */
export class DatabaseBatchOperations {
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

  /**
   * إضافة متعددة
   */
  static async addMultipleItems<T>(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    items: Omit<T, 'id'>[]
  ): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      const results: number[] = []
      let completedCount = 0
      const totalItems = items.length

      if (totalItems === 0) {
        resolve([])
        return
      }

      items.forEach((item, index) => {
        const request = store.add(item)
        
        request.onsuccess = () => {
          results[index] = request.result as number
          completedCount++
          if (completedCount === totalItems) {
            console.log(`✅ تم إضافة ${totalItems} عنصر إلى ${storeName}`)
            resolve(results)
          }
        }
        
        request.onerror = () => {
          reject(new Error(`فشل في إضافة عنصر إلى ${storeName}`))
        }
      })
    })
  }

  /**
   * حذف متعدد
   */
  static async deleteMultipleItems(
    db: IDBDatabase, 
    storeName: DatabaseStore, 
    ids: number[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      let completedCount = 0
      const totalItems = ids.length

      if (totalItems === 0) {
        resolve()
        return
      }

      ids.forEach(id => {
        const request = store.delete(id)
        
        request.onsuccess = () => {
          completedCount++
          if (completedCount === totalItems) {
            console.log(`✅ تم حذف ${totalItems} عنصر من ${storeName}`)
            resolve()
          }
        }
        
        request.onerror = () => {
          reject(new Error(`فشل في حذف عنصر من ${storeName}`))
        }
      })
    })
  }
}
