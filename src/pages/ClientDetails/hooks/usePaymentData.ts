import { useState } from 'react'
import { PaymentService } from '../services/PaymentService'

interface PaymentData {
  amount: string
  date: string
  notes: string
}

/**
 * خطاف مخصص لإدارة بيانات المدفوعات
 */
export const usePaymentData = (onNotification: (type: string, message: string) => void) => {
  // بيانات المدفوعات (وهمية)
  const [payments, setPayments] = useState([
    { id: 1, date: '2024-01-15', amount: 500, entryUser: 'أحمد الكويتي', entryDateTime: '2024-01-15 10:30:00', notes: 'دفعة منتظمة' },
    { id: 2, date: '2024-02-15', amount: 500, entryUser: 'فاطمة السالم', entryDateTime: '2024-02-15 14:20:00', notes: 'دفعة منتظمة' },
    { id: 3, date: '2024-03-15', amount: 750, entryUser: 'محمد العتيبي', entryDateTime: '2024-03-15 09:15:00', notes: 'دفعة مبكرة' }
  ])

  // حالات النماذج
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false)
  const [editingPayment, setEditingPayment] = useState<any>(null)

  // بيانات الدفعة الجديدة
  const [newPayment, setNewPayment] = useState<PaymentData>({
    amount: '', 
    date: new Date().toISOString().split('T')[0], 
    notes: ''
  })

  // إضافة دفعة جديدة
  const handleAddPayment = () => {
    try {
      const updatedPayments = PaymentService.addPayment(payments, newPayment)
      setPayments(updatedPayments)
      onNotification('success', 'تم إضافة الدفعة بنجاح!')
      setNewPayment({ amount: '', date: new Date().toISOString().split('T')[0], notes: '' })
      setShowAddPaymentModal(false)
    } catch (error) {
      onNotification('error', 'خطأ في إضافة الدفعة')
    }
  }

  // تعديل دفعة
  const handleEditPayment = (payment: any) => {
    console.log('🔧 تعديل الدفعة:', payment)
    setEditingPayment(payment)
    setShowEditPaymentModal(true)
  }

  // تأكيد تعديل الدفعة
  const confirmEditPayment = (newAmount: number, newNotes?: string) => {
    const updatedPayments = PaymentService.updatePayment(payments, editingPayment.id, newAmount, newNotes)
    setPayments(updatedPayments)
    onNotification('success', 'تم تعديل الدفعة بنجاح!')
    setShowEditPaymentModal(false)
    setEditingPayment(null)
  }

  // حذف دفعة
  const handleDeletePayment = (paymentId: number) => {
    const updatedPayments = PaymentService.deletePayment(payments, paymentId)
    setPayments(updatedPayments)
    onNotification('success', 'تم حذف الدفعة بنجاح!')
  }

  // إلغاء تعديل الدفعة
  const cancelEditPayment = () => {
    setShowEditPaymentModal(false)
    setEditingPayment(null)
  }

  return {
    payments,
    showAddPaymentModal,
    setShowAddPaymentModal,
    showEditPaymentModal,
    setShowEditPaymentModal,
    editingPayment,
    newPayment,
    setNewPayment,
    handleAddPayment,
    handleEditPayment,
    confirmEditPayment,
    handleDeletePayment,
    cancelEditPayment
  }
}
