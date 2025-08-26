import React from 'react'
import { useConfirmationContext } from '../../components/ConfirmationProvider'
import { createDeleteConfirm } from '../../utils/confirmation-helpers'
import styles from './Tables.module.css'

interface LawyerFee {
  id: number
  date: string
  amount: number
  description: string
  entryUser: string
  entryDateTime: string
}

interface LawyerFeesTableProps {
  lawyerFees: LawyerFee[]
  onEditLawyerFee: (feeId: number) => void
  onDeleteLawyerFee: (feeId: number) => void
  onAddLawyerFee: () => void
  showAddModal: boolean
  setShowAddModal: (show: boolean) => void
  showEditModal: boolean
  setShowEditModal: (show: boolean) => void
  editingLawyerFee: LawyerFee | null
  newLawyerFee: { amount: string; date: string; description: string }
  setNewLawyerFee: (fee: { amount: string; date: string; description: string }) => void
  confirmEditLawyerFee: (amount: number, description?: string) => void
  cancelEditLawyerFee: () => void
}

/**
 * مكون جدول أتعاب المحامي
 */
const LawyerFeesTable: React.FC<LawyerFeesTableProps> = ({
  lawyerFees,
  onEditLawyerFee,
  onDeleteLawyerFee,
  onAddLawyerFee,
  showAddModal,
  setShowAddModal,
  showEditModal,
  setShowEditModal,
  editingLawyerFee,
  newLawyerFee,
  setNewLawyerFee,
  confirmEditLawyerFee,
  cancelEditLawyerFee
}) => {
  const { showConfirm } = useConfirmationContext()
  const deleteConfirm = createDeleteConfirm(showConfirm)

  const handleDeleteLawyerFee = async (fee: LawyerFee) => {
    const confirmed = await deleteConfirm.deleteItem('هذه الأتعاب', fee.amount)
    if (confirmed) {
      onDeleteLawyerFee(fee.id)
    }
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.tableTitle}>
          <div className={`${styles.tableIcon} ${styles.lawyerFeesIcon}`}>
            ⚖️
          </div>
          أتعاب المحامي
        </div>
        <button
          onClick={onAddLawyerFee}
          className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          ➕ إضافة أتعاب
        </button>
      </div>

      {lawyerFees.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            ⚖️
          </div>
          <p className={styles.emptyMessage}>لا توجد أتعاب محامي مسجلة</p>
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
              {lawyerFees.map((fee) => (
                <tr key={fee.id} className={styles.tableRow}>
                  <td className={`${styles.tableCell} ${styles.dateCell}`}>{fee.date}</td>
                  <td className={`${styles.tableCell} ${styles.amountCell} ${styles.purple}`}>
                    {fee.amount.toLocaleString()} د.ك
                  </td>
                  <td className={`${styles.tableCell} ${styles.userCell}`}>
                    <div className={styles.userName}>{fee.entryUser}</div>
                    <div className={styles.userDateTime}>
                      {new Date(fee.entryDateTime).toLocaleString('ar-SA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className={styles.tableCell}>{fee.description}</td>
                  <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                    <button
                      onClick={() => onEditLawyerFee(fee.id)}
                      className={`${styles.actionButton} ${styles.editButton}`}
                    >
                      ✏️ تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteLawyerFee(fee)}
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
      {lawyerFees.length > 0 && (
        <div className={styles.tableStats}>
          <div className={styles.statsLabel}>
            إجمالي أتعاب المحامي:
            <span className={`${styles.statsValue} ${styles.purple}`} style={{ marginRight: '0.5rem' }}>
              {lawyerFees.reduce((sum, fee) => sum + fee.amount, 0).toLocaleString()} د.ك
            </span>
          </div>
          <div className={styles.statsLabel}>
            عدد الأتعاب:
            <span className={`${styles.statsValue} ${styles.purple}`} style={{ marginRight: '0.5rem' }}>
              {lawyerFees.length} أتعاب
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default LawyerFeesTable
