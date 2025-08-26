// إعداد Supabase موحد - قاعدة البيانات السحابية
// تم توحيد جميع عملاء Supabase في مكان واحد لتجنب تحذير Multiple GoTrueClient

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Global instance للتأكد من عدم التداخل مع ملفات خارجية
declare global {
  var __harmuni_supabase_client: SupabaseClient | undefined
}

/**
 * إدارة اتصال Supabase الموحد - Enhanced Singleton Pattern
 * يضمن وجود عميل واحد فقط في التطبيق بأكمله حتى مع الملفات الخارجية
 */
export class DatabaseConnection {
  private static readonly supabaseUrl = 'https://mxkzwpaxniudqbfugrqa.supabase.co'
  private static readonly supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3cGF4bml1ZHFiZnVncnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE3MTAsImV4cCI6MjA3MTU3NzcxMH0.DYHdZIh0xT7oXxlZ_8hvKzx-x6NVdKXrPFsMyUS3GqM'

  /**
   * الحصول على عميل Supabase الوحيد (Enhanced Singleton Pattern)
   */
  static getClient(): SupabaseClient {
    // التحقق من الـ global instance أولاً
    if (globalThis.__harmuni_supabase_client) {
      return globalThis.__harmuni_supabase_client
    }

    console.log('🔧 إنشاء عميل Supabase وحيد عالمي...')

    const client = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        flowType: 'implicit',
        storage: {
          // تخزين مخصص لتجنب التداخل مع ملفات أخرى
          getItem: (_key: string) => null,
          setItem: (_key: string, _value: string) => {},
          removeItem: (_key: string) => {}
        },
        storageKey: 'harmuni-app-auth-token'
      },
      realtime: {
        params: {
          eventsPerSecond: 1
        }
      },
      global: {
        headers: {
          'x-client-info': 'harmuni-excel@1.0.0',
          'x-app-instance': 'main-app'
        }
      }
    })

    // حفظ في الـ global scope لضمان الوحدة
    globalThis.__harmuni_supabase_client = client

    console.log('✅ تم إنشاء عميل Supabase وحيد عالمي بنجاح')
    return client
  }

  /**
   * اختبار الاتصال بقاعدة البيانات
   */
  static async testConnection(): Promise<boolean> {
    try {
      const client = this.getClient()
      const { error } = await client.from('clients').select('count').limit(1)

      if (error) {
        console.error('❌ خطأ في اختبار الاتصال:', error)
        return false
      }

      console.log('✅ الاتصال بقاعدة البيانات يعمل بشكل طبيعي')
      return true
    } catch (error) {
      console.error('❌ خطأ في اختبار الاتصال:', error)
      return false
    }
  }

  /**
   * إعادة تعيين الاتصال (للتطوير والاختبار)
   */
  static resetConnection(): void {
    globalThis.__harmuni_supabase_client = undefined
    console.log('🔄 تم إعادة تعيين الاتصال بقاعدة البيانات')
  }

  /**
   * الحصول على معلومات الاتصال
   */
  static getConnectionInfo() {
    return {
      url: this.supabaseUrl,
      key: this.supabaseKey.substring(0, 20) + '...',
      isConnected: !!globalThis.__harmuni_supabase_client
    }
  }
}

// تصدير العميل الوحيد للاستخدام المباشر
export const supabase = DatabaseConnection.getClient()
