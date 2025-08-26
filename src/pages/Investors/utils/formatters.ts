/**
 * دوال التنسيق الموحدة لصفحات المستثمرين
 * تضمن عرض الأرقام والتواريخ بالتنسيق المطلوب
 */

/**
 * تنسيق المبالغ المالية بالدينار الكويتي (أرقام إنجليزية)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KWD',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(amount)
}

/**
 * تنسيق الأرقام العادية (أرقام إنجليزية)
 */
export const formatNumber = (number: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number)
}

/**
 * تنسيق النسب المئوية (أرقام إنجليزية)
 */
export const formatPercentage = (percentage: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(percentage / 100)
}

/**
 * تنسيق التاريخ بالتقويم الميلادي (DD/MM/YYYY) - أرقام إنجليزية فقط
 */
export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * تنسيق التاريخ والوقت بالتقويم الميلادي - أرقام إنجليزية فقط
 */
export const formatDateTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * تنسيق التاريخ بصيغة مختصرة (MM/YYYY) - أرقام إنجليزية فقط
 */
export const formatDateShort = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('en-GB', {
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * تنسيق الأرقام الكبيرة مع اختصارات (K, M, B)
 */
export const formatLargeNumber = (number: number): string => {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + 'B'
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K'
  }
  return number.toString()
}

/**
 * تحويل الأرقام العربية إلى إنجليزية
 */
export const convertArabicToEnglishNumbers = (text: string): string => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  let result = text
  for (let i = 0; i < arabicNumbers.length; i++) {
    result = result.replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i])
  }
  return result
}

/**
 * معالج إدخال الأرقام - يحول العربية إلى إنجليزية فوراً
 */
export const handleNumberInput = (value: string): string => {
  // تحويل الأرقام العربية إلى إنجليزية
  const convertedValue = convertArabicToEnglishNumbers(value)

  // السماح فقط بالأرقام والنقطة العشرية
  const cleanedValue = convertedValue.replace(/[^0-9.]/g, '')

  // التأكد من وجود نقطة عشرية واحدة فقط
  const parts = cleanedValue.split('.')
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('')
  }

  return cleanedValue
}

/**
 * تنسيق المبلغ مع إضافة علامة الموجب أو السالب
 */
export const formatCurrencyWithSign = (amount: number): string => {
  const formatted = formatCurrency(Math.abs(amount))
  if (amount > 0) {
    return `+${formatted}`
  } else if (amount < 0) {
    return `-${formatted}`
  }
  return formatted
}

/**
 * تنسيق الفترة الزمنية (بالأيام، الأسابيع، الشهور)
 */
export const formatTimePeriod = (days: number): string => {
  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''}`
  } else if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks} week${weeks !== 1 ? 's' : ''}`
  } else if (days < 365) {
    const months = Math.floor(days / 30)
    return `${months} month${months !== 1 ? 's' : ''}`
  } else {
    const years = Math.floor(days / 365)
    return `${years} year${years !== 1 ? 's' : ''}`
  }
}

/**
 * تنسيق حالة الرصيد (موجب/سالب/صفر)
 */
export const getBalanceStatus = (balance: number): {
  status: 'positive' | 'negative' | 'zero'
  color: string
  icon: string
} => {
  if (balance > 0) {
    return {
      status: 'positive',
      color: 'text-green-600',
      icon: '📈'
    }
  } else if (balance < 0) {
    return {
      status: 'negative',
      color: 'text-red-600',
      icon: '📉'
    }
  } else {
    return {
      status: 'zero',
      color: 'text-gray-600',
      icon: '➖'
    }
  }
}
