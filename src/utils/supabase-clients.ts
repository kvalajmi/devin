import { ClientsAPI } from './api/ClientsAPI'

/**
 * خدمة قاعدة البيانات للعملاء
 * تم فصلها حسب القاعدة الذهبية
 */
export class SupabaseDatabaseClients {
  static async getClients(): Promise<any[]> {
    return ClientsAPI.getClients()
  }

  static async addClient(client: any): Promise<number | null> {
    return ClientsAPI.addClient(client)
  }

  static async updateClient(clientId: number, updates: any): Promise<boolean> {
    return ClientsAPI.updateClient(clientId, updates)
  }

  static async deleteClient(clientId: number): Promise<boolean> {
    return ClientsAPI.deleteClient(clientId)
  }

  static async searchClients(searchTerm: string): Promise<any[]> {
    return ClientsAPI.searchClients(searchTerm)
  }

  static async getClientById(clientId: number): Promise<any | null> {
    return ClientsAPI.getClientById(clientId)
  }

  static convertSupabaseToClient(supabaseClient: any): any {
    return ClientsAPI.convertSupabaseToClient(supabaseClient)
  }

  static async advancedSearchClients(filters: any): Promise<any[]> {
    return ClientsAPI.advancedSearchClients(filters)
  }
}
