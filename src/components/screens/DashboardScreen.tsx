import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'
import {
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react'
import type { DeductionInput, IncomeInput, TaxCalculationResult } from '../../config/types'
import { GlassCard } from '../glass/GlassCard'
import { StepChart } from '../glass/StepChart'
import { formatBaht, formatPercent } from '../../utils/formatters'
import type { TabId } from '../glass/GlassTabBar'
import { analyzeDeductionRooms } from '../../engine/optimizer'

interface DashboardScreenProps {
  calculation: TaxCalculationResult
  income: IncomeInput
  deductions: DeductionInput
  onNavigateTab: (tab: TabId) => void
  onOpenSettings: () => void
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  calculation,
  income,
  deductions,
  onNavigateTab,
  onOpenSettings,
}) => {
  const {
    isRefund,
    refundAmount,
    taxToPayAmount,
    marginalTaxRate,
    effectiveTaxRate,
    totalAssessableIncome,
    expenseDeductions,
    allowances,
    netTaxableIncome,
    grossTaxPayable,
    dividendTaxCredit,
    totalWithholdingTax,
    bracketBreakdown,
    methodUsed,
    isMethod2Applicable,
    taxMethod2,
  } = calculation

  const analysis = analyzeDeductionRooms(income, deductions)

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#818cf8', '#34d399', '#f472b6'],
    })
  }

  useEffect(() => {
    if (isRefund && refundAmount > 0) {
      triggerConfetti()
    }
  }, [isRefund, refundAmount])

  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* Top Header Bar */}
      <header className="flex justify-between items-center px-1">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase">
            ปีภาษี 2569
          </span>
          <h1 className="text-xl font-bold dark:text-white text-slate-900 tracking-tight">
            สรุปภาษีเงินได้
          </h1>
        </div>

        <button
          onClick={onOpenSettings}
          type="button"
          aria-label="ตั้งค่าและจัดการข้อมูล"
          className="p-2.5 rounded-full liquid-glass-pill hover:scale-105 active:scale-95 transition-all text-slate-300 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Hero Liquid Glass Card */}
      <GlassCard
        glow={isRefund ? 'cyan' : 'coral'}
        className="p-6 text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-1.5">
          {isRefund ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
              <TrendingDown className="w-3.5 h-3.5" /> คาดว่าจะได้ภาษีคืน
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
              <TrendingUp className="w-3.5 h-3.5" /> คาดว่าต้องจ่ายภาษีเพิ่ม
            </span>
          )}
        </div>

        <div>
          <div
            onClick={isRefund ? triggerConfetti : undefined}
            className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight cursor-default select-none transition-transform active:scale-95 ${
              isRefund
                ? 'dark:text-white text-slate-900 drop-shadow-[0_2px_15px_rgba(56,189,248,0.4)]'
                : 'text-amber-400 drop-shadow-[0_2px_15px_rgba(251,191,36,0.3)]'
            }`}
          >
            {formatBaht(isRefund ? refundAmount : taxToPayAmount)}
          </div>
          <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
            {isRefund
              ? 'กรมสรรพากรจะโอนคืนผ่าน PromptPay เลขบัตรประชาชน'
              : 'สามารถเลือกผ่อนชำระ 0% ได้ 3 งวด (ยอดเกิน 3,000 บาท)'}
          </p>
        </div>

        {/* Rate Pills */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <div className="px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs flex items-center gap-1.5">
            <span className="dark:text-slate-400 text-slate-500">อัตราภาษีสูงสุด</span>
            <span className="font-bold text-cyan-400 font-mono">
              {marginalTaxRate}%
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs flex items-center gap-1.5">
            <span className="dark:text-slate-400 text-slate-500">อัตราเฉลี่ย</span>
            <span className="font-bold text-sky-400 font-mono">
              {formatPercent(effectiveTaxRate)}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Stepped Tax Bracket Chart */}
      <GlassCard className="p-5">
        <StepChart
          brackets={bracketBreakdown}
          netTaxableIncome={netTaxableIncome}
          marginalRate={marginalTaxRate}
        />
      </GlassCard>

      {/* Tax Calculation Breakdown Flow */}
      <GlassCard className="p-5 space-y-3.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold uppercase tracking-wider dark:text-slate-400 text-slate-500">
            ขั้นตอนการคำนวณภาษี
          </span>
          {methodUsed === 'method2' ? (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-medium">
              คำนวณตามวิธีที่ 2 (0.5%)
            </span>
          ) : (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 font-medium">
              วิธีอัตราก้าวหน้า (ภ.ง.ด.90/91)
            </span>
          )}
        </div>

        <div className="space-y-2 text-xs divide-y dark:divide-white/5 divide-slate-200/50">
          <div className="flex justify-between py-1 items-center">
            <span className="dark:text-slate-300 text-slate-600">เงินได้พึงประเมินรวม</span>
            <span className="font-mono font-semibold dark:text-white text-slate-900">
              {formatBaht(totalAssessableIncome)}
            </span>
          </div>

          <div className="flex justify-between py-1.5 items-center">
            <span className="dark:text-slate-400 text-slate-500">หักค่าใช้จ่ายตามกฎหมาย</span>
            <span className="font-mono text-rose-400">
              - {formatBaht(expenseDeductions.totalExpenses)}
            </span>
          </div>

          <div className="flex justify-between py-1.5 items-center">
            <span className="dark:text-slate-400 text-slate-500">หักค่าลดหย่อนรวม</span>
            <span className="font-mono text-rose-400">
              - {formatBaht(allowances.totalAllowances)}
            </span>
          </div>

          <div className="flex justify-between py-1.5 items-center font-semibold bg-white/[0.02] px-2 rounded-lg">
            <span className="dark:text-cyan-300 text-cyan-600">เงินได้สุทธิ (นำไปคิดภาษี)</span>
            <span className="font-mono dark:text-cyan-300 text-cyan-600">
              {formatBaht(netTaxableIncome)}
            </span>
          </div>

          <div className="flex justify-between py-1.5 items-center">
            <span className="dark:text-slate-300 text-slate-700">ภาษีที่คำนวณได้</span>
            <span className="font-mono font-semibold dark:text-white text-slate-900">
              {formatBaht(grossTaxPayable)}
            </span>
          </div>

          {dividendTaxCredit > 0 && (
            <div className="flex justify-between py-1.5 items-center">
              <span className="text-emerald-400">หัก เครดิตภาษีเงินปันผล</span>
              <span className="font-mono text-emerald-400">
                - {formatBaht(dividendTaxCredit)}
              </span>
            </div>
          )}

          {totalWithholdingTax > 0 && (
            <div className="flex justify-between py-1.5 items-center">
              <span className="text-emerald-400">หัก ภาษีหัก ณ ที่จ่ายแล้ว</span>
              <span className="font-mono text-emerald-400">
                - {formatBaht(totalWithholdingTax)}
              </span>
            </div>
          )}
        </div>

        {isMethod2Applicable && (
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              มีเงินได้นอกเหนือจากเงินเดือนเกิน 1,000,000 บาท ระบบเทียบวิธี 0.5% (คำนวณได้ {formatBaht(taxMethod2)}) ให้ตามกฎหมายเรียบร้อยแล้ว
            </div>
          </div>
        )}
      </GlassCard>

      {/* Top Tax-Saving Opportunities Summary */}
      <GlassCard className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider dark:text-slate-300 text-slate-700">
              สิทธิ์ลดหย่อนคงเหลือที่แนะนำ
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('planning')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 font-medium"
          >
            วางแผน <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3 pt-1">
          {analysis.topRecommendations.slice(0, 4).map((rec) => {
            const pct = rec.maxLimit > 0 ? (rec.currentAmount / rec.maxLimit) * 100 : 0
            return (
              <div key={rec.key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="dark:text-slate-200 text-slate-800 font-medium">
                    {rec.title}
                  </span>
                  <span className="dark:text-slate-400 text-slate-500 font-mono text-[11px]">
                    เหลืออีก {formatBaht(rec.roomLeft)}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full dark:bg-white/10 bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>ใช้ไป {formatBaht(rec.currentAmount)}</span>
                  <span className="text-emerald-400">
                    ประหยัดได้อีก {formatBaht(rec.potentialTaxSaving)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
