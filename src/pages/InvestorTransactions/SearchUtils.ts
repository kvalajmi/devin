import { Client } from '../../utils/database'

/**
 * أدوات البحث والتصفية
 */
export class SearchUtils {
  /**
   * تحويل الأرقام العربية إلى إنجليزية
   */
  static convertArabicToEnglishNumbers(text: string): string {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    
    let convertedText = text
    arabicNumbers.forEach((arabicNum, index) => {
      convertedText = convertedText.replace(new RegExp(arabicNum, 'g'), englishNumbers[index])
    })
    
    return convertedText
  }

  /**
   * البحث في العملاء
   */
  static searchClients(clients: Client[], searchTerm: string): Client[] {
    if (!searchTerm.trim()) {
      return clients
    }

    // تحويل الأرقام العربية إلى إنجليزية في نص البحث
    const convertedSearchTerm = this.convertArabicToEnglishNumbers(searchTerm.toLowerCase().trim())
    
    return clients.filter(client => {
      // البحث في الاسم
      const nameMatch = client.name?.toLowerCase().includes(convertedSearchTerm) || false
      
      // البحث في الرقم المدني (مع تحويل الأرقام العربية)
      const civilIdConverted = this.convertArabicToEnglishNumbers(client.civilId?.toLowerCase() || '')
      const civilIdMatch = civilIdConverted.includes(convertedSearchTerm) || false
      
      // البحث في رقم الهاتف (مع تحويل الأرقام العربية)
      const phoneConverted = this.convertArabicToEnglishNumbers(client.phoneNumber?.toLowerCase() || '')
      const phoneMatch = phoneConverted.includes(convertedSearchTerm) || false
      
      // البحث في كود المعاملة
      const transactionCodeMatch = client.transaction_code?.toLowerCase().includes(convertedSearchTerm) || false
      
      return nameMatch || civilIdMatch || phoneMatch || transactionCodeMatch
    })
  }

  /**
   * ترتيب العملاء حسب معايير مختلفة
   */
  static sortClients(clients: Client[], sortBy: 'name' | 'amount' | 'date' | 'remaining', direction: 'asc' | 'desc' = 'asc'): Client[] {
    return [...clients].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '', 'ar')
          break
        case 'amount':
          comparison = (a.loanAmount || 0) - (b.loanAmount || 0)
          break
        case 'date':
          comparison = new Date(a.fundingDate || '').getTime() - new Date(b.fundingDate || '').getTime()
          break
        case 'remaining':
          comparison = (a.totalRemaining || 0) - (b.totalRemaining || 0)
          break
        default:
          return 0
      }
      
      return direction === 'desc' ? -comparison : comparison
    })
  }

  /**
   * تصفية العملاء حسب الحالة
   */
  static filterClientsByStatus(clients: Client[], status: 'all' | 'completed' | 'pending' | 'overdue'): Client[] {
    switch (status) {
      case 'completed':
        return clients.filter(client => (client.totalRemaining || 0) <= 0)
      case 'pending':
        return clients.filter(client => (client.totalRemaining || 0) > 0)
      case 'overdue':
        // يمكن إضافة منطق للتحقق من التأخير بناءً على تواريخ الاستحقاق
        return clients.filter(client => {
          const today = new Date()
          const firstInstallmentDate = new Date(client.firstInstallmentDate || '')
          const monthsDiff = (today.getFullYear() - firstInstallmentDate.getFullYear()) * 12 + 
                           (today.getMonth() - firstInstallmentDate.getMonth())
          
          // افتراض أن العميل متأخر إذا مر أكثر من 6 أشهر ولا يزال لديه مبلغ متبقي
          return monthsDiff > 6 && (client.totalRemaining || 0) > 0
        })
      default:
        return clients
    }
  }

  /**
   * حساب إحصائيات العملاء
   */
  static calculateClientsStats(clients: Client[]): {
    totalClients: number
    totalLoanAmount: number
    totalPaid: number
    totalRemaining: number
    completedClients: number
    pendingClients: number
    averageLoanAmount: number
  } {
    const totalClients = clients.length
    const totalLoanAmount = clients.reduce((sum, client) => sum + (client.loanAmount || 0), 0)
    const totalPaid = clients.reduce((sum, client) => sum + (client.totalPaid || 0), 0)
    const totalRemaining = clients.reduce((sum, client) => sum + (client.totalRemaining || 0), 0)
    const completedClients = clients.filter(client => (client.totalRemaining || 0) <= 0).length
    const pendingClients = totalClients - completedClients
    const averageLoanAmount = totalClients > 0 ? totalLoanAmount / totalClients : 0

    return {
      totalClients,
      totalLoanAmount,
      totalPaid,
      totalRemaining,
      completedClients,
      pendingClients,
      averageLoanAmount
    }
  }
}
