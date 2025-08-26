import React, { useState } from 'react'
import { Investor } from './types'
import styles from './InvestorDetails.module.css'

// استيراد المكونات المقسمة الأصلية
import InvestorDetailsHeader from './components/InvestorDetailsHeader'
import InvestorBasicInfoForm from './components/InvestorBasicInfoForm'
import PartnerInfoForm from './components/PartnerInfoForm'
import DistributionRatiosDisplay from './components/DistributionRatiosDisplay'

// استيراد المكونات المحسّنة الجديدة
import InvestorBasicInfoCard from './components/enhanced/InvestorBasicInfoCard'
import InvestorCurrentBalanceCard from './components/enhanced/InvestorCurrentBalanceCard'
import InvestorProfitTrackingCards from './components/enhanced/InvestorProfitTrackingCards'
import FundingRecordsTable from './components/enhanced/FundingRecordsTable'
import InvestorWithdrawalsTable from './components/enhanced/InvestorWithdrawalsTable'
import PartnerWithdrawalsTable from './components/enhanced/PartnerWithdrawalsTable'

// استيراد Hook المخصص
import { useInvestorDetailsForm } from './hooks/useInvestorDetailsForm'

interface InvestorDetailsProps {
  investor: Investor
  onClose: () => void
  onUpdate: (investorId: number, updates: Partial<Investor>) => Promise<boolean>
}

/**
 * مكون تفاصيل المستثمر المحسّن
 * يعرض البيانات بشكل منظم ومفصل مع البطاقات والجداول المطلوبة
 */
const InvestorDetails: React.FC<InvestorDetailsProps> = ({
  investor,
  onClose,
  onUpdate
}) => {
  // حالة عرض النموذج أو البطاقات
  const [viewMode, setViewMode] = useState<'cards' | 'form'>('cards')

  // استخدام Hook المخصص لإدارة حالة النموذج
  const {
    isEditing,
    isLoading,
    formData,
    handleInputChange,
    handleSave,
    handleCancel,
    handleEdit
  } = useInvestorDetailsForm({ investor, onUpdate })

  return (
    <div className={styles.fullScreenContainer}>
      <div className={styles.contentWrapper}>
        {/* Header مع أزرار التبديل */}
        <div className={styles.headerCard}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-3 rounded-lg ml-4">
                  👤
                </span>
                تفاصيل المستثمر: {investor.investorName}
              </h2>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              {/* أزرار التبديل بين العرض */}
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📊 عرض البطاقات
                </button>
                <button
                  onClick={() => setViewMode('form')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'form'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📝 نموذج التعديل
                </button>
              </div>

              <button
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ❌ إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى حسب وضع العرض */}
      {viewMode === 'cards' ? (
        <div className="space-y-6">
          {/* البطاقات العلوية */}
          <div className={styles.cardsGrid}>
            {/* بطاقة معلومات المستثمر الأساسية */}
            <InvestorBasicInfoCard investor={investor} />

            {/* بطاقة الرصيد الحالي */}
            <InvestorCurrentBalanceCard
              investorId={investor.id}
              investorName={investor.investorName}
            />
          </div>

          {/* بطاقات تتبع الأرباح */}
          <InvestorProfitTrackingCards investorId={investor.id} />

          {/* الجداول */}
          <div className={styles.tablesSection}>
            {/* جدول كشف التمويل الفعلي - عرض كامل */}
            <div className={styles.fundingTableContainer}>
              <FundingRecordsTable
                investorId={investor.id}
                investorName={investor.investorName}
              />
            </div>

            {/* جداول المسحوبات */}
            <div className={styles.withdrawalsGrid}>
              {/* جدول مسحوبات المستثمر */}
              <InvestorWithdrawalsTable
                investorId={investor.id}
                investorName={investor.investorName}
              />

              {/* جدول مسحوبات الشريك */}
              <PartnerWithdrawalsTable
                investorId={investor.id}
                partnerName={investor.partnerName}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="card space-y-6">
          <InvestorDetailsHeader
            isEditing={isEditing}
            isLoading={isLoading}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onClose={onClose}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InvestorBasicInfoForm
              investor={investor}
              formData={formData}
              isEditing={isEditing}
              isLoading={isLoading}
              onInputChange={handleInputChange}
            />

            <PartnerInfoForm
              investor={investor}
            />

            <DistributionRatiosDisplay
              investor={investor}
              formData={formData}
              isEditing={isEditing}
              isLoading={isLoading}
              onInputChange={handleInputChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default InvestorDetails
