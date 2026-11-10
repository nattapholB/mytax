export function formatBaht(amount: number, showDecimals = false): string {
  const rounded = showDecimals ? Math.round(amount * 100) / 100 : Math.round(amount)
  return '฿' + new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(rounded)
}

export function formatNumber(amount: number, showDecimals = false): string {
  const rounded = showDecimals ? Math.round(amount * 100) / 100 : Math.round(amount)
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(rounded)
}

export function formatPercent(rate: number): string {
  const formatted = Math.round(rate * 10) / 10
  return `${formatted}%`
}

export function parseNumberInput(val: string): number {
  const cleaned = val.replace(/[^0-9.]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}
