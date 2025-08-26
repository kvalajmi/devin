import React, { useState, useEffect } from 'react'
import { AttachmentsService } from './AttachmentsService'
import AttachmentViewerHeader from './AttachmentViewerHeader'
import AttachmentViewerContent from './AttachmentViewerContent'

interface AttachmentFile {
  id: number
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  description: string
  fileData: string
}

interface AttachmentViewerProps {
  attachment: AttachmentFile | null
  isOpen: boolean
  onClose: () => void
}

/**
 * مكون عرض المرفقات
 */
const AttachmentViewer: React.FC<AttachmentViewerProps> = ({
  attachment,
  isOpen,
  onClose
}) => {
  const [fileUrl, setFileUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // تحميل الملف عند فتح العارض
  useEffect(() => {
    if (isOpen && attachment) {
      loadFile()
    }

    // تنظيف URL عند إغلاق العارض
    return () => {
      if (fileUrl) {
        window.URL.revokeObjectURL(fileUrl)
      }
    }
  }, [isOpen, attachment])

  /**
   * تحميل الملف بطريقة محسّنة
   */
  const loadFile = async () => {
    if (!attachment) return

    try {
      setIsLoading(true)
      setError('')
      const url = await AttachmentsService.createFileUrl(attachment)
      setFileUrl(url)
    } catch (error) {
      console.error('خطأ في تحميل الملف:', error)
      setError('فشل في تحميل الملف للعرض')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !attachment) return null





  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden">
        {/* رأس النافذة */}
        <AttachmentViewerHeader
          attachment={attachment}
          onClose={onClose}
        />

        {/* وصف المرفق */}
        {attachment.description && attachment.description !== attachment.fileName && (
          <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
            <p className="text-sm text-blue-800">
              <span className="font-medium">الوصف:</span> {attachment.description}
            </p>
          </div>
        )}

        {/* محتوى الملف */}
        <div className="overflow-auto max-h-[calc(95vh-120px)]">
          <AttachmentViewerContent
            attachment={attachment}
            fileUrl={fileUrl}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* تذييل النافذة */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            اضغط خارج النافذة أو على زر الإغلاق للخروج
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  )
}

export default AttachmentViewer
