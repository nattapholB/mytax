import React from 'react'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  glow?: 'cyan' | 'purple' | 'coral' | 'emerald' | 'none'
  interactive?: boolean
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  interactive = false,
  ...props
}) => {
  const glowClasses = {
    cyan: 'shadow-[0_0_30px_rgba(6,182,212,0.18)] border-cyan-500/30',
    purple: 'shadow-[0_0_30px_rgba(168,85,247,0.18)] border-purple-500/30',
    coral: 'shadow-[0_0_30px_rgba(244,63,94,0.18)] border-rose-500/30',
    emerald: 'shadow-[0_0_30px_rgba(16,185,129,0.18)] border-emerald-500/30',
    none: '',
  }[glow]

  return (
    <div
      className={`
        relative rounded-[28px] overflow-hidden
        backdrop-blur-[28px] saturate-[190%]
        dark:bg-slate-900/40 bg-white/65
        dark:border-white/12 border-white/60 border
        dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25)]
        shadow-[0_20px_40px_-15px_rgba(100,116,139,0.2),inset_0_1px_2px_rgba(255,255,255,0.9)]
        transition-all duration-300
        ${interactive ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.985] hover:border-white/25' : ''}
        ${glowClasses}
        ${className}
      `}
      {...props}
    >
      {/* Specular Highlight along top edge */}
      <div
        className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />
      
      {children}
    </div>
  )
}
