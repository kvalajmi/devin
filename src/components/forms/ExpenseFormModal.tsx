import React from 'react'
import ArabicNumberInput from './ArabicNumberInput'

interface NewExpense {
  amount: string
  date: string
  description: string
}

interface ExpenseFormModalProps {
  isOpen: boolean
  newExpense: NewExpense
  setNewExpense: (expense: NewExpense) => void
  onAddExpense: () => void
  onClose: () => void
}

/**
 * نموذج إضافة مصروف جديد
 */
const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  newExpense,
  setNewExpense,
  onAddExpense,
  onClose
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-right shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">إضافة مصروف جديد</h3>
          
          <div className="space-y-4">
            <div>
              <ArabicNumberInput
                label="المبلغ (د.ك)"
                value={newExpense.amount}
                onChange={(value) => setNewExpense({...newExpense, amount: value})}
                placeholder="أدخل مبلغ المصروف"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وصف المصروف</label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
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
              onClick={onAddExpense}
              className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              إضافة المصروف
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseFormModal
