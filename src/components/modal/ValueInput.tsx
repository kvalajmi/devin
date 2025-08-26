import React, { forwardRef } from 'react'

interface ValueInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * مكون إدخال القيمة مع معالجة الأرقام العربية
 */
const ValueInput = forwardRef<HTMLInputElement, ValueInputProps>(({
  label,
  value,
  onChange,
  placeholder = "أدخل القيمة الجديدة"
}, ref) => {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // تحويل الأرقام العربية إلى إنجليزية
    const englishValue = inputValue
      .replace(/٠/g, '0')
      .replace(/١/g, '1')
      .replace(/٢/g, '2')
      .replace(/٣/g, '3')
      .replace(/٤/g, '4')
      .replace(/٥/g, '5')
      .replace(/٦/g, '6')
      .replace(/٧/g, '7')
      .replace(/٨/g, '8')
      .replace(/٩/g, '9')

    // السماح بالأرقام والنقطة العشرية فقط
    if (/^\d*\.?\d*$/.test(englishValue)) {
      onChange(englishValue)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleValueChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
          placeholder={placeholder}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          د.ك
        </div>
      </div>
    </div>
  )
})

ValueInput.displayName = 'ValueInput'

export default ValueInput
