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

interface AttachmentViewerHeaderProps {
  attachment: AttachmentFile
  onClose: () => void
}

/**
 * رأس عارض المرفقات
 */
const AttachmentViewerHeader: React.FC<AttachmentViewerHeaderProps> = ({
  attachment,
  onClose
}) => {
  const getFileIcon = () => {
    const extension = attachment.fileName.toLowerCase().split('.').pop()
    
    if (attachment.fileType.startsWith('image/')) {
      return (
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <span className="text-green-600 text-lg">🖼️</span>
        </div>
      )
    }
    
    if (attachment.fileType === 'application/pdf' || extension === 'pdf') {
      return (
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <span className="text-red-600 text-lg">📄</span>
        </div>
      )
    }
    
    if (['xls', 'xlsx'].includes(extension || '') || attachment.fileType.includes('excel')) {
      return (
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <span className="text-green-600 text-lg">📊</span>
        </div>
      )
    }
    
    if (['doc', 'docx'].includes(extension || '') || attachment.fileType.includes('word')) {
      return (
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 text-lg">📝</span>
        </div>
      )
    }
    
    return (
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
        <span className="text-blue-600 text-lg">📄</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {getFileIcon()}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-800 truncate max-w-md">
            {attachment.fileName}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{FileUtils.formatFileSize(attachment.fileSize)}</span>
            <span>•</span>
            <span>{formatDate(attachment.uploadDate)}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default AttachmentViewerHeader
