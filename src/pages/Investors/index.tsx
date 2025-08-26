// صفحة المستثمرين المحسّنة - تم إعادة تنظيمها حسب القاعدة الذهبية
// تم تقسيم المنطق إلى hook مخصص ومكونات منفصلة

import React from 'react'
import { useInvestorManagement } from '../../hooks/useInvestorManagement'
import { Investor } from './types'

// استيراد المكونات المتخصصة
import InvestorPageHeader from './components/InvestorPageHeader'
import InvestorStats from './components/InvestorStats'
import AddInvestorForm from './AddInvestorForm'
import InvestorsList from './InvestorsList'
import InvestorDetails from './InvestorDetails'
import SkeletonLoader from './components/SkeletonLoader'

/**
 * صفحة المستثمرين المحسّنة
 * تم تقسيمها إلى مكونات أصغر وhook مخصص لتحسين القابلية للصيانة
 */
const Investors: React.FC = () => {
  const {
    investors,
    isLoading,
    showAddForm,
    showDetailsForm,
    selectedInvestor,
    stats,
    addInvestor,
    deleteInvestor,
    updateInvestor,
    openInvestorDetails,
    openInvestorTransactions,
    closeAllForms,
    toggleAddForm
  } = useInvestorManagement()

  // معالج تعديل المستثمر مع إغلاق النموذج
  const handleEditInvestor = async (investor: Investor) => {
    // فتح نموذج التعديل
    openInvestorDetails(investor)
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-none">

      {/* Header - يظهر دائماً */}
      {!showDetailsForm && (
        <InvestorPageHeader
          showAddForm={showAddForm}
          onToggleAddForm={toggleAddForm}
          isLoading={isLoading}
        />
      )}

      {/* Statistics */}
      {!showDetailsForm && !showAddForm && (
        <InvestorStats stats={stats} isLoading={isLoading} />
      )}

      {/* Add Investor Form */}
      {showAddForm && !showDetailsForm && (
        <AddInvestorForm
          onAdd={addInvestor}
          onCancel={() => toggleAddForm()}
        />
      )}

      {/* Investors List */}
      {!showDetailsForm && !showAddForm && (
        <>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <>
              <InvestorsList
                investors={investors}
                onViewDetails={openInvestorDetails}
                onEdit={handleEditInvestor}
                onDelete={deleteInvestor}
                onViewTransactions={openInvestorTransactions}
              />

              {/* Empty State */}
              {investors.length === 0 && (
                <div className="card text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد مستثمرين</h3>
                  <p className="text-gray-500 mb-4">ابدأ بإضافة أول مستثمر لإدارة الشراكات المالية</p>
                  <button
                    onClick={toggleAddForm}
                    className="btn-primary"
                  >
                    إضافة مستثمر جديد
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Investor Details */}
      {showDetailsForm && selectedInvestor && (
        <InvestorDetails
          investor={selectedInvestor}
          onClose={closeAllForms}
          onUpdate={updateInvestor}
        />
      )}
    </div>
  )
}

export default Investors
