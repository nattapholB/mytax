import type { TaxBracket } from './types'

export const TAX_YEAR = 2569

export const TAX_BRACKETS_2569: TaxBracket[] = [
  { min: 0, max: 150_000, rate: 0.00, name: '0 - 150,000 (ยกเว้น)', taxAtBracketMax: 0 },
  { min: 150_000, max: 300_000, rate: 0.05, name: '150,001 - 300,000', taxAtBracketMax: 7_500 },
  { min: 300_000, max: 500_000, rate: 0.10, name: '300,001 - 500,000', taxAtBracketMax: 20_000 },
  { min: 500_000, max: 750_000, rate: 0.15, name: '500,001 - 750,000', taxAtBracketMax: 37_500 },
  { min: 750_000, max: 1_000_000, rate: 0.20, name: '750,001 - 1,000,000', taxAtBracketMax: 50_000 },
  { min: 1_000_000, max: 2_000_000, rate: 0.25, name: '1,000,001 - 2,000,000', taxAtBracketMax: 250_000 },
  { min: 2_000_000, max: 5_000_000, rate: 0.30, name: '2,000,001 - 5,000,000', taxAtBracketMax: 900_000 },
  { min: 5_000_000, max: null, rate: 0.35, name: '5,000,001 ขึ้นไป', taxAtBracketMax: Infinity },
]

export const TAX_RULES_2569 = {
  // Standard Expense Deductions
  expenses: {
    salaryAndFreelanceRate: 0.50, // 50%
    salaryAndFreelanceMax: 100_000,
    royaltyRate: 0.50,
    royaltyMax: 100_000,
    rental: {
      houseRate: 0.30, // 30%
      agriLandRate: 0.20, // 20%
      otherLandRate: 0.15, // 15%
      vehicleRate: 0.30, // 30%
      otherRate: 0.10, // 10%
    },
    liberal: {
      medicalRate: 0.60, // 60%
      otherRate: 0.30, // 30% (ทนายความ วิศวกร สถาปนิก บัญชี ช่างประณีตศิลป์)
    },
    contractorRate: 0.60, // 60%
    businessGeneralRate: 0.60, // 60%
  },

  // Deductions / Allowances
  allowances: {
    personal: 60_000,
    spouseWithoutIncome: 60_000,
    childPre2561: 30_000,
    childPost2561SecondPlus: 60_000,
    parentCare: 30_000, // per parent >= 60 yrs, income <= 30k
    disabledCare: 60_000,
    prenatalMax: 60_000,

    socialSecurityMax: 9_000,
    generalLifeInsuranceMax: 100_000,
    healthInsuranceSelfMax: 25_000,
    combinedLifeAndHealthMax: 100_000,
    parentsHealthInsuranceMax: 15_000,
    spouseLifeInsuranceMax: 10_000,

    // Retirement Pool (Total combined cap 500,000)
    retirementPoolCombinedMax: 500_000,
    pensionLifeInsuranceRate: 0.15, // 15% of assessable income
    pensionLifeInsuranceMax: 200_000, // up to 300k if life insurance < 100k
    rmfRate: 0.30, // 30% of assessable income
    rmfMax: 500_000,
    pvdRate: 0.15, // 15% of assessable income
    pvdMax: 500_000,
    nationalSavingsFundMax: 30_000,

    // ThaiESG (Separate cap)
    thaiEsgRate: 0.30, // 30% of assessable income
    thaiEsgMax: 300_000,

    // Property & Stimulus
    homeLoanInterestMax: 100_000,
    newHomeConstructionMax: 100_000,
    easyEReceiptMax: 50_000,

    // Donations
    doubleDonationMaxRateOfNetIncome: 0.10, // 10%
    generalDonationMaxRateOfNetIncome: 0.10, // 10%
    politicalPartyMax: 10_000,
  },

  // Method 2 (0.5% on non-40(1) income > 1,000,000)
  method2: {
    threshold: 1_000_000,
    rate: 0.005, // 0.5%
    minimumTaxToApply: 5_000,
  },
}
