import { ClientsService } from '../../services/ClientsService'

/**
 * واجهة برمجة التطبيقات لإدارة العملاء
 */
export class ClientsAPI {
  // ===== العمليات الأساسية =====
  static async getClients(): Promise<any[]> {
    return ClientsService.getClients()
  }

  static async addClient(client: any): Promise<number | null> {
    return ClientsService.addClient(client)
  }

  static async updateClient(clientId: number, updates: any): Promise<boolean> {
    return ClientsService.updateClient(clientId, updates)
  }

  static async deleteClient(clientId: number): Promise<boolean> {
    return ClientsService.deleteClient(clientId)
  }

  static async searchClients(searchTerm: string): Promise<any[]> {
    return ClientsService.searchClients(searchTerm)
  }

  static async getClientById(clientId: number): Promise<any | null> {
    return ClientsService.getClientById(clientId)
  }

  // ===== العمليات المتقدمة =====
  static convertSupabaseToClient(supabaseClient: any): any {
    return ClientsService.convertSupabaseToClient(supabaseClient)
  }

  static async advancedSearchClients(filters: any): Promise<any[]> {
    return ClientsService.advancedSearchClients(filters)
  }

  static async deleteAllClients(): Promise<boolean> {
    return ClientsService.deleteAllClients()
  }
}
