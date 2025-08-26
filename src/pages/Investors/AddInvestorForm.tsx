import React, { useState } from 'react'
import GlobalArabicNumberInput from '../../components/forms/GlobalArabicNumberInput'
import { Investor } from './types'

interface AddInvestorFormProps {
  onAdd: (investor: Omit<Investor, 'id'>) => void
  onCancel: () => void
}

const AddInvestorForm: React.FC<AddInvestorFormProps> = ({ onAdd, onCancel }) => {
  const [newInvestor, setNewInvestor] = useState<Omit<Investor, 'id'>>({
    investorName: '',
    partnerName: '',
    partnershipType: 'نسبة',
    investorPercentage: 50,
    partnerPercentage: 50,
    civilId: '',
    joinDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(newInvestor)
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">إضافة مستثمر جديد</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم المستثمر</label>
            <input
              type="text"
              value={newInvestor.investorName}
              onChange={(e) => setNewInvestor({...newInvestor, investorName: e.target.value})}
              className="input-field"
              placeholder="أدخل اسم المستثمر"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم الشريك</label>
            <select
              value={newInvestor.partnerName}
              onChange={(e) => setNewInvestor({...newInvestor, partnerName: e.target.value})}
              className="input-field"
              required
            >
              <option value="">اختر الشريك</option>
              <option value="شركة هارموني بلس">شركة هارموني بلس</option>
              <option value="شركة الكويت للاستثمار">شركة الكويت للاستثمار</option>
              <option value="شركة الخليج المالية">شركة الخليج المالية</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نسبة المستثمر (%)</label>
            <GlobalArabicNumberInput
              type="text"
              value={newInvestor.investorPercentage.toString()}
              onChange={(value) => {
                const numValue = parseInt(value) || 0;
                setNewInvestor({...newInvestor, investorPercentage: numValue});
              }}
              className="input-field"
              placeholder="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نسبة الشريك (%)</label>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-lg font-semibold text-blue-600">
                {newInvestor.investorPercentage ? (100 - Number(newInvestor.investorPercentage)) : '٥٠'}%
              </div>
              <div className="text-sm text-gray-600">تلقائي: 100 - نسبة المستثمر</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الرقم المدني</label>
            <GlobalArabicNumberInput
              type="text"
              value={newInvestor.civilId}
              onChange={(value) => {
                if (/^\d*$/.test(value) && value.length <= 12) {
                  setNewInvestor({...newInvestor, civilId: value});
                }
              }}
              className="input-field"
              placeholder="أدخل الرقم المدني"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانضمام</label>
            <input
              type="date"
              value={newInvestor.joinDate}
              onChange={(e) => setNewInvestor({...newInvestor, joinDate: e.target.value})}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="btn-primary flex-1"
          >
            إضافة المستثمر
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddInvestorForm
