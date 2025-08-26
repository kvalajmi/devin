import { useMemo } from 'react'
import { Investor } from '../pages/Investors/types'

/**
 * Hook مخصص لحساب إحصائيات المستثمرين
 * مسؤولية واحدة: حساب الإحصائيات فقط
 */
export const useInvestorStats = (investors: Investor[]) => {
  const stats = useMemo(() => ({
    totalInvestors: investors.length,
    totalInvestorPercentage: investors.reduce((sum, inv) => sum + inv.investorPercentage, 0),
    totalPartnerPercentage: investors.reduce((sum, inv) => sum + inv.partnerPercentage, 0),
    averageInvestorPercentage: investors.length > 0 ? investors.reduce((sum, inv) => sum + inv.investorPercentage, 0) / investors.length : 0,
    
    // إحصائيات إضافية
    partnershipTypes: investors.reduce((acc, inv) => {
      acc[inv.partnershipType] = (acc[inv.partnershipType] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    
    // توزيع النسب
    percentageDistribution: {
      '0-25%': investors.filter(inv => inv.investorPercentage <= 25).length,
      '26-50%': investors.filter(inv => inv.investorPercentage > 25 && inv.investorPercentage <= 50).length,
      '51-75%': investors.filter(inv => inv.investorPercentage > 50 && inv.investorPercentage <= 75).length,
      '76-100%': investors.filter(inv => inv.investorPercentage > 75).length
    },
    
    // المستثمرين الأكثر نشاطاً
    topInvestors: [...investors]
      .sort((a, b) => b.investorPercentage - a.investorPercentage)
      .slice(0, 5)
      .map(inv => ({
        name: inv.investorName,
        percentage: inv.investorPercentage,
        partnerName: inv.partnerName
      }))
  }), [investors])

  return stats
}
