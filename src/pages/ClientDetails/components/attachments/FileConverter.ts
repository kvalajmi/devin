import WorkerManager from './WorkerManager'

interface AttachmentFile {
  id: number
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  description: string
  fileData: string
}

/**
 * خدمة تحويل الملفات
 */
export class FileConverter {
  // cache للـ URLs لتجنب إعادة المعالجة
  private static urlCache = new Map<string, string>()
  
  /**
   * تنظيف cache URLs
   */
  static clearCache() {
    this.urlCache.forEach(url => {
      try {
        URL.revokeObjectURL(url)
      } catch (e) {
        // تجاهل الأخطاء
      }
    })
    this.urlCache.clear()
  }

  /**
   * تحويل الملف إلى Base64
   */
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader()
        
        reader.onload = () => {
          try {
            const result = reader.result as string
            if (!result) {
              reject(new Error('فشل في قراءة الملف'))
              return
            }
            
            // إزالة البادئة data:type;base64,
            const base64 = result.split(',')[1]
            if (!base64) {
              reject(new Error('فشل في تحويل الملف إلى Base64'))
              return
            }
            
            resolve(base64)
          } catch (error) {
            reject(new Error('خطأ في معالجة الملف'))
          }
        }
        
        reader.onerror = () => {
          reject(new Error('فشل في قراءة الملف'))
        }
        
        reader.onabort = () => {
          reject(new Error('تم إلغاء قراءة الملف'))
        }
        
        // بدء قراءة الملف
        reader.readAsDataURL(file)
        
      } catch (error) {
        reject(new Error('خطأ في تحضير الملف للقراءة'))
      }
    })
  }

  /**
   * تحويل Base64 إلى Blob باستخدام Web Worker
   */
  static async base64ToBlob(base64Data: string, contentType: string): Promise<Blob> {
    try {
      // للملفات الصغيرة (< 5MB)، استخدم الطريقة المباشرة
      if (base64Data.length < 5 * 1024 * 1024 * 0.75) { // تقريب Base64 size
        try {
          const response = await fetch(`data:${contentType};base64,${base64Data}`)
          return await response.blob()
        } catch {
          // fallback للطريقة التقليدية للملفات الصغيرة
          const byteCharacters = atob(base64Data)
          const byteArray = new Uint8Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i)
          }
          return new Blob([byteArray], { type: contentType })
        }
      }

      // للملفات الكبيرة، استخدم Web Worker
      const workerManager = WorkerManager.getInstance()
      return await workerManager.convertBase64ToBlob(base64Data, contentType)
      
    } catch (error) {
      console.error('خطأ في تحويل Base64 إلى Blob:', error)
      throw new Error('فشل في معالجة الملف')
    }
  }

  /**
   * إنشاء URL للملف بطريقة محسّنة مع cache
   */
  static async createFileUrl(attachment: AttachmentFile): Promise<string> {
    try {
      // إنشاء مفتاح فريد للملف
      const cacheKey = `${attachment.id}_${attachment.fileName}_${attachment.fileSize}`
      
      // التحقق من وجود URL في cache
      if (this.urlCache.has(cacheKey)) {
        const cachedUrl = this.urlCache.get(cacheKey)!
        // التحقق من صحة URL
        try {
          await fetch(cachedUrl, { method: 'HEAD' })
          return cachedUrl
        } catch {
          // URL غير صالح، إزالته من cache
          this.urlCache.delete(cacheKey)
        }
      }

      // إنشاء URL جديد
      const blob = await this.base64ToBlob(attachment.fileData, attachment.fileType)
      const url = window.URL.createObjectURL(blob)
      
      // حفظ في cache
      this.urlCache.set(cacheKey, url)
      
      return url
    } catch (error) {
      console.error('خطأ في إنشاء URL للملف:', error)
      throw new Error('فشل في إنشاء URL للملف')
    }
  }

  /**
   * إنشاء كائن مرفق جديد
   */
  static createAttachmentObject(
    file: File,
    description: string
  ): Promise<Omit<AttachmentFile, 'id'>> {
    return new Promise(async (resolve, reject) => {
      try {
        const base64 = await this.fileToBase64(file)
        
        const attachment: Omit<AttachmentFile, 'id'> = {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadDate: new Date().toISOString(),
          description: description || file.name,
          fileData: base64
        }
        
        resolve(attachment)
      } catch (error) {
        reject(error)
      }
    })
  }
}
