import React, { useState, useEffect, forwardRef } from 'react'

interface ArabicNumberInputProps {
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  min?: number
  max?: number
  step?: string
  disabled?: boolean
  label?: string
  error?: string
}

/**
 * مكون إدخال الأرقام مع دعم الأرقام العربية
 * يحول الأرقام العربية تلقائياً إلى الإنجليزية
 */
const ArabicNumberInput = forwardRef<HTMLInputElement, ArabicNumberInputProps>(({
  value,
  onChange,
  placeholder = '',
  className = '',
  required = false,
  min,
  max,
  step = '0.001',
  disabled = false,
  label,
  error
}, ref) => {
  const [displayValue, setDisplayValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [validationError, setValidationError] = useState('')

  // قاموس تحويل الأرقام العربية إلى الإنجليزية
  const arabicToEnglish: { [key: string]: string } = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    '٫': '.', '٬': ','
  }

  // تحويل الأرقام العربية إلى الإنجليزية
  const convertArabicToEnglish = (input: string): string => {
    return input.split('').map(char => arabicToEnglish[char] || char).join('')
  }

  // تحويل الأرقام الإنجليزية إلى العربية للعرض
  const convertEnglishToArabic = (input: string): string => {
    const englishToArabic: { [key: string]: string } = {
      '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
      '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩',
      '.': '٫', ',': '٬'
    }
    return input.split('').map(char => englishToArabic[char] || char).join('')
  }

  // تحديث القيمة المعروضة عند التهيئة
  useEffect(() => {
    // تحديث القيمة المعروضة عند التهيئة فقط
    if (typeof value === 'number') {
      setDisplayValue(value.toString())
    } else if (value) {
      setDisplayValue(value)
    } else {
      setDisplayValue('')
    }
  }, []) // إزالة value من dependencies لتجنب التداخل مع الكتابة

  // تحديث القيمة المعروضة عند تغيير value من الخارج (وليس من الكتابة)
  useEffect(() => {
    // تحديث القيمة المعروضة فقط إذا كانت مختلفة عن القيمة الحالية
    // هذا يمنع التداخل مع الكتابة العربية
    const newDisplayValue = typeof value === 'number' ? value.toString() : (value || '')
    if (newDisplayValue !== displayValue && !isFocused) {
      setDisplayValue(newDisplayValue)
    }
  }, [value, isFocused, displayValue])

  // معالجة تغيير القيمة
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    console.log('🔤 المستخدم يكتب:', inputValue)
    
    // حول القيمة إلى الإنجليزية فوراً
    const englishValue = convertArabicToEnglish(inputValue)
    console.log('🔤 القيمة المحولة:', englishValue)
    
    // تطبيق قيود min و max
    if (min !== undefined && Number(englishValue) < min) {
      setValidationError(`القيمة يجب أن تكون ${min} أو أكثر`)
      return // لا تسمح بالقيم أقل من الحد الأدنى
    }
    
    if (max !== undefined && Number(englishValue) > max) {
      setValidationError(`القيمة يجب أن تكون ${max} أو أقل`)
      return // لا تسمح بالقيم أكبر من الحد الأقصى
    }
    
    // إذا كانت القيمة صحيحة، امسح رسالة الخطأ
    setValidationError('')
    
    // اعرض القيمة باللغة الإنجليزية فوراً
    setDisplayValue(englishValue)
    console.log('🔤 تم عرض القيمة بالإنجليزية:', englishValue)
    
    onChange(englishValue)
  }

  // معالجة التركيز
  const handleFocus = () => {
    setIsFocused(true)
  }

  // معالجة فقدان التركيز
  const handleBlur = () => {
    setIsFocused(false)
    
    console.log('🔤 فقدان التركيز - القيمة المعروضة:', displayValue)
    
    // تطبيق قيود min و max في النهاية
    const currentValue = Number(displayValue)
    
    if (min !== undefined && currentValue < min) {
      setDisplayValue(min.toString())
      onChange(min.toString())
      setValidationError('')
      return
    }
    
    if (max !== undefined && currentValue > max) {
      setDisplayValue(max.toString())
      onChange(max.toString())
      setValidationError('')
      return
    }
    
    // القيمة صحيحة، تأكد من أنها باللغة الإنجليزية
    const finalValue = displayValue
    setValidationError('')
    onChange(finalValue)
  }

  // معالجة المفاتيح
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // السماح بالمفاتيح: الأرقام، النقطة، الفاصلة، الأسهم، Backspace، Delete
    const allowedKeys = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩',
      '.', '٫', ',', '٬',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Backspace', 'Delete', 'Tab', 'Enter'
    ]

    if (!allowedKeys.includes(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 border rounded-md transition-colors text-right
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error 
            ? 'border-red-300 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-blue-500'
          }
          ${className}
        `}
        required={required}
        disabled={disabled}
        dir="rtl"
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 text-right">{error}</p>
      )}
      
      {validationError && (
        <p className="mt-1 text-sm text-red-600 text-right">{validationError}</p>
      )}
      
      {/* مؤشر نوع الإدخال */}
      {isFocused && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          يمكنك الكتابة بالأرقام العربية (٠١٢٣٤٥٦٧٨٩) أو الإنجليزية (0123456789)
        </div>
      )}
    </div>
  )
})

ArabicNumberInput.displayName = 'ArabicNumberInput'

export default ArabicNumberInput
