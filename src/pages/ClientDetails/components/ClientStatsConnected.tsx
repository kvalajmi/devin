import React from 'react'
import { useClientData } from '../context/ClientDataContext'
import styles from '../ClientDetails.module.css'

interface ClientStatsConnectedProps {
  loanAmount?: number
  profit?: number
  investorPercentage?: number
  partnerPercentage?: number
}

/**
 * مكون إحصائيات العميل المتصل بـ Context
 * يتحدث تلقائياً عند تغيير البيانات
 */
const ClientStatsConnected: React.FC<ClientStatsConnectedProps> = ({
  loanAmount = 0,
  profit = 0,
  investorPercentage = 50,
  partnerPercentage = 50
}) => {
  // استخدام البيانات من Context
  const { 
    totalPaid, 
    totalExpenses, 
    totalLawyerFees
  } = useClientData()

  // حساب الإحصائيات
  const totalAmount = loanAmount + profit
  const totalRemaining = totalAmount - totalPaid
  const progressPercentage = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0

  // حساب النسب والأرباح الجديدة
  const profitRatioFromPaidAmount = loanAmount > 0 ? ((profit / loanAmount) * 100) * (totalPaid / totalAmount) : 0
  const collectedProfit = totalPaid > loanAmount ? totalPaid - loanAmount : 0
  const collectedCapital = totalPaid - collectedProfit
  const collectedNetProfit = collectedProfit - totalExpenses - totalLawyerFees

  // حساب أرباح المستثمر والشريك من الربح المحصل
  const investorCollectedProfit = (collectedNetProfit * investorPercentage) / 100
  const partnerCollectedProfit = (collectedNetProfit * partnerPercentage) / 100


  return (
    <div className={styles.financialSummaryContainer}>
      {/* إطار الملخص المالي */}
      <div className={styles.financialSummaryFrame}>
        {/* عنوان الملخص المالي */}
        <div className={styles.financialSummaryHeader}>
          <div className={styles.summaryIcon}>📊</div>
          <h2 className={styles.summaryTitle}>الملخص المالي</h2>
        </div>

        {/* محتوى الملخص المالي */}
        <div className={styles.financialSummaryContent}>
          {/* الكروت الرئيسية الجميلة */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💰</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{totalAmount.toLocaleString('en-US')} د.ك</div>
                <div className={styles.statLabel}>إجمالي المبلغ</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{totalPaid.toLocaleString('en-US')} د.ك</div>
                <div className={styles.statLabel}>إجمالي المدفوع</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>⏳</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{totalRemaining.toLocaleString('en-US')} د.ك</div>
                <div className={styles.statLabel}>المبلغ المتبقي</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{profitRatioFromPaidAmount.toFixed(2)}%</div>
                <div className={styles.statLabel}>نسبة الربح من المدفوع</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏦</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{collectedCapital.toLocaleString('en-US')} د.ك</div>
                <div className={styles.statLabel}>رأس المال المحصل</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>💸</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{totalExpenses.toLocaleString('en-US')} د.ك</div>
                <div className={styles.statLabel}>المصروفات</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚖️</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{totalLawyerFees.toLocaleString('en-US')} د.ك</div>
                <div className={styles.statLabel}>أتعاب المحامي</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>💎</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{collectedNetProfit.toLocaleString('en-US')} د.ك</div>
                <div className={styles.statLabel}>صافي الربح المحصل</div>
              </div>
            </div>
          </div>

          {/* شريط التقدم الجميل */}
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>تقدم السداد</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* توزيع الأرباح المحصلة - كروت منفصلة */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👤</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{investorCollectedProfit.toLocaleString('en-US')} د.ك</div>
                <div className={styles.statLabel}>ربح المستثمر ({investorPercentage}%)</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🤝</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{partnerCollectedProfit.toLocaleString('en-US')} د.ك</div>
                <div className={styles.statLabel}>ربح الشريك ({partnerPercentage}%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientStatsConnected
