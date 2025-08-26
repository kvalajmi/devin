import React from 'react'
import styles from '../ClientDetails.module.css'

interface ClientStatsDisplayProps {
  stats: any
}

export const ClientStatsDisplay: React.FC<ClientStatsDisplayProps> = ({ stats }) => {
  const {
    totalAmount = 0,
    totalPaid = 0,
    totalRemaining = 0,
    progressPercentage = 0,
    profitRatioFromPaidAmount = 0,
    collectedGrossProfit = 0,
    collectedCapital = 0,
    collectedNetProfit = 0,
    totalExpenses = 0,
    totalLawyerFees = 0,
    investorProfitShare = 0,
    partnerProfitShare = 0
  } = stats || {}

  return (
    <div className={styles.financialSummaryContainer}>
      <div className={styles.financialSummaryFrame}>
        <div className={styles.financialSummaryHeader}>
          <div className={styles.summaryIcon}>📊</div>
          <h2 className={styles.summaryTitle}>الملخص المالي</h2>
        </div>

        <div className={styles.financialSummaryContent}>
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
                <div className={styles.statLabel}>نسبة الربح من المدفوعات</div>
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
              <div className={styles.statIcon}>💰</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{collectedGrossProfit.toLocaleString('en-US')} د.ك</div>
                <div className={styles.statLabel}>الربح الإجمالي المحصل</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>💎</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{collectedNetProfit.toLocaleString('en-US')} د.ك</div>
                <div className={styles.statLabel}>الربح الصافي المحصل</div>
              </div>
            </div>
          </div>

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

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👤</div>
              <div className={styles.statContent}>
                <div className={styles.statValue} style={{ color: investorProfitShare >= 0 ? '#10b981' : '#ef4444' }}>
                  {investorProfitShare.toLocaleString('en-US')} د.ك
                </div>
                <div className={styles.statLabel}>💰 ربح المستثمر</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🤝</div>
              <div className={styles.statContent}>
                <div className={styles.statValue} style={{ color: partnerProfitShare >= 0 ? '#10b981' : '#ef4444' }}>
                  {partnerProfitShare.toLocaleString('en-US')} د.ك
                </div>
                <div className={styles.statLabel}>🤝 ربح الشريك</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientStatsDisplay
