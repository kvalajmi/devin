import React from 'react'
import PaymentsTable from '../PaymentsTable'
import { useClientData } from '../context/ClientDataContext'

interface ClientPaymentsManagerProps {
  // لا نحتاج props بعد الآن - البيانات من Context
}

const ClientPaymentsManager: React.FC<ClientPaymentsManagerProps> = () => {
  // استخدام البيانات من Context
  const {
    payments,
    addPayment,
    updatePayment,
    deletePayment
  } = useClientData()

  // حالات النماذج المحلية (نفس الواجهة القديمة)
  const [showAddPaymentModal, setShowAddPaymentModal] = React.useState(false)
  const [showEditPaymentModal, setShowEditPaymentModal] = React.useState(false)
  const [editingPayment, setEditingPayment] = React.useState<any>(null)
  const [newPayment, setNewPayment] = React.useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  // دوال المعالجة (نفس الواجهة القديمة)
  const handleAddPayment = () => {
    if (!newPayment.amount || !newPayment.date) return

    addPayment({
      amount: parseFloat(newPayment.amount),
      date: newPayment.date,
      notes: newPayment.notes
    })

    setNewPayment({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
    setShowAddPaymentModal(false)
  }

  const handleEditPayment = (paymentId: number) => {
    const payment = payments.find(p => p.id === paymentId)
    if (payment) {
      setEditingPayment(payment)
      setShowEditPaymentModal(true)
    }
  }

  const confirmEditPayment = (newAmount: number, newNotes?: string) => {
    if (editingPayment) {
      updatePayment(editingPayment.id, {
        amount: newAmount,
        notes: newNotes || editingPayment.notes
      })
    }
    setShowEditPaymentModal(false)
    setEditingPayment(null)
  }

  const handleDeletePayment = (paymentId: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
      deletePayment(paymentId)
    }
  }

  const cancelEditPayment = () => {
    setShowEditPaymentModal(false)
    setEditingPayment(null)
  }

  return (
    <div className="space-y-4">

      {/* جدول المدفوعات */}
      <PaymentsTable
        payments={payments}
        onAddPayment={handleAddPayment}
        onEditPayment={handleEditPayment}
        onDeletePayment={handleDeletePayment}
        showAddModal={showAddPaymentModal}
        setShowAddModal={setShowAddPaymentModal}
        showEditModal={showEditPaymentModal}
        setShowEditModal={setShowEditPaymentModal}
        editingPayment={editingPayment}
        newPayment={newPayment}
        setNewPayment={setNewPayment}
        confirmEditPayment={confirmEditPayment}
        cancelEditPayment={cancelEditPayment}
      />
    </div>
  )
}

export default ClientPaymentsManager
