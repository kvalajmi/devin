import React from 'react'
import { FileUtils } from './FileUtils'

interface AttachmentFile {
  id: number
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  description: string
  fileData: string
}

interface AttachmentViewerContentProps {
  attachment: AttachmentFile
  fileUrl: string
  isLoading: boolean
  error: string
}

/**
 * محتوى عارض المرفقات
 */
const AttachmentViewerContent: React.FC<AttachmentViewerContentProps> = ({
  attachment,
  fileUrl,
  isLoading,
  error
}) => {
  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>جاري تحميل الملف...</p>
        </div>
      </div>
    )
  }

  // عرض رسالة الخطأ
  if (error || !fileUrl) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-red-600">{error || 'لا يمكن عرض هذا الملف'}</p>
        </div>
      </div>
    )
  }

  // عرض الصور
  if (attachment.fileType.startsWith('image/')) {
    return (
      <div className="flex items-center justify-center p-4">
        <img
          src={fileUrl}
          alt={attachment.fileName}
          className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
          onLoad={() => {
            // تنظيف URL بعد التحميل
            setTimeout(() => window.URL.revokeObjectURL(fileUrl), 1000)
          }}
        />
      </div>
    )
  }

  // عرض PDF
  if (attachment.fileType === 'application/pdf' || attachment.fileName.toLowerCase().endsWith('.pdf')) {
    return (
      <div className="w-full h-[70vh]">
        <iframe
          src={fileUrl}
          className="w-full h-full border-0 rounded-lg"
          title={attachment.fileName}
          onLoad={() => {
            // تنظيف URL بعد التحميل
            setTimeout(() => window.URL.revokeObjectURL(fileUrl), 1000)
          }}
        />
      </div>
    )
  }

  // عرض النصوص
  if (attachment.fileType.startsWith('text/') || 
      attachment.fileName.toLowerCase().endsWith('.txt') ||
      attachment.fileName.toLowerCase().endsWith('.csv') ||
      attachment.fileName.toLowerCase().endsWith('.json') ||
      attachment.fileName.toLowerCase().endsWith('.xml')) {
    return (
      <div className="w-full h-[70vh] p-4">
        <iframe
          src={fileUrl}
          className="w-full h-full border border-gray-300 rounded-lg bg-white"
          title={attachment.fileName}
          onLoad={() => {
            setTimeout(() => window.URL.revokeObjectURL(fileUrl), 1000)
          }}
        />
      </div>
    )
  }

  // تحديد نوع الملف للعرض المناسب
  const fileInfo = FileUtils.getFileTypeInfo(attachment.fileName, attachment.fileType)
  const colorClasses = FileUtils.getColorClasses(fileInfo.color)

  // للملفات الأخرى (Word, Excel, etc.)
  return (
    <div className="flex items-center justify-center h-96 text-gray-500">
      <div className="text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${colorClasses}`}>
          <span className="text-2xl">{fileInfo.icon}</span>
        </div>
        <p className="mb-2 font-medium text-gray-700">{fileInfo.name}</p>
        <p className="text-sm mb-4">معاينة غير متاحة - يمكنك تحميل الملف لعرضه</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              const link = document.createElement('a')
              link.href = fileUrl
              link.download = attachment.fileName
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              window.URL.revokeObjectURL(fileUrl)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            تحميل الملف
          </button>
          <button
            onClick={() => {
              const newWindow = window.open(fileUrl, '_blank')
              if (newWindow) {
                setTimeout(() => window.URL.revokeObjectURL(fileUrl), 10000)
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            فتح في نافذة جديدة
          </button>
        </div>
      </div>
    </div>
  )
}

export default AttachmentViewerContent
