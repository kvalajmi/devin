import React from 'react'
import { Client } from '../../../types/DatabaseTypes'
import ArabicNumberInput from '../ArabicNumberInput'

interface LoanBasicInfoSectionProps {
  formData: Partial<Client>
  onInputChange: (field: keyof Client, value: string | number) => void
}

/**
 * قسم معلومات القرض الأساسية في نموذج تعديل القرض
 */
const LoanBasicInfoSection: React.FC<LoanBasicInfoSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-700 border-b border-gray-200 pb-2">
        معلومات القرض الأساسية
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ArabicNumberInput
            label="مبلغ القرض (د.ك)"
            value={formData.loanAmount || 0}
            onChange={(value) => onInputChange('loanAmount', Number(value))}
            required
            min={0}
            step="0.001"
          />
        </div>

        <div>
          <ArabicNumberInput
            label="الربح (د.ك)"
            value={formData.profit || 0}
            onChange={(value) => onInputChange('profit', Number(value))}
            required
            min={0}
            step="0.001"
          />
        </div>

        <div>
          <ArabicNumberInput
            label="فترة السداد (شهر)"
            value={formData.paymentPeriod || 0}
            onChange={(value) => onInputChange('paymentPeriod', Number(value))}
            required
            min={1}
            max={360}
          />
        </div>

        <div>
          <ArabicNumberInput
            label="قيمة القسط (د.ك)"
            value={formData.installmentValue || 0}
            onChange={(value) => onInputChange('installmentValue', Number(value))}
            required
            min={0}
            step="0.001"
          />
        </div>
      </div>
    </div>
  )
}

export default LoanBasicInfoSection
