import React from 'react'
import styles from './ClientDetails.module.css'

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

interface ClientStatsProps {
  payments: Payment[]
  expenses: Expense[]
  lawyerFees: LawyerFee[]
  loanAmount?: number
  profit?: number
  investorPercentage?: number
  partnerPercentage?: number
}

/**
 * مكون إحصائيات العميل - يعرض الملخص المالي
 */
const ClientStats: React.FC<ClientStatsProps> = ({
  payments,
  expenses,
  lawyerFees,
  loanAmount = 0,
  profit = 0,
  investorPercentage = 50,
  partnerPercentage = 50
}) => {
  // حساب الإحصائيات الأساسية
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalLawyerFees = lawyerFees.reduce((sum, fee) => sum + fee.amount, 0)
  const totalAmount = loanAmount + profit
  const remainingAmount = totalAmount - totalPaid
  const completionPercentage = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0

  // المعادلات المالية الجديدة
  // 1. نسبة الربح من المدفوع
  const profitPercentage = totalAmount > 0 ? (profit / totalAmount) * 100 : 0

  // 2. الربح المحصل
  const collectedProfit = totalPaid * (profitPercentage / 100)

  // 3. رأس المال المحصل
  const collectedCapital = totalPaid - collectedProfit

  // 4. صافي الربح المحصل
  const netCollectedProfit = collectedProfit - (totalExpenses + totalLawyerFees)

  // 5. نصيب المستثمر من الربح
  const investorProfitShare = netCollectedProfit * (investorPercentage / 100)

  // 6. نصيب الشريك من الربح
  const partnerProfitShare = netCollectedProfit * (partnerPercentage / 100)

  return (
    <div className={styles.infoCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <div className={styles.cardIcon}>
            📊
          </div>
          الملخص المالي
        </div>
      </div>

      <div className={styles.statsGrid}>
        {/* إجمالي المبلغ */}
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statValue}>
            {totalAmount.toLocaleString()}
          </div>
          <div className={styles.statLabel}>إجمالي المبلغ (د.ك)</div>
        </div>

        {/* المبلغ المدفوع */}
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statValue}>
            {totalPaid.toLocaleString()}
          </div>
          <div className={styles.statLabel}>المبلغ المدفوع (د.ك)</div>
        </div>

        {/* المبلغ المتبقي */}
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statValue}>
            {remainingAmount.toLocaleString()}
          </div>
          <div className={styles.statLabel}>المبلغ المتبقي (د.ك)</div>
        </div>

        {/* نسبة الإنجاز */}
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statValue}>
            {completionPercentage.toFixed(1)}%
          </div>
          <div className={styles.statLabel}>نسبة الإنجاز</div>
        </div>

        {/* نسبة الربح من المدفوع */}
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statValue}>
            {profitPercentage.toFixed(2)}%
          </div>
          <div className={styles.statLabel}>نسبة الربح من المدفوع</div>
        </div>

        {/* الربح المحصل */}
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statValue}>
            {collectedProfit.toLocaleString()}
          </div>
          <div className={styles.statLabel}>الربح المحصل (د.ك)</div>
        </div>

        {/* رأس المال المحصل */}
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statValue}>
            {collectedCapital.toLocaleString()}
          </div>
          <div className={styles.statLabel}>رأس المال المحصل (د.ك)</div>
        </div>

        {/* صافي الربح المحصل */}
        <div className={`${styles.statCard} ${netCollectedProfit >= 0 ? styles.success : styles.danger}`}>
          <div className={styles.statValue}>
            {netCollectedProfit.toLocaleString()}
          </div>
          <div className={styles.statLabel}>صافي الربح المحصل (د.ك)</div>
        </div>
      </div>

      {/* قسم توزيع الأرباح */}
      {netCollectedProfit > 0 && (
        <>
          <div className="mt-6 mb-4">
            <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">💰</span>
              توزيع الأرباح
            </h4>
          </div>

          <div className={styles.statsGrid}>
            {/* نصيب المستثمر */}
            <div className={`${styles.statCard} ${styles.success}`}>
              <div className={styles.statValue}>
                {investorProfitShare.toLocaleString()}
              </div>
              <div className={styles.statLabel}>نصيب المستثمر ({investorPercentage}%) - د.ك</div>
            </div>

            {/* نصيب الشريك */}
            <div className={`${styles.statCard} ${styles.success}`}>
              <div className={styles.statValue}>
                {partnerProfitShare.toLocaleString()}
              </div>
              <div className={styles.statLabel}>نصيب الشريك ({partnerPercentage}%) - د.ك</div>
            </div>
          </div>
        </>
      )}

      {/* شريط التقدم */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>تقدم السداد</span>
          <span>{completionPercentage.toFixed(1)}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${Math.min(completionPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* تفاصيل إضافية */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {payments.length}
          </div>
          <div className={styles.statLabel}>عدد الدفعات</div>
        </div>

        <div className={`${styles.statCard} ${styles.danger}`}>
          <div className={styles.statValue}>
            {totalExpenses.toLocaleString()}
          </div>
          <div className={styles.statLabel}>إجمالي المصروفات (د.ك)</div>
        </div>

        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statValue}>
            {totalLawyerFees.toLocaleString()}
          </div>
          <div className={styles.statLabel}>أتعاب المحامي (د.ك)</div>
        </div>
      </div>

      {/* تحذير إذا كان هناك تأخير */}
      {remainingAmount > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-2xl ml-3">⚠️</div>
            <div className="text-sm text-yellow-800">
              <p className="font-semibold">متبقي للسداد: {remainingAmount.toLocaleString()} د.ك</p>
              <p className="text-xs mt-1">يرجى متابعة عملية التحصيل</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientStats
