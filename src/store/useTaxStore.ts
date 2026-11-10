import { useState, useEffect } from 'react'
import type { DeductionInput, IncomeInput } from '../config/types'
import { calculateThaiTax } from '../engine/calculator'

export const DEFAULT_INCOME: IncomeInput = {
  salary: 780_000,
  bonus: 100_000,
  freelance: 50_000,
  royalty: 0,
  interest: 1_200,
  dividends: [
    {
      id: 'sample-1',
      companyName: 'PTT PCL',
      amount: 15_000,
      corporateTaxRatePercent: 20,
      withholdingTax: 1_500,
    },
  ],
  rentalHouse: 0,
  rentalAgriLand: 0,
  rentalOtherLand: 0,
  rentalVehicle: 0,
  rentalOther: 0,
  medicalProfession: 0,
  otherLiberalProfession: 0,
  contractor: 0,
  businessGeneral: 0,
  withholdingTax: 28_000,
}

export const DEFAULT_DEDUCTIONS: DeductionInput = {
  hasSpouse: false,
  spouseHasIncome: false,
  childrenPre2561: 0,
  childrenPost2561: 0,
  parentsSelfCount: 1,
  parentsSpouseCount: 0,
  disabledCount: 0,
  prenatalChildbirth: 0,
  socialSecurity: 9_000,
  generalLifeInsurance: 30_000,
  healthInsuranceSelf: 15_000,
  parentsHealthInsurance: 0,
  spouseLifeInsurance: 0,
  pensionLifeInsurance: 0,
  rmf: 40_000,
  pvdOrGpf: 39_000,
  nationalSavingsFund: 0,
  thaiEsg: 20_000,
  homeLoanInterest: 45_000,
  newHomeConstruction: 0,
  easyEReceipt: 20_000,
  doubleDonationEduSportHospital: 5_000,
  generalDonation: 2_000,
  politicalPartyDonation: 500,
}

export const BLANK_INCOME: IncomeInput = {
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

export const BLANK_DEDUCTIONS: DeductionInput = {
  hasSpouse: false,
  spouseHasIncome: false,
  childrenPre2561: 0,
  childrenPost2561: 0,
  parentsSelfCount: 0,
  parentsSpouseCount: 0,
  disabledCount: 0,
  prenatalChildbirth: 0,
  socialSecurity: 9_000,
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

const STORAGE_KEY = 'mytax_storage_2569_v1'

export function useTaxStore() {
  const [income, setIncome] = useState<IncomeInput>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.income) return parsed.income
      }
    } catch {
      // fallback
    }
    return DEFAULT_INCOME
  })

  const [deductions, setDeductions] = useState<DeductionInput>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.deductions) return parsed.deductions
      }
    } catch {
      // fallback
    }
    return DEFAULT_DEDUCTIONS
  })

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('mytax_theme')
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    } catch {
      // fallback
    }
    return 'dark'
  })

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mytax_onboarding_done') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ income, deductions }))
    } catch (e) {
      console.error('Failed to save to localStorage', e)
    }
  }, [income, deductions])

  useEffect(() => {
    try {
      localStorage.setItem('mytax_theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
    } catch {
      // fallback
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const markOnboardingDone = () => {
    setHasCompletedOnboarding(true)
    try {
      localStorage.setItem('mytax_onboarding_done', 'true')
    } catch {
      // fallback
    }
  }

  const resetToSample = () => {
    setIncome(DEFAULT_INCOME)
    setDeductions(DEFAULT_DEDUCTIONS)
  }

  const clearAllData = () => {
    setIncome(BLANK_INCOME)
    setDeductions(BLANK_DEDUCTIONS)
  }

  const exportDataJson = () => {
    const data = JSON.stringify({ income, deductions, exportedAt: new Date().toISOString() }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mytax-2569-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importDataJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString)
      if (parsed.income && parsed.deductions) {
        setIncome(parsed.income)
        setDeductions(parsed.deductions)
        return true
      }
    } catch (e) {
      console.error('Invalid JSON', e)
    }
    return false
  }

  const calculation = calculateThaiTax(income, deductions)

  return {
    income,
    setIncome,
    deductions,
    setDeductions,
    theme,
    toggleTheme,
    calculation,
    hasCompletedOnboarding,
    markOnboardingDone,
    resetToSample,
    clearAllData,
    exportDataJson,
    importDataJson,
  }
}
