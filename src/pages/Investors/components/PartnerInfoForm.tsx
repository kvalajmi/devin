import React from 'react'
import { Investor } from '../types'

interface PartnerInfoFormProps {
  investor: Investor
  formData: Partial<Investor>
  isEditing: boolean
  isLoading: boolean
  onInputChange: (field: keyof Investor, value: string | number) => void
}

/**
 * مكون نموذج معلومات الشريك
 */
const PartnerInfoForm: React.FC<PartnerInfoFormProps> = ({
  investor,
  formData,
  isEditing,
  isLoading,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">معلومات الشريك</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          اسم الشريك
        </label>
        {isEditing ? (
          <input
            type="text"
            value={formData.partnerName || ''}
            onChange={(e) => onInputChange('partnerName', e.target.value)}
            className="input-field"
            disabled={isLoading}
          />
        ) : (
          <p className="text-gray-900">{investor.partnerName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نوع الشراكة
        </label>
        {isEditing ? (
          <select
            value={formData.partnershipType || ''}
            onChange={(e) => onInputChange('partnershipType', e.target.value)}
            className="input-field"
            disabled={isLoading}
          >
            <option value="نسبة">نسبة</option>
            <option value="مبلغ ثابت">مبلغ ثابت</option>
            <option value="مختلط">مختلط</option>
          </select>
        ) : (
          <p className="text-gray-900">{investor.partnershipType}</p>
        )}
      </div>
    </div>
  )
}

export default PartnerInfoForm
