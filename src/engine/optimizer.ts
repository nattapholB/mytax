import type { DeductionInput, DeductionRoom, IncomeInput } from '../config/types'
import { TAX_RULES_2569 } from '../config/taxRules2569'
import { calculateThaiTax } from './calculator'

export function analyzeDeductionRooms(
  income: IncomeInput,
  deductions: DeductionInput
): {
  rooms: DeductionRoom[]
  retirementPoolUsed: number
  retirementPoolMax: number
  retirementPoolRoomLeft: number
  topRecommendations: DeductionRoom[]
} {
  const currentCalc = calculateThaiTax(income, deductions)
  const marginalRate = currentCalc.marginalTaxRate / 100
  const totalIncome = currentCalc.totalAssessableIncome
  const r = TAX_RULES_2569

  // Retirement pool tracking
  const currentRetirementUsed = currentCalc.allowances.retirementPool
  const retirementPoolMax = r.allowances.retirementPoolCombinedMax
  const retirementPoolRoomLeft = Math.max(0, retirementPoolMax - currentRetirementUsed)

  const rooms: DeductionRoom[] = []

  // 1. ThaiESG (Separate 300k limit)
  const thaiEsgCap = Math.min(r.allowances.thaiEsgMax, totalIncome * r.allowances.thaiEsgRate)
  const currentThaiEsg = Math.min(thaiEsgCap, Math.max(0, deductions.thaiEsg || 0))
  const thaiEsgRoom = Math.max(0, thaiEsgCap - currentThaiEsg)
  rooms.push({
    key: 'thaiEsg',
    title: 'กองทุน ThaiESG',
    group: 'การลงทุนเพื่อความยั่งยืน',
    currentAmount: currentThaiEsg,
    maxLimit: thaiEsgCap,
    roomLeft: thaiEsgRoom,
    potentialTaxSaving: Math.round(thaiEsgRoom * marginalRate),
    conditionNote: 'สูงสุด 30% ของเงินได้ ไม่เกิน 300,000 บาท (ถือครอง 5 ปี นับวันชนวัน วงเงินแยกต่างหากจากกลุ่มเกษียณ)',
  })

  // 2. RMF
  const rmfIncomeCap = Math.min(r.allowances.rmfMax, totalIncome * r.allowances.rmfRate)
  const currentRmf = Math.min(rmfIncomeCap, Math.max(0, deductions.rmf || 0))
  const rmfRoom = Math.min(
    Math.max(0, rmfIncomeCap - currentRmf),
    retirementPoolRoomLeft
  )
  rooms.push({
    key: 'rmf',
    title: 'กองทุนรวมเพื่อการเลี้ยงชีพ (RMF)',
    group: 'การออมเพื่อการเกษียณ',
    currentAmount: currentRmf,
    maxLimit: rmfIncomeCap,
    roomLeft: rmfRoom,
    potentialTaxSaving: Math.round(rmfRoom * marginalRate),
    conditionNote: 'สูงสุด 30% ของเงินได้ ไม่เกิน 500,000 บาท (นับรวมในเพดานกลุ่มเกษียณ 500,000 บาท)',
  })

  // 3. General Life & Health Insurance
  const currentHealth = Math.min(r.allowances.healthInsuranceSelfMax, Math.max(0, deductions.healthInsuranceSelf || 0))
  const currentLife = Math.max(0, deductions.generalLifeInsurance || 0)
  const currentLifeCombined = Math.min(r.allowances.combinedLifeAndHealthMax, currentLife + currentHealth)
  const lifeRoom = Math.max(0, r.allowances.combinedLifeAndHealthMax - currentLifeCombined)
  rooms.push({
    key: 'lifeInsurance',
    title: 'ประกันชีวิตและสุขภาพ',
    group: 'ความคุ้มครอง',
    currentAmount: currentLifeCombined,
    maxLimit: r.allowances.combinedLifeAndHealthMax,
    roomLeft: lifeRoom,
    potentialTaxSaving: Math.round(lifeRoom * marginalRate),
    conditionNote: 'ประกันชีวิตทั่วไป + ประกันสุขภาพตนเอง รวมกันไม่เกิน 100,000 บาท (สุขภาพเดี่ยวไม่เกิน 25,000 บาท)',
  })

  // 4. Pension Life Insurance
  const unusedLife = Math.max(0, r.allowances.combinedLifeAndHealthMax - currentLifeCombined)
  const pensionMaxCap = r.allowances.pensionLifeInsuranceMax + unusedLife
  const pensionIncomeCap = Math.min(pensionMaxCap, totalIncome * r.allowances.pensionLifeInsuranceRate)
  const currentPension = Math.min(pensionIncomeCap, Math.max(0, deductions.pensionLifeInsurance || 0))
  const pensionRoom = Math.min(
    Math.max(0, pensionIncomeCap - currentPension),
    retirementPoolRoomLeft
  )
  rooms.push({
    key: 'pensionLife',
    title: 'ประกันชีวิตแบบบำนาญ',
    group: 'การออมเพื่อการเกษียณ',
    currentAmount: currentPension,
    maxLimit: pensionIncomeCap,
    roomLeft: pensionRoom,
    potentialTaxSaving: Math.round(pensionRoom * marginalRate),
    conditionNote: 'สูงสุด 15% ของเงินได้ ไม่เกิน 200,000 บาท (ถ้าไม่ใช้ประกันชีวิตทั่วไป เพิ่มได้ถึง 300,000 บาท อยู่ในกลุ่มเกษียณ)',
  })

  // 5. PVD / GPF
  const pvdCap = Math.min(r.allowances.pvdMax, totalIncome * r.allowances.pvdRate)
  const currentPvd = Math.min(pvdCap, Math.max(0, deductions.pvdOrGpf || 0))
  const pvdRoom = Math.min(
    Math.max(0, pvdCap - currentPvd),
    retirementPoolRoomLeft
  )
  rooms.push({
    key: 'pvd',
    title: 'กองทุนสำรองเลี้ยงชีพ (PVD) / กบข.',
    group: 'การออมเพื่อการเกษียณ',
    currentAmount: currentPvd,
    maxLimit: pvdCap,
    roomLeft: pvdRoom,
    potentialTaxSaving: Math.round(pvdRoom * marginalRate),
    conditionNote: 'สูงสุด 15% ของเงินได้ ไม่เกิน 500,000 บาท (อยู่ในกลุ่มเกษียณ 500,000 บาท)',
  })

  // 6. Home Loan Interest
  const currentHomeLoan = Math.min(r.allowances.homeLoanInterestMax, Math.max(0, deductions.homeLoanInterest || 0))
  const homeLoanRoom = Math.max(0, r.allowances.homeLoanInterestMax - currentHomeLoan)
  rooms.push({
    key: 'homeLoan',
    title: 'ดอกเบี้ยกู้ยืมเพื่อซื้อที่อยู่อาศัย',
    group: 'อสังหาริมทรัพย์',
    currentAmount: currentHomeLoan,
    maxLimit: r.allowances.homeLoanInterestMax,
    roomLeft: homeLoanRoom,
    potentialTaxSaving: Math.round(homeLoanRoom * marginalRate),
    conditionNote: 'ตามจ่ายจริง สูงสุดไม่เกิน 100,000 บาท',
  })

  // 7. Double Donation (Education / Sports / Hospital / e-Donation)
  const doubleDonationRoom = Math.max(0, currentCalc.netTaxableIncome * 0.10)
  rooms.push({
    key: 'doubleDonation',
    title: 'เงินบริจาคเพื่อการศึกษา/กีฬา/รพ. (ลดหย่อน 2 เท่า)',
    group: 'เงินบริจาค',
    currentAmount: (deductions.doubleDonationEduSportHospital || 0) * 2,
    maxLimit: doubleDonationRoom,
    roomLeft: Math.max(0, doubleDonationRoom - (deductions.doubleDonationEduSportHospital || 0) * 2),
    potentialTaxSaving: Math.round(
      Math.max(0, doubleDonationRoom - (deductions.doubleDonationEduSportHospital || 0) * 2) * marginalRate
    ),
    conditionNote: 'ลดหย่อนได้ 2 เท่าของที่จ่ายจริง สูงสุด 10% ของเงินได้สุทธิก่อนหักบริจาค',
  })

  const topRecommendations = [...rooms]
    .filter((r) => r.roomLeft > 0)
    .sort((a, b) => b.potentialTaxSaving - a.potentialTaxSaving)

  return {
    rooms,
    retirementPoolUsed: currentRetirementUsed,
    retirementPoolMax,
    retirementPoolRoomLeft,
    topRecommendations,
  }
}

