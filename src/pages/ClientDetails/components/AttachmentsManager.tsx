import React, { useState, useEffect } from 'react'
import { Client } from '../../../types/DatabaseTypes'
import { SupabaseDatabase } from '../../../utils/supabase-simple'
import FileUploader from './attachments/FileUploader'
import AttachmentsList from './attachments/AttachmentsList'
import AttachmentViewer from './attachments/AttachmentViewer'
import { AttachmentsService } from './attachments/AttachmentsService'

interface AttachmentFile {
  id: number
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  description: string
  fileData: string
}

interface AttachmentsManagerProps {
  client: Client | null
  isOpen: boolean
  onClose: () => void
  showNotification: (type: 'success' | 'error' | 'warning', message: string) => void
}

/**
 * مكون إدارة المرفقات المبسط
 */
const AttachmentsManager: React.FC<AttachmentsManagerProps> = ({
  client,
  isOpen,
  onClose,
  showNotification
}) => {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [viewingAttachment, setViewingAttachment] = useState<AttachmentFile | null>(null)

  // تحميل المرفقات عند فتح النافذة
  useEffect(() => {
    if (isOpen && client) {
      loadAttachments()
    } else if (!isOpen) {
      // تنظيف cache عند إغلاق النافذة
      AttachmentsService.clearCache()
    }
  }, [isOpen, client])

  /**
   * تحميل المرفقات من قاعدة البيانات
   */
  const loadAttachments = async () => {
    if (!client) return

    try {
      setIsLoading(true)
      // TODO: إضافة استدعاء قاعدة البيانات هنا
      // const clientAttachments = await SupabaseDatabase.getClientAttachments(client.id)
      // setAttachments(clientAttachments?.files || [])
      setAttachments([]) // مؤقت
    } catch (error) {
      console.error('خطأ في تحميل المرفقات:', error)
      showNotification('error', 'فشل في تحميل المرفقات')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * رفع ملف جديد
   */
  const handleFileUpload = async (file: File, description: string) => {
    if (!client) return

    // التحقق من صحة الملف
    const validation = AttachmentsService.validateFile(file)
    if (!validation.isValid) {
      showNotification('error', validation.error!)
      return
    }

    try {
      setIsUploading(true)

      // إنشاء كائن المرفق
      const newAttachment = await AttachmentsService.createAttachmentObject(file, description)

      // TODO: حفظ في قاعدة البيانات
      // const attachmentId = await SupabaseDatabase.addClientAttachment(client.id, newAttachment)
      const attachmentId = Date.now() // مؤقت

      if (attachmentId) {
        const savedAttachment: AttachmentFile = {
          ...newAttachment,
          id: attachmentId
        }

        setAttachments(prev => [...prev, savedAttachment])
        showNotification('success', 'تم حفظ المرفق بنجاح')
      } else {
        throw new Error('فشل في حفظ الملف')
      }
    } catch (error) {
      console.error('خطأ في رفع الملف:', error)
      showNotification('error', 'فشل في حفظ الملف')
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * عرض مرفق
   */
  const handleViewAttachment = (attachment: AttachmentFile) => {
    setViewingAttachment(attachment)
  }

  /**
   * حذف مرفق
   */
  const handleDeleteAttachment = async (attachmentId: number) => {
    if (!client) return

    const { ConfirmationHelpers } = await import('../../../utils/confirmation-helpers')
    const confirmed = await ConfirmationHelpers.deleteItem('هذا المرفق')
    if (!confirmed) return

    try {
      // TODO: حذف من قاعدة البيانات
      // const success = await SupabaseDatabase.deleteClientAttachment(client.id, attachmentId)
      const success = true // مؤقت

      if (success) {
        setAttachments(prev => prev.filter(att => att.id !== attachmentId))
        showNotification('success', 'تم حذف المرفق بنجاح')
      } else {
        throw new Error('فشل في حذف المرفق')
      }
    } catch (error) {
      console.error('خطأ في حذف المرفق:', error)
      showNotification('error', 'فشل في حذف المرفق')
    }
  }

  /**
   * تحميل مرفق
   */
  const handleDownloadAttachment = async (attachment: AttachmentFile) => {
    try {
      await AttachmentsService.downloadAttachment(attachment)
      showNotification('success', 'تم تحميل الملف بنجاح')
    } catch (error) {
      console.error('خطأ في تحميل الملف:', error)
      showNotification('error', 'فشل في تحميل الملف')
    }
  }

  /**
   * طباعة مرفق
   */
  const handlePrintAttachment = async (attachment: AttachmentFile) => {
    try {
      await AttachmentsService.printAttachment(attachment)
      showNotification('success', 'تم فتح الملف للطباعة')
    } catch (error) {
      console.error('خطأ في طباعة الملف:', error)
      showNotification('error', 'فشل في طباعة الملف')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* رأس النافذة */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">📎</span>
            مرفقات العميل - {client?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* محتوى النافذة */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* قسم رفع الملفات */}
          <FileUploader
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
          />

          {/* قائمة المرفقات */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              المرفقات المحفوظة ({attachments.length})
            </h3>

            <AttachmentsList
              attachments={attachments}
              isLoading={isLoading}
              onView={handleViewAttachment}
              onDownload={handleDownloadAttachment}
              onPrint={handlePrintAttachment}
              onDelete={handleDeleteAttachment}
            />
          </div>
        </div>

        {/* تذييل النافذة */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>

      {/* عارض المرفقات */}
      <AttachmentViewer
        attachment={viewingAttachment}
        isOpen={!!viewingAttachment}
        onClose={() => setViewingAttachment(null)}
      />
    </div>
  )
}

export default AttachmentsManager
