import React from 'react'

interface ValueComparisonProps {
  currentValue: number
  newValue: string
}

/**
 * مكون مقارنة القيم (الحالية مقابل الجديدة)
 */
const ValueComparison: React.FC<ValueComparisonProps> = ({
  currentValue,
  newValue
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-sm">
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-600">القيمة الحالية:</span>
        <span className="font-semibold text-gray-800">{currentValue} د.ك</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">القيمة الجديدة:</span>
        <span className="font-semibold text-blue-600">
          {newValue ? `${parseFloat(newValue) || 0} د.ك` : '0 د.ك'}
        </span>
      </div>
    </div>
  )
}

export default ValueComparison
