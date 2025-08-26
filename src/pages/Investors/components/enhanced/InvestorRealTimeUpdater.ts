export class InvestorRealTimeUpdater {
  static setupRealTimeUpdates(investorId: number, updateCallback: (balance: number) => void) {
    const interval = setInterval(async () => {
      try {
        const { BalanceCalculator } = await import('../../services/BalanceCalculator')
        const result = await BalanceCalculator.calculateCurrentBalance(investorId)
        updateCallback(result.currentBalance)
      } catch (error) {
        console.error('خطأ في التحديث التلقائي:', error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }
}
