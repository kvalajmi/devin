/**
 * أدوات مساعدة للملفات
 */
export class FileUtils {
  /**
   * تنسيق حجم الملف
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * الحصول على أيقونة نوع الملف
   */
  static getFileIcon(fileType: string, fileName: string): { icon: string; color: string; bgColor: string } {
    const extension = fileName.toLowerCase().split('.').pop()
    
    // الصور
    if (fileType.startsWith('image/')) {
      return { icon: '🖼️', color: 'text-green-600', bgColor: 'bg-green-100' }
    }
    
    // PDF
    if (fileType === 'application/pdf' || extension === 'pdf') {
      return { icon: '📄', color: 'text-red-600', bgColor: 'bg-red-100' }
    }
    
    // Excel
    if (fileType.includes('excel') || fileType.includes('spreadsheet') || ['xls', 'xlsx'].includes(extension || '')) {
      return { icon: '📊', color: 'text-green-600', bgColor: 'bg-green-100' }
    }
    
    // Word
    if (fileType.includes('word') || fileType.includes('document') || ['doc', 'docx'].includes(extension || '')) {
      return { icon: '📝', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    }
    
    // PowerPoint
    if (fileType.includes('powerpoint') || fileType.includes('presentation') || ['ppt', 'pptx'].includes(extension || '')) {
      return { icon: '📊', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    }
    
    // النصوص
    if (fileType.startsWith('text/') || ['txt', 'csv', 'rtf'].includes(extension || '')) {
      return { icon: '📄', color: 'text-gray-600', bgColor: 'bg-gray-100' }
    }
    
    // الأرشيف
    if (['zip', 'rar', '7z'].includes(extension || '') || fileType.includes('zip') || fileType.includes('rar')) {
      return { icon: '🗜️', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    }
    
    // افتراضي
    return { icon: '📄', color: 'text-blue-600', bgColor: 'bg-blue-100' }
  }

  /**
   * الحصول على معلومات نوع الملف للعرض
   */
  static getFileTypeInfo(fileName: string, fileType: string): { icon: string; color: string; name: string } {
    const extension = fileName.toLowerCase().split('.').pop()
    
    if (['doc', 'docx'].includes(extension || '') || fileType.includes('word')) {
      return { icon: '📝', color: 'blue', name: 'مستند Word' }
    }
    if (['xls', 'xlsx'].includes(extension || '') || fileType.includes('excel')) {
      return { icon: '📊', color: 'green', name: 'جدول Excel' }
    }
    if (['ppt', 'pptx'].includes(extension || '') || fileType.includes('powerpoint')) {
      return { icon: '📊', color: 'orange', name: 'عرض PowerPoint' }
    }
    if (['zip', 'rar', '7z'].includes(extension || '') || fileType.includes('zip')) {
      return { icon: '🗜️', color: 'yellow', name: 'ملف مضغوط' }
    }
    
    return { icon: '📄', color: 'blue', name: 'ملف' }
  }

  /**
   * الحصول على أنماط الألوان
   */
  static getColorClasses(color: string): string {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
      gray: 'bg-gray-100 text-gray-600'
    }
    return colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
  }
}
