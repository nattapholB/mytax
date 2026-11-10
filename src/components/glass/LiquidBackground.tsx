import React from 'react'

interface Props {
  theme: 'dark' | 'light'
}

export const LiquidBackground: React.FC<Props> = ({ theme }) => {
  const isDark = theme === 'dark'

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-700 z-0 ${
        isDark ? 'bg-[#090d16]' : 'bg-[#eef2f9]'
      }`}
      aria-hidden="true"
    >
      {/* Dynamic Liquid Gradient Blobs */}
      <div className="absolute inset-0">
        {/* Blob 1: Cyan / Sky Blue */}
        <div
          className={`absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full blur-[90px] animate-blob-1 transition-opacity duration-1000 ${
            isDark
              ? 'bg-gradient-to-tr from-cyan-600/40 via-sky-500/35 to-blue-600/30 mix-blend-screen opacity-70'
              : 'bg-gradient-to-tr from-sky-400/40 via-cyan-300/35 to-blue-300/30 mix-blend-multiply opacity-60'
          }`}
        />

        {/* Blob 2: Violet / Deep Purple */}
        <div
          className={`absolute top-1/4 -right-28 w-[520px] h-[520px] rounded-full blur-[100px] animate-blob-2 transition-opacity duration-1000 ${
            isDark
              ? 'bg-gradient-to-bl from-purple-600/40 via-indigo-500/35 to-violet-700/30 mix-blend-screen opacity-75'
              : 'bg-gradient-to-bl from-purple-300/40 via-indigo-200/40 to-violet-300/30 mix-blend-multiply opacity-55'
          }`}
        />

        {/* Blob 3: Coral / Rose Warm Glow */}
        <div
          className={`absolute -bottom-36 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] animate-blob-3 transition-opacity duration-1000 ${
            isDark
              ? 'bg-gradient-to-tl from-rose-600/30 via-pink-500/25 to-amber-600/20 mix-blend-screen opacity-60'
              : 'bg-gradient-to-tl from-rose-300/35 via-pink-200/30 to-amber-200/25 mix-blend-multiply opacity-50'
          }`}
        />

        {/* Blob 4: Emerald / Teal Accent */}
        <div
          className={`absolute top-2/3 -left-32 w-[380px] h-[380px] rounded-full blur-[80px] animate-blob-1 transition-opacity duration-1000 ${
            isDark
              ? 'bg-gradient-to-r from-teal-500/25 to-emerald-600/20 mix-blend-screen opacity-50'
              : 'bg-gradient-to-r from-teal-300/30 to-emerald-200/25 mix-blend-multiply opacity-40'
          }`}
        />
      </div>

      {/* Subtle Noise / Surface Texture */}
      <div
        className={`absolute inset-0 opacity-[0.035] ${
          isDark ? 'invert' : ''
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
