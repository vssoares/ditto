export default function TitleBar() {
  const minimize = () => window.electronAPI?.minimizeWindow()
  const maximize = () => window.electronAPI?.maximizeWindow()
  const close = () => window.electronAPI?.closeWindow()

  return (
    <div className="drag flex items-center justify-between px-4 h-10 bg-ink-950 border-b border-ink-700 shrink-0">
      <div className="flex items-center gap-2 no-drag">
        <div className="w-2 h-2 rounded-full bg-amber-500 opacity-60" />
        <span className="font-mono text-xs text-amber-500/60 tracking-widest uppercase">
          Ditto
        </span>
      </div>

      <div className="no-drag flex items-center gap-1">
        <button
          onClick={minimize}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-ink-700 text-chalk/30 hover:text-chalk/60 transition-colors text-xs"
        >
          ─
        </button>
        <button
          onClick={maximize}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-ink-700 text-chalk/30 hover:text-chalk/60 transition-colors text-xs"
        >
          □
        </button>
        <button
          onClick={close}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-900/50 text-chalk/30 hover:text-red-400 transition-colors text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
