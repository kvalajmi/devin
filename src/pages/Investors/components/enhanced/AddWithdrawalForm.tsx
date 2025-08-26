import React, { useState } from 'react'
import { handleNumberInput } from '../../utils/formatters'

interface AddWithdrawalFormProps {
  onAdd: (record: { amount: number; date: string; notes: string }) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  title: string
  type: 'investor' | 'partner'
}

/**
 * نموذج إضافة سحب جديد (للمستثمر أو الشريك)
 * مسؤولية واحدة: إدارة نموذج السحب مع تحويل الأرقام العربية
 */
const AddWithdrawalForm: React.FC<AddWithdrawalFormProps> = ({
  onAdd,
  onCancel,
  isLoading = false,
  title,
  type
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.amount || !formData.date) {
      console.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      setIsSubmitting(true)
      await onAdd({
        amount: parseFloat(formData.amount),
        date: formData.date,
        notes: formData.notes
      })
      
      // إعادة تعيين النموذج
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      })
    } catch (error) {
      console.error('حدث خطأ في إضافة السحب')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    // معالجة خاصة لحقل المبلغ
    if (field === 'amount') {
      const processedValue = handleNumberInput(value)
      setFormData(prev => ({ ...prev, [field]: processedValue }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const bgColor = type === 'investor' ? 'bg-red-50' : 'bg-orange-50'
  const ringColor = type === 'investor' ? 'focus:ring-red-500' : 'focus:ring-orange-500'
  const buttonColor = type === 'investor' 
    ? 'bg-red-600 hover:bg-red-700' 
    : 'bg-orange-600 hover:bg-orange-700'

  return (
    <div className={`p-4 ${bgColor} border-b`}>
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المبلغ (د.ك) *
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${ringColor} focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            placeholder="0.000"
            disabled={isLoading || isSubmitting}
            dir="ltr"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            التاريخ *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${ringColor} focus:border-transparent`}
            disabled={isLoading || isSubmitting}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البيان
          </label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${ringColor} focus:border-transparent`}
            placeholder="وصف العملية..."
            disabled={isLoading || isSubmitting}
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2 space-x-reverse">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          disabled={isLoading || isSubmitting}
        >
          إلغاء
        </button>
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 ${buttonColor} text-white rounded-lg transition-colors disabled:opacity-50`}
          disabled={isLoading || isSubmitting}
        >
          {isSubmitting ? 'جاري السحب...' : 'تأكيد السحب'}
        </button>
      </div>
    </div>
  )
}

export default AddWithdrawalForm
