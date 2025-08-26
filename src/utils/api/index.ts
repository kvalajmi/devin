// تصدير جميع واجهات برمجة التطبيقات المقسمة
export { DatabaseAPI, testSupabaseConnection } from './DatabaseAPI'
export { ClientsAPI } from './ClientsAPI'
export { InvestorsAPI } from './InvestorsAPI'
export { PaymentsAPI } from './PaymentsAPI'
export { ExpensesAPI } from './ExpensesAPI'
export { SystemAPI } from './SystemAPI'

// تصدير الخدمات الأساسية للاستخدام المباشر
export {
  DatabaseConnection,
  SystemHealthService,
  DataCleanupService,
  ClientsService,
  InvestorsService,
  PaymentsService,
  ExpensesService
} from '../supabase-simple'
