import React, { useState } from 'react'
import { Client } from '../../../types/DatabaseTypes'
import ClientEditModal from '../../../components/forms/ClientEditModal'
import LoanEditModal from '../../../components/forms/LoanEditModal'
import AttachmentsManager from './AttachmentsManager'
import styles from '../ClientDetails.module.css'

interface ClientDataManagerProps {
  client: Client | null
  onUpdateClient: (updates: Partial<Client>) => void
  showNotification: (type: 'success' | 'error' | 'warning', message: string) => void
}

const ClientDataManager: React.FC<ClientDataManagerProps> = ({
  client,
  onUpdateClient,
  showNotification
}) => {
  const [showEditClientModal, setShowEditClientModal] = useState(false)
  const [showEditLoanModal, setShowEditLoanModal] = useState(false)
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false)

  // دوال معالجة تعديل العميل والقرض
  const handleEditClient = (updates: Partial<Client>) => {
    if (client) {
      onUpdateClient(updates)
      console.log('🔧 تم تحديث بيانات العميل:', updates)
    }
    
    showNotification('success', 'تم تحديث بيانات العميل بنجاح!')
    setShowEditClientModal(false)
  }

  const handleEditLoan = (updates: Partial<Client>) => {
    if (client) {
      onUpdateClient(updates)
      console.log('🔧 تم تحديث بيانات القرض:', updates)
    }
    
    showNotification('success', 'تم تحديث بيانات القرض بنجاح!')
    setShowEditLoanModal(false)
  }

  if (!client) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* شبكة البطاقات - جنباً إلى جنب */}
      <div className={styles.cardsGrid}>
        {/* معلومات العميل الأساسية */}
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <div className={styles.cardIcon}>
                👤
              </div>
              معلومات العميل
            </div>
            <button
              onClick={() => setShowEditClientModal(true)}
              className={`${styles.actionButton} ${styles.secondaryButton}`}
            >
              ✏️ تعديل المعلومات
            </button>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>الاسم</label>
              <div className={styles.infoValue}>{client.name}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>الرقم المدني</label>
              <div className={styles.infoValue}>{client.civilId}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>رقم الهاتف</label>
              <div className={styles.infoValue}>{client.phoneNumber}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>المهنة</label>
              <div className={styles.infoValue}>{client.job || 'غير محدد'}</div>
            </div>
          </div>
        </div>

        {/* معلومات القرض */}
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <div className={styles.cardIcon}>
                💰
              </div>
              معلومات القرض
            </div>
            <div className={styles.buttonGroup}>
              <button
                onClick={() => setShowEditLoanModal(true)}
                className={`${styles.actionButton} ${styles.secondaryButton}`}
              >
                ✏️ تعديل القرض
              </button>
              <button
                className={`${styles.actionButton} ${styles.primaryButton}`}
                onClick={() => setShowAttachmentsModal(true)}
              >
                📎 المرفقات
              </button>
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>مبلغ القرض</label>
              <div className={styles.infoValue}>{client.loanAmount?.toLocaleString()} د.ك</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>الربح</label>
              <div className={styles.infoValue}>{client.profit?.toLocaleString()} د.ك</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>المبلغ الإجمالي</label>
              <div className={`${styles.infoValue} font-bold text-lg text-blue-600`}>
                {((client.loanAmount || 0) + (client.profit || 0)).toLocaleString()} د.ك
              </div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>فترة السداد</label>
              <div className={styles.infoValue}>{client.paymentPeriod} شهر</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>تاريخ التمويل</label>
              <div className={styles.infoValue}>{client.fundingDate}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>الضمان</label>
              <div className={styles.infoValue}>{client.guarantee}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>قيمة القسط</label>
              <div className={styles.infoValue}>{client.installmentValue?.toLocaleString()} د.ك</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>تاريخ الاستحقاق</label>
              <div className={styles.infoValue}>{client.dueDate || 'غير محدد'}</div>
            </div>
            <div className={styles.infoItem}>
              <label className={styles.infoLabel}>كود المعاملة</label>
              <div className={styles.infoValue}>{client.transaction_code}</div>
            </div>
          </div>
        </div>
      </div>
      {/* نهاية شبكة البطاقات */}

      {/* النماذج */}
      {showEditClientModal && (
        <ClientEditModal
          isOpen={showEditClientModal}
          client={client}
          onSave={handleEditClient}
          onCancel={() => setShowEditClientModal(false)}
        />
      )}

      {showEditLoanModal && (
        <LoanEditModal
          isOpen={showEditLoanModal}
          client={client}
          onSave={handleEditLoan}
          onCancel={() => setShowEditLoanModal(false)}
        />
      )}

      {/* نافذة المرفقات */}
      <AttachmentsManager
        client={client}
        isOpen={showAttachmentsModal}
        onClose={() => setShowAttachmentsModal(false)}
        showNotification={showNotification}
      />
    </div>
  )
}

export default ClientDataManager
