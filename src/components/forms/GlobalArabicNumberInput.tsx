import React from 'react'
import { convertArabicToEnglishNumbers } from '../../pages/Investors/utils/formatters'

interface GlobalArabicNumberInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  type?: 'text' | 'number'
  id?: string
  name?: string
}

const GlobalArabicNumberInput: React.FC<GlobalArabicNumberInputProps> = ({
  value,
  onChange,
  placeholder,
  className = "input-field",
  disabled = false,
  type = "text",
  id,
  name
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const convertedValue = convertArabicToEnglishNumbers(inputValue)
    onChange(convertedValue)
  }

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      id={id}
      name={name}
    />
  )
}

export default GlobalArabicNumberInput
