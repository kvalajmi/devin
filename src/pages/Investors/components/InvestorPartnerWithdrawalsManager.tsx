import React, { useState, useCallback } from 'react'
import { Investor, PartnerWithdrawalRecord, FundingRecord, WithdrawalRecord } from '../types'
import { SupabaseDatabase } from '../../../utils/supabase-simple'

interface InvestorPartnerWithdrawalsManagerProps {
  investor: Investor
  partnerWithdrawalRecords: PartnerWithdrawalRecord[]
  fundingRecords: FundingRecord[]
  withdrawalRecords: WithdrawalRecord[]
  onDataUpdate: () => void
  showAlert: (type: 'success' | 'error' | 'warning', message: string) => void
}

const InvestorPartnerWithdrawalsManager: React.FC<InvestorPartnerWithdrawalsManagerProps> = ({ 
  investor, 
  partnerWithdrawalRecords, 
  fundingRecords,
  withdrawalRecords,
  onDataUpdate, 
  showAlert 
}) => {
  const [showAddPartnerWithdrawalForm, setShowAddPartnerWithdrawalForm] = useState(false)
  const [newPartnerWithdrawal, setNewPartnerWithdrawal] = useState<Omit<PartnerWithdrawalRecord, 'id' | 'investorId'>>({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  // دالة إضافة سحب الشريك
  const addPartnerWithdrawal = useCallback(async () => {
    try {
      if (!newPartnerWithdrawal.amount || newPartnerWithdrawal.amount <= 0) {
        showAlert('error', 'يرجى إدخال مبلغ صحيح')
        return
      }

      // التحقق من الرصيد المتاح
      const totalFunding = fundingRecords.reduce((sum, record) => sum + record.amount, 0)
      const totalWithdrawals = withdrawalRecords.reduce((sum, record) => sum + record.amount, 0)
      const totalPartnerWithdrawals = partnerWithdrawalRecords.reduce((sum, record) => sum + record.amount, 0)
      const availableBalance = totalFunding - totalWithdrawals - totalPartnerWithdrawals

      if (newPartnerWithdrawal.amount > availableBalance) {
        showAlert('error', `لا يمكن للشريك سحب ${newPartnerWithdrawal.amount.toLocaleString()} د.ك! الرصيد المتاح هو ${availableBalance.toLocaleString()} د.ك فقط.`)
        return
      }

      const partnerWithdrawalToAdd = {
        investor_id: investor.id,
        amount: newPartnerWithdrawal.amount,
        date: newPartnerWithdrawal.date,
        notes: newPartnerWithdrawal.notes
      }

      const result = await SupabaseDatabase.addPartnerWithdrawalRecord(partnerWithdrawalToAdd)
      if (result) {
        onDataUpdate()
        setNewPartnerWithdrawal({ amount: 0, date: new Date().toISOString().split('T')[0], notes: '' })
        setShowAddPartnerWithdrawalForm(false)
        showAlert('success', 'تم إضافة سحب الشريك بنجاح')
      } else {
        showAlert('error', 'حدث خطأ أثناء إضافة سحب الشريك')
      }
    } catch (error) {
      console.error('خطأ في إضافة سحب الشريك:', error)
      showAlert('error', 'حدث خطأ أثناء إضافة سحب الشريك')
    }
  }, [newPartnerWithdrawal, investor.id, fundingRecords, withdrawalRecords, partnerWithdrawalRecords, onDataUpdate, showAlert])

  // حساب إجمالي سحوبات الشريك
  const getTotalPartnerWithdrawals = () => {
    return partnerWithdrawalRecords.reduce((sum, record) => sum + record.amount, 0)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
      <div className="absolute right-0 top-0 w-1 h-full bg-amber-500"></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center ml-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">سحوبات الشريك</h3>
              <div className="text-xs text-gray-500">إدارة سحوبات الشريك</div>
            </div>
          </div>
          <button
            onClick={() => setShowAddPartnerWithdrawalForm(!showAddPartnerWithdrawalForm)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showAddPartnerWithdrawalForm ? 'إلغاء' : '+ إضافة سحب'}
          </button>
        </div>

        {/* نموذج إضافة سحب الشريك */}
        {showAddPartnerWithdrawalForm && (
          <div className="mb-4 p-4 bg-amber-50 rounded border">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (د.ك)</label>
                <input
                  type="number"
                  value={newPartnerWithdrawal.amount}
                  onChange={(e) => setNewPartnerWithdrawal({...newPartnerWithdrawal, amount: Number(e.target.value)})}
                  className="input-field"
                  placeholder="أدخل مبلغ السحب"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                <input
                  type="date"
                  value={newPartnerWithdrawal.date}
                  onChange={(e) => setNewPartnerWithdrawal({...newPartnerWithdrawal, date: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                <textarea
                  value={newPartnerWithdrawal.notes}
                  onChange={(e) => setNewPartnerWithdrawal({...newPartnerWithdrawal, notes: e.target.value})}
                  className="input-field"
                  rows={2}
                  placeholder="ملاحظات اختيارية"
                />
              </div>
              <button
                onClick={addPartnerWithdrawal}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded"
              >
                إضافة السحب
              </button>
            </div>
          </div>
        )}

        {/* عرض إجمالي سحوبات الشريك */}
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 mb-1">
              {getTotalPartnerWithdrawals().toLocaleString()} د.ك
            </div>
            <div className="text-sm font-medium text-amber-700">إجمالي سحوبات الشريك</div>
            <div className="text-xs text-gray-600 mt-1">
              {partnerWithdrawalRecords.length} عملية سحب
            </div>
          </div>
        </div>

        {/* قائمة سحوبات الشريك */}
        {partnerWithdrawalRecords.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {partnerWithdrawalRecords.slice(0, 5).map((record) => (
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
            {partnerWithdrawalRecords.length > 5 && (
              <div className="text-center text-xs text-gray-500">
                و{partnerWithdrawalRecords.length - 5} سحب إضافي...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default InvestorPartnerWithdrawalsManager
