import React, { useState } from 'react'
import {
  Users,
  Shield,
  Briefcase,
  Leaf,
  Home,
  Heart,
  ChevronDown,
} from 'lucide-react'
import type { DeductionInput, TaxCalculationResult } from '../../config/types'
import { TAX_RULES_2569 } from '../../config/taxRules2569'
import { GlassCard } from '../glass/GlassCard'
import { GlassInput } from '../glass/GlassInput'
import { formatBaht } from '../../utils/formatters'

interface DeductionScreenProps {
  deductions: DeductionInput
  onChangeDeductions: (newDeductions: DeductionInput) => void
  calculation: TaxCalculationResult
}

export const DeductionScreen: React.FC<DeductionScreenProps> = ({
  deductions,
  onChangeDeductions,
  calculation,
}) => {
  const r = TAX_RULES_2569
  const [openSection, setOpenSection] = useState<string>('family')

  const updateField = <K extends keyof DeductionInput>(field: K, val: DeductionInput[K]) => {
    onChangeDeductions({
      ...deductions,
      [field]: val,
    })
  }

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? '' : id)
  }

  const retirementUsed = calculation.allowances.retirementPool
  const retirementMax = r.allowances.retirementPoolCombinedMax
  const retirementPct = Math.min(100, (retirementUsed / retirementMax) * 100)

  return (
    <div className="space-y-4 pb-28 pt-2">
      <header className="px-1">
        <span className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase">
          สิทธิ์ลดหย่อนภาษี 2569
        </span>
        <h1 className="text-xl font-bold dark:text-white text-slate-900 tracking-tight">
          ค่าลดหย่อนและการยกเว้น
        </h1>
        <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
          กรอกข้อมูลตามสิทธิ์ที่คุณมี ระบบจะคุมเพดานรายตัวและเพดานรวมเกษียณ 500,000 ให้อัตโนมัติ
        </p>
      </header>

      {/* Summary Card */}
      <GlassCard className="p-4 flex items-center justify-between">
        <div>
          <div className="text-xs dark:text-slate-400 text-slate-500">ค่าลดหย่อนรวมทั้งหมด</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {formatBaht(calculation.allowances.totalAllowances)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs dark:text-slate-400 text-slate-500">ช่วยประหยัดภาษีได้</div>
          <div className="text-base font-semibold font-mono text-emerald-400">
            ~ {formatBaht(Math.round(calculation.allowances.totalAllowances * (calculation.marginalTaxRate / 100)))}
          </div>
        </div>
      </GlassCard>

      {/* Group 1: Personal & Family */}
      <GlassCard className="overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('family')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold dark:text-white text-slate-900">
                1. ตัวเองและครอบครัว
              </h2>
              <div className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                ลดหย่อนได้แล้ว {formatBaht(calculation.allowances.personalAndFamily)}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
              openSection === 'family' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'family' && (
          <div className="p-5 pt-1 space-y-4 border-t dark:border-white/5 border-slate-200/60">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex justify-between items-center text-xs">
              <span className="text-cyan-300 font-medium">ผู้มีเงินได้ (ตนเอง):</span>
              <span className="font-mono font-bold text-cyan-200">60,000 บาท (ได้ทุกคน)</span>
            </div>

            <div className="p-3.5 rounded-2xl dark:bg-white/[0.03] bg-slate-100/70 border dark:border-white/5 border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold dark:text-white text-slate-900">
                  คู่สมรส (จดทะเบียนสมรส)
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deductions.hasSpouse}
                    onChange={(e) => updateField('hasSpouse', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              {deductions.hasSpouse && (
                <div className="space-y-2 pt-2 border-t dark:border-white/5 border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="dark:text-slate-300 text-slate-700">คู่สมรสมีเงินได้หรือไม่?</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateField('spouseHasIncome', false)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          !deductions.spouseHasIncome
                            ? 'bg-cyan-500 text-white font-bold'
                            : 'dark:bg-white/10 bg-slate-200 text-slate-400'
                        }`}
                      >
                        ไม่มีเงินได้ (ลดหย่อน 60,000)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('spouseHasIncome', true)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          deductions.spouseHasIncome
                            ? 'bg-cyan-500 text-white font-bold'
                            : 'dark:bg-white/10 bg-slate-200 text-slate-400'
                        }`}
                      >
                        มีเงินได้
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassInput
                label="บุตรเกิดก่อนปี 2561 (คนละ 30,000)"
                value={deductions.childrenPre2561}
                onChange={(v) => updateField('childrenPre2561', v)}
                suffix="คน"
                max={10}
                step={1}
              />
              <GlassInput
                label="บุตรคนที่ 2 เป็นต้นไปเกิดปี 2561 ขึ้นไป (คนละ 60,000)"
                value={deductions.childrenPost2561}
                onChange={(v) => updateField('childrenPost2561', v)}
                suffix="คน"
                max={10}
                step={1}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassInput
                label="อุปการะพ่อแม่ตนเอง (อายุ 60+ รายได้ ≤ 3 หมื่น)"
                value={deductions.parentsSelfCount}
                onChange={(v) => updateField('parentsSelfCount', v)}
                suffix="ท่าน"
                max={2}
                step={1}
                hint="ท่านละ 30,000 บาท สูงสุด 2 ท่าน"
              />
              {deductions.hasSpouse && !deductions.spouseHasIncome && (
                <GlassInput
                  label="อุปการะพ่อแม่คู่สมรส (อายุ 60+)"
                  value={deductions.parentsSpouseCount}
                  onChange={(v) => updateField('parentsSpouseCount', v)}
                  suffix="ท่าน"
                  max={2}
                  step={1}
                  hint="ท่านละ 30,000 บาท สูงสุด 2 ท่าน"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassInput
                label="อุปการะคนพิการ/ทุพพลภาพ (คนละ 60,000)"
                value={deductions.disabledCount}
                onChange={(v) => updateField('disabledCount', v)}
                suffix="คน"
                max={5}
                step={1}
              />
              <GlassInput
                label="ค่าฝากครรภ์และทำคลอด (ตามจริง สูงสุด 60,000)"
                value={deductions.prenatalChildbirth}
                onChange={(v) => updateField('prenatalChildbirth', v)}
                max={60_000}
                step={5000}
              />
            </div>
          </div>
        )}
      </GlassCard>

      {/* Group 2: Insurance & Savings */}
      <GlassCard className="overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('insurance')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold dark:text-white text-slate-900">
                2. ประกันและเงินออม
              </h2>
              <div className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                ลดหย่อนได้แล้ว {formatBaht(calculation.allowances.insuranceAndSavings)}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
              openSection === 'insurance' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'insurance' && (
          <div className="p-5 pt-1 space-y-4 border-t dark:border-white/5 border-slate-200/60">
            <GlassInput
              label="ประกันสังคม (มาตรา 33 สูงสุด 9,000)"
              value={deductions.socialSecurity}
              onChange={(v) => updateField('socialSecurity', v)}
              max={9_000}
              step={750}
            />

            <div className="p-3.5 rounded-2xl dark:bg-white/[0.03] bg-slate-100/70 border dark:border-white/5 border-slate-200 space-y-3">
              <div className="text-xs font-semibold text-purple-400">
                ประกันชีวิตและสุขภาพ (เพดานรวมกันไม่เกิน 100,000 บาท)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <GlassInput
                  label="เบี้ยประกันชีวิตทั่วไป (สัญญา 10 ปี+)"
                  value={deductions.generalLifeInsurance}
                  onChange={(v) => updateField('generalLifeInsurance', v)}
                  max={100_000}
                  step={5000}
                />
                <GlassInput
                  label="เบี้ยประกันสุขภาพตนเอง"
                  value={deductions.healthInsuranceSelf}
                  onChange={(v) => updateField('healthInsuranceSelf', v)}
                  max={25_000}
                  step={5000}
                  hint="สูงสุดไม่เกิน 25,000 บาท"
                />
              </div>
            </div>

            <GlassInput
              label="เบี้ยประกันสุขภาพพ่อแม่ (ตามจริง สูงสุด 15,000)"
              value={deductions.parentsHealthInsurance}
              onChange={(v) => updateField('parentsHealthInsurance', v)}
              max={15_000}
              step={1000}
            />
          </div>
        )}
      </GlassCard>

      {/* Group 3: Retirement Pool (Combined limit 500k) */}
      <GlassCard glow="cyan" className="overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('retirement')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold dark:text-white text-slate-900">
                  3. กองทุนการออมเพื่อการเกษียณ
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300">
                  เพดานรวม 5 แสน
                </span>
              </div>
              <div className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                ใช้ไป {formatBaht(retirementUsed)} / 500,000 บาท
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
              openSection === 'retirement' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'retirement' && (
          <div className="p-5 pt-1 space-y-4 border-t dark:border-white/5 border-slate-200/60">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-cyan-200 font-medium">เพดานรวมกลุ่มเกษียณ (RMF + PVD + บำนาญ + กอช.)</span>
                <span className="font-mono font-bold text-cyan-300">{Math.round(retirementPct)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900/60 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-sky-300 rounded-full transition-all duration-500"
                  style={{ width: `${retirementPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-cyan-300/80 font-mono">
                <span>ใช้ไป {formatBaht(retirementUsed)}</span>
                <span>เหลืออีก {formatBaht(Math.max(0, retirementMax - retirementUsed))}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <GlassInput
                label="กองทุน RMF (สูงสุด 30% ของเงินได้ ไม่เกิน 500,000)"
                value={deductions.rmf}
                onChange={(v) => updateField('rmf', v)}
                max={500_000}
                step={10000}
              />
              <GlassInput
                label="กองทุนสำรองเลี้ยงชีพ (PVD) / กบข. (สูงสุด 15%)"
                value={deductions.pvdOrGpf}
                onChange={(v) => updateField('pvdOrGpf', v)}
                max={500_000}
                step={5000}
              />
              <GlassInput
                label="เบี้ยประกันชีวิตแบบบำนาญ (สูงสุด 15% ไม่เกิน 200k-300k)"
                value={deductions.pensionLifeInsurance}
                onChange={(v) => updateField('pensionLifeInsurance', v)}
                max={300_000}
                step={10000}
              />
              <GlassInput
                label="กองทุนการออมแห่งชาติ (กอช. สูงสุด 30,000)"
                value={deductions.nationalSavingsFund}
                onChange={(v) => updateField('nationalSavingsFund', v)}
                max={30_000}
                step={1000}
              />
            </div>
          </div>
        )}
      </GlassCard>

      {/* Group 4: ThaiESG */}
      <GlassCard glow="emerald" className="overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('thaiesg')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold dark:text-white text-slate-900">
                  4. กองทุน ThaiESG (ลดหย่อนพิเศษ)
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-300 font-semibold">
                  แยกต่างหาก 3 แสน
                </span>
              </div>
              <div className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                ลดหย่อนได้แล้ว {formatBaht(calculation.allowances.thaiEsg)}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
              openSection === 'thaiesg' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'thaiesg' && (
          <div className="p-5 pt-1 space-y-4 border-t dark:border-white/5 border-slate-200/60">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
              🌿 <strong>เกณฑ์ใหม่ปี 2567–2569:</strong> ลดหย่อนได้สูงสุด 30% ของเงินได้ ไม่เกิน 300,000 บาท และถือครอง 5 ปีนับวันชนวัน (ไม่ต้องนับรวมกับกลุ่มเกษียณ 500,000 บาท)
            </div>

            <GlassInput
              label="เงินลงทุนกองทุนรวม ThaiESG ในปี 2569"
              value={deductions.thaiEsg}
              onChange={(v) => updateField('thaiEsg', v)}
              max={300_000}
              step={10000}
            />
          </div>
        )}
      </GlassCard>

      {/* Group 5: Real Estate & Stimulus */}
      <GlassCard className="overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('property')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Home className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold dark:text-white text-slate-900">
                5. อสังหาริมทรัพย์และมาตรการรัฐ
              </h2>
              <div className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                ลดหย่อนได้แล้ว {formatBaht(calculation.allowances.propertyAndStimulus)}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
              openSection === 'property' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'property' && (
          <div className="p-5 pt-1 space-y-4 border-t dark:border-white/5 border-slate-200/60">
            <GlassInput
              label="ดอกเบี้ยเงินกู้ยืมเพื่อซื้อ/สร้างบ้าน (ตามจริง สูงสุด 100,000)"
              value={deductions.homeLoanInterest}
              onChange={(v) => updateField('homeLoanInterest', v)}
              max={100_000}
              step={5000}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassInput
                label="ค่าสร้างบ้านใหม่ (สูงสุด 100,000)"
                value={deductions.newHomeConstruction}
                onChange={(v) => updateField('newHomeConstruction', v)}
                max={100_000}
                step={10000}
              />
              <GlassInput
                label="Easy E-Receipt / ช้อปดีมีคืน (สูงสุด 50,000)"
                value={deductions.easyEReceipt}
                onChange={(v) => updateField('easyEReceipt', v)}
                max={50_000}
                step={5000}
              />
            </div>
          </div>
        )}
      </GlassCard>

      {/* Group 6: Donations */}
      <GlassCard className="overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('donations')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <Heart className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold dark:text-white text-slate-900">
                6. เงินบริจาค
              </h2>
              <div className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                ลดหย่อนได้แล้ว {formatBaht(calculation.allowances.donationsDouble + calculation.allowances.donationsGeneral)}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
              openSection === 'donations' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'donations' && (
          <div className="p-5 pt-1 space-y-4 border-t dark:border-white/5 border-slate-200/60">
            <GlassInput
              label="บริจาคเพื่อการศึกษา/กีฬา/รพ./e-Donation (ลดหย่อน 2 เท่า)"
              value={deductions.doubleDonationEduSportHospital}
              onChange={(v) => updateField('doubleDonationEduSportHospital', v)}
              step={1000}
              hint="ลดหย่อนได้ 2 เท่าของยอดบริจาคจริง (สูงสุดไม่เกิน 10% ของเงินได้สุทธิ)"
            />

            <GlassInput
              label="เงินบริจาคทั่วไป (วัด มูลนิธิ สาธารณกุศล)"
              value={deductions.generalDonation}
              onChange={(v) => updateField('generalDonation', v)}
              step={1000}
              hint="ลดหย่อนตามจ่ายจริง สูงสุดไม่เกิน 10% ของเงินได้สุทธิคงเหลือ"
            />

            <GlassInput
              label="เงินบริจาคให้พรรคการเมือง (ตามจริง สูงสุด 10,000)"
              value={deductions.politicalPartyDonation}
              onChange={(v) => updateField('politicalPartyDonation', v)}
              max={10_000}
              step={500}
            />
          </div>
        )}
      </GlassCard>
    </div>
  )
}
