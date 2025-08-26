import { FileConverter } from './FileConverter'

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
 * خدمة إجراءات الملفات (تحميل، طباعة، عرض)
 */
export class FileActions {
  /**
   * تحميل مرفق
   */
  static async downloadAttachment(attachment: AttachmentFile): Promise<void> {
    try {
      const blob = await FileConverter.base64ToBlob(attachment.fileData, attachment.fileType)
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = attachment.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('خطأ في تحميل الملف:', error)
      throw new Error('فشل في تحميل الملف')
    }
  }

  /**
   * طباعة مرفق (للصور و PDF)
   */
  static async printAttachment(attachment: AttachmentFile): Promise<void> {
    try {
      const blob = await FileConverter.base64ToBlob(attachment.fileData, attachment.fileType)
      const url = window.URL.createObjectURL(blob)
      
      const printWindow = window.open(url, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
          // تنظيف URL بعد الطباعة
          setTimeout(() => window.URL.revokeObjectURL(url), 1000)
        }
      } else {
        // تنظيف URL إذا فشل فتح النافذة
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('خطأ في طباعة الملف:', error)
      throw new Error('فشل في طباعة الملف')
    }
  }

  /**
   * عرض مرفق في نافذة جديدة
   */
  static async viewAttachment(attachment: AttachmentFile): Promise<void> {
    try {
      const blob = await FileConverter.base64ToBlob(attachment.fileData, attachment.fileType)
      const url = window.URL.createObjectURL(blob)
      
      const viewWindow = window.open(url, '_blank')
      if (viewWindow) {
        viewWindow.onload = () => {
          // تنظيف URL بعد فترة
          setTimeout(() => window.URL.revokeObjectURL(url), 10000)
        }
      } else {
        // تنظيف URL إذا فشل فتح النافذة
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('خطأ في عرض الملف:', error)
      throw new Error('فشل في عرض الملف')
    }
  }
}
