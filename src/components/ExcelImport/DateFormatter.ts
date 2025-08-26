/**
 * مساعد لتحويل التواريخ من تنسيقات Excel المختلفة إلى تنسيق قاعدة البيانات
 */

/**
 * دالة للتحقق من صحة القيمة
 */
export const isValidValue = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string' && value.trim() === '') return false
  if (typeof value === 'number' && isNaN(value)) return false
  return true
}

/**
 * دالة لتحويل التاريخ من تنسيق Excel إلى تنسيق قاعدة البيانات
 */
export const formatDate = (dateValue: any): string => {
  if (!dateValue) return new Date().toISOString().split('T')[0]
  
  // إذا كان التاريخ رقم (Excel date)
  if (typeof dateValue === 'number') {
    const date = new Date((dateValue - 25569) * 86400 * 1000)
    return date.toISOString().split('T')[0]
  }
  
  // إذا كان التاريخ نص بتنسيق d/m/yyyy
  if (typeof dateValue === 'string') {
    const parts = dateValue.split('/')
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0')
      const month = parts[1].padStart(2, '0')
      const year = parts[2]
      return `${year}-${month}-${day}`
    }
  }
  
  return new Date().toISOString().split('T')[0]
}

/**
 * دالة لتحويل القيم النصية إلى أرقام
 */
export const parseNumericValue = (value: any): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const cleanValue = value.replace(/[^\d.-]/g, '')
    const parsed = parseFloat(cleanValue)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

/**
 * دالة لتنظيف النصوص
 */
export const cleanText = (value: any): string => {
  if (!value) return ''
  return String(value).trim()
}
