// Native dialogs utility for Electron integration
// This replaces browser dialogs with native OS dialogs

interface ConfirmDialogOptions {
  title?: string;
  message: string;
  detail?: string;
  confirmText?: string;
  cancelText?: string;
}

interface AlertDialogOptions {
  title?: string;
  message: string;
  detail?: string;
  type?: 'info' | 'error' | 'warning';
  buttonText?: string;
}

interface ErrorDialogOptions {
  title?: string;
  message: string;
}

// Type declaration for Electron API
declare global {
  interface Window {
    electronAPI?: {
      showConfirmDialog: (options: ConfirmDialogOptions) => Promise<boolean>;
      showAlertDialog: (options: AlertDialogOptions) => Promise<void>;
      showErrorDialog: (options: ErrorDialogOptions) => Promise<void>;
      isElectron: boolean;
    };
    isElectron?: boolean;
  }
}

/**
 * Show native confirmation dialog
 * Falls back to browser confirm if not in Electron
 */
export async function showNativeConfirm(options: ConfirmDialogOptions): Promise<boolean> {
  // Check if running in Electron
  if (window.electronAPI?.isElectron) {
    try {
      return await window.electronAPI.showConfirmDialog(options);
    } catch (error) {
      console.error('فشل في عرض حوار التأكيد الأصلي:', error);
      // Fall back to browser dialog
      return false; // Deprecated - use ConfirmationProvider instead
    }
  }
  
  // Fallback to browser confirm
  return false; // Deprecated - use ConfirmationProvider instead
}

/**
 * Show native alert dialog
 * Falls back to browser alert if not in Electron
 */
export async function showNativeAlert(options: AlertDialogOptions): Promise<void> {
  // Check if running in Electron
  if (window.electronAPI?.isElectron) {
    try {
      await window.electronAPI.showAlertDialog(options);
      return;
    } catch (error) {
      console.error('فشل في عرض حوار التنبيه الأصلي:', error);
      // Fall back to browser alert
      console.log('Alert (deprecated):', options.message); // Use notification system instead
      return;
    }
  }
  
  // Fallback to browser alert
  console.log('Alert (deprecated):', options.message); // Use notification system instead
}

/**
 * Show native error dialog
 * Falls back to browser alert if not in Electron
 */
export async function showNativeError(options: ErrorDialogOptions): Promise<void> {
  // Check if running in Electron
  if (window.electronAPI?.isElectron) {
    try {
      await window.electronAPI.showErrorDialog(options);
      return;
    } catch (error) {
      console.error('فشل في عرض حوار الخطأ الأصلي:', error);
      // Fall back to browser alert
      console.error('Error (deprecated):', options.message); // Use notification system instead
      return;
    }
  }
  
  // Fallback to browser alert
  console.error('Error (deprecated):', options.message); // Use notification system instead
}

/**
 * Check if running in Electron environment
 */
export function isElectronApp(): boolean {
  return !!(window.electronAPI?.isElectron || window.isElectron);
}

// Convenience functions for common dialog patterns

/**
 * Show deletion confirmation dialog
 */
export async function showDeleteConfirm(itemName: string, amount?: number): Promise<boolean> {
  let message = `هل أنت متأكد من حذف ${itemName}؟`;
  let detail = 'هذا الإجراء غير قابل للتراجع.';
  
  if (amount !== undefined) {
    message += `\nالمبلغ: ${amount.toLocaleString()} د.ك`;
  }
  
  return showNativeConfirm({
    title: '⚠️ تأكيد الحذف ⚠️',
    message,
    detail,
    confirmText: 'حذف',
    cancelText: 'إلغاء'
  });
}

/**
 * Show bulk deletion confirmation dialog
 */
export async function showBulkDeleteConfirm(): Promise<boolean> {
  return showNativeConfirm({
    title: '⚠️ تحذير: حذف جميع البيانات ⚠️',
    message: 'هل أنت متأكد من أنك تريد حذف جميع البيانات؟',
    detail: 'هذه العملية لا يمكن التراجع عنها! ستفقد جميع البيانات المحفوظة.',
    confirmText: 'نعم، احذف الكل',
    cancelText: 'إلغاء'
  });
}

/**
 * Show success message
 */
export async function showSuccessMessage(message: string): Promise<void> {
  return showNativeAlert({
    title: '✅ نجح',
    message,
    type: 'info',
    buttonText: 'موافق'
  });
}

/**
 * Show error message
 */
export async function showErrorMessage(message: string): Promise<void> {
  return showNativeError({
    title: 'خطأ',
    message
  });
}
