import React from 'react'

interface DescriptionInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * مكون إدخال الوصف
 */
const DescriptionInput: React.FC<DescriptionInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "أدخل الوصف"
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
        placeholder={placeholder}
      />
    </div>
  )
}

export default DescriptionInput
