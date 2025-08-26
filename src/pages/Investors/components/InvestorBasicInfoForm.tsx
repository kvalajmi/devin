import React from 'react'
import GlobalArabicNumberInput from '../../../components/forms/GlobalArabicNumberInput'
import { Investor } from '../types'
import { CivilIdValidator } from '../../../services/validation/CivilIdValidator'
import { useGlobalNotifications } from '../../../hooks/useGlobalNotifications'

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
  const { showNotification } = useGlobalNotifications()

  const handleInputChange = async (field: keyof Investor, value: string | number) => {
    onInputChange(field, value)

    if (field === 'civilId' && typeof value === 'string') {
      const validation = await CivilIdValidator.validateUniqueness(value, investor.id)
      if (!validation.isValid) {
        showNotification('error', validation.message)
      }
    }
  }
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
            onChange={(e) => handleInputChange('investorName', e.target.value)}
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
                handleInputChange('civilId', value);
              }
            }}
            className="input-field"
            disabled={isLoading}
            placeholder="أدخل الرقم المدني (12 رقم)"
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
