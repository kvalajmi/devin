import React from 'react'

interface ArabicNumberDisplayProps {
  value: number | string
  currency?: string
  className?: string
}

/**
 * مكون لعرض الأرقام باللغة العربية
 * يحول الأرقام الإنجليزية إلى العربية للعرض
 */
const ArabicNumberDisplay: React.FC<ArabicNumberDisplayProps> = ({
  value,
  currency = '',
  className = ''
}) => {
  // تنسيق الرقم مع الفواصل
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3
    })
  }

  const displayValue = typeof value === 'number' 
    ? formatNumber(value)
    : value

  return (
    <span className={className}>
      {displayValue}
      {currency && <span className="mr-1">{currency}</span>}
    </span>
  )
}

export default ArabicNumberDisplay
