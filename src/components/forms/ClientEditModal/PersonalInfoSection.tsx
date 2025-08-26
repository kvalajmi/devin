import React from 'react'
import { Client } from '../../../types/DatabaseTypes'

interface PersonalInfoSectionProps {
  formData: Partial<Client>
  onInputChange: (field: keyof Client, value: string) => void
}

/**
 * قسم المعلومات الشخصية في نموذج تعديل العميل
 */
const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-700 border-b border-gray-200 pb-2">
        المعلومات الشخصية
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الرقم المدني</label>
          <input
            type="text"
            value={formData.civilId}
            onChange={(e) => onInputChange('civilId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">المهنة</label>
          <input
            type="text"
            value={formData.job}
            onChange={(e) => onInputChange('job', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoSection
