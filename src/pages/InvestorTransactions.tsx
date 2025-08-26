import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Client } from '../utils/database'
import { SupabaseDatabase } from '../utils/supabase-simple'

// استيراد المكونات الجديدة
import InvestorHeader from './InvestorTransactions/InvestorHeader'
import ClientsSearch from './InvestorTransactions/ClientsSearch'
import ClientsTable from './InvestorTransactions/ClientsTable'
import { SearchUtils } from './InvestorTransactions/SearchUtils'

interface Investor {
  id: number
  investorName: string
  partnerName: string
  partnershipType: string
  investorPercentage?: number
  partnerPercentage: number
  civilId: string
  joinDate: string
}

/**
 * صفحة معاملات المستثمر المحسّنة
 * تم تقسيمها إلى مكونات أصغر حسب القاعدة الذهبية
 */
const InvestorTransactions: React.FC = () => {
  const navigate = useNavigate()
  const { id: investorId } = useParams<{ id: string }>()
  
  // بيانات المستثمر (ديناميكية)
  const [investor, setInvestor] = useState<Investor | null>(null)
  const [isLoadingInvestor, setIsLoadingInvestor] = useState(true)

  useEffect(() => {
    const fetchInvestor = async () => {
      if (!investorId) return
      
      try {
        setIsLoadingInvestor(true)
        const investors = await SupabaseDatabase.getInvestors()
        const foundInvestor = investors.find(inv => inv.id === parseInt(investorId))
        
        if (foundInvestor) {
          setInvestor({
            id: foundInvestor.id,
            investorName: foundInvestor.investor_name,
            partnerName: foundInvestor.partner_name,
            partnershipType: foundInvestor.partnership_type,
            investorPercentage: foundInvestor.investor_percentage,
            partnerPercentage: foundInvestor.partner_percentage,
            civilId: foundInvestor.civil_id,
            joinDate: foundInvestor.join_date
          })
        }
      } catch (error) {
        console.error('خطأ في جلب بيانات المستثمر:', error)
        setError('حدث خطأ في تحميل بيانات المستثمر')
      } finally {
        setIsLoadingInvestor(false)
      }
    }

    fetchInvestor()
  }, [investorId])

  // حالات البيانات
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // حالات البحث والتصفية
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredClients, setFilteredClients] = useState<Client[]>([])

  // تحميل بيانات العملاء
  const refreshClients = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('🔄 تحديث بيانات العملاء...')
      const supabaseClients = await SupabaseDatabase.getClients()
      
      // تحويل البيانات من تنسيق Supabase إلى تنسيق Client
      const convertedClients = supabaseClients.map(supabaseClient => 
        SupabaseDatabase.convertSupabaseToClient(supabaseClient)
      )
      
      console.log(`✅ تم تحميل ${convertedClients.length} عميل بنجاح`)
      setClients(convertedClients)
      
    } catch (error) {
      console.error('❌ خطأ في تحميل العملاء:', error)
      setError('حدث خطأ في تحميل بيانات العملاء')
    } finally {
      setIsLoading(false)
    }
  }

  // البحث في العملاء
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
    const filtered = SearchUtils.searchClients(clients, newSearchTerm)
    setFilteredClients(filtered)
  }

  // فتح تفاصيل العميل
  const openClientDetails = (client: Client) => {
    console.log('🔗 فتح تفاصيل العميل:', client.name, 'ID:', client.id)
    navigate(`/client-details/${client.id}`)
  }

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    refreshClients()
  }, [])

  // تحديث النتائج المفلترة عند تغيير العملاء
  useEffect(() => {
    const filtered = SearchUtils.searchClients(clients, searchTerm)
    setFilteredClients(filtered)
  }, [clients, searchTerm])

  // إعادة تحميل البيانات عند العودة للصفحة
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 عودة المستخدم للصفحة - تحديث البيانات')
      refreshClients()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  if (isLoadingInvestor || !investor) {
    return (
      <div className="space-y-4 sm:space-y-6 w-full max-w-none">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  // عرض الخطأ
  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6 w-full max-w-none">
        <InvestorHeader investor={investor || {} as Investor} investorId={investorId} />
        
        <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">خطأ في تحميل البيانات</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <button
                  onClick={refreshClients}
                  className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-none">
      {/* رأس المستثمر */}
      <InvestorHeader investor={investor || {} as Investor} investorId={investorId} />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* البحث */}
        <ClientsSearch
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          totalClients={clients.length}
          filteredCount={filteredClients.length}
        />

        {/* جدول العملاء */}
        <ClientsTable
          clients={filteredClients}
          isLoading={isLoading}
          onClientClick={openClientDetails}
        />
      </main>
    </div>
  )
}

export default InvestorTransactions
