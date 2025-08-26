import { Client } from '../../types/DatabaseTypes'

export class ClientDataConverter {
  static convertFromSupabase(supabaseClient: any): Client {
    return {
      id: supabaseClient.id,
      name: supabaseClient.name || '',
      civilId: supabaseClient.civil_id || '',
      phoneNumber: supabaseClient.phone_number || '',
      pensionDate: supabaseClient.pension_date || 0,
      guarantee: supabaseClient.guarantee || '',
      paymentPeriod: supabaseClient.payment_period || 0,
      loanAmount: supabaseClient.loan_amount || 0,
      profit: supabaseClient.profit || 0,
      fundingDate: supabaseClient.funding_date || '',
      installmentValue: supabaseClient.installment_value || 0,
      firstInstallmentDate: supabaseClient.first_installment_date || '',
      totalAmount: (supabaseClient.loan_amount || 0) + (supabaseClient.profit || 0),
      totalPaid: supabaseClient.total_paid || 0,
      totalRemaining: ((supabaseClient.loan_amount || 0) + (supabaseClient.profit || 0)) - (supabaseClient.total_paid || 0),
      transaction_code: supabaseClient.transaction_code,
      loan_code: supabaseClient.loan_code,
      investor_id: supabaseClient.investor_id,
      job: supabaseClient.job,
      address: supabaseClient.address,
      governorate: supabaseClient.governorate,
      area: supabaseClient.area,
      block: supabaseClient.block,
      street: supabaseClient.street,
      avenue: supabaseClient.avenue,
      houseNumber: supabaseClient.house_number
    }
  }
}
