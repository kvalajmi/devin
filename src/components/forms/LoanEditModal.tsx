import React, { useState, useEffect } from 'react'
import { Client } from '../../types/DatabaseTypes'
import ArabicNumberInput from './ArabicNumberInput'
import ArabicDateInput from './ArabicDateInput'
import LoanBasicInfoSection from './LoanEditModal/LoanBasicInfoSection'

interface LoanEditModalProps {
  isOpen: boolean
  client: Client | null
  onSave: (updates: Partial<Client>) => void
  onCancel: () => void
}

/**
 * نموذج تعديل بيانات القرض
 */
const LoanEditModal: React.FC<LoanEditModalProps> = ({
  isOpen,
  client,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    loanAmount: client?.loanAmount || 0,
    profit: client?.profit || 0,
    paymentPeriod: client?.paymentPeriod || 0,
    installmentValue: client?.installmentValue || 0,
    guarantee: client?.guarantee || '',
    fundingDate: client?.fundingDate || '',
    firstInstallmentDate: client?.firstInstallmentDate || '',
    pensionDate: client?.pensionDate || 0
  })

  // تحديث formData عند تغيير client
  useEffect(() => {
    if (client) {
      setFormData({
        loanAmount: client.loanAmount || 0,
        profit: client.profit || 0,
        paymentPeriod: client.paymentPeriod || 0,
        installmentValue: client.installmentValue || 0,
        guarantee: client.guarantee || '',
        fundingDate: client.fundingDate || '',
        firstInstallmentDate: client.firstInstallmentDate || '',
        pensionDate: client.pensionDate || 0
      })
    }
  }, [client])

  // تحديث formData عند فتح النموذج
  useEffect(() => {
    if (isOpen && client) {
      console.log('🔧 فتح نموذج تعديل القرض - بيانات العميل:', {
        loanAmount: client.loanAmount,
        profit: client.profit,
        paymentPeriod: client.paymentPeriod,
        installmentValue: client.installmentValue
      })
      
      setFormData({
        loanAmount: client.loanAmount || 0,
        profit: client.profit || 0,
        paymentPeriod: client.paymentPeriod || 0,
        installmentValue: client.installmentValue || 0,
        guarantee: client.guarantee || '',
        fundingDate: client.fundingDate || '',
        firstInstallmentDate: client.firstInstallmentDate || '',
        pensionDate: client.pensionDate || 0
      })
    }
  }, [isOpen, client])

  if (!isOpen || !client) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleInputChange = (field: keyof Client, value: string | number) => {
    console.log(`🔧 تغيير ${field}:`, value)
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onCancel}></div>
        
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-right shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">تعديل بيانات القرض</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* معلومات القرض الأساسية */}
            <LoanBasicInfoSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الضمان</label>
                <input
                  type="text"
                  value={formData.guarantee}
                  onChange={(e) => handleInputChange('guarantee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="نوع الضمان"
                />
              </div>

              <div>
                <ArabicDateInput
                  label="تاريخ التمويل"
                  value={formData.fundingDate || ''}
                  onChange={(value) => handleInputChange('fundingDate', value)}
                  required
                />
              </div>

              <div>
                <ArabicDateInput
                  label="تاريخ أول قسط"
                  value={formData.firstInstallmentDate || ''}
                  onChange={(value) => handleInputChange('firstInstallmentDate', value)}
                  required
                />
              </div>

              <div>
                <ArabicNumberInput
                  label="تاريخ نزول المعاش"
                  value={formData.pensionDate || 0}
                  onChange={(value) => handleInputChange('pensionDate', Number(value))}
                  placeholder="اليوم (١-٢٨)"
                  min={1}
                  max={28}
                />
              </div>
            </div>

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
                className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
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

export default LoanEditModal
