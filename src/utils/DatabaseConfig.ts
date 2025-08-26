import { DatabaseConfig } from '../types/DatabaseTypes'

/**
 * إعدادات قاعدة البيانات المحلية
 */
export const DATABASE_CONFIG: DatabaseConfig = {
  name: 'HarmuniExcelDB',
  version: 1,
  stores: [
    {
      name: 'investors',
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'investorName', keyPath: 'investorName', unique: false },
        { name: 'civilId', keyPath: 'civilId', unique: true }
      ]
    },
    {
      name: 'clients',
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'investorId', keyPath: 'investorId', unique: false },
        { name: 'civilId', keyPath: 'civilId', unique: true }
      ]
    },
    {
      name: 'fundingRecords',
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'investorId', keyPath: 'investorId', unique: false },
        { name: 'date', keyPath: 'date', unique: false }
      ]
    },
    {
      name: 'withdrawalRecords',
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'investorId', keyPath: 'investorId', unique: false },
        { name: 'date', keyPath: 'date', unique: false }
      ]
    },
    {
      name: 'partnerWithdrawalRecords',
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'investorId', keyPath: 'investorId', unique: false },
        { name: 'date', keyPath: 'date', unique: false }
      ]
    },
    {
      name: 'transactionExpenses',
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'clientId', keyPath: 'clientId', unique: false },
        { name: 'date', keyPath: 'date', unique: false }
      ]
    },
    {
      name: 'lawyerFees',
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'clientId', keyPath: 'clientId', unique: false },
        { name: 'date', keyPath: 'date', unique: false }
      ]
    },
    {
      name: 'paymentRecords',
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'clientId', keyPath: 'clientId', unique: false },
        { name: 'date', keyPath: 'date', unique: false }
      ]
    },
    {
      name: 'attachments',
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'clientId', keyPath: 'clientId', unique: false },
        { name: 'category', keyPath: 'category', unique: false }
      ]
    }
  ]
}
