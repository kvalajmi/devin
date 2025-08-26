import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import * as XLSX from 'xlsx'

// استيراد المكونات الجديدة
import ExcelReader from './ExcelImport/ExcelReader'
import ImportProgress from './ExcelImport/ImportProgress'
import ImportResults from './ExcelImport/ImportResults'
import DataParser, { ImportedClient } from './ExcelImport/DataParser'
import { DatabaseImporter } from './ExcelImport/DatabaseImporter'

/**
 * المكون الرئيسي لاستيراد بيانات Excel
 * تم تقسيمه إلى مكونات أصغر حسب القاعدة الذهبية
 */
const ExcelImport: React.FC = () => {
  const { investorId } = useParams<{ investorId: string }>()
  
  // حالات المكون
  const [isLoading, setIsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importedClients, setImportedClients] = useState<ImportedClient[]>([])
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  /**
   * معالجة قراءة ملف Excel
   */
  const handleFileRead = async (workbook: XLSX.WorkBook) => {
    try {
      setIsLoading(true)
      setError('')
      setSuccess('')
      setProgress(10)
      setCurrentStep('بدء تحليل الملف...')

      // إنشاء محلل البيانات
      const parser = new DataParser(updateProgress)
      
      // تحليل البيانات
      const clients = await parser.parseWorkbook(workbook)
      
      setImportedClients(clients)
      setProgress(40)
      setCurrentStep(`تم العثور على ${clients.length} عميل`)
      
      if (clients.length === 0) {
        setError('لم يتم العثور على أي بيانات عملاء صحيحة في الملف')
      } else {
        setSuccess(`تم تحليل الملف بنجاح! تم العثور على ${clients.length} عميل`)
      }
      
    } catch (error) {
      console.error('خطأ في تحليل الملف:', error)
      setError('حدث خطأ أثناء تحليل الملف')
    } finally {
      setIsLoading(false)
      setProgress(0)
      setCurrentStep('')
    }
  }

  /**
   * بدء عملية الاستيراد إلى قاعدة البيانات
   */
  const handleStartImport = async () => {
    if (importedClients.length === 0) return

    try {
      setIsImporting(true)
      setError('')
      setSuccess('')
      setProgress(0)
      setCurrentStep('بدء الاستيراد...')

      // إنشاء مستورد قاعدة البيانات
      const importer = new DatabaseImporter(updateProgress, investorId)
      
      // استيراد البيانات
      await importer.importClients(importedClients)
      
      setProgress(100)
      setCurrentStep('تم الانتهاء من الاستيراد بنجاح!')
      setSuccess(`تم استيراد ${importedClients.length} عميل بنجاح!`)
      
      // مسح البيانات بعد الاستيراد الناجح
      setTimeout(() => {
        handleClearData()
      }, 2000)
      
    } catch (error) {
      console.error('خطأ في الاستيراد:', error)
      setError(`فشل في الاستيراد: ${error}`)
    } finally {
      setIsImporting(false)
      setProgress(0)
      setCurrentStep('')
    }
  }

  /**
   * تحديث شريط التقدم
   */
  const updateProgress = (progress: number, step: string) => {
    setProgress(progress)
    setCurrentStep(step)
  }

  /**
   * مسح البيانات
   */
  const handleClearData = () => {
    setImportedClients([])
    setError('')
    setSuccess('')
    setProgress(0)
    setCurrentStep('')
  }

  /**
   * معالجة الأخطاء
   */
  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setIsLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">استيراد بيانات العملاء</h2>
        <p className="text-gray-600">
          استيراد بيانات العملاء والمدفوعات والمصروفات من ملفات Excel
        </p>
      </div>

      {/* رسائل النجاح والخطأ */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* شريط التقدم */}
      <ImportProgress 
        progress={progress}
        currentStep={currentStep}
        isVisible={isLoading || isImporting}
      />

      {/* قارئ الملفات */}
      <ExcelReader 
        onFileRead={handleFileRead}
        onError={handleError}
        isLoading={isLoading}
      />

      {/* نتائج التحليل */}
      <ImportResults 
        clients={importedClients}
        onStartImport={handleStartImport}
        onClear={handleClearData}
        isImporting={isImporting}
      />
    </div>
  )
}

export default ExcelImport
