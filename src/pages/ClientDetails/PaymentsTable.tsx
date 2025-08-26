import React from 'react'
import { useConfirmationContext } from '../../components/ConfirmationProvider'
import { createDeleteConfirm } from '../../utils/confirmation-helpers'
import ArabicNumberDisplay from '../../components/forms/ArabicNumberDisplay'
import styles from './Tables.module.css'

interface Payment {
  id: number
  date: string
  amount: number
  entryUser: string
  entryDateTime: string
  notes: string
}

interface PaymentsTableProps {
  payments: Payment[]
  onEditPayment: (paymentId: number) => void
  onDeletePayment: (paymentId: number) => void
  onAddPayment: () => void
}

/**
 * مكون جدول المدفوعات
 */
const PaymentsTable: React.FC<PaymentsTableProps> = ({
  payments,
  onEditPayment,
  onDeletePayment,
  onAddPayment
}) => {
  const { showConfirm } = useConfirmationContext()
  const deleteConfirm = createDeleteConfirm(showConfirm)

  const handleDeletePayment = async (payment: Payment) => {
    const confirmed = await deleteConfirm.deleteItem('هذه الدفعة', payment.amount)
    if (confirmed) {
      onDeletePayment(payment.id)
    }
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.tableTitle}>
          <div className={`${styles.tableIcon} ${styles.paymentsIcon}`}>
            💰
          </div>
          مدفوعات القرض
        </div>
        <button
          onClick={onAddPayment}
          className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          ➕ إضافة دفعة
        </button>
      </div>

      {payments.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            💳
          </div>
          <p className={styles.emptyMessage}>لا توجد مدفوعات مسجلة</p>
          <p className="text-sm text-gray-500 mt-2">انقر على "إضافة دفعة" لتسجيل أول دفعة</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableHeadCell}>التاريخ</th>
                <th className={styles.tableHeadCell}>المبلغ (د.ك)</th>
                <th className={styles.tableHeadCell}>مدخل البيان</th>
                <th className={styles.tableHeadCell}>ملاحظات</th>
                <th className={styles.tableHeadCell}>إجراءات</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {payments.map((payment) => (
                <tr key={payment.id} className={styles.tableRow}>
                  <td className={`${styles.tableCell} ${styles.dateCell}`}>{payment.date}</td>
                  <td className={`${styles.tableCell} ${styles.amountCell} ${styles.positive}`}>
                    <ArabicNumberDisplay value={payment.amount} currency="د.ك" />
                  </td>
                  <td className={`${styles.tableCell} ${styles.userCell}`}>
                    <div className={styles.userName}>{payment.entryUser}</div>
                    <div className={styles.userDateTime}>
                      {new Date(payment.entryDateTime).toLocaleString('ar-SA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className={`${styles.tableCell} ${styles.notesCell}`} title={payment.notes}>
                    {payment.notes}
                  </td>
                  <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                    <button
                      onClick={() => onEditPayment(payment.id)}
                      className={`${styles.actionButton} ${styles.editButton}`}
                    >
                      ✏️ تعديل
                    </button>
                    <button
                      onClick={() => handleDeletePayment(payment)}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                    >
                      🗑️ حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* إحصائيات سريعة */}
      {payments.length > 0 && (
        <div className={styles.tableStats}>
          <div className={styles.statsLabel}>
            إجمالي المدفوعات:
            <span className={`${styles.statsValue} ${styles.positive}`} style={{ marginRight: '0.5rem' }}>
              <ArabicNumberDisplay
                value={payments.reduce((sum, payment) => sum + payment.amount, 0)}
                currency="د.ك"
              />
            </span>
          </div>
          <div className={styles.statsLabel}>
            عدد الدفعات:
            <span className={`${styles.statsValue} ${styles.positive}`} style={{ marginRight: '0.5rem' }}>
              {payments.length} دفعة
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentsTable
