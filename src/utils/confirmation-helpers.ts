import { useConfirmationContext } from '../components/ConfirmationProvider'

// Helper functions for common confirmation patterns
export const createDeleteConfirm = (showConfirm: ReturnType<typeof useConfirmationContext>['showConfirm']) => {
  return {
    // تأكيد حذف عنصر واحد
    async deleteItem(itemName: string, amount?: number): Promise<boolean> {
      let message = `هل أنت متأكد من حذف ${itemName}؟`
      let detail = 'هذا الإجراء غير قابل للتراجع.'
      
      if (amount !== undefined) {
        message += `\nالمبلغ: ${amount.toLocaleString()} د.ك`
      }
      
      return showConfirm({
        title: '⚠️ تأكيد الحذف ⚠️',
        message,
        detail,
        confirmText: 'حذف',
        cancelText: 'إلغاء',
        type: 'danger'
      })
    },

    // تأكيد حذف جميع البيانات
    async deleteAllData(): Promise<boolean> {
      return showConfirm({
        title: '⚠️ تحذير: حذف جميع البيانات ⚠️',
        message: 'هل أنت متأكد من أنك تريد حذف جميع البيانات؟',
        detail: 'هذه العملية لا يمكن التراجع عنها! ستفقد جميع البيانات المحفوظة.',
        confirmText: 'نعم، احذف الكل',
        cancelText: 'إلغاء',
        type: 'danger'
      })
    },

    // تأكيد حذف المستثمر
    async deleteInvestor(): Promise<boolean> {
      return showConfirm({
        title: '⚠️ تأكيد حذف المستثمر ⚠️',
        message: 'هل أنت متأكد من حذف هذا المستثمر؟',
        detail: 'سيتم حذف جميع البيانات المرتبطة به.',
        confirmText: 'حذف',
        cancelText: 'إلغاء',
        type: 'danger'
      })
    },

    // تأكيد حذف التمويل
    async deleteFunding(amount?: number): Promise<boolean> {
      let message = 'هل أنت متأكد من حذف هذا التمويل؟'
      let detail = 'هذا الإجراء غير قابل للتراجع.'
      
      if (amount !== undefined) {
        message += `\nالمبلغ: ${amount.toLocaleString()} د.ك`
      }
      
      return showConfirm({
        title: '⚠️ تأكيد حذف التمويل ⚠️',
        message,
        detail,
        confirmText: 'حذف',
        cancelText: 'إلغاء',
        type: 'danger'
      })
    },

    // تأكيد حذف السحب
    async deleteWithdrawal(amount?: number): Promise<boolean> {
      let message = 'هل أنت متأكد من حذف هذا السحب؟'
      let detail = 'هذا الإجراء غير قابل للتراجع.'
      
      if (amount !== undefined) {
        message += `\nالمبلغ: ${amount.toLocaleString()} د.ك`
      }
      
      return showConfirm({
        title: '⚠️ تأكيد حذف السحب ⚠️',
        message,
        detail,
        confirmText: 'حذف',
        cancelText: 'إلغاء',
        type: 'danger'
      })
    },

    // تأكيد حذف مسحوبات الشريك
    async deletePartnerWithdrawal(amount?: number): Promise<boolean> {
      let message = 'هل أنت متأكد من حذف مسحوبات الشريك؟'
      let detail = 'هذا الإجراء غير قابل للتراجع.'
      
      if (amount !== undefined) {
        message += `\nالمبلغ: ${amount.toLocaleString()} د.ك`
      }
      
      return showConfirm({
        title: '⚠️ تأكيد حذف مسحوبات الشريك ⚠️',
        message,
        detail,
        confirmText: 'حذف',
        cancelText: 'إلغاء',
        type: 'danger'
      })
    }
  }
}
