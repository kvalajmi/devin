import React from 'react'
import { useClientData } from '../context/ClientDataContext'
import { ClientStatsCalculations } from './ClientStatsCalculations'
import { ClientStatsDisplay } from './ClientStatsDisplay'

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

  const stats = ClientStatsCalculations.calculateFinancialStats(
    { loanAmount, profit, investorPercentage, partnerPercentage } as any,
    totalPaid,
    totalExpenses,
    totalLawyerFees
  )



  return <ClientStatsDisplay stats={stats} />
}

export default ClientStatsConnected
