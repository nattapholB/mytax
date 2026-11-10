import React, { useState, useEffect } from 'react'
import { formatNumber, parseNumberInput } from '../../utils/formatters'

interface GlassInputProps {
  id?: string
  label: string
  value: number
  onChange: (val: number) => void
  suffix?: string
  hint?: string
  max?: number
  min?: number
  step?: number
  placeholder?: string
  icon?: React.ReactNode
}

export const GlassInput: React.FC<GlassInputProps> = ({
  id,
  label,
  value,
  onChange,
  suffix = 'บาท',
  hint,
  max,
  min = 0,
  step = 1000,
  placeholder = '0',
  icon,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [localText, setLocalText] = useState('')

  useEffect(() => {
    if (!isFocused) {
      setLocalText(value > 0 ? formatNumber(value) : '')
    }
  }, [value, isFocused])

  const handleFocus = () => {
    setIsFocused(true)
    setLocalText(value > 0 ? value.toString() : '')
  }

  const handleBlur = () => {
    setIsFocused(false)
    let parsed = parseNumberInput(localText)
    if (min !== undefined && parsed < min) parsed = min
    if (max !== undefined && parsed > max) parsed = max
    onChange(parsed)
    setLocalText(parsed > 0 ? formatNumber(parsed) : '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalText(e.target.value)
    const parsed = parseNumberInput(e.target.value)
    onChange(parsed)
  }

  const handleQuickAdd = (amount: number) => {
    let next = value + amount
    if (max !== undefined && next > max) next = max
    onChange(next)
  }

  const isAtMax = max !== undefined && value >= max

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-baseline">
        <label
          htmlFor={id}
          className="text-xs font-medium dark:text-slate-300 text-slate-700 flex items-center gap-1.5"
        >
          {icon && <span className="opacity-80">{icon}</span>}
          <span>{label}</span>
        </label>
        {max !== undefined && (
          <span
            className={`text-[11px] font-mono transition-colors ${
              isAtMax
                ? 'text-amber-400 font-semibold'
                : 'dark:text-slate-400 text-slate-500'
            }`}
          >
            {isAtMax ? 'เต็มสิทธิ์ ' : 'สูงสุด '}
            {formatNumber(max)} {suffix}
          </span>
        )}
      </div>

      <div
        className={`
          relative flex items-center rounded-2xl transition-all duration-200
          dark:bg-slate-900/60 bg-white/70
          backdrop-blur-md
          border ${
            isFocused
              ? 'dark:border-cyan-400/80 border-cyan-500 ring-2 ring-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
              : 'dark:border-white/10 border-slate-200 hover:border-white/20'
          }
        `}
      >
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={localText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full py-2.5 pl-3.5 pr-14 bg-transparent outline-none text-right font-mono text-base font-semibold dark:text-white text-slate-900 placeholder:text-slate-400/50"
        />

        <div className="absolute right-3.5 pointer-events-none text-xs font-medium dark:text-slate-400 text-slate-500">
          {suffix}
        </div>
      </div>

      {hint && (
        <p className="text-[11px] leading-tight dark:text-slate-400/80 text-slate-500 pl-1">
          {hint}
        </p>
      )}

      {/* Quick shortcuts if step > 0 */}
      {step >= 1000 && max !== undefined && max > 10000 && (
        <div className="flex gap-1.5 pt-0.5 justify-end">
          <button
            type="button"
            onClick={() => handleQuickAdd(10_000)}
            className="text-[10px] px-2 py-0.5 rounded-lg dark:bg-white/5 bg-slate-100 hover:bg-cyan-500/10 dark:text-slate-300 text-slate-600 dark:hover:text-cyan-300 hover:text-cyan-600 transition-colors"
          >
            +1 หมื่น
          </button>
          <button
            type="button"
            onClick={() => onChange(max)}
            className="text-[10px] px-2 py-0.5 rounded-lg dark:bg-white/5 bg-slate-100 hover:bg-cyan-500/10 dark:text-slate-300 text-slate-600 dark:hover:text-cyan-300 hover:text-cyan-600 transition-colors"
          >
            เต็มสิทธิ์
          </button>
          {value > 0 && (
            <button
              type="button"
              onClick={() => onChange(0)}
              className="text-[10px] px-2 py-0.5 rounded-lg dark:bg-white/5 bg-slate-100 hover:bg-rose-500/10 dark:text-slate-400 text-slate-500 hover:text-rose-400 transition-colors"
            >
              ล้าง
            </button>
          )}
        </div>
      )}
    </div>
  )
}
