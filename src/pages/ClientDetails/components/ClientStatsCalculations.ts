
export class ClientStatsCalculations {
  static calculateFinancialStats(
    client: any,
    totalPaid: number,
    totalExpenses: number,
    totalLawyerFees: number
  ) {
    if (!client) {
      return {
        loanAmount: 0,
        profit: 0,
        totalAmount: 0,
        totalRemaining: 0,
        progressPercentage: 0,
        profitRatio: 0,
        profitRatioFromPaidAmount: 0,
        collectedProfit: 0,
        collectedGrossProfit: 0,
        collectedCapital: 0,
        collectedNetProfit: 0,
        investorProfitShare: 0,
        partnerProfitShare: 0
      }
    }

    const loanAmount = client.loanAmount || 0
    const profit = client.profit || 0
    const totalAmount = loanAmount + profit
    const totalRemaining = totalAmount - totalPaid
    const progressPercentage = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0

    const profitRatio = (loanAmount + profit) > 0 ? profit / (loanAmount + profit) : 0
    const profitRatioFromPaidAmount = profitRatio * (totalPaid / totalAmount) * 100
    const collectedProfit = totalPaid > loanAmount ? totalPaid - loanAmount : 0
    const collectedGrossProfit = collectedProfit
    const collectedCapital = totalPaid - collectedProfit
    const collectedNetProfit = collectedProfit - totalExpenses - totalLawyerFees

    const investorProfitShare = (collectedNetProfit * (client?.investorPercentage || 50)) / 100
    const partnerProfitShare = (collectedNetProfit * (client?.partnerPercentage || 50)) / 100

    return {
      loanAmount,
      profit,
      totalAmount,
      totalRemaining,
      progressPercentage,
      profitRatio,
      profitRatioFromPaidAmount,
      collectedProfit,
      collectedGrossProfit,
      collectedCapital,
      collectedNetProfit,
      investorProfitShare,
      partnerProfitShare
    }
  }
}