export function simulateWhatIf(
  baseIncome: IncomeInput,
  baseDeductions: DeductionInput,
  additions: {
    thaiEsg?: number
    rmf?: number
    lifeInsurance?: number
    pensionLife?: number
    pvd?: number
  }
) {
  const currentCalc = calculateThaiTax(baseIncome, baseDeductions)

  const simulatedDeductions: DeductionInput = {
    ...baseDeductions,
    thaiEsg: (baseDeductions.thaiEsg || 0) + (additions.thaiEsg || 0),
    rmf: (baseDeductions.rmf || 0) + (additions.rmf || 0),
    generalLifeInsurance: (baseDeductions.generalLifeInsurance || 0) + (additions.lifeInsurance || 0),
    pensionLifeInsurance: (baseDeductions.pensionLifeInsurance || 0) + (additions.pensionLife || 0),
    pvdOrGpf: (baseDeductions.pvdOrGpf || 0) + (additions.pvd || 0),
  }

  const simulatedCalc = calculateThaiTax(baseIncome, simulatedDeductions)

  const taxSaved = Math.max(0, currentCalc.grossTaxPayable - simulatedCalc.grossTaxPayable)
  const additionalInvestment =
    (additions.thaiEsg || 0) +
    (additions.rmf || 0) +
    (additions.lifeInsurance || 0) +
    (additions.pensionLife || 0) +
    (additions.pvd || 0)

  const returnOnInvestmentPercent =
    additionalInvestment > 0 ? (taxSaved / additionalInvestment) * 100 : 0

  return {
    currentTax: currentCalc.grossTaxPayable,
    simulatedTax: simulatedCalc.grossTaxPayable,
    taxSaved,
    additionalInvestment,
    returnOnInvestmentPercent: Math.round(returnOnInvestmentPercent * 10) / 10,
    newFinalDue: simulatedCalc.finalTaxPayable,
    newIsRefund: simulatedCalc.isRefund,
    newRefundAmount: simulatedCalc.refundAmount,
  }
}
