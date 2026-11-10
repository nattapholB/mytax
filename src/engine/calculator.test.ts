import { describe, it, expect } from 'vitest'
import { calculateThaiTax } from './calculator'
import type { DeductionInput, IncomeInput } from '../config/types'

const emptyIncome: IncomeInput = {
  salary: 0,
  bonus: 0,
  freelance: 0,
  royalty: 0,
  interest: 0,
  dividends: [],
  rentalHouse: 0,
  rentalAgriLand: 0,
  rentalOtherLand: 0,
  rentalVehicle: 0,
  rentalOther: 0,
  medicalProfession: 0,
  otherLiberalProfession: 0,
  contractor: 0,
  businessGeneral: 0,
  withholdingTax: 0,
}

const defaultDeductions: DeductionInput = {
  hasSpouse: false,
  spouseHasIncome: false,
  childrenPre2561: 0,
  childrenPost2561: 0,
  parentsSelfCount: 0,
  parentsSpouseCount: 0,
  disabledCount: 0,
  prenatalChildbirth: 0,
  socialSecurity: 0,
  generalLifeInsurance: 0,
  healthInsuranceSelf: 0,
  parentsHealthInsurance: 0,
  spouseLifeInsurance: 0,
  pensionLifeInsurance: 0,
  rmf: 0,
  pvdOrGpf: 0,
  nationalSavingsFund: 0,
  thaiEsg: 0,
  homeLoanInterest: 0,
  newHomeConstruction: 0,
  easyEReceipt: 0,
  doubleDonationEduSportHospital: 0,
  generalDonation: 0,
  politicalPartyDonation: 0,
}

describe('Thai Tax Engine 2569', () => {
  it('calculates tax for a standard employee (30,000 THB/month)', () => {
    const income: IncomeInput = {
      ...emptyIncome,
      salary: 360_000,
      withholdingTax: 2_050,
    }
    const deductions: DeductionInput = {
      ...defaultDeductions,
      socialSecurity: 9_000,
    }

    const res = calculateThaiTax(income, deductions)

    // Assessable: 360,000
    expect(res.totalAssessableIncome).toBe(360_000)
    // Expense: 50% max 100k -> 100,000
    expect(res.expenseDeductions.section40_1_2).toBe(100_000)
    expect(res.incomeAfterExpenses).toBe(260_000)
    // Allowances: personal 60k + SSO 9k = 69,000
    expect(res.allowances.personalAndFamily).toBe(60_000)
    expect(res.allowances.insuranceAndSavings).toBe(9_000)
    // Net: 260,000 - 69,000 = 191,000
    expect(res.netTaxableIncome).toBe(191_000)

    // Tax:
    // 0 - 150k @ 0% = 0
    // 150,001 - 191,000 = 41,000 @ 5% = 2,050
    expect(res.taxMethod1).toBe(2_050)
    expect(res.grossTaxPayable).toBe(2_050)
    expect(res.marginalTaxRate).toBe(5)
    expect(res.finalTaxPayable).toBe(0)
    expect(res.isRefund).toBe(false)
  })

  it('calculates refund when withholding tax exceeds payable tax', () => {
    const income: IncomeInput = {
      ...emptyIncome,
      salary: 360_000,
      withholdingTax: 5_000,
    }
    const deductions: DeductionInput = {
      ...defaultDeductions,
      socialSecurity: 9_000,
    }

    const res = calculateThaiTax(income, deductions)
    expect(res.grossTaxPayable).toBe(2_050)
    expect(res.isRefund).toBe(true)
    expect(res.refundAmount).toBe(2_950)
  })

  it('correctly calculates ThaiESG independently from 500k retirement pool', () => {
    const income: IncomeInput = {
      ...emptyIncome,
      salary: 2_000_000,
    }
    const deductions: DeductionInput = {
      ...defaultDeductions,
      rmf: 500_000,
      thaiEsg: 300_000,
    }

    const res = calculateThaiTax(income, deductions)
    expect(res.allowances.retirementPool).toBe(500_000)
    expect(res.allowances.thaiEsg).toBe(300_000)
  })

  it('correctly enforces the 500,000 THB retirement pool cap', () => {
    const income: IncomeInput = {
      ...emptyIncome,
      salary: 3_000_000,
    }
    const deductions: DeductionInput = {
      ...defaultDeductions,
      rmf: 400_000,
      pvdOrGpf: 300_000,
    }

    const res = calculateThaiTax(income, deductions)
    expect(res.allowances.retirementPool).toBe(500_000)
  })

  it('applies Method 2 (0.5%) when non-40(1) income > 1,000,000 THB and exceeds Method 1', () => {
    const income: IncomeInput = {
      ...emptyIncome,
      businessGeneral: 3_000_000,
    }
    const deductions: DeductionInput = {
      ...defaultDeductions,
      socialSecurity: 9_000,
      generalLifeInsurance: 100_000,
      rmf: 500_000,
      thaiEsg: 300_000,
    }

    const res = calculateThaiTax(income, deductions)
    expect(res.isMethod2Applicable).toBe(true)
    expect(res.taxMethod2).toBe(15_000)
  })

  it('computes dividend tax credit correctly (20% corporate tax rate)', () => {
    const income: IncomeInput = {
      ...emptyIncome,
      salary: 500_000,
      dividends: [
        {
          id: 'div-1',
          companyName: 'PTT PCL',
          amount: 100_000,
          corporateTaxRatePercent: 20,
          withholdingTax: 10_000,
        },
      ],
    }

    const res = calculateThaiTax(income, defaultDeductions)
    expect(res.dividendTaxCredit).toBe(25_000)
    expect(res.totalWithholdingTax).toBe(10_000)
    expect(res.totalTaxCredits).toBe(35_000)
  })
})
