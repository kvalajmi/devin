import React from 'react'
import * as XLSX from 'xlsx'

interface ExcelReaderProps {
  onFileRead: (workbook: XLSX.WorkBook) => void
  onError: (error: string) => void
  isLoading: boolean
}

/**
 * مكون قراءة ملفات Excel
 */
const ExcelReader: React.FC<ExcelReaderProps> = ({ onFileRead, onError, isLoading }) => {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { 
            type: 'array',
            cellDates: false,
            cellNF: false,
            cellText: false
          })
          onFileRead(workbook)
        } catch (error) {
          console.error('خطأ في قراءة ملف Excel:', error)
          onError('خطأ في قراءة ملف Excel. تأكد من صحة الملف.')
        }
      }
      reader.readAsArrayBuffer(file)
    } catch (error) {
      console.error('خطأ في تحميل الملف:', error)
      onError('خطأ في تحميل الملف')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center">
        <div className="mb-4">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            stroke="currentColor" 
            fill="none" 
            viewBox="0 0 48 48"
          >
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth={2} 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          استيراد بيانات العملاء من Excel
        </h3>
        
        <p className="text-gray-600 mb-4">
          اختر ملف Excel يحتوي على بيانات العملاء للاستيراد
        </p>
        
        <label 
          htmlFor="excel-upload" 
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري المعالجة...
            </>
          ) : (
            <>
              <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              اختيار ملف Excel
            </>
          )}
        </label>
        
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isLoading}
        />
        
        <div className="mt-4 text-xs text-gray-500">
          <p>الملفات المدعومة: .xlsx, .xls</p>
          <p>الحد الأقصى لحجم الملف: 10 ميجابايت</p>
        </div>
      </div>
    </div>
  )
}

export default ExcelReader
