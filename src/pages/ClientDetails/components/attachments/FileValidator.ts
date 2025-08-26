/**
 * خدمة التحقق من صحة الملفات
 */
export class FileValidator {
  /**
   * التحقق من صحة الملف
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // التحقق من حجم الملف (50MB كحد أقصى)
    if (file.size > 50 * 1024 * 1024) {
      return {
        isValid: false,
        error: 'حجم الملف كبير جداً. الحد الأقصى 50 ميجابايت'
      }
    }

    // التحقق من نوع الملف - قائمة شاملة
    const allowedTypes = [
      // الصور
      'image/jpeg',
      'image/jpg', 
      'image/png', 
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
      
      // PDF
      'application/pdf',
      
      // Microsoft Office
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      
      // النصوص
      'text/plain', // .txt
      'text/csv', // .csv
      'application/rtf', // .rtf
      
      // أرشيف
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      
      // أخرى
      'application/json',
      'application/xml',
      'text/xml'
    ]
    
    // التحقق من النوع أو الامتداد
    const fileExtension = file.name.toLowerCase().split('.').pop()
    const allowedExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg',
      'pdf',
      'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
      'txt', 'csv', 'rtf',
      'zip', 'rar', '7z',
      'json', 'xml'
    ]
    
    const isTypeAllowed = allowedTypes.includes(file.type)
    const isExtensionAllowed = fileExtension && allowedExtensions.includes(fileExtension)
    
    if (!isTypeAllowed && !isExtensionAllowed) {
      return {
        isValid: false,
        error: `نوع الملف غير مدعوم. الأنواع المدعومة: الصور، PDF، Word، Excel، PowerPoint، النصوص، الأرشيف`
      }
    }

    return { isValid: true }
  }

  /**
   * التحقق من حجم الملف وإرجاع تحذير إذا كان كبيراً
   */
  static getFileSizeWarning(file: File): string | null {
    // تحذير للملفات أكبر من 20MB
    if (file.size > 20 * 1024 * 1024) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1)
      return `الملف كبير (${sizeMB}MB) - قد يستغرق وقتاً أطول للرفع والعرض`
    }
    return null
  }

  /**
   * التحقق من إمكانية العرض
   */
  static canView(fileType: string): boolean {
    return fileType.startsWith('image/') || fileType === 'application/pdf'
  }

  /**
   * التحقق من إمكانية الطباعة
   */
  static canPrint(fileType: string): boolean {
    return fileType.startsWith('image/') || fileType === 'application/pdf'
  }
}
