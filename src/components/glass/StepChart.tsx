import React from 'react'
import type { TaxBracket } from '../../config/types'
import { formatBaht } from '../../utils/formatters'

interface StepChartProps {
  brackets: {
    bracket: TaxBracket
    taxableInBracket: number
    tax: number
  }[]
  netTaxableIncome: number
  marginalRate: number
}

export const StepChart: React.FC<StepChartProps> = ({
  brackets,
  netTaxableIncome,
  marginalRate,
}) => {
  const stepHeights: Record<number, string> = {
    0: 'h-6',
    5: 'h-10',
    10: 'h-14',
    15: 'h-20',
    20: 'h-24',
    25: 'h-28',
    30: 'h-32',
    35: 'h-36',
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-semibold uppercase tracking-wider dark:text-slate-400 text-slate-500">
          ขั้นบันไดอัตราภาษี 2569
        </span>
        <span className="text-xs font-mono dark:text-cyan-400 text-cyan-600 font-medium">
          เงินได้สุทธิ {formatBaht(netTaxableIncome)}
        </span>
      </div>

      <div className="pt-6 pb-2 px-1 flex items-end justify-between gap-1.5 h-44 overflow-x-auto no-scrollbar">
        {brackets.map(({ bracket, taxableInBracket, tax }) => {
          const ratePercent = bracket.rate * 100
          const isCurrentBracket = ratePercent === marginalRate && netTaxableIncome > 0
          const isPassedBracket = bracket.rate < marginalRate / 100
          const heightClass = stepHeights[ratePercent] || 'h-16'

          return (
            <div
              key={bracket.name}
              className="flex-1 flex flex-col items-center justify-end h-full group relative min-w-[34px]"
            >
              {/* Tooltip on hover */}
              <div
                className="
                  absolute -top-12 z-20 hidden group-hover:flex flex-col items-center
                  px-2.5 py-1.5 rounded-xl
                  dark:bg-slate-900/90 bg-white/95 backdrop-blur-md
                  border dark:border-white/15 border-slate-300
                  shadow-xl pointer-events-none whitespace-nowrap text-[11px]
                "
              >
                <div className="font-semibold text-cyan-400">
                  {bracket.name} ({ratePercent}%)
                </div>
                <div className="dark:text-slate-300 text-slate-600 font-mono text-[10px]">
                  คำนวณในขั้น: {formatBaht(taxableInBracket)} → ภาษี {formatBaht(tax)}
                </div>
              </div>

              {/* Stepped Bar */}
              <div
                className={`
                  w-full rounded-t-xl transition-all duration-500 relative overflow-hidden
                  ${heightClass}
                  ${
                    isCurrentBracket
                      ? 'bg-gradient-to-t from-cyan-500/80 via-sky-400/90 to-white/90 shadow-[0_0_20px_rgba(6,182,212,0.8),inset_0_1px_1px_rgba(255,255,255,0.9)] border-t border-x border-cyan-300 scale-105 z-10'
                      : isPassedBracket
                      ? 'dark:bg-white/20 bg-slate-300/60 dark:border-white/10 border-slate-300'
                      : 'dark:bg-white/5 bg-slate-200/40 dark:border-white/5 border-slate-200'
                  }
                  border
                `}
              >
                {isCurrentBracket && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                )}
              </div>

              {/* Rate label */}
              <div className="mt-2 text-center">
                <span
                  className={`text-[11px] font-mono block ${
                    isCurrentBracket
                      ? 'font-bold text-cyan-400'
                      : 'dark:text-slate-400 text-slate-500'
                  }`}
                >
                  {ratePercent}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between text-[11px] dark:text-slate-500 text-slate-400 px-1 border-t dark:border-white/5 border-slate-200/60 pt-2">
        <span>เริ่มต้น 0% (1.5 แสนแรกยกเว้น)</span>
        <span>สูงสุด 35% (เกิน 5 ล้าน)</span>
      </div>
    </div>
  )
}
