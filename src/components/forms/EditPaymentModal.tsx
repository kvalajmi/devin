import React, { useState, useEffect } from 'react'
import GlobalArabicNumberInput from './GlobalArabicNumberInput'

interface EditPaymentModalProps {
  isOpen: boolean
  payment: any
  onSave: (amount: number, notes?: string) => void
  onClose: () => void
}

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({
  isOpen,
  payment,
  onSave,
  onClose
}) => {
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount?.toString() || '')
      setNotes(payment.notes || '')
    }
  }, [payment])

  const handleSave = () => {
    const numAmount = parseFloat(amount)
    if (!isNaN(numAmount)) {
      onSave(numAmount, notes)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-right shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">تعديل الدفعة</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ (د.ك)</label>
              <GlobalArabicNumberInput
                value={amount}
                onChange={setAmount}
                placeholder="أدخل المبلغ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="أدخل أي ملاحظات"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              حفظ التعديل
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPaymentModal
