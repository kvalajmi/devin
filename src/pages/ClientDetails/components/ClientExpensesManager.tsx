import React from 'react'
import ExpensesTable from '../ExpensesTable'
import LawyerFeesTable from '../LawyerFeesTable'
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

  const handleDeleteExpense = (expenseId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
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

  const handleDeleteLawyerFee = (feeId: number) => {
    if (confirm('هل أنت متأكد من حذف أتعاب المحامي؟')) {
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
          onAddExpense={handleAddExpense}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
          showAddModal={showAddExpenseModal}
          setShowAddModal={setShowAddExpenseModal}
          showEditModal={showEditExpenseModal}
          setShowEditModal={setShowEditExpenseModal}
          editingExpense={editingExpense}
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          confirmEditExpense={confirmEditExpense}
          cancelEditExpense={cancelEditExpense}
        />
      </div>

      {/* قسم أتعاب المحاماة */}
      <div className="space-y-4">

        <LawyerFeesTable
          lawyerFees={lawyerFees}
          onAddLawyerFee={handleAddLawyerFee}
          onEditLawyerFee={handleEditLawyerFee}
          onDeleteLawyerFee={handleDeleteLawyerFee}
          showAddModal={showAddLawyerFeeModal}
          setShowAddModal={setShowAddLawyerFeeModal}
          showEditModal={showEditLawyerFeeModal}
          setShowEditModal={setShowEditLawyerFeeModal}
          editingLawyerFee={editingLawyerFee}
          newLawyerFee={newLawyerFee}
          setNewLawyerFee={setNewLawyerFee}
          confirmEditLawyerFee={confirmEditLawyerFee}
          cancelEditLawyerFee={cancelEditLawyerFee}
        />
      </div>
    </div>
  )
}

export default ClientExpensesManager
