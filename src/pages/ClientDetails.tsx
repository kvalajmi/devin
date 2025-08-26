import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Client } from '../types/DatabaseTypes'
import { SupabaseDatabase } from '../utils/supabase-simple'
import styles from './ClientDetails/ClientDetails.module.css'

// استيراد المكونات

import ClientDataManager from './ClientDetails/components/ClientDataManager'
import ClientStatsConnected from './ClientDetails/components/ClientStatsConnected'
import ClientPaymentsManager from './ClientDetails/components/ClientPaymentsManager'
import ClientExpensesManager from './ClientDetails/components/ClientExpensesManager'

// استيراد الخطافات المخصصة
import { useClientDetails } from './ClientDetails/hooks/useClientDetails'
import { ClientDataProvider } from './ClientDetails/context/ClientDataContext'

/**
 * المكون الرئيسي لتفاصيل العميل المحسّن
 * تم تقسيمه إلى خطافات مخصصة ومكونات أصغر حسب القاعدة الذهبية
 */
const ClientDetails: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  
  // التأكد من وجود clientId
  if (!clientId) {
    console.error('❌ لم يتم تمرير معرف العميل')
    return <div className="text-red-600 text-center">خطأ: لم يتم تحديد العميل</div>
  }
  
  // خطاف بيانات العميل
  const {
    client,
    isLoading,
    error,
    notification,
    showNotification,
    hideNotification,
    updateClient
  } = useClientDetails(clientId)

  // دالة تحديث العميل
  const handleUpdateClient = (updates: Partial<Client>) => {
    if (client) {
      const updatedClient = { ...client, ...updates }
      updateClient(updatedClient)
      console.log('🔧 تم تحديث بيانات العميل:', updatedClient)
    }
  }

  // state للمستثمر
  const [investor, setInvestor] = useState<any>(null)

  // دالة لاستخراج معلومات المستثمر من كود المعاملة
  const getInvestorFromTransactionCode = async (transactionCode: string) => {
    try {
      // استخراج الجزء الأول من كود المعاملة (مثل k10001 من k10001-1)
      const investorCode = transactionCode.split('-')[0]

      // جلب جميع المستثمرين
      const investors = await SupabaseDatabase.getInvestors()

      // للآن، سنستخدم مستثمر افتراضي بناءً على كود المعاملة
      // يمكن تحسين هذا لاحقاً بربط أفضل
      if (investors && investors.length > 0) {
        // استخدام أول مستثمر كافتراضي
        const defaultInvestor = investors[0]
        setInvestor({
          id: defaultInvestor.id,
          name: defaultInvestor.investor_name,
          partnerName: defaultInvestor.partner_name,
          transactionCode: investorCode
        })
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات المستثمر:', error)
    }
  }

  // تأثير لجلب بيانات المستثمر عند تحميل العميل
  useEffect(() => {
    if (client?.transaction_code) {
      getInvestorFromTransactionCode(client.transaction_code)
    }
  }, [client?.transaction_code])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات العميل...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg mb-4">{error}</div>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          العودة للصفحة السابقة
        </button>
      </div>
    )
  }

  return (
    <ClientDataProvider clientId={clientId} onNotification={showNotification}>
      <div className={styles.fullScreenContainer}>
        <div className={styles.contentWrapper}>
        {/* إشعار */}
        {notification.show && (
          <div className={`p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.message}
            <button
              onClick={hideNotification}
              className="float-left text-lg"
            >
              ×
            </button>
          </div>
        )}

      {/* رأس الصفحة مع اسم المستثمر */}
      <div className={styles.pageHeader}>
        <button
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          العودة إلى القائمة
        </button>

        {/* اسم المستثمر */}
        {investor && (
          <div className={styles.investorInfo}>
            <div className={styles.investorLabel}>المستثمر</div>
            <div className={styles.investorName}>{investor.name}</div>
            {investor.partnerName && (
              <div className={styles.partnerName}>بالشراكة مع {investor.partnerName}</div>
            )}
          </div>
        )}
      </div>

      {/* إدارة بيانات العميل */}
      <ClientDataManager
        client={client}
        onUpdateClient={handleUpdateClient}
        showNotification={showNotification}
      />

      {/* إحصائيات العميل */}
      {client && (
        <ClientStatsConnected
          loanAmount={client.loanAmount}
          profit={client.profit}
          investorPercentage={investor?.investorPercentage || 50}
          partnerPercentage={investor?.partnerPercentage || 50}
        />
      )}

      {/* إدارة المدفوعات */}
      <ClientPaymentsManager />

      {/* إدارة المصروفات */}
      <ClientExpensesManager />
        </div>
      </div>
    </ClientDataProvider>
  )
}

export default ClientDetails