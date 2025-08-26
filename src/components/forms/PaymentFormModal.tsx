import React from 'react'
import ArabicNumberInput from './ArabicNumberInput'

interface NewPayment {
  amount: string
  date: string
  notes: string
}

interface PaymentFormModalProps {
  isOpen: boolean
  newPayment: NewPayment
  setNewPayment: (payment: NewPayment) => void
  onAddPayment: () => void
  onClose: () => void
}

/**
 * نموذج إضافة دفعة جديدة
 */
const PaymentFormModal: React.FC<PaymentFormModalProps> = ({
  isOpen,
  newPayment,
  setNewPayment,
  onAddPayment,
  onClose
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-right shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">إضافة دفعة جديدة</h3>
          
          <div className="space-y-4">
            <div>
              <ArabicNumberInput
                label="المبلغ (د.ك)"
                value={newPayment.amount}
                onChange={(value) => setNewPayment({...newPayment, amount: value})}
                placeholder="أدخل مبلغ الدفعة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
              <input
                type="date"
                value={newPayment.date}
                onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات (اختياري)</label>
              <textarea
                value={newPayment.notes}
                onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="أدخل أي ملاحظات إضافية"
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
              onClick={onAddPayment}
              className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              إضافة الدفعة
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFormModal
