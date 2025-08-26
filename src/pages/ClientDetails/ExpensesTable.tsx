import React from 'react'
import { useConfirmationContext } from '../../components/ConfirmationProvider'
import { createDeleteConfirm } from '../../utils/confirmation-helpers'
import styles from './Tables.module.css'

interface Expense {
  id: number
  date: string
  amount: number
  description: string
  entryUser: string
  entryDateTime: string
}

interface ExpensesTableProps {
  expenses: Expense[]
  onEditExpense: (expenseId: number) => void
  onDeleteExpense: (expenseId: number) => void
  onAddExpense: () => void
  showAddModal: boolean
  setShowAddModal: (show: boolean) => void
  showEditModal: boolean
  setShowEditModal: (show: boolean) => void
  editingExpense: Expense | null
  newExpense: { amount: string; date: string; description: string }
  setNewExpense: (expense: { amount: string; date: string; description: string }) => void
  confirmEditExpense: (amount: number, description?: string) => void
  cancelEditExpense: () => void
}

/**
 * مكون جدول المصروفات
 */
const ExpensesTable: React.FC<ExpensesTableProps> = ({
  expenses,
  onEditExpense,
  onDeleteExpense,
  onAddExpense,
  showAddModal,
  setShowAddModal,
  showEditModal,
  setShowEditModal,
  editingExpense,
  newExpense,
  setNewExpense,
  confirmEditExpense,
  cancelEditExpense
}) => {
  const { showConfirm } = useConfirmationContext()
  const deleteConfirm = createDeleteConfirm(showConfirm)

  const handleDeleteExpense = async (expense: Expense) => {
    const confirmed = await deleteConfirm.deleteItem('هذا المصروف', expense.amount)
    if (confirmed) {
      onDeleteExpense(expense.id)
    }
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.tableTitle}>
          <div className={`${styles.tableIcon} ${styles.expensesIcon}`}>
            💸
          </div>
          مصروفات القرض
        </div>
        <button
          onClick={onAddExpense}
          className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          ➕ إضافة مصروف
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            💸
          </div>
          <p className={styles.emptyMessage}>لا توجد مصروفات مسجلة</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableHeadCell}>التاريخ</th>
                <th className={styles.tableHeadCell}>المبلغ</th>
                <th className={styles.tableHeadCell}>مدخل البيان</th>
                <th className={styles.tableHeadCell}>الوصف</th>
                <th className={styles.tableHeadCell}>إجراءات</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {expenses.map((expense) => (
                <tr key={expense.id} className={styles.tableRow}>
                  <td className={`${styles.tableCell} ${styles.dateCell}`}>{expense.date}</td>
                  <td className={`${styles.tableCell} ${styles.amountCell} ${styles.negative}`}>
                    {expense.amount.toLocaleString()} د.ك
                  </td>
                  <td className={`${styles.tableCell} ${styles.userCell}`}>
                    <div className={styles.userName}>{expense.entryUser}</div>
                    <div className={styles.userDateTime}>
                      {new Date(expense.entryDateTime).toLocaleString('ar-SA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className={styles.tableCell}>{expense.description}</td>
                  <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                    <button
                      onClick={() => onEditExpense(expense.id)}
                      className={`${styles.actionButton} ${styles.editButton}`}
                    >
                      ✏️ تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense)}
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
      {expenses.length > 0 && (
        <div className={styles.tableStats}>
          <div className={styles.statsLabel}>
            إجمالي المصروفات:
            <span className={`${styles.statsValue} ${styles.negative}`} style={{ marginRight: '0.5rem' }}>
              {expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()} د.ك
            </span>
          </div>
          <div className={styles.statsLabel}>
            عدد المصروفات:
            <span className={`${styles.statsValue} ${styles.negative}`} style={{ marginRight: '0.5rem' }}>
              {expenses.length} مصروف
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpensesTable
