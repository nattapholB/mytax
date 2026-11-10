import React from 'react'
import {
  Briefcase,
  Layers,
  PieChart,
  Home,
  Stethoscope,
  Store,
  Plus,
  Trash2,
  Receipt,
} from 'lucide-react'
import type { DividendIncomeItem, IncomeInput, TaxCalculationResult } from '../../config/types'
import { GlassCard } from '../glass/GlassCard'
import { GlassInput } from '../glass/GlassInput'
import { formatBaht } from '../../utils/formatters'

interface IncomeScreenProps {
  income: IncomeInput
  onChangeIncome: (newIncome: IncomeInput) => void
  calculation: TaxCalculationResult
}

export const IncomeScreen: React.FC<IncomeScreenProps> = ({
  income,
  onChangeIncome,
  calculation,
}) => {
  const updateField = (field: keyof IncomeInput, val: number) => {
    onChangeIncome({
      ...income,
      [field]: val,
    })
  }

  // Dividends management
  const addDividend = () => {
    const newItem: DividendIncomeItem = {
      id: 'div-' + Date.now(),
      companyName: 'บริษัทในตลาดหลักทรัพย์',
      amount: 10_000,
      corporateTaxRatePercent: 20,
      withholdingTax: 1_000,
    }
    onChangeIncome({
      ...income,
      dividends: [...(income.dividends || []), newItem],
    })
  }

  const updateDividend = (id: string, updates: Partial<DividendIncomeItem>) => {
    onChangeIncome({
      ...income,
      dividends: (income.dividends || []).map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })
  }

  const removeDividend = (id: string) => {
    onChangeIncome({
      ...income,
      dividends: (income.dividends || []).filter((d) => d.id !== id),
    })
  }

  return (
    <div className="space-y-4 pb-28 pt-2">
      <header className="px-1">
        <span className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase">
          เงินได้พึงประเมิน 8 ประเภท
        </span>
        <h1 className="text-xl font-bold dark:text-white text-slate-900 tracking-tight">
          รายได้และการหักค่าใช้จ่าย
        </h1>
        <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
          ระบุเงินได้ของคุณตามมาตรา 40(1) – 40(8) ระบบจะคำนวณการหักค่าใช้จ่ายตามกฎหมายให้อัตโนมัติ
        </p>
      </header>

      {/* Income Summary Card */}
      <GlassCard className="p-4 flex items-center justify-between">
        <div>
          <div className="text-xs dark:text-slate-400 text-slate-500">เงินได้พึงประเมินรวม</div>
          <div className="text-2xl font-bold font-mono dark:text-white text-slate-900">
            {formatBaht(calculation.totalAssessableIncome)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs dark:text-slate-400 text-slate-500">หักค่าใช้จ่ายเหมาได้</div>
          <div className="text-base font-semibold font-mono text-rose-400">
            - {formatBaht(calculation.expenseDeductions.totalExpenses)}
          </div>
        </div>
      </GlassCard>

      {/* 40(1) & 40(2) Employment & Freelance */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center gap-2 border-b dark:border-white/10 border-slate-200 pb-3">
          <Briefcase className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-bold dark:text-white text-slate-900">
              40(1) เงินเดือน และ 40(2) ฟรีแลนซ์/รับจ้าง
            </h2>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              หักค่าใช้จ่ายร่วมกัน 50% แต่รวมกันไม่เกิน 100,000 บาท
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <GlassInput
            id="salary-input"
            label="เงินเดือนตลอดปี (รวม 12 เดือน)"
            value={income.salary}
            onChange={(v) => updateField('salary', v)}
            step={5000}
            hint="ก่อนหักประกันสังคมและภาษี ณ ที่จ่าย"
          />

          <GlassInput
            id="bonus-input"
            label="โบนัส / เงินพิเศษ"
            value={income.bonus}
            onChange={(v) => updateField('bonus', v)}
            step={5000}
          />
        </div>

        <GlassInput
          id="freelance-input"
          label="40(2) ฟรีแลนซ์ / ค่านายหน้า / เบี้ยประชุม"
          value={income.freelance}
          onChange={(v) => updateField('freelance', v)}
          step={5000}
        />

        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs flex justify-between items-center">
          <span className="text-cyan-300">ค่าใช้จ่าย 40(1)+(2) ที่หักได้:</span>
          <span className="font-mono font-semibold text-cyan-200">
            {formatBaht(calculation.expenseDeductions.section40_1_2)} (เต็มสิทธิ์ 100,000)
          </span>
        </div>
      </GlassCard>

      {/* 40(4) Dividends & Interest */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b dark:border-white/10 border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-sm font-bold dark:text-white text-slate-900">
                40(4) ดอกเบี้ย และเงินปันผล (พร้อมเครดิตภาษี)
              </h2>
              <p className="text-[11px] dark:text-slate-400 text-slate-500">
                คำนวณเครดิตภาษีเงินปันผลเพื่อขอคืนภาษีได้
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={addDividend}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg liquid-glass-pill hover:text-cyan-400 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> เพิ่มเงินปันผล
          </button>
        </div>

        <GlassInput
          id="interest-input"
          label="ดอกเบี้ยเงินฝาก / ดอกเบี้ยหุ้นกู้"
          value={income.interest}
          onChange={(v) => updateField('interest', v)}
          hint="เงินได้ดอกเบี้ยที่เลือกนำมารวมคำนวณภาษี"
        />

        {/* Dividend Items */}
        <div className="space-y-3 pt-2">
          {(income.dividends || []).map((divItem) => {
            const credit =
              divItem.corporateTaxRatePercent > 0
                ? divItem.amount * (divItem.corporateTaxRatePercent / (100 - divItem.corporateTaxRatePercent))
                : 0

            return (
              <div
                key={divItem.id}
                className="p-3 rounded-2xl dark:bg-white/[0.03] bg-slate-100/70 border dark:border-white/10 border-slate-200 space-y-2.5"
              >
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    value={divItem.companyName}
                    onChange={(e) => updateDividend(divItem.id, { companyName: e.target.value })}
                    className="text-xs font-semibold bg-transparent outline-none dark:text-white text-slate-900 border-b border-dashed dark:border-white/20 border-slate-300 pb-0.5"
                    placeholder="ชื่อบริษัทที่จ่ายปันผล"
                  />
                  <button
                    type="button"
                    onClick={() => removeDividend(divItem.id)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">ยอดเงินปันผล (บาท)</label>
                    <input
                      type="number"
                      value={divItem.amount || ''}
                      onChange={(e) => updateDividend(divItem.id, { amount: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full p-2 rounded-xl dark:bg-slate-900/60 bg-white border dark:border-white/10 border-slate-300 text-right font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">อัตราภาษีนิติบุคคล</label>
                    <select
                      value={divItem.corporateTaxRatePercent}
                      onChange={(e) => updateDividend(divItem.id, { corporateTaxRatePercent: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl dark:bg-slate-900/60 bg-white border dark:border-white/10 border-slate-300 text-xs dark:text-white text-slate-900"
                    >
                      <option value={20}>20% (บริษัททั่วไปในตลาด)</option>
                      <option value={25}>25%</option>
                      <option value={30}>30%</option>
                      <option value={0}>0% (ยกเว้นภาษี / BOI)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">ภาษีหัก ณ ที่จ่าย 10%</label>
                    <input
                      type="number"
                      value={divItem.withholdingTax || ''}
                      onChange={(e) => updateDividend(divItem.id, { withholdingTax: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full p-2 rounded-xl dark:bg-slate-900/60 bg-white border dark:border-white/10 border-slate-300 text-right font-mono text-emerald-400"
                    />
                  </div>
                </div>

                <div className="text-[11px] flex justify-between items-center dark:text-slate-400 text-slate-500 pt-1 border-t dark:border-white/5 border-slate-200">
                  <span>เครดิตภาษีเงินปันผลที่ได้:</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    +{formatBaht(credit)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* 40(3), 40(5), 40(6), 40(7), 40(8) Other Incomes */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center gap-2 border-b dark:border-white/10 border-slate-200 pb-3">
          <Layers className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-sm font-bold dark:text-white text-slate-900">
              รายได้ประเภทอื่นๆ (40(3) ถึง 40(8))
            </h2>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              หักค่าใช้จ่ายตามประมวลรัษฎากรและพระราชกฤษฎีกา
            </p>
          </div>
        </div>

        <GlassInput
          label="40(3) ค่าลิขสิทธิ์ / สิทธิบัตร (หัก 50% สูงสุด 100,000)"
          value={income.royalty}
          onChange={(v) => updateField('royalty', v)}
        />

        {/* 40(5) Rentals */}
        <div className="space-y-2 pt-1 border-t dark:border-white/5 border-slate-200/60">
          <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
            <Home className="w-4 h-4" /> 40(5) ค่าเช่าทรัพย์สิน
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GlassInput
              label="ค่าเช่าบ้าน / อาคาร (หัก 30%)"
              value={income.rentalHouse}
              onChange={(v) => updateField('rentalHouse', v)}
            />
            <GlassInput
              label="ค่าเช่ายานพาหนะ (หัก 30%)"
              value={income.rentalVehicle}
              onChange={(v) => updateField('rentalVehicle', v)}
            />
          </div>
        </div>

        {/* 40(6) Liberal Professions */}
        <div className="space-y-2 pt-1 border-t dark:border-white/5 border-slate-200/60">
          <span className="text-xs font-semibold text-purple-400 flex items-center gap-1">
            <Stethoscope className="w-4 h-4" /> 40(6) วิชาชีพอิสระ
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GlassInput
              label="การประกอบโรคศิลปะ / แพทย์ (หัก 60%)"
              value={income.medicalProfession}
              onChange={(v) => updateField('medicalProfession', v)}
            />
            <GlassInput
              label="ทนายความ / วิศวกร / สถาปนิก / บัญชี (หัก 30%)"
              value={income.otherLiberalProfession}
              onChange={(v) => updateField('otherLiberalProfession', v)}
            />
          </div>
        </div>

        {/* 40(7) & 40(8) */}
        <div className="space-y-2 pt-1 border-t dark:border-white/5 border-slate-200/60">
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <Store className="w-4 h-4" /> 40(7) รับเหมา และ 40(8) ธุรกิจ/พาณิชย์
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GlassInput
              label="40(7) รับเหมาก่อสร้าง (จัดหาวัสดุเอง) (หัก 60%)"
              value={income.contractor}
              onChange={(v) => updateField('contractor', v)}
            />
            <GlassInput
              label="40(8) ค้าขาย / ธุรกิจ / ยูทูบเบอร์ / อื่นๆ (หัก 60%)"
              value={income.businessGeneral}
              onChange={(v) => updateField('businessGeneral', v)}
            />
          </div>
        </div>
      </GlassCard>

      {/* Withholding Tax Card */}
      <GlassCard glow="cyan" className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-bold dark:text-white text-slate-900">
              ภาษีหัก ณ ที่จ่าย (ถูกหักไว้แล้ว)
            </h2>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              ดูจากใบ 50 ทวิ (เช่น หนังสือรับรองหักภาษี ณ ที่จ่ายจากนายจ้างหรือผู้ว่าจ้าง)
            </p>
          </div>
        </div>

        <GlassInput
          id="wht-input"
          label="ภาษีหัก ณ ที่จ่ายรวมตลอดปี (ไม่รวมปันผลข้างต้น)"
          value={income.withholdingTax}
          onChange={(v) => updateField('withholdingTax', v)}
          step={1000}
        />

        <div className="p-3 rounded-xl dark:bg-white/[0.03] bg-slate-100 flex justify-between items-center text-xs">
          <span className="dark:text-slate-400 text-slate-600">ภาษีที่ถูกหักไว้รวมทั้งหมด:</span>
          <span className="font-mono font-bold text-emerald-400">
            {formatBaht(calculation.totalWithholdingTax)}
          </span>
        </div>
      </GlassCard>
    </div>
  )
}
