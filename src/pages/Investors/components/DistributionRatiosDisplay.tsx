import React from 'react'
import { Investor } from '../types'

interface DistributionRatiosDisplayProps {
  investor: Investor
  formData: Partial<Investor>
  isEditing: boolean
  isLoading: boolean
  onInputChange: (field: keyof Investor, value: string | number) => void
}

/**
 * مكون عرض نسب التوزيع
 */
const DistributionRatiosDisplay: React.FC<DistributionRatiosDisplayProps> = ({
  investor,
  formData,
  isEditing,
  isLoading,
  onInputChange
}) => {
  return (
    <div className="md:col-span-2 space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">نسب التوزيع</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نسبة المستثمر (%)
          </label>
          {isEditing ? (
            <input
              type="number"
              min="0"
              max="100"
              value={formData.investorPercentage || 0}
              onChange={(e) => onInputChange('investorPercentage', Number(e.target.value))}
              className="input-field"
              disabled={isLoading}
            />
          ) : (
            <p className="text-gray-900">{investor.investorPercentage}%</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نسبة الشريك (%)
          </label>
          <p className="text-gray-900">
            {isEditing 
              ? `${100 - (formData.investorPercentage || 0)}%`
              : `${investor.partnerPercentage}%`
            }
          </p>
        </div>
      </div>

      {/* شريط التقدم */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>المستثمر</span>
          <span>الشريك</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${investor.investorPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{investor.investorPercentage}%</span>
          <span>{investor.partnerPercentage}%</span>
        </div>
      </div>
    </div>
  )
}

export default DistributionRatiosDisplay
