// واجهة موحدة لقاعدة البيانات المحلية
// تم تقسيم الملف الأصلي إلى خدمات متخصصة حسب القاعدة الذهبية

// إعادة تصدير الأنواع والواجهات
export * from '../types/DatabaseTypes'

// إعادة تصدير الخدمات
export { LocalDatabaseService } from '../services/LocalDatabaseService'
export { DATABASE_CONFIG } from './DatabaseConfig'

// إنشاء نسخة واحدة من قاعدة البيانات للتوافق مع الكود القديم
import { LocalDatabaseService } from '../services/LocalDatabaseService'

/**
 * فئة قاعدة البيانات المحلية الموحدة
 * تعمل كواجهة للخدمة الجديدة مع الحفاظ على التوافق
 */
export class LocalDatabase extends LocalDatabaseService {
  // جميع الوظائف موروثة من LocalDatabaseService
  // هذا يضمن التوافق مع الكود القديم
}

// إنشاء نسخة واحدة من قاعدة البيانات (للتوافق مع الكود القديم)
export const localDB = new LocalDatabase()
