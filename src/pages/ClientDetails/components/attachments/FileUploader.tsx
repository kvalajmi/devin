import React, { useState } from 'react'
import { AttachmentsService } from './AttachmentsService'

interface AttachmentFile {
  id: number
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  description: string
  fileData: string
}

interface FileUploaderProps {
  onFileUpload: (file: File, description: string) => Promise<void>
  isUploading: boolean
}

/**
 * مكون رفع الملفات
 */
const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, isUploading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [sizeWarning, setSizeWarning] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // التحقق من حجم الملف وعرض تحذير إذا لزم الأمر
      const warning = AttachmentsService.getFileSizeWarning(file)
      setSizeWarning(warning)
    }
  }

  const handleSave = async () => {
    if (!selectedFile) return

    await onFileUpload(selectedFile, description)

    // إعادة تعيين النموذج
    setSelectedFile(null)
    setDescription('')
    // إعادة تعيين input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setDescription('')
    setSizeWarning(null)
    // إعادة تعيين input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">رفع ملف جديد</h3>

      {/* وصف المرفق */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          وصف المرفق (اختياري)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="وصف مختصر للمرفق"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* منطقة رفع الملف */}
      <div className="flex items-center justify-center w-full mb-4">
        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${selectedFile ? 'border-green-400 bg-green-50' : ''}`}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {selectedFile ? (
              <>
                <svg className="w-8 h-8 mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mb-2 text-sm text-green-600 font-semibold">
                  تم اختيار الملف: {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">اضغط لاختيار ملف</span> أو اسحب وأفلت
                </p>
                <p className="text-xs text-gray-500">جميع أنواع الملفات مدعومة (حتى 50MB)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.txt,.csv,.rtf,.zip,.rar,.7z,.json,.xml"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* تحذير حجم الملف */}
      {sizeWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-yellow-800">{sizeWarning}</p>
          </div>
        </div>
      )}

      {/* أزرار الحفظ والإلغاء */}
      {selectedFile && (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isUploading}
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={isUploading}
            className={`px-6 py-2 text-white rounded-md transition-colors flex items-center gap-2 ${
              isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                حفظ المرفق
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default FileUploader
