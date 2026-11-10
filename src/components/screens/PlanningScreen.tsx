import React, { useState } from 'react'
import {
  Sparkles,
  SlidersHorizontal,
  Check,
  RotateCcw,
  Zap,
} from 'lucide-react'
import type { DeductionInput, IncomeInput, TaxCalculationResult } from '../../config/types'
import { GlassCard } from '../glass/GlassCard'
import { GlassSlider } from '../glass/GlassSlider'
import { analyzeDeductionRooms, simulateWhatIf } from '../../engine/optimizer'
import { formatBaht } from '../../utils/formatters'

interface PlanningScreenProps {
  income: IncomeInput
  deductions: DeductionInput
  calculation: TaxCalculationResult
  onCommitPlan: (newDeductions: DeductionInput) => void
}

export const PlanningScreen: React.FC<PlanningScreenProps> = ({
  income,
  deductions,
  calculation,
  onCommitPlan,
}) => {
  const analysis = analyzeDeductionRooms(income, deductions)

  const [addThaiEsg, setAddThaiEsg] = useState<number>(0)
  const [addRmf, setAddRmf] = useState<number>(0)
  const [addLife, setAddLife] = useState<number>(0)
  const [addPension, setAddPension] = useState<number>(0)
  const [isSavedBanner, setIsSavedBanner] = useState<boolean>(false)

  const simulation = simulateWhatIf(income, deductions, {
    thaiEsg: addThaiEsg,
    rmf: addRmf,
    lifeInsurance: addLife,
    pensionLife: addPension,
  })

  const thaiEsgRoom = analysis.rooms.find((r) => r.key === 'thaiEsg')?.roomLeft || 0
  const rmfRoom = analysis.rooms.find((r) => r.key === 'rmf')?.roomLeft || 0
  const lifeRoom = analysis.rooms.find((r) => r.key === 'lifeInsurance')?.roomLeft || 0
  const pensionRoom = analysis.rooms.find((r) => r.key === 'pensionLife')?.roomLeft || 0

  const handleResetSliders = () => {
    setAddThaiEsg(0)
    setAddRmf(0)
    setAddLife(0)
    setAddPension(0)
  }

  const handleCommitToActual = () => {
    const updated: DeductionInput = {
      ...deductions,
      thaiEsg: (deductions.thaiEsg || 0) + addThaiEsg,
      rmf: (deductions.rmf || 0) + addRmf,
      generalLifeInsurance: (deductions.generalLifeInsurance || 0) + addLife,
      pensionLifeInsurance: (deductions.pensionLifeInsurance || 0) + addPension,
    }
    onCommitPlan(updated)
    handleResetSliders()
    setIsSavedBanner(true)
    setTimeout(() => setIsSavedBanner(false), 3000)
  }

  const marginalRate = calculation.marginalTaxRate

  return (
    <div className="space-y-4 pb-28 pt-2">
      <header className="px-1">
        <span className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase">
          วางแผนภาษีปี 2569
        </span>
        <h1 className="text-xl font-bold dark:text-white text-slate-900 tracking-tight">
          วางแผนและจำลองลดหย่อนภาษี
        </h1>
        <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
          ลองลากสไลเดอร์เพื่อดูภาษีที่จะประหยัดได้ทันทีตามฐานภาษีสูงสุดของคุณ ({marginalRate}%)
        </p>
      </header>

      {/* Real-time What-If Simulation Result Card */}
      <GlassCard
        glow={simulation.taxSaved > 0 ? 'cyan' : 'none'}
        className="p-5 space-y-4"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              ผลลัพธ์จากการจำลอง (What-If)
            </span>
          </div>

          {(addThaiEsg > 0 || addRmf > 0 || addLife > 0 || addPension > 0) && (
            <button
              type="button"
              onClick={handleResetSliders}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> รีเซ็ต
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3.5 rounded-2xl dark:bg-white/[0.03] bg-slate-100/80 border dark:border-white/5 border-slate-200">
            <div className="text-[11px] dark:text-slate-400 text-slate-500">เงินลงทุนเพิ่มเติม</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-0.5">
              {formatBaht(simulation.additionalInvestment)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl dark:bg-emerald-500/10 bg-emerald-50 border border-emerald-500/20">
            <div className="text-[11px] text-emerald-300 font-medium">ประหยัดภาษีได้</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-0.5">
              +{formatBaht(simulation.taxSaved)}
            </div>
            {simulation.additionalInvestment > 0 && (
              <div className="text-[10px] text-emerald-300/80 font-mono">
                ผลตอบแทนทันที {simulation.returnOnInvestmentPercent}%
              </div>
            )}
          </div>
        </div>

        {/* Comparison row */}
        <div className="p-3 rounded-xl dark:bg-white/[0.02] bg-slate-50 flex justify-between items-center text-xs">
          <div>
            <span className="dark:text-slate-400 text-slate-500">ภาษีสุทธิเดิม: </span>
            <span className="font-mono font-medium dark:text-slate-300 text-slate-700">
              {calculation.isRefund
                ? `ได้คืน ${formatBaht(calculation.refundAmount)}`
                : `จ่ายเพิ่ม ${formatBaht(calculation.taxToPayAmount)}`}
            </span>
          </div>
          <div>
            <span className="dark:text-slate-400 text-slate-500">ภาษีสุทธิใหม่: </span>
            <span className="font-mono font-bold text-cyan-400">
              {simulation.newIsRefund
                ? `ได้คืน ${formatBaht(simulation.newRefundAmount)}`
                : `จ่ายเพิ่ม ${formatBaht(simulation.newFinalDue)}`}
            </span>
          </div>
        </div>

        {/* Commit Button */}
        {simulation.additionalInvestment > 0 && (
          <button
            type="button"
            onClick={handleCommitToActual}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            นำแผนนี้ไปบันทึกลงในค่าลดหย่อนจริง
          </button>
        )}

        {isSavedBanner && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs text-center font-medium">
            ✓ บันทึกเข้าหน้ารายการลดหย่อนจริงเรียบร้อยแล้ว
          </div>
        )}
      </GlassCard>

      {/* Sliders Section */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center gap-2 border-b dark:border-white/10 border-slate-200 pb-3">
          <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-bold dark:text-white text-slate-900">
              ปรับจำลองค่าลดหย่อน (What-If Sliders)
            </h2>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              ลากเพื่อดูจำนวนเงินที่ประหยัดได้ทันที
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {thaiEsgRoom > 0 && (
            <GlassSlider
              label="กองทุน ThaiESG เพิ่มเติม"
              sublabel="ถือครอง 5 ปีนับวันชนวัน (วงเงินแยกต่างหาก 3 แสน)"
              value={addThaiEsg}
              onChange={setAddThaiEsg}
              max={thaiEsgRoom}
              tag="แนะนำอันดับ 1"
              taxSaved={Math.round(addThaiEsg * (marginalRate / 100))}
            />
          )}

          {rmfRoom > 0 && (
            <GlassSlider
              label="กองทุน RMF เพิ่มเติม"
              sublabel="ถือถึงอายุ 55 ปี (อยู่ในเพดานเกษียณ 5 แสน)"
              value={addRmf}
              onChange={setAddRmf}
              max={rmfRoom}
              tag="เกษียณ"
              taxSaved={Math.round(addRmf * (marginalRate / 100))}
            />
          )}

          {lifeRoom > 0 && (
            <GlassSlider
              label="ประกันชีวิต / สุขภาพ เพิ่มเติม"
              sublabel="คุ้มครองชีวิต 10 ปีขึ้นไป (เพดาน 1 แสน)"
              value={addLife}
              onChange={setAddLife}
              max={lifeRoom}
              tag="คุ้มครอง"
              taxSaved={Math.round(addLife * (marginalRate / 100))}
            />
          )}

          {pensionRoom > 0 && (
            <GlassSlider
              label="ประกันชีวิตบำนาญ เพิ่มเติม"
              sublabel="รับเงินคืนหลังเกษียณ (เพดาน 2 แสน - 3 แสน)"
              value={addPension}
              onChange={setAddPension}
              max={pensionRoom}
              tag="บำนาญ"
              taxSaved={Math.round(addPension * (marginalRate / 100))}
            />
          )}
        </div>
      </GlassCard>

      {/* Best Bang for Your Baht Rankings */}
      <GlassCard className="p-5 space-y-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-sm font-bold dark:text-white text-slate-900">
              จัดอันดับ &quot;ซื้ออะไรคุ้มสุด&quot; ตามฐานภาษีคุณ
            </h2>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              ฐานภาษีคุณอยู่ที่ {marginalRate}% ทุก 10,000 บาทที่ซื้อ ประหยัดภาษีทันที {formatBaht(10000 * (marginalRate / 100))}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {analysis.topRecommendations.map((item, idx) => (
            <div
              key={item.key}
              className="p-3.5 rounded-2xl dark:bg-white/[0.03] bg-slate-100/70 border dark:border-white/5 border-slate-200 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold dark:text-white text-slate-900">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400">{item.group}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    ลดได้อีก +{formatBaht(item.potentialTaxSaving)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    เหลือสิทธิ์ {formatBaht(item.roomLeft)}
                  </div>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed dark:text-slate-400 text-slate-600 pl-7">
                {item.conditionNote}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
