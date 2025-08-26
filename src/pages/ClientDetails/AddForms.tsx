// مكون نماذج الإضافة - تم إعادة تنظيمه حسب القاعدة الذهبية
// تم تقسيم الملف الأصلي إلى مكونات منفصلة متخصصة

import React from 'react'
import PaymentFormModal from '../../components/forms/PaymentFormModal'
import ExpenseFormModal from '../../components/forms/ExpenseFormModal'
import LawyerFeeFormModal from '../../components/forms/LawyerFeeFormModal'

interface NewPayment {
  amount: string
  date: string
  notes: string
}

interface NewExpense {
  amount: string
  date: string
  description: string
}

interface NewLawyerFee {
  amount: string
  date: string
  description: string
}

interface AddFormsProps {
  // Payment Form
  showAddPaymentModal: boolean
  newPayment: NewPayment
  setNewPayment: (payment: NewPayment) => void
  onAddPayment: () => void
  onClosePaymentModal: () => void

  // Expense Form
  showAddExpenseModal: boolean
  newExpense: NewExpense
  setNewExpense: (expense: NewExpense) => void
  onAddExpense: () => void
  onCloseExpenseModal: () => void

  // Lawyer Fee Form
  showAddLawyerFeeModal: boolean
  newLawyerFee: NewLawyerFee
  setNewLawyerFee: (fee: NewLawyerFee) => void
  onAddLawyerFee: () => void
  onCloseLawyerFeeModal: () => void
}

/**
 * مكون نماذج الإضافة الموحد - يجمع جميع النماذج المتخصصة
 * تم تقسيمه إلى مكونات منفصلة لتحسين القابلية للصيانة
 */
const AddForms: React.FC<AddFormsProps> = ({
  // Payment Form Props
  showAddPaymentModal,
  newPayment,
  setNewPayment,
  onAddPayment,
  onClosePaymentModal,

  // Expense Form Props
  showAddExpenseModal,
  newExpense,
  setNewExpense,
  onAddExpense,
  onCloseExpenseModal,

  // Lawyer Fee Form Props
  showAddLawyerFeeModal,
  newLawyerFee,
  setNewLawyerFee,
  onAddLawyerFee,
  onCloseLawyerFeeModal
}) => {
  return (
    <>
      {/* نموذج إضافة دفعة */}
      <PaymentFormModal
        isOpen={showAddPaymentModal}
        newPayment={newPayment}
        setNewPayment={setNewPayment}
        onAddPayment={onAddPayment}
        onClose={onClosePaymentModal}
      />

      {/* نموذج إضافة مصروف */}
      <ExpenseFormModal
        isOpen={showAddExpenseModal}
        newExpense={newExpense}
        setNewExpense={setNewExpense}
        onAddExpense={onAddExpense}
        onClose={onCloseExpenseModal}
      />

      {/* نموذج إضافة أتعاب محامي */}
      <LawyerFeeFormModal
        isOpen={showAddLawyerFeeModal}
        newLawyerFee={newLawyerFee}
        setNewLawyerFee={setNewLawyerFee}
        onAddLawyerFee={onAddLawyerFee}
        onClose={onCloseLawyerFeeModal}
      />
    </>
  )
}

export default AddForms

// تصدير الأنواع للاستخدام في مكونات أخرى
export type { NewPayment, NewExpense, NewLawyerFee }