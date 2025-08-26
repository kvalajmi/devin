import React from 'react'
import ExpensesTable from '../ExpensesTable'
import LawyerFeesTable from '../LawyerFeesTable'
import ExpenseFormModal from '../../../components/forms/ExpenseFormModal'
import LawyerFeeFormModal from '../../../components/forms/LawyerFeeFormModal'
import EditExpenseModal from '../../../components/forms/EditExpenseModal'
import EditLawyerFeeModal from '../../../components/forms/EditLawyerFeeModal'
import { useClientData } from '../context/ClientDataContext'

interface ClientExpensesManagerProps {
  // لا نحتاج props بعد الآن - البيانات من Context
}

const ClientExpensesManager: React.FC<ClientExpensesManagerProps> = () => {
  // استخدام البيانات من Context
  const {
    expenses,
    lawyerFees,
    addExpense,
    updateExpense,
    deleteExpense,
    addLawyerFee,
    updateLawyerFee,
    deleteLawyerFee
  } = useClientData()

  // حالات النماذج المحلية للمصروفات
  const [showAddExpenseModal, setShowAddExpenseModal] = React.useState(false)
  const [showEditExpenseModal, setShowEditExpenseModal] = React.useState(false)
  const [editingExpense, setEditingExpense] = React.useState<any>(null)
  const [newExpense, setNewExpense] = React.useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })

  // حالات النماذج المحلية لأتعاب المحامي
  const [showAddLawyerFeeModal, setShowAddLawyerFeeModal] = React.useState(false)
  const [showEditLawyerFeeModal, setShowEditLawyerFeeModal] = React.useState(false)
  const [editingLawyerFee, setEditingLawyerFee] = React.useState<any>(null)
  const [newLawyerFee, setNewLawyerFee] = React.useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })

  // دوال معالجة المصروفات
  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.date || !newExpense.description) return

    addExpense({
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      description: newExpense.description
    })

    setNewExpense({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    })
    setShowAddExpenseModal(false)
  }

  const handleEditExpense = (expenseId: number) => {
    const expense = expenses.find(e => e.id === expenseId)
    if (expense) {
      setEditingExpense(expense)
      setShowEditExpenseModal(true)
    }
  }

  const confirmEditExpense = (newAmount: number, newDescription?: string) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, {
        amount: newAmount,
        description: newDescription || editingExpense.description
      })
    }
    setShowEditExpenseModal(false)
    setEditingExpense(null)
  }

  const handleDeleteExpense = async (expenseId: number) => {
    const { ConfirmationHelpers } = await import('../../../utils/confirmation-helpers')
    const confirmed = await ConfirmationHelpers.deleteItem('هذا المصروف')
    if (confirmed) {
      deleteExpense(expenseId)
    }
  }

  const cancelEditExpense = () => {
    setShowEditExpenseModal(false)
    setEditingExpense(null)
  }

  // دوال معالجة أتعاب المحامي
  const handleAddLawyerFee = () => {
    if (!newLawyerFee.amount || !newLawyerFee.date || !newLawyerFee.description) return

    addLawyerFee({
      amount: parseFloat(newLawyerFee.amount),
      date: newLawyerFee.date,
      description: newLawyerFee.description
    })

    setNewLawyerFee({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    })
    setShowAddLawyerFeeModal(false)
  }

  const handleEditLawyerFee = (feeId: number) => {
    const fee = lawyerFees.find(f => f.id === feeId)
    if (fee) {
      setEditingLawyerFee(fee)
      setShowEditLawyerFeeModal(true)
    }
  }

  const confirmEditLawyerFee = (newAmount: number, newDescription?: string) => {
    if (editingLawyerFee) {
      updateLawyerFee(editingLawyerFee.id, {
        amount: newAmount,
        description: newDescription || editingLawyerFee.description
      })
    }
    setShowEditLawyerFeeModal(false)
    setEditingLawyerFee(null)
  }

  const handleDeleteLawyerFee = async (feeId: number) => {
    const { ConfirmationHelpers } = await import('../../../utils/confirmation-helpers')
    const confirmed = await ConfirmationHelpers.deleteItem('أتعاب المحامي')
    if (confirmed) {
      deleteLawyerFee(feeId)
    }
  }

  const cancelEditLawyerFee = () => {
    setShowEditLawyerFeeModal(false)
    setEditingLawyerFee(null)
  }

  return (
    <div className="space-y-6">
      {/* قسم المصروفات */}
      <div className="space-y-4">

        <ExpensesTable
          expenses={expenses}
          onAddExpense={() => setShowAddExpenseModal(true)}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      </div>

      {/* قسم أتعاب المحاماة */}
      <div className="space-y-4">

        <LawyerFeesTable
          lawyerFees={lawyerFees}
          onAddLawyerFee={() => setShowAddLawyerFeeModal(true)}
          onEditLawyerFee={handleEditLawyerFee}
          onDeleteLawyerFee={handleDeleteLawyerFee}
        />
      </div>

      {/* نموذج إضافة مصروف */}
      <ExpenseFormModal
        isOpen={showAddExpenseModal}
        newExpense={newExpense}
        setNewExpense={setNewExpense}
        onAddExpense={handleAddExpense}
        onClose={() => setShowAddExpenseModal(false)}
      />

      {/* نموذج تعديل مصروف */}
      <EditExpenseModal
        isOpen={showEditExpenseModal}
        expense={editingExpense}
        onSave={confirmEditExpense}
        onClose={cancelEditExpense}
      />

      {/* نموذج إضافة أتعاب محامي */}
      <LawyerFeeFormModal
        isOpen={showAddLawyerFeeModal}
        newLawyerFee={newLawyerFee}
        setNewLawyerFee={setNewLawyerFee}
        onAddLawyerFee={handleAddLawyerFee}
        onClose={() => setShowAddLawyerFeeModal(false)}
      />

      {/* نموذج تعديل أتعاب محامي */}
      <EditLawyerFeeModal
        isOpen={showEditLawyerFeeModal}
        lawyerFee={editingLawyerFee}
        onSave={confirmEditLawyerFee}
        onClose={cancelEditLawyerFee}
      />
    </div>
  )
}

export default ClientExpensesManager
