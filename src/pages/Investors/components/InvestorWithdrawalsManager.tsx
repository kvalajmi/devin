import React, { useState, useCallback } from 'react'
import { Investor, WithdrawalRecord, FundingRecord, PartnerWithdrawalRecord } from '../types'
import { SupabaseDatabase } from '../../../utils/supabase-simple'

interface InvestorWithdrawalsManagerProps {
  investor: Investor
  withdrawalRecords: WithdrawalRecord[]
  fundingRecords: FundingRecord[]
  partnerWithdrawalRecords: PartnerWithdrawalRecord[]
  onDataUpdate: () => void
  showAlert: (type: 'success' | 'error' | 'warning', message: string) => void
}

const InvestorWithdrawalsManager: React.FC<InvestorWithdrawalsManagerProps> = ({ 
  investor, 
  withdrawalRecords, 
  fundingRecords,
  partnerWithdrawalRecords,
  onDataUpdate, 
  showAlert 
}) => {
  const [showAddWithdrawalForm, setShowAddWithdrawalForm] = useState(false)
  const [newWithdrawal, setNewWithdrawal] = useState<Omit<WithdrawalRecord, 'id' | 'investorId'>>({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  // دالة إضافة السحب
  const addWithdrawal = useCallback(async () => {
    try {
      if (!newWithdrawal.amount || newWithdrawal.amount <= 0) {
        showAlert('error', 'يرجى إدخال مبلغ صحيح')
        return
      }

      // التحقق من الرصيد المتاح
      const totalFunding = fundingRecords.reduce((sum, record) => sum + record.amount, 0)
      const totalWithdrawals = withdrawalRecords.reduce((sum, record) => sum + record.amount, 0)
      const totalPartnerWithdrawals = partnerWithdrawalRecords.reduce((sum, record) => sum + record.amount, 0)
      const availableBalance = totalFunding - totalWithdrawals - totalPartnerWithdrawals

      if (newWithdrawal.amount > availableBalance) {
        showAlert('error', `لا يمكن سحب ${newWithdrawal.amount.toLocaleString()} د.ك! الرصيد المتاح هو ${availableBalance.toLocaleString()} د.ك فقط.`)
        return
      }

      const withdrawalToAdd = {
        investor_id: investor.id,
        amount: newWithdrawal.amount,
        date: newWithdrawal.date,
        notes: newWithdrawal.notes
      }

      const result = await SupabaseDatabase.addWithdrawalRecord(withdrawalToAdd)
      if (result) {
        onDataUpdate()
        setNewWithdrawal({ amount: 0, date: new Date().toISOString().split('T')[0], notes: '' })
        setShowAddWithdrawalForm(false)
        showAlert('success', 'تم إضافة السحب بنجاح')
      } else {
        showAlert('error', 'حدث خطأ أثناء إضافة السحب')
      }
    } catch (error) {
      console.error('خطأ في إضافة السحب:', error)
      showAlert('error', 'حدث خطأ أثناء إضافة السحب')
    }
  }, [newWithdrawal, investor.id, fundingRecords, withdrawalRecords, partnerWithdrawalRecords, onDataUpdate, showAlert])

  // حساب إجمالي السحوبات
  const getTotalWithdrawals = () => {
    return withdrawalRecords.reduce((sum, record) => sum + record.amount, 0)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
      <div className="absolute right-0 top-0 w-1 h-full bg-emerald-500"></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center ml-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">سحوبات المستثمر</h3>
              <div className="text-xs text-gray-500">إدارة سحوبات المستثمر</div>
            </div>
          </div>
          <button
            onClick={() => setShowAddWithdrawalForm(!showAddWithdrawalForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showAddWithdrawalForm ? 'إلغاء' : '+ إضافة سحب'}
          </button>
        </div>

        {/* نموذج إضافة السحب */}
        {showAddWithdrawalForm && (
          <div className="mb-4 p-4 bg-emerald-50 rounded border">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (د.ك)</label>
                <input
                  type="number"
                  value={newWithdrawal.amount}
                  onChange={(e) => setNewWithdrawal({...newWithdrawal, amount: Number(e.target.value)})}
                  className="input-field"
                  placeholder="أدخل مبلغ السحب"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                <input
                  type="date"
                  value={newWithdrawal.date}
                  onChange={(e) => setNewWithdrawal({...newWithdrawal, date: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                <textarea
                  value={newWithdrawal.notes}
                  onChange={(e) => setNewWithdrawal({...newWithdrawal, notes: e.target.value})}
                  className="input-field"
                  rows={2}
                  placeholder="ملاحظات اختيارية"
                />
              </div>
              <button
                onClick={addWithdrawal}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded"
              >
                إضافة السحب
              </button>
            </div>
          </div>
        )}

        {/* عرض إجمالي السحوبات */}
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {getTotalWithdrawals().toLocaleString()} د.ك
            </div>
            <div className="text-sm font-medium text-emerald-700">إجمالي سحوبات المستثمر</div>
            <div className="text-xs text-gray-600 mt-1">
              {withdrawalRecords.length} عملية سحب
            </div>
          </div>
        </div>

        {/* قائمة السحوبات */}
        {withdrawalRecords.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {withdrawalRecords.slice(0, 5).map((record) => (
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
            {withdrawalRecords.length > 5 && (
              <div className="text-center text-xs text-gray-500">
                و{withdrawalRecords.length - 5} سحب إضافي...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default InvestorWithdrawalsManager
