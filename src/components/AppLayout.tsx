import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TitleBar from './TitleBar'
import UpdateBanner from './UpdateBanner'
import GeneratorScreen from './GeneratorScreen'
import LibraryScreen from './LibraryScreen'
import StudyScreen from './StudyScreen'
import type { Phrase } from '../utils/types'
import { storage } from '../utils/storage'

const NAV = [
  { id: 'generate', label: 'Gerar', icon: '✦', path: '/app/generate' },
  { id: 'library', label: 'Biblioteca', icon: '◈', path: '/app/library' },
] as const

type ScreenId = (typeof NAV)[number]['id'] | 'study'

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [studyPhrases, setStudyPhrases] = useState<Phrase[] | null>(null)

  const screen: ScreenId = useMemo(() => {
    if (location.pathname.startsWith('/app/library')) return 'library'
    if (location.pathname.startsWith('/app/study')) return 'study'
    return 'generate'
  }, [location.pathname])

  const handleGenerate = (phrases: Phrase[]) => {
    const existing = storage.getPhrases()
    const existingIds = new Set(existing.map((p) => p.id))
    const newPhrases = phrases.filter((p) => !existingIds.has(p.id))
    storage.setPhrases([...existing, ...newPhrases])

    setStudyPhrases(phrases)
    navigate('/app/study')
  }

  const handleStudyFromLibrary = (phrases: Phrase[]) => {
    setStudyPhrases(phrases)
    navigate('/app/study')
  }

  const handleStudyBack = () => {
    setStudyPhrases(null)
    navigate('/app/generate')
  }

  const handleStudyFinish = () => {
    setStudyPhrases(null)
    navigate('/app/library')
  }

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

      <div className="flex flex-1 min-h-0 relative z-10">
        {/* Sidebar */}
        {screen !== 'study' && (
          <aside className="w-16 flex flex-col items-center py-4 gap-2 border-r border-ink-700 bg-ink-950 shrink-0">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                title={item.label}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 group relative ${
                  screen === item.id
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-chalk/25 hover:text-chalk/60 hover:bg-ink-800'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {screen === item.id && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber-500 rounded-l" />
                )}
              </button>
            ))}

            <div className="flex-1" />
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col min-h-0 min-w-0">
          {screen === 'generate' && <GeneratorScreen onGenerate={handleGenerate} />}
          {screen === 'library' && <LibraryScreen onStudy={handleStudyFromLibrary} />}
          {screen === 'study' && studyPhrases && (
            <StudyScreen phrases={studyPhrases} onBack={handleStudyBack} onFinish={handleStudyFinish} />
          )}
        </main>
      </div>
    </div>
  )
}

