import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Code2,
  BarChart3,
  Sparkles,
} from 'lucide-react'
import { daxFunctions, type DaxFunction, type DaxCategory } from '../data/daxReference'

type Complexity = 'Basic' | 'Intermediate' | 'Advanced'

const ALL_CATEGORIES: DaxCategory[] = [
  'Aggregation',
  'Date/Time',
  'Filter',
  'Information',
  'Logical',
  'Math',
  'Statistical',
  'Table',
  'Text',
  'Time Intelligence',
]

const categoryColors: Record<DaxCategory, string> = {
  Aggregation: '#3b82f6',
  'Date/Time': '#8b5cf6',
  Filter: '#f59e0b',
  Information: '#06b6d4',
  Logical: '#10b981',
  Math: '#ec4899',
  Statistical: '#f97316',
  Table: '#0078d4',
  Text: '#14b8a6',
  'Time Intelligence': '#a855f7',
}

const complexityConfig: Record<Complexity, { color: string; bg: string; label: string }> = {
  Basic: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', label: 'Basic' },
  Intermediate: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', label: 'Intermediate' },
  Advanced: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', label: 'Advanced' },
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// ── Stats Bar ──
function StatsBar() {
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const fn of daxFunctions) {
      counts[fn.category] = (counts[fn.category] || 0) + 1
    }
    return counts
  }, [])

  const maxCount = Math.max(...Object.values(categoryCounts))

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-pbi-text">
            {daxFunctions.length} fonctions DAX
          </span>
        </div>
        <span className="text-xs text-pbi-muted">
          {ALL_CATEGORIES.length} categories
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {ALL_CATEGORIES.map((cat) => {
          const count = categoryCounts[cat] || 0
          const pct = (count / maxCount) * 100
          return (
            <div key={cat} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-pbi-muted truncate">{cat}</span>
                <span
                  className="text-[11px] font-bold"
                  style={{ color: categoryColors[cat] }}
                >
                  {count}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-pbi-dark overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: categoryColors[cat] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ── Function Card ──
function FunctionCard({ fn, index }: { fn: DaxFunction; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const catColor = categoryColors[fn.category]
  const cplx = complexityConfig[fn.complexity]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className="glass-card overflow-hidden hover:border-primary/30 transition-colors group"
      style={{ borderColor: 'rgba(42, 58, 92, 0.5)' }}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-pbi-text group-hover:text-primary transition-colors">
            {fn.name}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: catColor,
                background: `${catColor}20`,
                border: `1px solid ${catColor}40`,
              }}
            >
              {fn.category}
            </span>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: cplx.color,
                background: cplx.bg,
                border: `1px solid ${cplx.color}40`,
              }}
            >
              {cplx.label}
            </span>
          </div>
        </div>

        <p className="text-sm text-pbi-muted leading-relaxed mb-3">{fn.description}</p>

        {/* Syntax */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Code2 className="w-3.5 h-3.5 text-fabric" />
            <span className="text-[11px] font-semibold text-fabric uppercase tracking-wider">
              Syntaxe
            </span>
          </div>
          <div className="rounded-lg bg-pbi-darker/80 border border-pbi-border/50 p-3 overflow-x-auto">
            <code className="text-sm font-mono text-primary whitespace-pre">{fn.syntax}</code>
          </div>
        </div>
      </div>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Example */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-success" />
                  <span className="text-[11px] font-semibold text-success uppercase tracking-wider">
                    Exemple
                  </span>
                </div>
                <div className="rounded-lg bg-pbi-darker/80 border border-pbi-border/50 p-3 overflow-x-auto">
                  <code className="text-sm font-mono text-pbi-text whitespace-pre">
                    {fn.example}
                  </code>
                </div>
              </div>

              {/* Tip */}
              <div
                className="rounded-lg p-3 flex items-start gap-2.5"
                style={{
                  background: 'rgba(242, 200, 17, 0.08)',
                  border: '1px solid rgba(242, 200, 17, 0.2)',
                }}
              >
                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-pbi-text leading-relaxed">{fn.tip}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-pbi-muted hover:text-primary border-t border-pbi-border/30 transition-colors cursor-pointer"
      >
        {expanded ? (
          <>
            Moins <ChevronUp className="w-3.5 h-3.5" />
          </>
        ) : (
          <>
            Exemple & Astuce <ChevronDown className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </motion.div>
  )
}

// ── Main Page ──
export default function DaxReference() {
  const [searchInput, setSearchInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<DaxCategory | 'All'>('All')
  const [selectedComplexity, setSelectedComplexity] = useState<Complexity | 'All'>('All')
  const searchRef = useRef<HTMLInputElement>(null)

  const debouncedSearch = useDebounce(searchInput, 200)

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const fn of daxFunctions) {
      counts[fn.category] = (counts[fn.category] || 0) + 1
    }
    return counts
  }, [])

  const filteredFunctions = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim()

    return daxFunctions.filter((fn) => {
      // Category filter
      if (selectedCategory !== 'All' && fn.category !== selectedCategory) return false
      // Complexity filter
      if (selectedComplexity !== 'All' && fn.complexity !== selectedComplexity) return false
      // Search filter
      if (query) {
        return (
          fn.name.toLowerCase().includes(query) ||
          fn.description.toLowerCase().includes(query) ||
          fn.category.toLowerCase().includes(query) ||
          fn.syntax.toLowerCase().includes(query)
        )
      }
      return true
    })
  }, [debouncedSearch, selectedCategory, selectedComplexity])

  const clearSearch = useCallback(() => {
    setSearchInput('')
    searchRef.current?.focus()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Reference DAX</h1>
        </div>
        <p className="text-pbi-muted ml-[52px]">
          Explorez les fonctions DAX essentielles avec syntaxe, exemples et astuces de pro.
        </p>
      </motion.div>

      {/* Stats Bar */}
      <StatsBar />

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-5"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pbi-muted pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher une fonction DAX (nom, description, categorie)..."
            className="w-full pl-12 pr-24 py-3.5 rounded-xl bg-pbi-card border border-pbi-border/60 text-pbi-text placeholder-pbi-muted/60 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchInput && (
              <button
                onClick={clearSearch}
                className="p-1 rounded-md hover:bg-pbi-border/40 text-pbi-muted hover:text-pbi-text transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <span className="text-xs text-pbi-muted bg-pbi-dark px-2 py-1 rounded-md">
              {filteredFunctions.length} resultat{filteredFunctions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Category Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-primary/15 text-primary border-primary/40'
                : 'bg-pbi-card text-pbi-muted border-pbi-border/50 hover:border-pbi-muted/50 hover:text-pbi-text'
            }`}
          >
            Toutes ({daxFunctions.length})
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat
            const color = categoryColors[cat]
            const count = categoryCounts[cat] || 0
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isActive ? 'All' : cat)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer"
                style={
                  isActive
                    ? {
                        background: `${color}20`,
                        color: color,
                        borderColor: `${color}60`,
                      }
                    : {
                        background: undefined,
                        color: undefined,
                        borderColor: undefined,
                      }
                }
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Complexity Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex items-center gap-2 mb-6"
      >
        <span className="text-xs text-pbi-muted mr-1">Complexite :</span>
        <button
          onClick={() => setSelectedComplexity('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
            selectedComplexity === 'All'
              ? 'bg-pbi-card-hover text-pbi-text border-pbi-border'
              : 'bg-transparent text-pbi-muted border-pbi-border/40 hover:border-pbi-border hover:text-pbi-text'
          }`}
        >
          Toutes
        </button>
        {(['Basic', 'Intermediate', 'Advanced'] as Complexity[]).map((level) => {
          const cfg = complexityConfig[level]
          const isActive = selectedComplexity === level
          return (
            <button
              key={level}
              onClick={() => setSelectedComplexity(isActive ? 'All' : level)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer"
              style={
                isActive
                  ? {
                      background: cfg.bg,
                      color: cfg.color,
                      borderColor: `${cfg.color}60`,
                    }
                  : {
                      background: 'transparent',
                      color: undefined,
                      borderColor: undefined,
                    }
              }
            >
              {level}
            </button>
          )
        })}
      </motion.div>

      {/* Function Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredFunctions.map((fn, i) => (
            <FunctionCard key={fn.name} fn={fn} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      <AnimatePresence>
        {filteredFunctions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-pbi-card flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-pbi-muted" />
            </div>
            <h3 className="text-lg font-semibold text-pbi-text mb-1">
              Aucune fonction trouvee
            </h3>
            <p className="text-sm text-pbi-muted max-w-md">
              Essayez de modifier votre recherche ou vos filtres pour trouver ce que vous cherchez.
            </p>
            <button
              onClick={() => {
                setSearchInput('')
                setSelectedCategory('All')
                setSelectedComplexity('All')
              }}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors cursor-pointer"
            >
              Reinitialiser les filtres
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
