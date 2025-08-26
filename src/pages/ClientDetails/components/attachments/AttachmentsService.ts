import { FileValidator } from './FileValidator'
import { FileConverter } from './FileConverter'
import { FileActions } from './FileActions'
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

/**
 * واجهة موحدة لخدمات إدارة المرفقات
 * تجمع جميع الوظائف من الخدمات المتخصصة
 */
export class AttachmentsService {
  // ===== التحقق من الملفات =====
  static validateFile(file: File) {
    return FileValidator.validateFile(file)
  }

  static getFileSizeWarning(file: File) {
    return FileValidator.getFileSizeWarning(file)
  }

  static canView(fileType: string) {
    return FileValidator.canView(fileType)
  }

  static canPrint(fileType: string) {
    return FileValidator.canPrint(fileType)
  }

  // ===== تحويل الملفات =====
  static fileToBase64(file: File) {
    return FileConverter.fileToBase64(file)
  }

  static base64ToBlob(base64Data: string, contentType: string) {
    return FileConverter.base64ToBlob(base64Data, contentType)
  }

  static createAttachmentObject(file: File, description: string) {
    return FileConverter.createAttachmentObject(file, description)
  }

  static createFileUrl(attachment: AttachmentFile) {
    return FileConverter.createFileUrl(attachment)
  }

  static clearCache() {
    return FileConverter.clearCache()
  }

  // ===== إجراءات الملفات =====
  static downloadAttachment(attachment: AttachmentFile) {
    return FileActions.downloadAttachment(attachment)
  }

  static printAttachment(attachment: AttachmentFile) {
    return FileActions.printAttachment(attachment)
  }

  static viewAttachment(attachment: AttachmentFile) {
    return FileActions.viewAttachment(attachment)
  }

  // ===== أدوات مساعدة =====
  static formatFileSize(bytes: number) {
    return FileUtils.formatFileSize(bytes)
  }

  static getFileIcon(fileType: string, fileName: string) {
    return FileUtils.getFileIcon(fileType, fileName)
  }

  static getFileTypeInfo(fileName: string, fileType: string) {
    return FileUtils.getFileTypeInfo(fileName, fileType)
  }

  static getColorClasses(color: string) {
    return FileUtils.getColorClasses(color)
  }
}
