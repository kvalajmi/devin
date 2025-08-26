import { useState } from 'react'
import { ExpenseService } from '../services/ExpenseService'

interface ExpenseData {
  amount: string
  date: string
  description: string
}

/**
 * خطاف مخصص لإدارة بيانات المصروفات وأتعاب المحامي
 */
export const useExpenseData = (onNotification: (type: string, message: string) => void) => {
  // بيانات المصروفات (وهمية)
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2024-01-10', amount: 50, description: 'رسوم إدارية', entryUser: 'سارة الأحمد', entryDateTime: '2024-01-10 11:45:00' },
    { id: 2, date: '2024-02-05', amount: 25, description: 'رسوم تحويل', entryUser: 'خالد المطيري', entryDateTime: '2024-02-05 16:30:00' }
  ])

  const [lawyerFees, setLawyerFees] = useState([
    { id: 1, date: '2024-01-20', amount: 100, description: 'استشارة قانونية', entryUser: 'نورا الصالح', entryDateTime: '2024-01-20 13:00:00' }
  ])

  // حالات النماذج
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [showAddLawyerFeeModal, setShowAddLawyerFeeModal] = useState(false)
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false)
  const [showEditLawyerFeeModal, setShowEditLawyerFeeModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)
  const [editingLawyerFee, setEditingLawyerFee] = useState<any>(null)

  // بيانات جديدة
  const [newExpense, setNewExpense] = useState<ExpenseData>({
    amount: '', 
    date: new Date().toISOString().split('T')[0], 
    description: ''
  })

  const [newLawyerFee, setNewLawyerFee] = useState<ExpenseData>({
    amount: '', 
    date: new Date().toISOString().split('T')[0], 
    description: ''
  })

  // معالجات المصروفات
  const handleAddExpense = () => {
    try {
      const updatedExpenses = ExpenseService.addExpense(expenses, newExpense)
      setExpenses(updatedExpenses)
      onNotification('success', 'تم إضافة المصروف بنجاح!')
      setNewExpense({ amount: '', date: new Date().toISOString().split('T')[0], description: '' })
      setShowAddExpenseModal(false)
    } catch (error) {
      onNotification('error', 'خطأ في إضافة المصروف')
    }
  }

  const handleEditExpense = (expense: any) => {
    console.log('🔧 تعديل المصروف:', expense)
    setEditingExpense(expense)
    setShowEditExpenseModal(true)
  }

  const confirmEditExpense = (newAmount: number, newDescription?: string) => {
    const updatedExpenses = ExpenseService.updateExpense(expenses, editingExpense.id, newAmount, newDescription)
    setExpenses(updatedExpenses)
    onNotification('success', 'تم تعديل المصروف بنجاح!')
    setShowEditExpenseModal(false)
    setEditingExpense(null)
  }

  const handleDeleteExpense = (expenseId: number) => {
    const updatedExpenses = ExpenseService.deleteExpense(expenses, expenseId)
    setExpenses(updatedExpenses)
    onNotification('success', 'تم حذف المصروف بنجاح!')
  }

  // معالجات أتعاب المحامي
  const handleAddLawyerFee = () => {
    try {
      const updatedFees = ExpenseService.addLawyerFee(lawyerFees, newLawyerFee)
      setLawyerFees(updatedFees)
      onNotification('success', 'تم إضافة أتعاب المحامي بنجاح!')
      setNewLawyerFee({ amount: '', date: new Date().toISOString().split('T')[0], description: '' })
      setShowAddLawyerFeeModal(false)
    } catch (error) {
      onNotification('error', 'خطأ في إضافة أتعاب المحامي')
    }
  }

  const handleEditLawyerFee = (fee: any) => {
    console.log('🔧 تعديل أتعاب المحامي:', fee)
    setEditingLawyerFee(fee)
    setShowEditLawyerFeeModal(true)
  }

  const confirmEditLawyerFee = (newAmount: number, newDescription?: string) => {
    const updatedFees = ExpenseService.updateLawyerFee(lawyerFees, editingLawyerFee.id, newAmount, newDescription)
    setLawyerFees(updatedFees)
    onNotification('success', 'تم تعديل أتعاب المحامي بنجاح!')
    setShowEditLawyerFeeModal(false)
    setEditingLawyerFee(null)
  }

  const handleDeleteLawyerFee = (feeId: number) => {
    const updatedFees = ExpenseService.deleteLawyerFee(lawyerFees, feeId)
    setLawyerFees(updatedFees)
    onNotification('success', 'تم حذف أتعاب المحامي بنجاح!')
  }

  // معالجات الإلغاء
  const cancelEditExpense = () => {
    setShowEditExpenseModal(false)
    setEditingExpense(null)
  }

  const cancelEditLawyerFee = () => {
    setShowEditLawyerFeeModal(false)
    setEditingLawyerFee(null)
  }

  return {
    // بيانات المصروفات
    expenses,
    lawyerFees,
    showAddExpenseModal,
    setShowAddExpenseModal,
    showAddLawyerFeeModal,
    setShowAddLawyerFeeModal,
    showEditExpenseModal,
    setShowEditExpenseModal,
    showEditLawyerFeeModal,
    setShowEditLawyerFeeModal,
    editingExpense,
    editingLawyerFee,
    newExpense,
    setNewExpense,
    newLawyerFee,
    setNewLawyerFee,
    
    // معالجات المصروفات
    handleAddExpense,
    handleEditExpense,
    confirmEditExpense,
    handleDeleteExpense,
    cancelEditExpense,
    
    // معالجات أتعاب المحامي
    handleAddLawyerFee,
    handleEditLawyerFee,
    confirmEditLawyerFee,
    handleDeleteLawyerFee,
    cancelEditLawyerFee
  }
}
