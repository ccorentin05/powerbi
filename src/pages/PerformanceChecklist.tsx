import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Filter,
  RotateCcw,
  Zap,
  Target,
  AlertTriangle,
  ArrowUpDown,
  Eye,
  EyeOff,
  X,
  Database,
  Calculator,
  BarChart3,
  RefreshCw,
  Server,
  Gauge,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  database: Database,
  calculator: Calculator,
  'bar-chart-3': BarChart3,
  'refresh-cw': RefreshCw,
  server: Server,
  gauge: Gauge,
}
import { performanceChecklist, type ChecklistItem } from '../data/performanceChecklist'

type Impact = ChecklistItem['impact']
type Effort = ChecklistItem['effort']

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'pbi-perf-checklist-checked'

const impactColor: Record<Impact, string> = {
  High: 'bg-danger/20 text-danger border-danger/30',
  Medium: 'bg-warning/20 text-warning border-warning/30',
  Low: 'bg-success/20 text-success border-success/30',
}

const effortColor: Record<Effort, string> = {
  Easy: 'bg-success/20 text-success border-success/30',
  Medium: 'bg-warning/20 text-warning border-warning/30',
  Hard: 'bg-danger/20 text-danger border-danger/30',
}

const impactValue: Record<Impact, number> = { High: 3, Medium: 2, Low: 1 }
const effortValue: Record<Effort, number> = { Easy: 1, Medium: 2, Hard: 3 }

type SortMode = 'default' | 'impact' | 'effort' | 'status'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const allItems: ChecklistItem[] = performanceChecklist.flatMap((c) => c.items)
const totalItems = allItems.length

function loadChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return new Set(JSON.parse(raw))
  } catch {
    /* ignore */
  }
  return new Set()
}

