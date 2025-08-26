import React, { useState, useEffect } from 'react'
import { Client } from '../../types/DatabaseTypes'
import PersonalInfoSection from './ClientEditModal/PersonalInfoSection'
import AddressSection from './ClientEditModal/AddressSection'

interface ClientEditModalProps {
  isOpen: boolean
  client: Client | null
  onSave: (updates: Partial<Client>) => void
  onCancel: () => void
}

/**
 * نموذج تعديل بيانات العميل
 */
const ClientEditModal: React.FC<ClientEditModalProps> = ({
  isOpen,
  client,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: client?.name || '',
    civilId: client?.civilId || '',
    phoneNumber: client?.phoneNumber || '',
    job: client?.job || '',
    address: client?.address || '',
    governorate: client?.governorate || '',
    area: client?.area || '',
    block: client?.block || '',
    street: client?.street || '',
    avenue: client?.avenue || '',
    houseNumber: client?.houseNumber || ''
  })

  // تحديث formData عند تغيير client أو فتح النموذج
  useEffect(() => {
    if (isOpen && client) {
      console.log('🔧 فتح نموذج تعديل العميل - بيانات العميل:', {
        name: client.name,
        civilId: client.civilId,
        phoneNumber: client.phoneNumber
      })
      
      setFormData({
        name: client.name || '',
        civilId: client.civilId || '',
        phoneNumber: client.phoneNumber || '',
        job: client.job || '',
        address: client.address || '',
        governorate: client.governorate || '',
        area: client.area || '',
        block: client.block || '',
        street: client.street || '',
        avenue: client.avenue || '',
        houseNumber: client.houseNumber || ''
      })
    }
  }, [isOpen, client])

  if (!isOpen || !client) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleInputChange = (field: keyof Client, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onCancel}></div>
        
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-right shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">تعديل بيانات العميل</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* المعلومات الشخصية */}
            <PersonalInfoSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />
            
            {/* العنوان */}
            <AddressSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />

            <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ClientEditModal
