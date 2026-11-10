import React from 'react'
import { formatBaht, formatNumber } from '../../utils/formatters'

interface GlassSliderProps {
  label: string
  sublabel?: string
  value: number
  onChange: (val: number) => void
  min?: number
  max: number
  step?: number
  tag?: string
  taxSaved?: number
}

export const GlassSlider: React.FC<GlassSliderProps> = ({
  label,
  sublabel,
  value,
  onChange,
  min = 0,
  max,
  step = 5000,
  tag,
  taxSaved,
}) => {
  const percentage = max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 0

  return (
    <div className="space-y-2 p-3.5 rounded-2xl dark:bg-white/[0.03] bg-slate-900/[0.02] border dark:border-white/5 border-slate-200/50">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold dark:text-white text-slate-900">
              {label}
            </span>
            {tag && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                {tag}
              </span>
            )}
          </div>
          {sublabel && (
            <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-0.5">
              {sublabel}
            </p>
          )}
        </div>

        <div className="text-right">
          <div className="text-base font-bold font-mono text-cyan-400">
            {formatBaht(value)}
          </div>
          {taxSaved !== undefined && taxSaved > 0 && (
            <div className="text-[11px] font-medium text-emerald-400">
              ประหยัดภาษี +{formatBaht(taxSaved)}
            </div>
          )}
        </div>
      </div>

      {/* Slider Track with Liquid Glow */}
      <div className="relative pt-2 pb-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full relative z-10"
        />

        {/* Liquid Active Progress Underlay */}
        <div
          className="absolute top-[16px] left-0 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 pointer-events-none transition-all duration-75"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono dark:text-slate-500 text-slate-400">
        <span>{formatNumber(min)}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + 10000))}
            className="hover:text-cyan-400 transition-colors"
          >
            +10k
          </button>
          <button
            type="button"
            onClick={() => onChange(max)}
            className="hover:text-cyan-400 font-semibold transition-colors"
          >
            MAX ({formatNumber(max)})
          </button>
          {value > 0 && (
            <button
              type="button"
              onClick={() => onChange(0)}
              className="hover:text-rose-400 transition-colors"
            >
              0
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
