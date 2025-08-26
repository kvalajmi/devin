import React, { useState, useCallback } from 'react'
import * as XLSX from 'xlsx'

// استيراد المحللات الجديدة
import { ClientDataParser, ClientData } from './parsers/ClientDataParser'
import { PaymentDataParser, PaymentRecord } from './parsers/PaymentDataParser'
import { ExpenseDataParser, ExpenseRecord, LawyerFeeRecord } from './parsers/ExpenseDataParser'

// إعادة تصدير الواجهات
export type { ClientData, PaymentRecord, ExpenseRecord, LawyerFeeRecord }

export interface ImportedClient extends ClientData {
  payments: PaymentRecord[]
  expenses: ExpenseRecord[]
  lawyerFees: LawyerFeeRecord[]
}

interface DataParserProps {
  file: File
  onDataParsed: (clients: ImportedClient[]) => void
  onError: (error: string) => void
}

/**
 * مكون تحليل بيانات Excel المحسّن
 * تم تقسيمه إلى محللات متخصصة حسب القاعدة الذهبية
 */
const DataParser: React.FC<DataParserProps> = ({ file, onDataParsed, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  /**
   * تحليل جميع البيانات
   */
  const parseAllData = useCallback(async (rawData: any[]): Promise<ImportedClient[]> => {
    const importedClients: ImportedClient[] = []
    const totalRows = rawData.length

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i]
      
      // تحديث التقدم
      const rowProgress = 40 + (i / totalRows) * 50
      setProgress(rowProgress)
      setCurrentStep(`معالجة العميل ${i + 1} من ${totalRows}`)

      try {
        // تحليل بيانات العميل
        const clientData = ClientDataParser.parseClientData(row, i)
        if (!clientData) continue

        // التحقق من صحة البيانات
        const validation = ClientDataParser.validateClientData(clientData)
        if (!validation.isValid) {
          console.warn(`تحذيرات للعميل ${clientData.name}:`, validation.errors)
        }

        // تحليل المدفوعات
        const payments = PaymentDataParser.parsePayments([row])
        
        // تحليل المصروفات
        const expenses = ExpenseDataParser.parseExpenses([row])
        
        // تحليل أتعاب المحامي
        const lawyerFees = ExpenseDataParser.parseLawyerFees([row])

        // إنشاء كائن العميل المستورد
        const importedClient: ImportedClient = {
          ...clientData,
          payments,
          expenses,
          lawyerFees
        }

        importedClients.push(importedClient)

      } catch (error) {
        console.error(`خطأ في معالجة الصف ${i + 1}:`, error)
        // متابعة المعالجة حتى لو فشل صف واحد
      }

      // إضافة تأخير صغير لتحديث واجهة المستخدم
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    }

    return importedClients
  }, [setProgress, setCurrentStep])

  /**
   * معالج تحليل الملف
   */
  const handleFileAnalysis = useCallback(async () => {
    try {
      setIsProcessing(true)
      setProgress(0)
      setCurrentStep('جاري قراءة الملف...')

      // قراءة ملف Excel
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      const worksheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[worksheetName]
      
      setProgress(20)
      setCurrentStep('جاري تحليل البيانات...')

      // تحويل البيانات إلى JSON
      const rawData = XLSX.utils.sheet_to_json(worksheet)
      
      if (rawData.length === 0) {
        throw new Error('الملف فارغ أو لا يحتوي على بيانات صالحة')
      }

      setProgress(40)
      setCurrentStep('جاري معالجة بيانات العملاء...')

      // تحليل البيانات
      const importedClients = await parseAllData(rawData)

      setProgress(100)
      setCurrentStep('اكتمل التحليل')

      onDataParsed(importedClients)
    } catch (error) {
      console.error('خطأ في تحليل الملف:', error)
      onError(error instanceof Error ? error.message : 'حدث خطأ غير معروف')
    } finally {
      setIsProcessing(false)
    }
  }, [file, parseAllData, onDataParsed, onError])

  /**
   * بدء التحليل عند تحميل المكون
   */
  React.useEffect(() => {
    if (file) {
      handleFileAnalysis()
    }
  }, [file, handleFileAnalysis])

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="text-center">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isProcessing ? 'جاري تحليل البيانات...' : 'تحليل مكتمل'}
        </h3>
        
        {isProcessing && (
          <>
            <p className="text-gray-600 mb-4">{currentStep}</p>
            
            {/* شريط التقدم */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="text-sm text-gray-500">
              {Math.round(progress)}% مكتمل
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DataParser