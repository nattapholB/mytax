import type {
  DeductionInput,
  IncomeInput,
  TaxCalculationResult,
} from '../config/types'
import { TAX_BRACKETS_2569, TAX_RULES_2569 } from '../config/taxRules2569'

export function calculateThaiTax(
  income: IncomeInput,
  deductions: DeductionInput
): TaxCalculationResult {
  const r = TAX_RULES_2569

  // 1. Total Assessable Income
  const income40_1 = Math.max(0, (income.salary || 0) + (income.bonus || 0))
  const income40_2 = Math.max(0, income.freelance || 0)
  const income40_3 = Math.max(0, income.royalty || 0)
  
  const dividendGross = (income.dividends || []).reduce((acc, d) => acc + (d.amount || 0), 0)
  const income40_4 = Math.max(0, (income.interest || 0) + dividendGross)
  
  const income40_5 = Math.max(0, 
    (income.rentalHouse || 0) +
    (income.rentalAgriLand || 0) +
    (income.rentalOtherLand || 0) +
    (income.rentalVehicle || 0) +
    (income.rentalOther || 0)
  )
  
  const income40_6 = Math.max(0, (income.medicalProfession || 0) + (income.otherLiberalProfession || 0))
  const income40_7 = Math.max(0, income.contractor || 0)
  const income40_8 = Math.max(0, income.businessGeneral || 0)

  const totalAssessableIncome =
    income40_1 +
    income40_2 +
    income40_3 +
    income40_4 +
    income40_5 +
    income40_6 +
    income40_7 +
    income40_8

  const incomeWithout40_1 = totalAssessableIncome - income40_1

  // 2. Expense Deductions
  const exp40_1_2 = Math.min(
    (income40_1 + income40_2) * r.expenses.salaryAndFreelanceRate,
    r.expenses.salaryAndFreelanceMax
  )
  const exp40_3 = Math.min(
    income40_3 * r.expenses.royaltyRate,
    r.expenses.royaltyMax
  )
  const exp40_4 = 0 // No standard expense deduction for dividends/interest
  const exp40_5 =
    (income.rentalHouse || 0) * r.expenses.rental.houseRate +
    (income.rentalAgriLand || 0) * r.expenses.rental.agriLandRate +
    (income.rentalOtherLand || 0) * r.expenses.rental.otherLandRate +
    (income.rentalVehicle || 0) * r.expenses.rental.vehicleRate +
    (income.rentalOther || 0) * r.expenses.rental.otherRate
  const exp40_6 =
    (income.medicalProfession || 0) * r.expenses.liberal.medicalRate +
    (income.otherLiberalProfession || 0) * r.expenses.liberal.otherRate
  const exp40_7 = income40_7 * r.expenses.contractorRate
  const exp40_8 = income40_8 * r.expenses.businessGeneralRate

  const totalExpenses =
    exp40_1_2 + exp40_3 + exp40_4 + exp40_5 + exp40_6 + exp40_7 + exp40_8

  const incomeAfterExpenses = Math.max(0, totalAssessableIncome - totalExpenses)

  // 3. Allowances (excluding donations)
  // Group 1: Personal & Family
  let personalAndFamily = r.allowances.personal
  if (deductions.hasSpouse && !deductions.spouseHasIncome) {
    personalAndFamily += r.allowances.spouseWithoutIncome
  }
  personalAndFamily += Math.max(0, deductions.childrenPre2561 || 0) * r.allowances.childPre2561
  personalAndFamily += Math.max(0, deductions.childrenPost2561 || 0) * r.allowances.childPost2561SecondPlus
  
  const selfParents = Math.min(2, Math.max(0, deductions.parentsSelfCount || 0))
  let spouseParents = 0
  if (deductions.hasSpouse && !deductions.spouseHasIncome) {
    spouseParents = Math.min(2, Math.max(0, deductions.parentsSpouseCount || 0))
  }
  personalAndFamily += (selfParents + spouseParents) * r.allowances.parentCare
  personalAndFamily += Math.max(0, deductions.disabledCount || 0) * r.allowances.disabledCare
  personalAndFamily += Math.min(r.allowances.prenatalMax, Math.max(0, deductions.prenatalChildbirth || 0))

  // Group 2: Insurance & Savings
  const socialSecurity = Math.min(r.allowances.socialSecurityMax, Math.max(0, deductions.socialSecurity || 0))
  const healthSelf = Math.min(r.allowances.healthInsuranceSelfMax, Math.max(0, deductions.healthInsuranceSelf || 0))
  const generalLife = Math.max(0, deductions.generalLifeInsurance || 0)
  const combinedLifeAndHealth = Math.min(r.allowances.combinedLifeAndHealthMax, generalLife + healthSelf)
  const parentsHealth = Math.min(r.allowances.parentsHealthInsuranceMax, Math.max(0, deductions.parentsHealthInsurance || 0))
  let spouseLife = 0
  if (deductions.hasSpouse && !deductions.spouseHasIncome) {
    spouseLife = Math.min(r.allowances.spouseLifeInsuranceMax, Math.max(0, deductions.spouseLifeInsurance || 0))
  }
  const insuranceAndSavings = socialSecurity + combinedLifeAndHealth + parentsHealth + spouseLife

  // Group 3: Retirement Pool (Combined limit 500,000)
  const unusedLifeRoom = Math.max(0, r.allowances.combinedLifeAndHealthMax - combinedLifeAndHealth)
  const maxPensionCap = r.allowances.pensionLifeInsuranceMax + unusedLifeRoom
  const pensionIncomeCap = totalAssessableIncome * r.allowances.pensionLifeInsuranceRate
  const allowedPension = Math.min(
    Math.max(0, deductions.pensionLifeInsurance || 0),
    Math.min(maxPensionCap, pensionIncomeCap)
  )

  const rmfIncomeCap = totalAssessableIncome * r.allowances.rmfRate
  const allowedRmf = Math.min(
    Math.max(0, deductions.rmf || 0),
    Math.min(r.allowances.rmfMax, rmfIncomeCap)
  )

  const pvdIncomeCap = totalAssessableIncome * r.allowances.pvdRate
  const allowedPvd = Math.min(
    Math.max(0, deductions.pvdOrGpf || 0),
    Math.min(r.allowances.pvdMax, pvdIncomeCap)
  )

  const allowedNsf = Math.min(r.allowances.nationalSavingsFundMax, Math.max(0, deductions.nationalSavingsFund || 0))

  const retirementSumBeforeCap = allowedPension + allowedRmf + allowedPvd + allowedNsf
  const retirementPool = Math.min(r.allowances.retirementPoolCombinedMax, retirementSumBeforeCap)

  // Group 4: ThaiESG (Separate from 500k retirement pool)
  const thaiEsgIncomeCap = totalAssessableIncome * r.allowances.thaiEsgRate
  const thaiEsg = Math.min(
    Math.max(0, deductions.thaiEsg || 0),
    Math.min(r.allowances.thaiEsgMax, thaiEsgIncomeCap)
  )

  // Group 5: Real Estate & Stimulus
  const homeLoan = Math.min(r.allowances.homeLoanInterestMax, Math.max(0, deductions.homeLoanInterest || 0))
  const newHome = Math.min(r.allowances.newHomeConstructionMax, Math.max(0, deductions.newHomeConstruction || 0))
  const easyE = Math.min(r.allowances.easyEReceiptMax, Math.max(0, deductions.easyEReceipt || 0))
  const propertyAndStimulus = homeLoan + newHome + easyE

  // Subtotal before donations
  const allowancesBeforeDonations =
    personalAndFamily + insuranceAndSavings + retirementPool + thaiEsg + propertyAndStimulus

  const netIncomeBeforeDonations = Math.max(0, incomeAfterExpenses - allowancesBeforeDonations)

  // Group 6: Donations
  const maxDoubleDonation = netIncomeBeforeDonations * r.allowances.doubleDonationMaxRateOfNetIncome
  const actualDoubleDonationValue = Math.max(0, deductions.doubleDonationEduSportHospital || 0) * 2
  const donationsDouble = Math.min(maxDoubleDonation, actualDoubleDonationValue)

  const netIncomeAfterDouble = Math.max(0, netIncomeBeforeDonations - donationsDouble)

  const maxGeneralDonation = netIncomeAfterDouble * r.allowances.generalDonationMaxRateOfNetIncome
  const donationsGeneral = Math.min(maxGeneralDonation, Math.max(0, deductions.generalDonation || 0))

  const politicalParty = Math.min(r.allowances.politicalPartyMax, Math.max(0, deductions.politicalPartyDonation || 0))

  const totalAllowances = allowancesBeforeDonations + donationsDouble + donationsGeneral + politicalParty
  const netTaxableIncome = Math.max(0, netIncomeAfterDouble - donationsGeneral - politicalParty)

  // 4. Method 1: Progressive Bracket Calculation
  let remainingTaxable = netTaxableIncome
  let taxMethod1 = 0
  let marginalRate = 0

  const bracketBreakdown = TAX_BRACKETS_2569.map((b) => {
    if (netTaxableIncome <= b.min) {
      return { bracket: b, taxableInBracket: 0, tax: 0 }
    }

    const bracketSpan = b.max !== null ? b.max - b.min : Infinity
    const taxableInBracket = Math.min(remainingTaxable, bracketSpan)
    const taxInBracket = taxableInBracket * b.rate

    taxMethod1 += taxInBracket
    remainingTaxable = Math.max(0, remainingTaxable - taxableInBracket)

    if (taxableInBracket > 0) {
      marginalRate = Math.max(marginalRate, b.rate * 100)
    }

    return {
      bracket: b,
      taxableInBracket,
      tax: taxInBracket,
    }
  })

  // 5. Method 2: 0.5% of non-40(1) income if > 1,000,000
  let isMethod2Applicable = false
  let taxMethod2 = 0

  if (incomeWithout40_1 > r.method2.threshold) {
    const rawTax2 = incomeWithout40_1 * r.method2.rate
    if (rawTax2 > r.method2.minimumTaxToApply) {
      isMethod2Applicable = true
      taxMethod2 = Math.round(rawTax2)
    }
  }

  // 6. Selected Gross Tax
  const grossTaxPayable = Math.max(taxMethod1, taxMethod2)
  const methodUsed: 'method1' | 'method2' =
    isMethod2Applicable && taxMethod2 > taxMethod1 ? 'method2' : 'method1'

  // 7. Credits & Withholding Tax
  let dividendTaxCredit = 0
  let dividendWht = 0
  for (const d of income.dividends || []) {
    if (d.corporateTaxRatePercent > 0) {
      const credit = d.amount * (d.corporateTaxRatePercent / (100 - d.corporateTaxRatePercent))
      dividendTaxCredit += credit
    }
    dividendWht += d.withholdingTax || 0
  }

  const totalWithholdingTax = Math.max(0, (income.withholdingTax || 0) + dividendWht)
  const totalTaxCredits = dividendTaxCredit + totalWithholdingTax

  // 8. Final Tax Payable or Refund
  const netDue = grossTaxPayable - totalTaxCredits
  const isRefund = netDue < 0
  const refundAmount = isRefund ? Math.abs(netDue) : 0
  const taxToPayAmount = !isRefund ? netDue : 0

  const effectiveTaxRate =
    totalAssessableIncome > 0 ? (grossTaxPayable / totalAssessableIncome) * 100 : 0

  return {
    totalAssessableIncome,
    incomeWithout40_1,
    expenseDeductions: {
      section40_1_2: exp40_1_2,
      section40_3: exp40_3,
      section40_4: exp40_4,
      section40_5: exp40_5,
      section40_6: exp40_6,
      section40_7: exp40_7,
      section40_8: exp40_8,
      totalExpenses,
    },
    incomeAfterExpenses,
    allowances: {
      personalAndFamily,
      insuranceAndSavings,
      retirementPool,
      thaiEsg,
      propertyAndStimulus,
      donationsDouble,
      donationsGeneral,
      totalAllowances,
    },
    netTaxableIncome,
    bracketBreakdown,
    taxMethod1: Math.round(taxMethod1),
    isMethod2Applicable,
    taxMethod2,
    grossTaxPayable: Math.round(grossTaxPayable),
    methodUsed,
    dividendTaxCredit: Math.round(dividendTaxCredit),
    totalWithholdingTax: Math.round(totalWithholdingTax),
    totalTaxCredits: Math.round(totalTaxCredits),
    finalTaxPayable: Math.round(netDue),
    isRefund,
    refundAmount: Math.round(refundAmount),
    taxToPayAmount: Math.round(taxToPayAmount),
    effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
    marginalTaxRate: marginalRate,
  }
}
