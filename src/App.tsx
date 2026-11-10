import { useState } from 'react'
import { LiquidBackground } from './components/glass/LiquidBackground'
import { GlassTabBar } from './components/glass/GlassTabBar'
import type { TabId } from './components/glass/GlassTabBar'
import { DashboardScreen } from './components/screens/DashboardScreen'
import { IncomeScreen } from './components/screens/IncomeScreen'
import { DeductionScreen } from './components/screens/DeductionScreen'
import { PlanningScreen } from './components/screens/PlanningScreen'
import { SettingsModal } from './components/screens/SettingsModal'
import { OnboardingModal } from './components/screens/OnboardingModal'
import { useTaxStore } from './store/useTaxStore'
import type { DeductionInput, IncomeInput } from './config/types'

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)

  const {
    income,
    setIncome,
    deductions,
    setDeductions,
    theme,
    toggleTheme,
    calculation,
    hasCompletedOnboarding,
    markOnboardingDone,
    resetToSample,
    clearAllData,
    exportDataJson,
    importDataJson,
  } = useTaxStore()

  const handleOnboardingComplete = (
    initIncome: Partial<IncomeInput>,
    initDeductions: Partial<DeductionInput>
  ) => {
    setIncome((prev) => ({ ...prev, ...initIncome }))
    setDeductions((prev) => ({ ...prev, ...initDeductions }))
    markOnboardingDone()
  }

  return (
    <div className={`min-h-screen relative flex flex-col items-center ${theme === 'dark' ? 'dark text-slate-100' : 'light text-slate-800'}`}>
      {/* Animated Liquid Background with Multi-layer Blobs */}
      <LiquidBackground theme={theme} />

      {/* Main Container */}
      <main className="w-full max-w-lg px-4 sm:px-6 relative z-10 flex-1 flex flex-col">
        {activeTab === 'dashboard' && (
          <DashboardScreen
            calculation={calculation}
            income={income}
            deductions={deductions}
            onNavigateTab={setActiveTab}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {activeTab === 'income' && (
          <IncomeScreen
            income={income}
            onChangeIncome={setIncome}
            calculation={calculation}
          />
        )}

        {activeTab === 'deductions' && (
          <DeductionScreen
            deductions={deductions}
            onChangeDeductions={setDeductions}
            calculation={calculation}
          />
        )}

        {activeTab === 'planning' && (
          <PlanningScreen
            income={income}
            deductions={deductions}
            calculation={calculation}
            onCommitPlan={(newDeductions) => setDeductions(newDeductions)}
          />
        )}
      </main>

      {/* Floating Liquid Glass Tab Bar */}
      <GlassTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Settings & Privacy Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onExport={exportDataJson}
        onImport={importDataJson}
        onResetSample={resetToSample}
        onClearAll={clearAllData}
      />

      {/* Onboarding Modal for first launch */}
      <OnboardingModal
        isOpen={!hasCompletedOnboarding}
        onComplete={handleOnboardingComplete}
      />
    </div>
  )
}

export default App
