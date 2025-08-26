import React, { useState, useEffect } from 'react'
import GlobalArabicNumberInput from './GlobalArabicNumberInput'

interface EditExpenseModalProps {
  isOpen: boolean
  expense: any
  onSave: (amount: number, description?: string) => void
  onClose: () => void
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isOpen,
  expense,
  onSave,
  onClose
}) => {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount?.toString() || '')
      setDescription(expense.description || '')
    }
  }, [expense])

  const handleSave = () => {
    const numAmount = parseFloat(amount)
    if (!isNaN(numAmount)) {
      onSave(numAmount, description)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-right shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">تعديل المصروف</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ (د.ك)</label>
              <GlobalArabicNumberInput
                value={amount}
                onChange={setAmount}
                placeholder="أدخل المبلغ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وصف المصروف</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="أدخل وصف المصروف"
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
              className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              حفظ التعديل
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditExpenseModal
