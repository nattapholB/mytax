import React, { useRef } from 'react'
import {
  X,
  Moon,
  Sun,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  ShieldAlert,
} from 'lucide-react'
import { GlassCard } from '../glass/GlassCard'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  onExport: () => void
  onImport: (jsonString: string) => boolean
  onResetSample: () => void
  onClearAll: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  onExport,
  onImport,
  onResetSample,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        const ok = onImport(content)
        if (ok) {
          alert('นำเข้าข้อมูลสำเร็จ!')
          onClose()
        } else {
          alert('ไฟล์ข้อมูลไม่ถูกต้อง โปรดตรวจสอบรูปแบบไฟล์ JSON')
        }
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
      />

      <GlassCard className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center border-b dark:border-white/10 border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold dark:text-white text-slate-900">
              การตั้งค่าและจัดการข้อมูล
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full dark:hover:bg-white/10 hover:bg-slate-200 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-between items-center p-3 rounded-2xl dark:bg-white/[0.03] bg-slate-100/70 border dark:border-white/5 border-slate-200">
          <div>
            <div className="text-xs font-semibold dark:text-white text-slate-900">ธีมหน้าจอ</div>
            <div className="text-[11px] text-slate-400">สลับระหว่างโหมดมืดและสว่าง</div>
          </div>
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-pill text-xs font-medium dark:text-cyan-300 text-cyan-600 hover:scale-105 active:scale-95 transition-all"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-4 h-4" /> โหมดมืด
              </>
            ) : (
              <>
                <Sun className="w-4 h-4" /> โหมดสว่าง
              </>
            )}
          </button>
        </div>

        {/* Data Storage & Privacy */}
        <div className="space-y-2">
          <div className="text-xs font-semibold dark:text-slate-300 text-slate-700">
            ข้อมูลและความเป็นส่วนตัว
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            ข้อมูลภาษี รายได้ และค่าลดหย่อนของคุณจะถูกบันทึกไว้ในเบราว์เซอร์ของอุปกรณ์นี้เท่านั้น
            (ไม่มีการส่งไปยังเซิร์ฟเวอร์ภายนอกใดๆ)
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onExport}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl liquid-glass-pill text-xs font-medium dark:text-white text-slate-800 hover:border-cyan-400/40 transition-all"
            >
              <Download className="w-4 h-4 text-cyan-400" /> สำรองข้อมูล (JSON)
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl liquid-glass-pill text-xs font-medium dark:text-white text-slate-800 hover:border-cyan-400/40 transition-all"
            >
              <Upload className="w-4 h-4 text-purple-400" /> กู้คืนข้อมูล (JSON)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Data Presets */}
        <div className="space-y-2 pt-2 border-t dark:border-white/5 border-slate-200">
          <div className="text-xs font-semibold dark:text-slate-300 text-slate-700">
            รีเซ็ตข้อมูล
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (confirm('คุณต้องการรีเซ็ตเป็นข้อมูลตัวอย่างหรือไม่?')) {
                  onResetSample()
                  onClose()
                }
              }}
              className="flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 hover:bg-cyan-500/10 text-xs font-medium text-cyan-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> โหลดข้อมูลตัวอย่าง
            </button>

            <button
              onClick={() => {
                if (confirm('ยืนยันล้างข้อมูลรายได้และลดหย่อนทั้งหมดเป็นศูนย์?')) {
                  onClearAll()
                  onClose()
                }
              }}
              className="flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 hover:bg-rose-500/10 text-xs font-medium text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> ล้างข้อมูลทั้งหมด
            </button>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0" /> ข้อจำกัดความรับผิดชอบทางกฎหมาย
          </div>
          <p>
            แอป MyTax จัดทำขึ้นเพื่ออำนวยความสะดวกในการประมาณการและวางแผนภาษีเบื้องต้นสำหรับปีภาษี 2569
            ตามกฎหมายประมวลรัษฎากรเท่านั้น ตัวเลขจริงอาจคลาดเคลื่อนตามเอกสารหลักฐานและเงื่อนไขเฉพาะบุคคล
            กรุณาตรวจสอบความถูกต้องกับกรมสรรพากรก่อนยื่นแบบแสดงรายการภาษีจริง
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
