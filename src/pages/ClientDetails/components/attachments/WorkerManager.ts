/**
 * مدير Web Workers لمعالجة الملفات
 */

interface WorkerMessage {
  type: 'CONVERT_BASE64' | 'RESULT' | 'ERROR'
  data?: any
  error?: string
}

class WorkerManager {
  private static instance: WorkerManager
  private worker: Worker | null = null

  private constructor() {}

  static getInstance(): WorkerManager {
    if (!WorkerManager.instance) {
      WorkerManager.instance = new WorkerManager()
    }
    return WorkerManager.instance
  }

  /**
   * إنشاء Worker جديد
   */
  private createWorker(): Worker {
    // إنشاء Worker من كود inline لتجنب مشاكل المسارات
    const workerCode = `
      self.onmessage = function(e) {
        const { type, data } = e.data

        switch (type) {
          case 'CONVERT_BASE64':
            try {
              convertBase64ToBlob(data.base64Data, data.contentType)
            } catch (error) {
              self.postMessage({
                type: 'ERROR',
                error: error.message || 'خطأ غير معروف'
              })
            }
            break
        }
      }

      function convertBase64ToBlob(base64Data, contentType) {
        try {
          fetch('data:' + contentType + ';base64,' + base64Data)
            .then(response => response.blob())
            .then(blob => {
              self.postMessage({
                type: 'RESULT',
                data: blob
              })
            })
            .catch(() => {
              fallbackConversion(base64Data, contentType)
            })
        } catch (error) {
          fallbackConversion(base64Data, contentType)
        }
      }

      function fallbackConversion(base64Data, contentType) {
        try {
          const byteCharacters = atob(base64Data)
          const byteArray = new Uint8Array(byteCharacters.length)
          
          const chunkSize = 8192
          let offset = 0
          
          function processChunk() {
            const end = Math.min(offset + chunkSize, byteCharacters.length)
            
            for (let i = offset; i < end; i++) {
              byteArray[i] = byteCharacters.charCodeAt(i)
            }
            
            offset = end
            
            if (offset < byteCharacters.length) {
              setTimeout(processChunk, 0)
            } else {
              const blob = new Blob([byteArray], { type: contentType })
              self.postMessage({
                type: 'RESULT',
                data: blob
              })
            }
          }
          
          processChunk()
          
        } catch (error) {
          self.postMessage({
            type: 'ERROR',
            error: error.message || 'فشل في تحويل الملف'
          })
        }
      }
    `

    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const workerUrl = URL.createObjectURL(blob)
    
    const worker = new Worker(workerUrl)
    
    // تنظيف URL بعد إنشاء Worker
    URL.revokeObjectURL(workerUrl)
    
    return worker
  }

  /**
   * تحويل Base64 إلى Blob باستخدام Web Worker
   */
  async convertBase64ToBlob(base64Data: string, contentType: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // إنشاء Worker جديد لكل عملية لتجنب التداخل
      const worker = this.createWorker()

      // معالج الرسائل من Worker
      worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        const { type, data, error } = e.data

        switch (type) {
          case 'RESULT':
            worker.terminate() // إنهاء Worker
            resolve(data as Blob)
            break
          
          case 'ERROR':
            worker.terminate() // إنهاء Worker
            reject(new Error(error || 'فشل في معالجة الملف'))
            break
        }
      }

      // معالج الأخطاء
      worker.onerror = (error) => {
        worker.terminate()
        reject(new Error('خطأ في Web Worker: ' + error.message))
      }

      // إرسال البيانات للمعالجة
      worker.postMessage({
        type: 'CONVERT_BASE64',
        data: { base64Data, contentType }
      })

      // timeout للحماية من التعليق
      setTimeout(() => {
        worker.terminate()
        reject(new Error('انتهت مهلة معالجة الملف'))
      }, 30000) // 30 ثانية
    })
  }

  /**
   * تنظيف الموارد
   */
  cleanup() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }
}

export default WorkerManager
