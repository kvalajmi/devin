/**
 * خدمة تحليل اتجاهات المصروفات
 */
export class ExpenseTrends {
  /**
   * تحليل اتجاهات المصروفات
   */
  static analyzeExpenseTrends(expenses: any[]): {
    monthlyTrends: Record<string, number>
    growthRate: number
    highestMonth: string
    lowestMonth: string
  } {
    if (expenses.length === 0) {
      return {
        monthlyTrends: {},
        growthRate: 0,
        highestMonth: 'غير محدد',
        lowestMonth: 'غير محدد'
      }
    }

    // تجميع المصروفات حسب الشهر
    const monthlyTrends: Record<string, number> = {}
    
    expenses.forEach(expense => {
      const date = new Date(expense.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyTrends[monthKey] = (monthlyTrends[monthKey] || 0) + expense.amount
    })

    // حساب معدل النمو
    const months = Object.keys(monthlyTrends).sort()
    let growthRate = 0
    
    if (months.length >= 2) {
      const firstMonth = monthlyTrends[months[0]]
      const lastMonth = monthlyTrends[months[months.length - 1]]
      growthRate = ((lastMonth - firstMonth) / firstMonth) * 100
    }

    // العثور على أعلى وأقل شهر
    const monthEntries = Object.entries(monthlyTrends)
    const highestMonth = monthEntries.reduce((max, [month, amount]) => 
      amount > max.amount ? { month, amount } : max, 
      { month: '', amount: 0 }
    ).month || 'غير محدد'

    const lowestMonth = monthEntries.reduce((min, [month, amount]) => 
      amount < min.amount ? { month, amount } : min, 
      { month: '', amount: Infinity }
    ).month || 'غير محدد'

    return {
      monthlyTrends,
      growthRate: Math.round(growthRate * 100) / 100,
      highestMonth,
      lowestMonth
    }
  }

  /**
   * توقع المصروفات المستقبلية
   */
  static predictFutureExpenses(expenses: any[]): {
    nextMonthEstimate: number
    confidence: 'عالية' | 'متوسطة' | 'منخفضة'
    trend: 'متزايد' | 'متناقص' | 'ثابت'
  } {
    if (expenses.length < 6) {
      return {
        nextMonthEstimate: 0,
        confidence: 'منخفضة',
        trend: 'ثابت'
      }
    }

    // تجميع البيانات الشهرية
    const monthlyData: Record<string, number> = {}
    expenses.forEach(expense => {
      const date = new Date(expense.date)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + expense.amount
    })

    const months = Object.keys(monthlyData).sort()
    const recentMonths = months.slice(-6) // آخر 6 أشهر
    const recentAmounts = recentMonths.map(month => monthlyData[month])

    // حساب المتوسط
    const average = recentAmounts.reduce((sum, amt) => sum + amt, 0) / recentAmounts.length

    // تحديد الاتجاه
    const firstHalf = recentAmounts.slice(0, 3).reduce((sum, amt) => sum + amt, 0) / 3
    const secondHalf = recentAmounts.slice(-3).reduce((sum, amt) => sum + amt, 0) / 3
    
    let trend: 'متزايد' | 'متناقص' | 'ثابت'
    if (secondHalf > firstHalf * 1.1) {
      trend = 'متزايد'
    } else if (secondHalf < firstHalf * 0.9) {
      trend = 'متناقص'
    } else {
      trend = 'ثابت'
    }

    // حساب مستوى الثقة
    const variance = recentAmounts.reduce((sum, amt) => 
      sum + Math.pow(amt - average, 2), 0) / recentAmounts.length
    
    const confidence = variance < (average * 0.1) ? 'عالية' :
                      variance < (average * 0.3) ? 'متوسطة' : 'منخفضة'

    return {
      nextMonthEstimate: Math.round(average),
      confidence,
      trend
    }
  }

  /**
   * مقارنة المصروفات بالفترات السابقة
   */
  static compareWithPreviousPeriods(expenses: any[]): {
    currentMonth: number
    previousMonth: number
    currentQuarter: number
    previousQuarter: number
    monthlyChange: number
    quarterlyChange: number
  } {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // حساب المصروفات للشهر الحالي
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    }).reduce((sum, expense) => sum + expense.amount, 0)

    // حساب المصروفات للشهر السابق
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const previousMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === prevMonth && expenseDate.getFullYear() === prevYear
    }).reduce((sum, expense) => sum + expense.amount, 0)

    // حساب المصروفات للربع الحالي
    const currentQuarterStart = Math.floor(currentMonth / 3) * 3
    const currentQuarterExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      const expenseMonth = expenseDate.getMonth()
      return expenseMonth >= currentQuarterStart && 
             expenseMonth < currentQuarterStart + 3 && 
             expenseDate.getFullYear() === currentYear
    }).reduce((sum, expense) => sum + expense.amount, 0)

    // حساب المصروفات للربع السابق
    const prevQuarterStart = currentQuarterStart === 0 ? 9 : currentQuarterStart - 3
    const prevQuarterYear = currentQuarterStart === 0 ? currentYear - 1 : currentYear
    const previousQuarterExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      const expenseMonth = expenseDate.getMonth()
      return expenseMonth >= prevQuarterStart && 
             expenseMonth < prevQuarterStart + 3 && 
             expenseDate.getFullYear() === prevQuarterYear
    }).reduce((sum, expense) => sum + expense.amount, 0)

    // حساب نسب التغيير
    const monthlyChange = previousMonthExpenses > 0 
      ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100 
      : 0

    const quarterlyChange = previousQuarterExpenses > 0 
      ? ((currentQuarterExpenses - previousQuarterExpenses) / previousQuarterExpenses) * 100 
      : 0

    return {
      currentMonth: currentMonthExpenses,
      previousMonth: previousMonthExpenses,
      currentQuarter: currentQuarterExpenses,
      previousQuarter: previousQuarterExpenses,
      monthlyChange: Math.round(monthlyChange * 100) / 100,
      quarterlyChange: Math.round(quarterlyChange * 100) / 100
    }
  }
}
