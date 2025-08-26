import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Client } from '../../../types/DatabaseTypes'

// أنواع البيانات
interface Payment {
  id: number
  date: string
  amount: number
  entryUser: string
  entryDateTime: string
  notes: string
}

interface Expense {
  id: number
  date: string
  amount: number
  description: string
  entryUser: string
  entryDateTime: string
}

interface LawyerFee {
  id: number
  date: string
  amount: number
  description: string
  entryUser: string
  entryDateTime: string
}

// نوع السياق
interface ClientDataContextType {
  // بيانات العميل
  client: Client | null
  setClient: (client: Client | null) => void
  
  // المدفوعات
  payments: Payment[]
  addPayment: (payment: Omit<Payment, 'id' | 'entryUser' | 'entryDateTime'>) => void
  updatePayment: (id: number, updates: Partial<Payment>) => void
  deletePayment: (id: number) => void
  
  // المصروفات
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id' | 'entryUser' | 'entryDateTime'>) => void
  updateExpense: (id: number, updates: Partial<Expense>) => void
  deleteExpense: (id: number) => void
  
  // أتعاب المحامي
  lawyerFees: LawyerFee[]
  addLawyerFee: (fee: Omit<LawyerFee, 'id' | 'entryUser' | 'entryDateTime'>) => void
  updateLawyerFee: (id: number, updates: Partial<LawyerFee>) => void
  deleteLawyerFee: (id: number) => void
  
  // الإحصائيات المحسوبة
  totalPaid: number
  totalExpenses: number
  totalLawyerFees: number
  netAmount: number
  
  // الإشعارات
  showNotification: (type: 'success' | 'error' | 'warning', message: string) => void
}

// إنشاء السياق
const ClientDataContext = createContext<ClientDataContextType | undefined>(undefined)

// مزود السياق
interface ClientDataProviderProps {
  children: ReactNode
  onNotification: (type: 'success' | 'error' | 'warning', message: string) => void
}

export const ClientDataProvider: React.FC<ClientDataProviderProps> = ({
  children,
  onNotification
}) => {
  // حالات البيانات
  const [client, setClient] = useState<Client | null>(null)
  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, date: '2024-01-15', amount: 500, entryUser: 'أحمد الكويتي', entryDateTime: '2024-01-15 10:30:00', notes: 'دفعة منتظمة' },
    { id: 2, date: '2024-02-15', amount: 500, entryUser: 'فاطمة السالم', entryDateTime: '2024-02-15 14:20:00', notes: 'دفعة منتظمة' },
    { id: 3, date: '2024-03-15', amount: 750, entryUser: 'محمد العتيبي', entryDateTime: '2024-03-15 09:15:00', notes: 'دفعة مبكرة' }
  ])
  
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, date: '2024-01-10', amount: 50, description: 'رسوم إدارية', entryUser: 'أحمد الكويتي', entryDateTime: '2024-01-10 09:00:00' },
    { id: 2, date: '2024-02-05', amount: 25, description: 'رسوم بنكية', entryUser: 'فاطمة السالم', entryDateTime: '2024-02-05 11:15:00' }
  ])
  
  const [lawyerFees, setLawyerFees] = useState<LawyerFee[]>([
    { id: 1, date: '2024-01-20', amount: 200, description: 'استشارة قانونية', entryUser: 'محمد العتيبي', entryDateTime: '2024-01-20 14:30:00' }
  ])

  // دوال إدارة المدفوعات
  const addPayment = (paymentData: Omit<Payment, 'id' | 'entryUser' | 'entryDateTime'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: Math.max(...payments.map(p => p.id), 0) + 1,
      entryUser: 'المستخدم الحالي',
      entryDateTime: new Date().toISOString()
    }
    setPayments(prev => [...prev, newPayment])
    onNotification('success', '✅ تم إضافة الدفعة بنجاح!')
  }

  const updatePayment = (id: number, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(payment => 
      payment.id === id ? { ...payment, ...updates } : payment
    ))
    onNotification('success', '✅ تم تعديل الدفعة بنجاح!')
  }

  const deletePayment = (id: number) => {
    setPayments(prev => prev.filter(payment => payment.id !== id))
    onNotification('success', '✅ تم حذف الدفعة بنجاح!')
    
    import('../../../utils/balance-events').then(({ triggerBalanceUpdate, triggerProfitUpdate }) => {
      triggerBalanceUpdate()
      triggerProfitUpdate()
    })
  }

  // دوال إدارة المصروفات
  const addExpense = (expenseData: Omit<Expense, 'id' | 'entryUser' | 'entryDateTime'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Math.max(...expenses.map(e => e.id), 0) + 1,
      entryUser: 'المستخدم الحالي',
      entryDateTime: new Date().toISOString()
    }
    setExpenses(prev => [...prev, newExpense])
    onNotification('success', '✅ تم إضافة المصروف بنجاح!')
  }

  const updateExpense = (id: number, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    ))
    onNotification('success', '✅ تم تعديل المصروف بنجاح!')
  }

  const deleteExpense = (id: number) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
    onNotification('success', '✅ تم حذف المصروف بنجاح!')
    
    import('../../../utils/balance-events').then(({ triggerBalanceUpdate, triggerProfitUpdate }) => {
      triggerBalanceUpdate()
      triggerProfitUpdate()
    })
  }

  // دوال إدارة أتعاب المحامي
  const addLawyerFee = (feeData: Omit<LawyerFee, 'id' | 'entryUser' | 'entryDateTime'>) => {
    const newFee: LawyerFee = {
      ...feeData,
      id: Math.max(...lawyerFees.map(f => f.id), 0) + 1,
      entryUser: 'المستخدم الحالي',
      entryDateTime: new Date().toISOString()
    }
    setLawyerFees(prev => [...prev, newFee])
    onNotification('success', '✅ تم إضافة أتعاب المحامي بنجاح!')
  }

  const updateLawyerFee = (id: number, updates: Partial<LawyerFee>) => {
    setLawyerFees(prev => prev.map(fee => 
      fee.id === id ? { ...fee, ...updates } : fee
    ))
    onNotification('success', '✅ تم تعديل أتعاب المحامي بنجاح!')
  }

  const deleteLawyerFee = (id: number) => {
    setLawyerFees(prev => prev.filter(fee => fee.id !== id))
    onNotification('success', '✅ تم حذف أتعاب المحامي بنجاح!')
    
    import('../../../utils/balance-events').then(({ triggerBalanceUpdate, triggerProfitUpdate }) => {
      triggerBalanceUpdate()
      triggerProfitUpdate()
    })
  }

  // الإحصائيات المحسوبة
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalLawyerFees = lawyerFees.reduce((sum, fee) => sum + fee.amount, 0)
  const netAmount = totalPaid - totalExpenses - totalLawyerFees

  // قيمة السياق
  const contextValue: ClientDataContextType = {
    client,
    setClient,
    payments,
    addPayment,
    updatePayment,
    deletePayment,
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    lawyerFees,
    addLawyerFee,
    updateLawyerFee,
    deleteLawyerFee,
    totalPaid,
    totalExpenses,
    totalLawyerFees,
    netAmount,
    showNotification: onNotification
  }

  return (
    <ClientDataContext.Provider value={contextValue}>
      {children}
    </ClientDataContext.Provider>
  )
}

// خطاف لاستخدام السياق
export const useClientData = () => {
  const context = useContext(ClientDataContext)
  if (context === undefined) {
    throw new Error('useClientData must be used within a ClientDataProvider')
  }
  return context
}
