interface ProfitDistribution {
  investorId: number
  investorName: string
  availableProfit: number
  distributedAmount: string
  partnerProfit: number
  partnerAmount: string
}

/**
 * خدمة حساب الأرباح
 */
export class ProfitCalculator {
  /**
   * حساب توزيعات الأرباح لجميع المستثمرين
   */
  static calculateDistributions(
    investors: any[],
    clients: any[],
    expenses: any[],
    fees: any[],
    partnerWithdrawals: any[]
  ): ProfitDistribution[] {
    return investors.map(investor => {
      // حساب إجمالي الأرباح المحققة من جميع العملاء
      const investorClients = clients.filter(client => client.investorId === investor.id)
      const totalClientProfits = investorClients.reduce((total, client) => {
        return total + (client.profit || 0)
      }, 0)

      // حساب إجمالي المصروفات المرتبطة بهذا المستثمر
      const investorExpenses = expenses
        .filter(expense => {
          const expenseClient = clients.find(client => client.id === expense.clientId)
          return expenseClient && expenseClient.investorId === investor.id
        })
        .reduce((total, expense) => total + expense.amount, 0)

      // حساب إجمالي أتعاب المحاماة
      const investorLawyerFees = fees
        .filter(fee => {
          const feeClient = clients.find(client => client.id === fee.clientId)
          return feeClient && feeClient.investorId === investor.id
        })
        .reduce((total, fee) => total + fee.amount, 0)

      // صافي الربح = إجمالي الأرباح - المصروفات - أتعاب المحاماة
      const netProfit = totalClientProfits - investorExpenses - investorLawyerFees

      // حساب نصيب الشريك (نسبة من صافي الربح)
      const partnerPercentage = investor.partnerPercentage || 50
      const partnerProfit = (netProfit * partnerPercentage) / 100

      // حساب المبلغ المسحوب من قبل الشريك
      const withdrawnByPartner = partnerWithdrawals
        .filter(withdrawal => withdrawal.investorId === investor.id)
        .reduce((total, withdrawal) => total + withdrawal.amount, 0)

      // الربح المتاح للتوزيع = نصيب الشريك - المسحوب
      const availableProfit = Math.max(partnerProfit - withdrawnByPartner, 0)

      return {
        investorId: investor.id,
        investorName: investor.investorName,
        availableProfit,
        distributedAmount: '',
        partnerProfit,
        partnerAmount: ''
      }
    })
  }

  /**
   * حساب إحصائيات الأرباح لمستثمر واحد
   */
  static calculateInvestorProfitStats(
    investor: any,
    clients: any[],
    expenses: any[],
    fees: any[]
  ) {
    const investorClients = clients.filter(client => client.investorId === investor.id)
    
    const totalRevenue = investorClients.reduce((total, client) => {
      return total + (client.totalAmount || 0)
    }, 0)

    const totalProfits = investorClients.reduce((total, client) => {
      return total + (client.profit || 0)
    }, 0)

    const totalExpenses = expenses
      .filter(expense => {
        const expenseClient = clients.find(client => client.id === expense.clientId)
        return expenseClient && expenseClient.investorId === investor.id
      })
      .reduce((total, expense) => total + expense.amount, 0)

    const totalLawyerFees = fees
      .filter(fee => {
        const feeClient = clients.find(client => client.id === fee.clientId)
        return feeClient && feeClient.investorId === investor.id
      })
      .reduce((total, fee) => total + fee.amount, 0)

    const netProfit = totalProfits - totalExpenses - totalLawyerFees
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

    return {
      totalRevenue,
      totalProfits,
      totalExpenses,
      totalLawyerFees,
      netProfit,
      profitMargin: Math.round(profitMargin * 100) / 100,
      clientsCount: investorClients.length
    }
  }
}
