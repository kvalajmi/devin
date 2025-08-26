import React from 'react'
import GlobalArabicNumberInput from '../../../components/forms/GlobalArabicNumberInput'
import { Investor } from '../types'

interface InvestorBasicInfoFormProps {
  investor: Investor
  formData: Partial<Investor>
  isEditing: boolean
  isLoading: boolean
  onInputChange: (field: keyof Investor, value: string | number) => void
}

/**
 * مكون نموذج المعلومات الأساسية للمستثمر
 */
const InvestorBasicInfoForm: React.FC<InvestorBasicInfoFormProps> = ({
  investor,
  formData,
  isEditing,
  isLoading,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">معلومات المستثمر</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          اسم المستثمر
        </label>
        {isEditing ? (
          <input
            type="text"
            value={formData.investorName || ''}
            onChange={(e) => onInputChange('investorName', e.target.value)}
            className="input-field"
            disabled={isLoading}
          />
        ) : (
          <p className="text-gray-900">{investor.investorName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الرقم المدني
        </label>
        {isEditing ? (
          <GlobalArabicNumberInput
            value={formData.civilId || ''}
            onChange={(value) => {
              if (/^\d*$/.test(value) && value.length <= 12) {
                onInputChange('civilId', value);
              }
            }}
            className="input-field"
            disabled={isLoading}
            placeholder="أدخل الرقم المدني"
          />
        ) : (
          <p className="text-gray-900">{investor.civilId}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تاريخ الانضمام
        </label>
        <p className="text-gray-900">{investor.joinDate}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نسبة المستثمر (%)
        </label>
        <p className="text-gray-900">{investor.investorPercentage}%</p>
      </div>
    </div>
  )
}

export default InvestorBasicInfoForm
