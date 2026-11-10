import React from 'react'
import {
  LayoutDashboard,
  Wallet,
  BadgePercent,
  Sparkles,
} from 'lucide-react'

export type TabId = 'dashboard' | 'income' | 'deductions' | 'planning'

interface GlassTabBarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export const GlassTabBar: React.FC<GlassTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'dashboard' as TabId, label: 'สรุป', icon: LayoutDashboard },
    { id: 'income' as TabId, label: 'รายได้', icon: Wallet },
    { id: 'deductions' as TabId, label: 'ลดหย่อน', icon: BadgePercent },
    { id: 'planning' as TabId, label: 'วางแผน', icon: Sparkles },
  ]

  return (
    <nav
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md pointer-events-auto"
      aria-label="เมนูหลัก"
    >
      <div
        className="
          liquid-glass-pill p-1.5
          flex items-center justify-between
          backdrop-blur-3xl saturate-200
          dark:bg-slate-950/70 bg-white/80
          dark:border-white/15 border-white/70 border
          dark:shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.3)]
          shadow-[0_20px_40px_rgba(100,116,139,0.3),inset_0_1px_2px_rgba(255,255,255,0.9)]
        "
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-full
                transition-all duration-300 ease-out select-none
                ${
                  isActive
                    ? 'dark:text-cyan-300 text-cyan-600 font-semibold'
                    : 'dark:text-slate-400 text-slate-500 hover:text-slate-200 hover:bg-white/5'
                }
              `}
            >
              {/* Active liquid pill glow */}
              {isActive && (
                <div
                  className="
                    absolute inset-0 rounded-full
                    dark:bg-gradient-to-b dark:from-white/15 dark:to-cyan-500/10
                    bg-gradient-to-b from-white/90 to-cyan-50/80
                    border dark:border-cyan-400/30 border-cyan-400/40
                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_0_15px_rgba(6,182,212,0.25)]
                    -z-10
                  "
                />
              )}

              <Icon
                className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'scale-100 opacity-75'
                }`}
                strokeWidth={isActive ? 2.3 : 1.8}
              />
              <span className="text-[11px] mt-1 tracking-tight">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
