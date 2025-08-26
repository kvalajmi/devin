import React from 'react'
import ArabicNumberInput from './ArabicNumberInput'

interface NewLawyerFee {
  amount: string
  date: string
  description: string
}

interface LawyerFeeFormModalProps {
  isOpen: boolean
  newLawyerFee: NewLawyerFee
  setNewLawyerFee: (fee: NewLawyerFee) => void
  onAddLawyerFee: () => void
  onClose: () => void
}

/**
 * نموذج إضافة أتعاب محامي جديدة
 */
const LawyerFeeFormModal: React.FC<LawyerFeeFormModalProps> = ({
  isOpen,
  newLawyerFee,
  setNewLawyerFee,
  onAddLawyerFee,
  onClose
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-right shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">إضافة أتعاب محامي</h3>
          
          <div className="space-y-4">
            <div>
              <ArabicNumberInput
                label="المبلغ (د.ك)"
                value={newLawyerFee.amount}
                onChange={(value) => setNewLawyerFee({...newLawyerFee, amount: value})}
                placeholder="أدخل مبلغ الأتعاب"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
              <input
                type="date"
                value={newLawyerFee.date}
                onChange={(e) => setNewLawyerFee({...newLawyerFee, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وصف الأتعاب</label>
              <input
                type="text"
                value={newLawyerFee.description}
                onChange={(e) => setNewLawyerFee({...newLawyerFee, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="أدخل وصف الأتعاب"
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
              onClick={onAddLawyerFee}
              className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
            >
              إضافة الأتعاب
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LawyerFeeFormModal
