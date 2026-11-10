export type IncomeCategoryId =
  | 'salary' // 40(1)
  | 'freelance' // 40(2)
  | 'royalty' // 40(3)
  | 'dividends' // 40(4)
  | 'rental' // 40(5)
  | 'liberal' // 40(6)
  | 'contractor' // 40(7)
  | 'business' // 40(8)

export interface DividendIncomeItem {
  id: string
  companyName: string
  amount: number
  corporateTaxRatePercent: number // e.g. 20, 25, 0 (BOI)
  withholdingTax: number // typically 10%
}

export interface IncomeInput {
  // 40(1)
  salary: number
  bonus: number
  // 40(2)
  freelance: number
  // 40(3)
  royalty: number
  // 40(4)
  interest: number
  dividends: DividendIncomeItem[]
  // 40(5) Rental
  rentalHouse: number
  rentalAgriLand: number
  rentalOtherLand: number
  rentalVehicle: number
  rentalOther: number
  // 40(6) Liberal Profession
  medicalProfession: number
  otherLiberalProfession: number // law, engineer, architecture, accountant
  // 40(7)
  contractor: number
  // 40(8)
  businessGeneral: number
  // Withholding taxes paid throughout year
  withholdingTax: number
}

export interface DeductionInput {
  // Group 1: Personal & Family
  hasSpouse: boolean
  spouseHasIncome: boolean
  childrenPre2561: number // born before 2561 (30k)
  childrenPost2561: number // 2nd+ child born 2561 onwards (60k)
  parentsSelfCount: number // max 2 (father, mother over 60)
  parentsSpouseCount: number // max 2
  disabledCount: number // 60k each
  prenatalChildbirth: number // max 60k
  
  // Group 2: Insurance & Savings
  socialSecurity: number // max 9,000
  generalLifeInsurance: number // max 100k
  healthInsuranceSelf: number // max 25k (life + health <= 100k)
  parentsHealthInsurance: number // max 15k
  spouseLifeInsurance: number // max 10k (if spouse no income)
  
  // Group 3: Retirement Pool (Combined limit 500,000)
  pensionLifeInsurance: number // up to 15% max 200k (or up to 300k if life unfulfilled)
  rmf: number // up to 30% max 500k
  pvdOrGpf: number // provident fund / GPF up to 15% max 500k
  nationalSavingsFund: number // กอช. max 30k
  
  // Group 4: ThaiESG (Separate 300,000 limit)
  thaiEsg: number // up to 30% max 300k
  
  // Group 5: Real Estate & Stimulus
  homeLoanInterest: number // max 100k
  newHomeConstruction: number // max 100k
  easyEReceipt: number // max 50k
  
  // Group 6: Donations
  doubleDonationEduSportHospital: number // 2x actual, max 10% of net income
  generalDonation: number // max 10% of remaining net income
  politicalPartyDonation: number // max 10k
}

export interface TaxBracket {
  min: number
  max: number | null
  rate: number
  name: string
  taxAtBracketMax: number
}

export interface TaxCalculationResult {
  totalAssessableIncome: number
  incomeWithout40_1: number
  
  // Expenses breakdown
  expenseDeductions: {
    section40_1_2: number // capped at 100,000
    section40_3: number // capped at 100,000
    section40_4: number // 0
    section40_5: number
    section40_6: number
    section40_7: number
    section40_8: number
    totalExpenses: number
  }
  incomeAfterExpenses: number
  
  // Allowances breakdown
  allowances: {
    personalAndFamily: number
    insuranceAndSavings: number
    retirementPool: number // <= 500,000
    thaiEsg: number // <= 300,000
    propertyAndStimulus: number
    donationsDouble: number
    donationsGeneral: number
    totalAllowances: number
  }
  
  // Net taxable income
  netTaxableIncome: number
  
  // Tax Method 1 (Progressive)
  bracketBreakdown: {
    bracket: TaxBracket
    taxableInBracket: number
    tax: number
  }[]
  taxMethod1: number
  
  // Tax Method 2 (0.5% for non-40(1) income > 1,000,000)
  isMethod2Applicable: boolean
  taxMethod2: number
  
  // Selected Tax Method
  grossTaxPayable: number
  methodUsed: 'method1' | 'method2'
  
  // Credits & Prepayments
  dividendTaxCredit: number
  totalWithholdingTax: number
  totalTaxCredits: number
  
  // Final Result
  finalTaxPayable: number // positive = need to pay extra, negative = tax refund!
  isRefund: boolean
  refundAmount: number
  taxToPayAmount: number
  
  // Rates
  effectiveTaxRate: number // percent of total assessable income
  marginalTaxRate: number // highest bracket rate (0 - 35)
}

export interface DeductionRoom {
  key: string
  title: string
  group: string
  currentAmount: number
  maxLimit: number
  roomLeft: number
  potentialTaxSaving: number
  conditionNote: string
}
