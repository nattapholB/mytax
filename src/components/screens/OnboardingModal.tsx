import React, { useState } from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { GlassCard } from '../glass/GlassCard'
import type { DeductionInput, IncomeInput } from '../../config/types'

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: (initialIncome: Partial<IncomeInput>, initialDeductions: Partial<DeductionInput>) => void
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married_no_income' | 'married_income'>('single')
  const [childrenCount, setChildrenCount] = useState<number>(0)
  const [monthlySalary, setMonthlySalary] = useState<number>(50_000)

  if (!isOpen) return null

  const handleFinish = () => {
    const annualSalary = monthlySalary * 12
    const bonus = Math.round(monthlySalary * 1.5)
    const estimatedWht = Math.round(annualSalary * 0.035)

    onComplete(
      {
        salary: annualSalary,
        bonus,
        withholdingTax: estimatedWht,
      },
      {
        hasSpouse: maritalStatus !== 'single',
        spouseHasIncome: maritalStatus === 'married_income',
        childrenPost2561: childrenCount,
        socialSecurity: 9_000,
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      <GlassCard glow="cyan" className="relative z-10 w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> ยินดีต้อนรับสู่ MyTax 2569
          </div>
          <h2 className="text-xl font-bold dark:text-white text-slate-900">
            ตั้งค่าเริ่มต้น 3 คำถามสั้นๆ
          </h2>
          <p className="text-xs dark:text-slate-400 text-slate-500">
            เพื่อคำนวณและแสดงผลภาษีที่ใกล้เคียงกับคุณที่สุดทันที
          </p>
        </div>

        {/* Question 1: Marital Status */}
        <div className="space-y-2">
          <label className="text-xs font-bold dark:text-slate-300 text-slate-700">
            1. สถานะสมรสของคุณ
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'single', label: 'โสด' },
              { id: 'married_no_income', label: 'สมรส (คู่สมรสไม่มีเงินได้ ลดหย่อน 60,000)' },
              { id: 'married_income', label: 'สมรส (คู่สมรสมีเงินได้ แยกยื่น)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMaritalStatus(opt.id as any)}
                className={`p-3 rounded-xl text-left text-xs transition-all ${
                  maritalStatus === opt.id
                    ? 'bg-cyan-500/20 border-cyan-400 border text-cyan-200 font-semibold'
                    : 'dark:bg-white/[0.03] bg-slate-100 border dark:border-white/5 border-slate-200 dark:text-slate-300 text-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Children */}
        <div className="space-y-2">
          <label className="text-xs font-bold dark:text-slate-300 text-slate-700">
            2. จำนวนบุตร
          </label>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setChildrenCount(num)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  childrenCount === num
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'dark:bg-white/[0.03] bg-slate-100 border dark:border-white/5 border-slate-200 dark:text-slate-300 text-slate-700'
                }`}
              >
                {num === 0 ? 'ไม่มี' : `${num} คน`}
              </button>
            ))}
          </div>
        </div>

        {/* Question 3: Estimated Monthly Salary */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-bold dark:text-slate-300 text-slate-700">
              3. เงินเดือนโดยประมาณต่อเดือน
            </label>
            <span className="text-xs font-mono font-bold text-cyan-400">
              ฿{monthlySalary.toLocaleString()} / ด.
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[30000, 50000, 80000, 120000].map((sal) => (
              <button
                key={sal}
                type="button"
                onClick={() => setMonthlySalary(sal)}
                className={`py-2 rounded-xl text-[11px] font-mono transition-all ${
                  monthlySalary === sal
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'dark:bg-white/[0.03] bg-slate-100 border dark:border-white/5 border-slate-200 dark:text-slate-400 text-slate-600'
                }`}
              >
                {sal / 1000}k
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleFinish}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            เริ่มต้นใช้งาน MyTax <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </GlassCard>
    </div>
  )
}
