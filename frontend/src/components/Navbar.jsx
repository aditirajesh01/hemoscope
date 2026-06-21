import { Link, useNavigate } from 'react-router-dom'
import { Sun, Moon, Dna, BookOpen } from 'lucide-react'

export default function Navbar({ dark, setDark }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-teal-300 flex items-center justify-center">
            <Dna size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
            HemoScope
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal hidden sm:block">
            India
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/browse"
            className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <BookOpen size={13} />
            Variant browser
          </Link>

          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
