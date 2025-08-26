import React from 'react'
import { Client } from '../../../types/DatabaseTypes'

interface AddressSectionProps {
  formData: Partial<Client>
  onInputChange: (field: keyof Client, value: string) => void
}

/**
 * قسم العنوان في نموذج تعديل العميل
 */
const AddressSection: React.FC<AddressSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-700 border-b border-gray-200 pb-2">
        العنوان
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">المحافظة</label>
          <input
            type="text"
            value={formData.governorate}
            onChange={(e) => onInputChange('governorate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة</label>
          <input
            type="text"
            value={formData.area}
            onChange={(e) => onInputChange('area', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">القطعة</label>
          <input
            type="text"
            value={formData.block}
            onChange={(e) => onInputChange('block', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الشارع</label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => onInputChange('street', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الجادة</label>
          <input
            type="text"
            value={formData.avenue}
            onChange={(e) => onInputChange('avenue', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">رقم المنزل</label>
          <input
            type="text"
            value={formData.houseNumber}
            onChange={(e) => onInputChange('houseNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}

export default AddressSection
