/**
 * تعريف جميع الواجهات والأنواع المستخدمة في قاعدة البيانات
 */

export interface Client {
  id: number
  name: string
  civilId: string
  phoneNumber: string
  pensionDate: number
  guarantee: string
  paymentPeriod: number
  loanAmount: number
  profit: number
  fundingDate: string
  installmentValue: number
  firstInstallmentDate: string
  totalAmount: number
  totalPaid: number
  totalRemaining: number
  transaction_code?: string // كود المعاملة (مثل k10001-1)
  loan_code?: string // كود القرض (5 أرقام مثل 00001)
  investor_id?: number // معرف المستثمر
  job?: string
  address?: string
  governorate?: string
  area?: string
  block?: string
  street?: string
  avenue?: string
  houseNumber?: string
}

export interface TransactionExpense {
  id: number
  clientId: number
  date: string
  amount: number
  description: string
}

export interface LawyerFee {
  id: number
  clientId: number
  date: string
  amount: number
  description: string
}

export interface PaymentRecord {
  id: number
  clientId: number
  installmentId?: number
  date: string
  amount: number
  notes?: string
  type: 'installment' | 'partial'
}

export interface AttachmentFile {
  id: number
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  description: string
  fileData: string // Base64 encoded file data
  category: 'contract' | 'identity' | 'guarantee' | 'payment' | 'legal' | 'other'
}

export interface ClientAttachments {
  clientId: number
  files: AttachmentFile[]
  lastUpdated: string
}

export interface Investor {
  id: number
  investorName: string
  partnerName: string
  partnershipType: string
  investorPercentage: number
  partnerPercentage: number
  civilId: string
  joinDate: string
}

export interface FundingRecord {
  id: number
  investorId: number
  date: string
  amount: number
  description: string
  type: 'initial' | 'additional'
}

export interface WithdrawalRecord {
  id: number
  investorId: number
  date: string
  amount: number
  description: string
  type: 'profit' | 'capital'
}

export interface PartnerWithdrawalRecord {
  id: number
  investorId: number
  date: string
  amount: number
  description: string
  percentage: number
}

// أنواع مساعدة
export type DatabaseStore = 
  | 'clients' 
  | 'investors' 
  | 'fundingRecords' 
  | 'withdrawalRecords' 
  | 'partnerWithdrawalRecords' 
  | 'transactionExpenses' 
  | 'lawyerFees' 
  | 'paymentRecords' 
  | 'attachments'

export type SortDirection = 'asc' | 'desc'

export type ClientStatus = 'active' | 'completed' | 'overdue' | 'suspended'

export type PaymentStatus = 'pending' | 'completed' | 'overdue' | 'partial'

// إعدادات قاعدة البيانات
export interface DatabaseConfig {
  name: string
  version: number
  stores: {
    name: DatabaseStore
    keyPath: string
    autoIncrement: boolean
    indexes?: {
      name: string
      keyPath: string
      unique: boolean
    }[]
  }[]
}
