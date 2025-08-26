// أنواع البيانات المستخدمة في قسم المستثمرين

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
  amount: number
  date: string
  notes?: string
}

export interface WithdrawalRecord {
  id: number
  investorId: number
  amount: number
  date: string
  notes?: string
}

export interface PartnerWithdrawalRecord {
  id: number
  investorId: number
  amount: number
  date: string
  notes?: string
}

export interface TransactionExpense {
  id: number
  clientId: number
  amount: number
  description: string
  date: string
}

export interface LawyerFee {
  id: number
  clientId: number
  amount: number
  description: string
  date: string
}

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
  job?: string
  address?: string
  governorate?: string
  area?: string
  block?: string
  street?: string
  avenue?: string
  houseNumber?: string
  transactionCode?: string
  transactionDate?: string
  installmentAmount?: number
}

export interface AlertState {
  show: boolean
  type: 'success' | 'error' | 'warning'
  message: string
}

export interface ProfitData {
  collectedProfit: number
  netProfit: number
  investorProfitShare: number
  partnerProfitShare: number
  investorNetRemaining: number
  partnerNetRemaining: number
}
