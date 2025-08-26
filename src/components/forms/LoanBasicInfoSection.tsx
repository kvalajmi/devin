import React from 'react'
import ArabicNumberInput from './ArabicNumberInput'
import ArabicDateInput from './ArabicDateInput'
import { Client } from '../../types/DatabaseTypes'

interface LoanBasicInfoSectionProps {
  formData: Partial<Client>
  onInputChange: (field: keyof Client, value: string | number) => void
}

const LoanBasicInfoSection: React.FC<LoanBasicInfoSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">مبلغ القرض</label>
        <ArabicNumberInput
          value={formData.loanAmount?.toString() || ''}
          onChange={(value) => onInputChange('loanAmount', parseFloat(value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">الربح</label>
        <ArabicNumberInput
          value={formData.profit?.toString() || ''}
          onChange={(value) => onInputChange('profit', parseFloat(value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">فترة السداد (شهر)</label>
        <ArabicNumberInput
          value={formData.paymentPeriod?.toString() || ''}
          onChange={(value) => onInputChange('paymentPeriod', parseInt(value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">قيمة القسط</label>
        <ArabicNumberInput
          value={formData.installmentValue?.toString() || ''}
          onChange={(value) => onInputChange('installmentValue', parseFloat(value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ التمويل</label>
        <ArabicDateInput
          value={formData.fundingDate || ''}
          onChange={(value) => onInputChange('fundingDate', value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ أول قسط</label>
        <ArabicDateInput
          value={formData.firstInstallmentDate || ''}
          onChange={(value) => onInputChange('firstInstallmentDate', value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}

export default LoanBasicInfoSection
