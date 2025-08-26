import React from 'react'
import { FileUtils } from './FileUtils'
import { formatDate } from '../../../Investors/utils/formatters'

interface AttachmentFile {
  id: number
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  description: string
  fileData: string
}

interface AttachmentsListProps {
  attachments: AttachmentFile[]
  isLoading: boolean
  onView: (attachment: AttachmentFile) => void
  onDownload: (attachment: AttachmentFile) => void
  onPrint: (attachment: AttachmentFile) => void
  onDelete: (attachmentId: number) => void
}

/**
 * مكون عرض قائمة المرفقات
 */
const AttachmentsList: React.FC<AttachmentsListProps> = ({
  attachments,
  isLoading,
  onView,
  onDownload,
  onPrint,
  onDelete
}) => {




  /**
   * أيقونة نوع الملف
   */
  const getFileIcon = (fileType: string, fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop()

    // الصور
    if (fileType.startsWith('image/')) {
      return (
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <span className="text-green-600 text-xl">🖼️</span>
        </div>
      )
    }

    // PDF
    if (fileType === 'application/pdf' || extension === 'pdf') {
      return (
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <span className="text-red-600 text-xl">📄</span>
        </div>
      )
    }

    // Excel
    if (fileType.includes('excel') || fileType.includes('spreadsheet') || ['xls', 'xlsx'].includes(extension || '')) {
      return (
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <span className="text-green-600 text-xl">📊</span>
        </div>
      )
    }

    // Word
    if (fileType.includes('word') || fileType.includes('document') || ['doc', 'docx'].includes(extension || '')) {
      return (
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 text-xl">📝</span>
        </div>
      )
    }

    // PowerPoint
    if (fileType.includes('powerpoint') || fileType.includes('presentation') || ['ppt', 'pptx'].includes(extension || '')) {
      return (
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <span className="text-orange-600 text-xl">📊</span>
        </div>
      )
    }

    // النصوص
    if (fileType.startsWith('text/') || ['txt', 'csv', 'rtf'].includes(extension || '')) {
      return (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-600 text-xl">📄</span>
        </div>
      )
    }

    // الأرشيف
    if (['zip', 'rar', '7z'].includes(extension || '') || fileType.includes('zip') || fileType.includes('rar')) {
      return (
        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <span className="text-yellow-600 text-xl">🗜️</span>
        </div>
      )
    }

    // افتراضي
    return (
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <span className="text-blue-600 text-xl">📄</span>
      </div>
    )
  }

  /**
   * التحقق من إمكانية الطباعة
   */
  const canPrint = (fileType: string): boolean => {
    return fileType.startsWith('image/') || fileType === 'application/pdf'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="mr-3 text-gray-600">جاري التحميل...</span>
      </div>
    )
  }

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>لا توجد مرفقات محفوظة</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {attachments.map((attachment) => (
        <div key={attachment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-shrink-0">
                {(() => {
                  const iconInfo = FileUtils.getFileIcon(attachment.fileType, attachment.fileName)
                  return (
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconInfo.bgColor}`}>
                      <span className={`text-xl ${iconInfo.color}`}>{iconInfo.icon}</span>
                    </div>
                  )
                })()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {attachment.fileName}
                </h4>
                <p className="text-sm text-gray-500 truncate">
                  {attachment.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {FileUtils.formatFileSize(attachment.fileSize)}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(attachment.uploadDate)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onView(attachment)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="عرض"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>

              <button
                onClick={() => onDownload(attachment)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="تحميل"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              {canPrint(attachment.fileType) && (
                <button
                  onClick={() => onPrint(attachment)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="طباعة"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
              )}

              <button
                onClick={() => onDelete(attachment.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="حذف"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AttachmentsList
