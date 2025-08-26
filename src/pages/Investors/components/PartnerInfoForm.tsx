import React from 'react'
import { Investor } from '../types'

interface PartnerInfoFormProps {
  investor: Investor
}

/**
 * مكون نموذج معلومات الشريك
 */
const PartnerInfoForm: React.FC<PartnerInfoFormProps> = ({
  investor
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">معلومات الشريك</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          اسم الشريك
        </label>
        <p className="text-gray-900">{investor.partnerName}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نوع الشراكة
        </label>
        <p className="text-gray-900">{investor.partnershipType}</p>
      </div>
    </div>
  )
}

export default PartnerInfoForm
