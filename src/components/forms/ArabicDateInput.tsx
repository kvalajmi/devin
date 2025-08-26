import React, { useState, useEffect, forwardRef } from 'react'

interface ArabicDateInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  disabled?: boolean
  label?: string
  error?: string
}

/**
 * مكون إدخال التواريخ مع دعم الأرقام العربية
 * يحول الأرقام العربية تلقائياً إلى الإنجليزية
 */
const ArabicDateInput = forwardRef<HTMLInputElement, ArabicDateInputProps>(({
  value,
  onChange,
  placeholder = '',
  className = '',
  required = false,
  disabled = false,
  label,
  error
}, ref) => {
  const [displayValue, setDisplayValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // قاموس تحويل الأرقام العربية إلى الإنجليزية
  const arabicToEnglish: { [key: string]: string } = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  }

  // تحويل الأرقام العربية إلى الإنجليزية
  const convertArabicToEnglish = (input: string): string => {
    return input.split('').map(char => arabicToEnglish[char] || char).join('')
  }

  // تحويل الأرقام الإنجليزية إلى العربية للعرض
  const convertEnglishToArabic = (input: string): string => {
    const englishToArabic: { [key: string]: string } = {
      '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
      '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
    }
    return input.split('').map(char => englishToArabic[char] || char).join('')
  }

  // تحديث القيمة المعروضة عند تغيير القيمة
  useEffect(() => {
    if (value) {
      setDisplayValue(value)
    } else {
      setDisplayValue('')
    }
  }, [value])

  // معالجة تغيير القيمة
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // إذا كان المستخدم يكتب أرقام عربية، احتفظ بها للعرض
    if (inputValue.match(/[٠١٢٣٤٥٦٧٨٩]/)) {
      setDisplayValue(inputValue)
    } else {
      // إذا كان المستخدم يكتب أرقام إنجليزية، حولها للعربية للعرض
      setDisplayValue(convertEnglishToArabic(inputValue))
    }

    // دائماً حول القيمة إلى الإنجليزية للمعالجة
    const englishValue = convertArabicToEnglish(inputValue)
    onChange(englishValue)
  }

  // معالجة التركيز
  const handleFocus = () => {
    setIsFocused(true)
  }

  // معالجة فقدان التركيز
  const handleBlur = () => {
    setIsFocused(false)
    // تأكد من أن القيمة النهائية باللغة الإنجليزية
    const finalValue = convertArabicToEnglish(displayValue)
    onChange(finalValue)
  }

  // معالجة المفاتيح
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // السماح بالمفاتيح: الأرقام، الشرطة، الأسهم، Backspace، Delete
    const allowedKeys = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩',
      '-', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
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
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
      
      {/* مؤشر نوع الإدخال */}
      {isFocused && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          اختر التاريخ من التقويم أو اكتبه بالأرقام العربية (٠١٢٣٤٥٦٧٨٩)
        </div>
      )}
    </div>
  )
})

ArabicDateInput.displayName = 'ArabicDateInput'

export default ArabicDateInput
