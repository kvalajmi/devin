import React, { useState, useCallback } from 'react'
import { Investor, FundingRecord } from '../types'
import { SupabaseDatabase } from '../../../utils/supabase-simple'

interface InvestorFundingManagerProps {
  investor: Investor
  fundingRecords: FundingRecord[]
  onDataUpdate: () => void
  showAlert: (type: 'success' | 'error' | 'warning', message: string) => void
}

const InvestorFundingManager: React.FC<InvestorFundingManagerProps> = ({ 
  investor, 
  fundingRecords, 
  onDataUpdate, 
  showAlert 
}) => {
  const [showAddFundingForm, setShowAddFundingForm] = useState(false)
  const [newFunding, setNewFunding] = useState<Omit<FundingRecord, 'id' | 'investorId'>>({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  // دالة إضافة التمويل
  const addFunding = useCallback(async () => {
    try {
      if (!newFunding.amount || newFunding.amount <= 0) {
        showAlert('error', 'يرجى إدخال مبلغ صحيح')
        return
      }

      const fundingToAdd = {
        investor_id: investor.id,
        amount: newFunding.amount,
        date: newFunding.date,
        notes: newFunding.notes
      }

      const result = await SupabaseDatabase.addFundingRecord(fundingToAdd)
      if (result) {
        onDataUpdate()
        setNewFunding({ amount: 0, date: new Date().toISOString().split('T')[0], notes: '' })
        setShowAddFundingForm(false)
        showAlert('success', 'تم إضافة التمويل بنجاح')
      } else {
        showAlert('error', 'حدث خطأ أثناء إضافة التمويل')
      }
    } catch (error) {
      console.error('خطأ في إضافة التمويل:', error)
      showAlert('error', 'حدث خطأ أثناء إضافة التمويل')
    }
  }, [newFunding, investor.id, onDataUpdate, showAlert])

  // حساب إجمالي التمويل
  const getTotalFunding = () => {
    return fundingRecords.reduce((sum, record) => sum + record.amount, 0)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
      <div className="absolute right-0 top-0 w-1 h-full bg-blue-500"></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center ml-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">إدارة التمويل</h3>
              <div className="text-xs text-gray-500">إضافة وإدارة التمويلات</div>
            </div>
          </div>
          <button
            onClick={() => setShowAddFundingForm(!showAddFundingForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showAddFundingForm ? 'إلغاء' : '+ إضافة تمويل'}
          </button>
        </div>

        {/* نموذج إضافة التمويل */}
        {showAddFundingForm && (
          <div className="mb-4 p-4 bg-blue-50 rounded border">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (د.ك)</label>
                <input
                  type="number"
                  value={newFunding.amount}
                  onChange={(e) => setNewFunding({...newFunding, amount: Number(e.target.value)})}
                  className="input-field"
                  placeholder="أدخل مبلغ التمويل"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                <input
                  type="date"
                  value={newFunding.date}
                  onChange={(e) => setNewFunding({...newFunding, date: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                <textarea
                  value={newFunding.notes}
                  onChange={(e) => setNewFunding({...newFunding, notes: e.target.value})}
                  className="input-field"
                  rows={2}
                  placeholder="ملاحظات اختيارية"
                />
              </div>
              <button
                onClick={addFunding}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                إضافة التمويل
              </button>
            </div>
          </div>
        )}

        {/* عرض إجمالي التمويل */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {getTotalFunding().toLocaleString()} د.ك
            </div>
            <div className="text-sm font-medium text-blue-700">إجمالي التمويل الفعلي</div>
            <div className="text-xs text-gray-600 mt-1">
              {fundingRecords.length} عملية تمويل
            </div>
          </div>
        </div>

        {/* قائمة التمويلات */}
        {fundingRecords.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {fundingRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="bg-white p-2 rounded border text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{record.amount.toLocaleString()} د.ك</span>
                  <span className="text-gray-500">{record.date}</span>
                </div>
                {record.notes && (
                  <div className="text-gray-600 text-xs mt-1">{record.notes}</div>
                )}
              </div>
            ))}
            {fundingRecords.length > 5 && (
              <div className="text-center text-xs text-gray-500">
                و{fundingRecords.length - 5} تمويل إضافي...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default InvestorFundingManager
