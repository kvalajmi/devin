import { DatabaseConnection } from '../../services/DatabaseConnection'

/**
 * واجهة برمجة التطبيقات الأساسية لقاعدة البيانات
 */
export class DatabaseAPI {
  /**
   * الحصول على عميل قاعدة البيانات
   */
  static getClient() {
    return DatabaseConnection.getClient()
  }

  /**
   * اختبار الاتصال بقاعدة البيانات
   */
  static async testConnection(): Promise<boolean> {
    return DatabaseConnection.testConnection()
  }
}

// دالة اختبار الاتصال (للتوافق مع الكود القديم)
export async function testSupabaseConnection(): Promise<boolean> {
  return DatabaseAPI.testConnection()
}
