import * as XLSX from 'xlsx'
import { ClientDataParser, ClientData } from './parsers/ClientDataParser'
import { PaymentDataParser, PaymentRecord } from './parsers/PaymentDataParser'
import { ExpenseDataParser, ExpenseRecord, LawyerFeeRecord } from './parsers/ExpenseDataParser'

export interface ImportedClient extends ClientData {
  payments: PaymentRecord[]
  expenses: ExpenseRecord[]
  lawyerFees: LawyerFeeRecord[]
}

/**
 * فئة تحليل بيانات Excel
 * تم إنشاؤها لحل مشكلة TypeScript في ExcelImport.tsx
 */
export class DataParserClass {
  private updateProgress: (progress: number, step: string) => void

  constructor(updateProgress: (progress: number, step: string) => void) {
    this.updateProgress = updateProgress
  }

  /**
   * تحليل ملف Excel وإرجاع البيانات
   */
  async parseWorkbook(workbook: XLSX.WorkBook): Promise<ImportedClient[]> {
    const worksheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[worksheetName]
    
    this.updateProgress(20, 'جاري تحليل البيانات...')
    
    const rawData = XLSX.utils.sheet_to_json(worksheet)
    
    if (rawData.length === 0) {
      throw new Error('الملف فارغ أو لا يحتوي على بيانات صالحة')
    }

    this.updateProgress(40, 'جاري معالجة بيانات العملاء...')
    
    return this.parseAllData(rawData)
  }

  /**
   * تحليل جميع البيانات
   */
  private async parseAllData(rawData: any[]): Promise<ImportedClient[]> {
    const importedClients: ImportedClient[] = []
    const totalRows = rawData.length

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i]
      
      const rowProgress = 40 + (i / totalRows) * 50
      this.updateProgress(rowProgress, `معالجة العميل ${i + 1} من ${totalRows}`)

      try {
        const clientData = ClientDataParser.parseClientData(row, i)
        if (!clientData) continue

        const validation = ClientDataParser.validateClientData(clientData)
        if (!validation.isValid) {
          console.warn(`تحذيرات للعميل ${clientData.name}:`, validation.errors)
        }

        const payments = PaymentDataParser.parsePayments([row])
        
        const expenses = ExpenseDataParser.parseExpenses([row])
        
        const lawyerFees = ExpenseDataParser.parseLawyerFees([row])

        const importedClient: ImportedClient = {
          ...clientData,
          payments,
          expenses,
          lawyerFees
        }

        importedClients.push(importedClient)

      } catch (error) {
        console.error(`خطأ في معالجة الصف ${i + 1}:`, error)
      }

      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    }

    return importedClients
  }
}
