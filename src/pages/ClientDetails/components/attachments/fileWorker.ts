/**
 * Web Worker لمعالجة الملفات في خيط منفصل
 * يمنع تجميد الواجهة الرئيسية
 */

// تعريف أنواع الرسائل
interface WorkerMessage {
  type: 'CONVERT_BASE64' | 'RESULT' | 'ERROR'
  data?: any
  error?: string
}

// معالج الرسائل من الخيط الرئيسي
self.onmessage = function(e: MessageEvent<WorkerMessage>) {
  const { type, data } = e.data

  switch (type) {
    case 'CONVERT_BASE64':
      try {
        convertBase64ToBlob(data.base64Data, data.contentType)
      } catch (error) {
        self.postMessage({
          type: 'ERROR',
          error: error instanceof Error ? error.message : 'خطأ غير معروف'
        })
      }
      break
  }
}

/**
 * تحويل Base64 إلى Blob في Web Worker
 */
function convertBase64ToBlob(base64Data: string, contentType: string) {
  try {
    // محاولة استخدام fetch أولاً (الأسرع)
    fetch(`data:${contentType};base64,${base64Data}`)
      .then(response => response.blob())
      .then(blob => {
        // إرسال النتيجة للخيط الرئيسي
        self.postMessage({
          type: 'RESULT',
          data: blob
        })
      })
      .catch(() => {
        // fallback للطريقة التقليدية
        fallbackConversion(base64Data, contentType)
      })
  } catch (error) {
    // fallback للطريقة التقليدية
    fallbackConversion(base64Data, contentType)
  }
}

/**
 * الطريقة الاحتياطية لتحويل Base64
 */
function fallbackConversion(base64Data: string, contentType: string) {
  try {
    const byteCharacters = atob(base64Data)
    const byteArray = new Uint8Array(byteCharacters.length)
    
    // معالجة تدريجية لتجنب تجميد Worker
    const chunkSize = 8192 // 8KB chunks
    let offset = 0
    
    function processChunk() {
      const end = Math.min(offset + chunkSize, byteCharacters.length)
      
      for (let i = offset; i < end; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i)
      }
      
      offset = end
      
      if (offset < byteCharacters.length) {
        // معالجة الجزء التالي في الدورة التالية
        setTimeout(processChunk, 0)
      } else {
        // انتهت المعالجة - إنشاء Blob
        const blob = new Blob([byteArray], { type: contentType })
        
        // إرسال النتيجة للخيط الرئيسي
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
      error: error instanceof Error ? error.message : 'فشل في تحويل الملف'
    })
  }
}

// تصدير فارغ لجعل الملف module
export {}