function saveChecked(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

function sortItems(
  items: ChecklistItem[],
  mode: SortMode,
  checked: Set<string>,
): ChecklistItem[] {
  const copy = [...items]
  switch (mode) {
    case 'impact':
      return copy.sort((a, b) => impactValue[b.impact] - impactValue[a.impact])
    case 'effort':
      return copy.sort((a, b) => effortValue[a.effort] - effortValue[b.effort])
    case 'status':
      return copy.sort(
        (a, b) => (checked.has(a.id) ? 1 : 0) - (checked.has(b.id) ? 1 : 0),
      )
    default:
      return copy.sort(
        (a, b) =>
          impactValue[b.impact] - impactValue[a.impact] ||
          effortValue[a.effort] - effortValue[b.effort],
      )
  }
}

/* ------------------------------------------------------------------ */
/*  Circular Progress                                                  */
/* ------------------------------------------------------------------ */

function CircularProgress({
  pct,
  size = 140,
  stroke = 10,
}: {
  pct: number
  size?: number
  stroke?: number
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-pbi-border)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-primary"
          key={pct}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {pct}%
        </motion.span>
        <span className="text-xs text-pbi-muted">complete</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Checkbox                                                           */
/* ------------------------------------------------------------------ */

function CheckBox({
  checked,
  onToggle,
}: {
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="relative flex-shrink-0 w-7 h-7 flex items-center justify-center cursor-pointer focus:outline-none"
      aria-label={checked ? 'Uncheck' : 'Check'}
    >
      <AnimatePresence mode="wait">
        {checked ? (
          <motion.div
            key="checked"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <CheckCircle2 className="w-7 h-7 text-success" />
          </motion.div>
        ) : (
          <motion.div
            key="unchecked"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Circle className="w-7 h-7 text-pbi-muted/50 hover:text-pbi-muted transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
      {checked && (
        <motion.div
          className="absolute inset-0 rounded-full bg-success/20"
          initial={{ scale: 1.8, opacity: 0.6 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Item Row                                                           */
/* ------------------------------------------------------------------ */

function ItemRow({
  item,
  checked,
  onToggle,
}: {
  item: ChecklistItem
  checked: boolean
  onToggle: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      id={`item-${item.id}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-xl border p-4 transition-colors ${
        checked
          ? 'border-success/20 bg-success/5'
          : 'border-pbi-border bg-pbi-card hover:bg-pbi-card-hover'
      }`}
    >
      <div className="flex items-start gap-3">
        <CheckBox checked={checked} onToggle={onToggle} />
        <div className="flex-1 min-w-0">
          <button
            className="w-full text-left cursor-pointer"
            onClick={() => setExpanded((v) => !v)}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-medium transition-colors ${
                  checked ? 'text-pbi-muted line-through' : 'text-pbi-text'
                }`}
              >
                {item.title}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${impactColor[item.impact]}`}
              >
                {item.impact}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${effortColor[item.effort]}`}
              >
                {item.effort}
              </span>
            </div>
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-sm text-pbi-muted mt-2 overflow-hidden"
              >
                {item.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-shrink-0 text-pbi-muted hover:text-pbi-text transition-colors cursor-pointer"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Impact / Effort Matrix                                             */
/* ------------------------------------------------------------------ */

function Matrix({
  checked,
  onScrollTo,
}: {
  checked: Set<string>
  onScrollTo: (id: string) => void
}) {
  const buckets = useMemo(() => {
    const m = {
      quickWins: [] as ChecklistItem[],
      bigBets: [] as ChecklistItem[],
      easyWins: [] as ChecklistItem[],
      thankless: [] as ChecklistItem[],
    }
    for (const item of allItems) {
      if (checked.has(item.id)) continue
      const hi = item.impact === 'High'
      const easy = item.effort === 'Easy' || item.effort === 'Medium'
      if (hi && easy) m.quickWins.push(item)
      else if (hi && !easy) m.bigBets.push(item)
      else if (!hi && easy) m.easyWins.push(item)
      else m.thankless.push(item)
    }
    return m
  }, [checked])

  const Cell = ({
    label,
    items,
    highlight,
    color,
  }: {
    label: string
    items: ChecklistItem[]
    highlight?: boolean
    color: string
  }) => (
    <div
      className={`rounded-xl border p-3 ${
        highlight
          ? 'border-primary/40 bg-primary/5'
          : 'border-pbi-border bg-pbi-card'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {highlight && <Zap className="w-4 h-4 text-primary" />}
        <span className={`text-sm font-semibold ${color}`}>{label}</span>
        <span className="text-xs text-pbi-muted">({items.length})</span>
      </div>
      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onScrollTo(it.id)}
            className="text-[11px] px-2 py-0.5 rounded-full bg-pbi-border/40 text-pbi-muted hover:text-pbi-text hover:bg-pbi-border transition-colors cursor-pointer truncate max-w-[180px]"
            title={it.title}
          >
            {it.title}
          </button>
        ))}
        {items.length === 0 && (
          <span className="text-xs text-pbi-muted/50 italic">Tout fait !</span>
        )}
      </div>
    </div>
  )

  return (
    <div className="glass-card p-6 mb-8">
      <h3 className="text-lg font-bold text-pbi-text mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        Matrice Impact / Effort
      </h3>
      <div className="grid grid-cols-[auto_1fr_1fr] grid-rows-[auto_1fr_1fr] gap-2">
        <div />
        <div className="text-center text-xs text-pbi-muted font-semibold pb-1">
          Facile / Moyen
        </div>
        <div className="text-center text-xs text-pbi-muted font-semibold pb-1">
          Difficile
        </div>
        <div className="text-xs text-pbi-muted font-semibold flex items-center justify-end pr-2 [writing-mode:vertical-lr] rotate-180">
          Impact eleve
        </div>
        <Cell
          label="Quick Wins"
          items={buckets.quickWins}
          highlight
          color="text-primary"
        />
        <Cell label="Big Bets" items={buckets.bigBets} color="text-warning" />
        <div className="text-xs text-pbi-muted font-semibold flex items-center justify-end pr-2 [writing-mode:vertical-lr] rotate-180">
          Impact faible
        </div>
        <Cell
          label="Easy Wins"
          items={buckets.easyWins}
          color="text-success"
        />
        <Cell
          label="A eviter"
          items={buckets.thankless}
          color="text-pbi-muted"
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function PerformanceChecklist() {
  const [checked, setChecked] = useState<Set<string>>(loadChecked)
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(performanceChecklist.map((c) => c.name)),
  )
  const [filterImpact, setFilterImpact] = useState<Impact | null>(null)
  const [filterEffort, setFilterEffort] = useState<Effort | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>('default')
  const [showOnlyUnchecked, setShowOnlyUnchecked] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => saveChecked(checked), [checked])

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleCategory = useCallback((name: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    setChecked(new Set())
    setConfirmReset(false)
  }

  const scrollToItem = (id: string) => {
    const item = allItems.find((it) => it.id === id)
    if (item) {
      setOpenCategories((prev) => new Set(prev).add(item.category))
    }
    setTimeout(() => {
      const el = document.getElementById(`item-${id}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 200)
  }

  /* ---- derived ---- */
  const checkedCount = checked.size
  const pct = Math.round((checkedCount / totalItems) * 100)
  const score = Math.round((checkedCount / totalItems) * 100)

  const highImpactRemaining = allItems.filter(
    (i) => i.impact === 'High' && !checked.has(i.id),
  ).length

  const filteredCategories = useMemo(() => {
    return performanceChecklist
      .filter((cat) => !filterCategory || cat.name === filterCategory)
      .map((cat) => {
        let items = cat.items
        if (filterImpact) items = items.filter((i) => i.impact === filterImpact)
        if (filterEffort) items = items.filter((i) => i.effort === filterEffort)
        if (showOnlyUnchecked)
          items = items.filter((i) => !checked.has(i.id))
        items = sortItems(items, sortMode, checked)
        return { ...cat, items }
      })
      .filter((cat) => cat.items.length > 0)
  }, [
    filterImpact,
    filterEffort,
    filterCategory,
    showOnlyUnchecked,
    sortMode,
    checked,
  ])

  const categoryProgress = useMemo(() => {
    return performanceChecklist.map((cat) => ({
      name: cat.name,
      done: cat.items.filter((i) => checked.has(i.id)).length,
      total: cat.items.length,
    }))
  }, [checked])

  const hasActiveFilters =
    filterImpact || filterEffort || filterCategory || showOnlyUnchecked

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* ---- Header ---- */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text mb-3">
          Checklist Performance Power BI
        </h1>
        <p className="text-pbi-muted text-lg max-w-2xl mx-auto">
          Optimisez vos rapports et modeles avec cette checklist exhaustive.
          Votre progression est sauvegardee automatiquement.
        </p>
      </motion.div>

      {/* ---- Progress Dashboard ---- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <CircularProgress pct={pct} />

          <div className="flex-1 w-full">
            <div className="mb-4">
              <span className="text-pbi-muted text-sm">
                Votre score d'optimisation :{' '}
              </span>
              <motion.span
                key={score}
                className="text-2xl font-bold text-primary"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {score}/100
              </motion.span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="text-center bg-gray-100 rounded-lg py-2">
                <div className="text-xl font-bold text-pbi-text">
                  {totalItems}
                </div>
                <div className="text-[11px] text-pbi-muted">Total</div>
              </div>
              <div className="text-center bg-gray-100 rounded-lg py-2">
                <div className="text-xl font-bold text-success">
                  {checkedCount}
                </div>
                <div className="text-[11px] text-pbi-muted">Completes</div>
              </div>
              <div className="text-center bg-gray-100 rounded-lg py-2">
                <div className="text-xl font-bold text-danger">
                  {highImpactRemaining}
                </div>
                <div className="text-[11px] text-pbi-muted">
                  Impact eleve restants
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {categoryProgress.map((cp) => {
                const p = Math.round((cp.done / cp.total) * 100)
                return (
                  <div key={cp.name} className="flex items-center gap-3">
                    <span className="text-xs text-pbi-muted w-28 text-right truncate">
                      {cp.name}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${p}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-xs text-pbi-muted w-12">
                      {cp.done}/{cp.total}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---- Impact / Effort Matrix ---- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Matrix checked={checked} onScrollTo={scrollToItem} />
      </motion.div>

      {/* ---- Filters / Sort Bar ---- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 mb-6"
      >
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              showFilters || hasActiveFilters
                ? 'bg-primary/20 text-primary'
                : 'bg-gray-100 text-pbi-muted hover:text-pbi-text'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown className="w-4 h-4 text-pbi-muted" />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="bg-gray-100 text-pbi-text text-sm rounded-lg px-2 py-1.5 border border-pbi-border focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="default">Par defaut</option>
              <option value="impact">Par impact</option>
              <option value="effort">Par effort</option>
              <option value="status">Par statut</option>
            </select>
          </div>

          <button
            onClick={() => setShowOnlyUnchecked((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
              showOnlyUnchecked
                ? 'bg-primary/20 text-primary'
                : 'bg-gray-100 text-pbi-muted hover:text-pbi-text'
            }`}
          >
            {showOnlyUnchecked ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {showOnlyUnchecked ? 'Non completes' : 'Tous'}
          </button>

          <button
            onClick={handleReset}
            onBlur={() => setConfirmReset(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
              confirmReset
                ? 'bg-danger/20 text-danger'
                : 'bg-gray-100 text-pbi-muted hover:text-danger'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            {confirmReset ? 'Confirmer ?' : 'Reset'}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-pbi-border flex flex-wrap gap-4">
                <div>
                  <span className="text-xs text-pbi-muted block mb-1.5">
                    Impact
                  </span>
                  <div className="flex gap-1.5">
                    {(['High', 'Medium', 'Low'] as Impact[]).map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          setFilterImpact((v) =>
                            v === level ? null : level,
                          )
                        }
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors cursor-pointer ${
                          filterImpact === level
                            ? impactColor[level]
                            : 'border-pbi-border text-pbi-muted hover:text-pbi-text'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-pbi-muted block mb-1.5">
                    Effort
                  </span>
                  <div className="flex gap-1.5">
                    {(['Easy', 'Medium', 'Hard'] as Effort[]).map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          setFilterEffort((v) =>
                            v === level ? null : level,
                          )
                        }
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors cursor-pointer ${
                          filterEffort === level
                            ? effortColor[level]
                            : 'border-pbi-border text-pbi-muted hover:text-pbi-text'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-pbi-muted block mb-1.5">
                    Categorie
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {performanceChecklist.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() =>
                          setFilterCategory((v) =>
                            v === cat.name ? null : cat.name,
                          )
                        }
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors cursor-pointer ${
                          filterCategory === cat.name
                            ? 'bg-fabric/20 text-fabric border-fabric/30'
                            : 'border-pbi-border text-pbi-muted hover:text-pbi-text'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setFilterImpact(null)
                      setFilterEffort(null)
                      setFilterCategory(null)
                      setShowOnlyUnchecked(false)
                    }}
                    className="flex items-center gap-1 text-xs text-danger hover:text-danger/80 transition-colors self-end cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    Effacer les filtres
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ---- Category Sections ---- */}
      <div className="space-y-6">
        {filteredCategories.map((cat, catIdx) => {
          const Icon = iconMap[cat.icon] || Database
          const isOpen = openCategories.has(cat.name)
          const catDone = cat.items.filter((i) => checked.has(i.id)).length
          const originalCat = performanceChecklist.find(
            (c) => c.name === cat.name,
          )!
          const catPct = Math.round(
            (originalCat.items.filter((i) => checked.has(i.id)).length /
              originalCat.items.length) *
              100,
          )

          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * catIdx }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(cat.name)}
                className="w-full flex items-center gap-4 p-5 cursor-pointer hover:bg-pbi-card-hover/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-pbi-text">
                      {cat.name}
                    </h2>
                    <span className="text-xs text-pbi-muted">
                      {catDone}/{cat.items.length}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${catPct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-pbi-muted" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-3">
                      {cat.items.map((item) => (
                        <ItemRow
                          key={item.id}
                          item={item}
                          checked={checked.has(item.id)}
                          onToggle={() => toggle(item.id)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {filteredCategories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
          <p className="text-pbi-muted text-lg">
            Aucun element ne correspond aux filtres selectionnes.
          </p>
          <button
            onClick={() => {
              setFilterImpact(null)
              setFilterEffort(null)
              setFilterCategory(null)
              setShowOnlyUnchecked(false)
            }}
            className="mt-3 text-primary hover:text-primary-light transition-colors cursor-pointer"
          >
            Effacer les filtres
          </button>
        </motion.div>
      )}

      <div className="h-20" />
    </div>
  )
}
