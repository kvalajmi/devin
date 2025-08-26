// خدمة إدارة العملاء الموحدة - تم إعادة تنظيمها حسب القاعدة الذهبية
// تم تقسيم الملف الأصلي إلى خدمات متخصصة منفصلة

import { ClientOperationsService } from './clients/ClientOperationsService'
import { ClientSearchService } from './clients/ClientSearchService'
import { ClientDataTransformer } from './clients/ClientDataTransformer'

/**
 * خدمة إدارة العملاء - واجهة موحدة
 * تعمل كواجهة للخدمات المتخصصة المنفصلة
 */
export class ClientsService {
  // ===== العمليات الأساسية =====
  static async getClients(): Promise<any[]> {
    return ClientOperationsService.getClients()
  }

  static async getClientById(clientId: number): Promise<any | null> {
    return ClientOperationsService.getClientById(clientId)
  }

  static async addClient(client: any): Promise<number | null> {
    return ClientOperationsService.addClient(client)
  }

  static async updateClient(clientId: number, updates: any): Promise<boolean> {
    return ClientOperationsService.updateClient(clientId, updates)
  }

  static async deleteClient(clientId: number): Promise<boolean> {
    return ClientOperationsService.deleteClient(clientId)
  }

  static async deleteAllClients(): Promise<boolean> {
    return ClientOperationsService.deleteAllClients()
  }

  // ===== خدمات البحث =====
  static async searchClients(searchTerm: string): Promise<any[]> {
    return ClientSearchService.searchClients(searchTerm)
  }

  static async advancedSearchClients(filters: {
    searchTerm?: string
    governorate?: string
    area?: string
    minLoanAmount?: number
    maxLoanAmount?: number
    pensionDateFrom?: string
    pensionDateTo?: string
  }): Promise<any[]> {
    return ClientSearchService.advancedSearchClients(filters)
  }

  static async searchClientsByCivilId(civilId: string): Promise<any[]> {
    return ClientSearchService.searchClientsByCivilId(civilId)
  }

  static async searchClientsByName(name: string): Promise<any[]> {
    return ClientSearchService.searchClientsByName(name)
  }

  static async getClientsByGovernorate(governorate: string): Promise<any[]> {
    return ClientSearchService.getClientsByGovernorate(governorate)
  }

  // ===== تحويل البيانات =====
  static convertSupabaseToClient(supabaseClient: any): any {
    return ClientDataTransformer.convertSupabaseToClient(supabaseClient)
  }

  static convertClientToSupabase(localClient: any): any {
    return ClientDataTransformer.convertClientToSupabase(localClient)
  }

  static convertMultipleSupabaseToClient(supabaseClients: any[]): any[] {
    return ClientDataTransformer.convertMultipleSupabaseToClient(supabaseClients)
  }

  static extractBasicClientInfo(client: any): any {
    return ClientDataTransformer.extractBasicClientInfo(client)
  }

  static extractAddressInfo(client: any): any {
    return ClientDataTransformer.extractAddressInfo(client)
  }

  static cleanClientData(client: any): any {
    return ClientDataTransformer.cleanClientData(client)
  }

  static validateClientData(client: any): { isValid: boolean; errors: string[] } {
    return ClientDataTransformer.validateClientData(client)
  }
}

// تصدير الخدمات المتخصصة للاستخدام المباشر عند الحاجة
export { ClientOperationsService, ClientSearchService, ClientDataTransformer }