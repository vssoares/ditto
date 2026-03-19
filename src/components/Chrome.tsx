import type { ReactNode } from 'react'
import TitleBar from './TitleBar'
import UpdateBanner from './UpdateBanner'

export default function Chrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-ink-950 overflow-hidden">
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-40 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.06) 0%, transparent 70%)',
        }}
      />

      <TitleBar />
      <UpdateBanner />

      <div className="flex flex-1 min-h-0 relative z-10">{children}</div>
    </div>
  )
}

