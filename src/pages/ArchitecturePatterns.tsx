import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Network,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Layers,
  GitCompare,
  Zap,
  Database,
  BarChart3,
  Workflow,
  Radio,
  Bell,
  Cpu,
  Target,
  Factory,
} from 'lucide-react'
import { architecturePatterns, type ArchitecturePattern } from '../data/architecturePatterns'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TYPE_COLORS: Record<string, string> = {
  source: '#ef4444',
  ingest: '#f59e0b',
  transform: '#3b82f6',
  store: '#10b981',
  serve: '#8b5cf6',
  consume: '#f2c811',
}

const TYPE_LABELS: Record<string, string> = {
  source: 'Source',
  ingest: 'Ingestion',
  transform: 'Transformation',
  store: 'Stockage',
  serve: 'Service',
  consume: 'Consommation',
}

const COMPLEXITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Simple: { bg: 'rgba(16,185,129,0.15)', text: '#10b981', border: '#10b981' },
  Medium: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: '#f59e0b' },
  Complex: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', border: '#ef4444' },
}

const FABRIC_SERVICE_ICONS: Record<string, typeof Database> = {
  'Data Factory': Factory,
  Lakehouse: Database,
  Warehouse: Layers,
  Notebook: Cpu,
  'KQL Database': BarChart3,
  'Power BI': BarChart3,
  'Dataflow Gen2': Workflow,
  Eventstream: Radio,
  'Data Activator': Bell,
}

const FILTERS = ['Tous', 'Simple', 'Medium', 'Complex'] as const

/* ------------------------------------------------------------------ */
/*  Small components                                                   */
/* ------------------------------------------------------------------ */

function ComplexityBadge({ complexity }: { complexity: string }) {
  const c = COMPLEXITY_COLORS[complexity] ?? COMPLEXITY_COLORS.Medium
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {complexity}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Architecture Diagram                                               */
/* ------------------------------------------------------------------ */

function ArchitectureDiagram({ components }: { components: ArchitecturePattern['components'] }) {
  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="flex items-center gap-2 min-w-[700px] justify-center">
        {components.map((comp, idx) => {
          const color = TYPE_COLORS[comp.type]
          return (
            <div key={comp.name} className="flex items-center">
              {/* Component box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="relative flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.08, y: -4 }}
                  className="rounded-xl px-4 py-3 text-center cursor-default min-w-[110px]"
                  style={{
                    background: `${color}18`,
                    border: `1.5px solid ${color}55`,
                    boxShadow: `0 0 20px ${color}22`,
                  }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70" style={{ color }}>
                    {TYPE_LABELS[comp.type]}
                  </div>
                  <div className="text-sm font-semibold text-pbi-text leading-tight">{comp.name}</div>
                </motion.div>
                {/* Tooltip-style description */}
                <div
                  className="mt-2 text-[10px] text-pbi-muted text-center max-w-[120px] leading-tight"
                >
                  {comp.description}
                </div>
              </motion.div>

              {/* Arrow connector */}
              {idx < components.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: idx * 0.1 + 0.2, duration: 0.3 }}
                  className="flex items-center mx-1 mt-[-20px]"
                >
                  <div className="relative h-[2px] w-8">
                    {/* Animated flowing line */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${TYPE_COLORS[comp.type]}, ${TYPE_COLORS[components[idx + 1].type]})`,
                      }}
                    />
                    <motion.div
                      className="absolute top-[-2px] w-2 h-2 rounded-full"
                      style={{ background: TYPE_COLORS[components[idx + 1].type], boxShadow: `0 0 8px ${TYPE_COLORS[components[idx + 1].type]}` }}
                      animate={{ left: ['0%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2, ease: 'linear' }}
                    />
                  </div>
                  <div
                    className="w-0 h-0"
                    style={{
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent',
                      borderLeft: `6px solid ${TYPE_COLORS[components[idx + 1].type]}`,
                    }}
                  />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Pattern Card                                                       */
/* ------------------------------------------------------------------ */

function PatternCard({
  pattern,
  isCompareMode,
  isSelected,
  onToggleSelect,
}: {
  pattern: ArchitecturePattern
  isCompareMode: boolean
  isSelected: boolean
  onToggleSelect: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`glass-card p-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-xl font-bold text-pbi-text">{pattern.name}</h3>
            <ComplexityBadge complexity={pattern.complexity} />
          </div>
          <p className="text-pbi-muted text-sm leading-relaxed">{pattern.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isCompareMode && (
            <button
              onClick={onToggleSelect}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isSelected
                  ? 'bg-primary text-pbi-dark'
                  : 'bg-pbi-card-hover text-pbi-muted hover:text-pbi-text'
              }`}
            >
              {isSelected ? 'Selectionne' : 'Comparer'}
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg bg-pbi-card-hover hover:bg-pbi-border transition-colors text-pbi-muted hover:text-pbi-text"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Architecture Diagram - always visible */}
      <ArchitectureDiagram components={pattern.components} />

      {/* Fabric Services badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {pattern.fabricServices.map((svc) => {
          const Icon = FABRIC_SERVICE_ICONS[svc] ?? Zap
          return (
            <span
              key={svc}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(0,120,212,0.15)', color: '#4da6ff', border: '1px solid rgba(0,120,212,0.3)' }}
            >
              <Icon size={12} />
              {svc}
            </span>
          )
        })}
      </div>

      {/* Expandable details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-6 pt-6 border-t border-pbi-border grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Use Cases */}
              <div>
                <h4 className="text-sm font-semibold text-pbi-text mb-3 flex items-center gap-2">
                  <Target size={14} className="text-info" />
                  Cas d'usage
                </h4>
                <ul className="space-y-2">
                  {pattern.useCases.map((uc) => (
                    <li key={uc} className="text-sm text-pbi-muted flex items-start gap-2">
                      <span className="text-info mt-0.5">-</span>
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pros */}
              <div>
                <h4 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  Avantages
                </h4>
                <ul className="space-y-2">
                  {pattern.pros.map((pro) => (
                    <li key={pro} className="text-sm text-pbi-muted flex items-start gap-2">
                      <CheckCircle2 size={12} className="text-success mt-0.5 shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h4 className="text-sm font-semibold text-danger mb-3 flex items-center gap-2">
                  <XCircle size={14} />
                  Inconvenients
                </h4>
                <ul className="space-y-2">
                  {pattern.cons.map((con) => (
                    <li key={con} className="text-sm text-pbi-muted flex items-start gap-2">
                      <XCircle size={12} className="text-danger mt-0.5 shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Comparison Panel                                                   */
/* ------------------------------------------------------------------ */

function ComparisonPanel({ patterns }: { patterns: ArchitecturePattern[] }) {
  if (patterns.length < 2) return null
  const [a, b] = patterns

  const allServices = [...new Set([...a.fabricServices, ...b.fabricServices])].sort()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 glow-blue"
    >
      <h3 className="text-lg font-bold gradient-text mb-6 flex items-center gap-2">
        <GitCompare size={20} />
        Comparaison : {a.name} vs {b.name}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Complexity */}
        <div>
          <h4 className="text-sm font-semibold text-pbi-muted mb-3">Complexite</h4>
          <div className="flex gap-3">
            <ComplexityBadge complexity={a.complexity} />
            <span className="text-pbi-muted">vs</span>
            <ComplexityBadge complexity={b.complexity} />
          </div>
        </div>

        {/* Services comparison */}
        <div>
          <h4 className="text-sm font-semibold text-pbi-muted mb-3">Services Fabric</h4>
          <div className="space-y-1.5">
            {allServices.map((svc) => {
              const inA = a.fabricServices.includes(svc)
              const inB = b.fabricServices.includes(svc)
              return (
                <div key={svc} className="flex items-center gap-2 text-xs">
                  <span className={`w-4 text-center ${inA ? 'text-success' : 'text-danger'}`}>
                    {inA ? '✓' : '✗'}
                  </span>
                  <span className="text-pbi-muted flex-1">{svc}</span>
                  <span className={`w-4 text-center ${inB ? 'text-success' : 'text-danger'}`}>
                    {inB ? '✓' : '✗'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pros/Cons count */}
        <div>
          <h4 className="text-sm font-semibold text-pbi-muted mb-3">Avantages / Inconvenients</h4>
          <div className="space-y-3">
            {[a, b].map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs text-pbi-text font-medium w-32 truncate">{p.name}</span>
                <span className="text-xs text-success">{p.pros.length} pros</span>
                <span className="text-xs text-danger">{p.cons.length} cons</span>
              </div>
            ))}
          </div>

          {/* Side by side pros */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            {[a, b].map((p) => (
              <div key={p.id}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-pbi-muted mb-2">{p.name}</div>
                <div className="space-y-1">
                  {p.pros.map((pro) => (
                    <div key={pro} className="text-[11px] text-success/80 flex items-start gap-1">
                      <span>+</span>{pro}
                    </div>
                  ))}
                  {p.cons.map((con) => (
                    <div key={con} className="text-[11px] text-danger/80 flex items-start gap-1">
                      <span>-</span>{con}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Fabric Services Legend                                              */
/* ------------------------------------------------------------------ */

function FabricServicesLegend() {
  const services = Object.entries(FABRIC_SERVICE_ICONS)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-pbi-muted mb-4 flex items-center gap-2">
        <Layers size={14} className="text-fabric" />
        Services Microsoft Fabric
      </h3>
      <div className="flex flex-wrap gap-3">
        {services.map(([name, Icon]) => (
          <div
            key={name}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
            style={{ background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.15)' }}
          >
            <Icon size={14} className="text-fabric" />
            <span className="text-pbi-text">{name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Flow Type Legend                                                    */
/* ------------------------------------------------------------------ */

function FlowTypeLegend() {
  return (
    <div className="flex flex-wrap gap-3 mb-2">
      {Object.entries(TYPE_LABELS).map(([type, label]) => (
        <div key={type} className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: TYPE_COLORS[type] }} />
          <span className="text-xs text-pbi-muted">{label}</span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function ArchitecturePatterns() {
  const [filter, setFilter] = useState<string>('Tous')
  const [compareMode, setCompareMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filtered = useMemo(() => {
    if (filter === 'Tous') return architecturePatterns
    return architecturePatterns.filter((p) => p.complexity === filter)
  }, [filter])

  const selectedPatterns = useMemo(
    () => architecturePatterns.filter((p) => selectedIds.includes(p.id)),
    [selectedIds],
  )

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  function toggleCompareMode() {
    setCompareMode((prev) => {
      if (prev) setSelectedIds([])
      return !prev
    })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto pt-12 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Network size={32} className="text-primary" />
          <h1 className="text-3xl font-bold gradient-text">Patterns d'Architecture</h1>
          <span className="ml-2 px-3 py-1 rounded-full bg-pbi-card text-pbi-muted text-sm font-medium border border-pbi-border">
            {architecturePatterns.length} patterns
          </span>
        </div>
        <p className="text-pbi-muted text-sm max-w-2xl">
          Explorez les architectures de reference pour Microsoft Fabric et Power BI.
          Chaque pattern inclut un diagramme interactif, les services utilises et une analyse avantages / inconvenients.
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-4"
      >
        {/* Complexity filter pills */}
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-primary text-pbi-dark'
                  : 'bg-pbi-card text-pbi-muted hover:text-pbi-text hover:bg-pbi-card-hover border border-pbi-border'
              }`}
            >
              {f === 'Tous' ? `Tous (${architecturePatterns.length})` : f}
            </button>
          ))}
        </div>

        {/* Compare toggle */}
        <button
          onClick={toggleCompareMode}
          className={`ml-auto flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            compareMode
              ? 'bg-fabric text-white'
              : 'bg-pbi-card text-pbi-muted hover:text-pbi-text hover:bg-pbi-card-hover border border-pbi-border'
          }`}
        >
          <GitCompare size={14} />
          {compareMode ? 'Quitter comparaison' : 'Comparer'}
        </button>
      </motion.div>

      {/* Compare hint */}
      {compareMode && selectedIds.length < 2 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-warning"
        >
          Selectionnez {2 - selectedIds.length} pattern{selectedIds.length === 0 ? 's' : ''} pour comparer.
        </motion.p>
      )}

      {/* Comparison panel */}
      <AnimatePresence>
        {compareMode && selectedPatterns.length === 2 && (
          <ComparisonPanel patterns={selectedPatterns} />
        )}
      </AnimatePresence>

      {/* Flow type legend */}
      <FlowTypeLegend />

      {/* Pattern cards */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((pattern) => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              isCompareMode={compareMode}
              isSelected={selectedIds.includes(pattern.id)}
              onToggleSelect={() => toggleSelect(pattern.id)}
            />
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-pbi-muted">
            Aucun pattern ne correspond au filtre selectionne.
          </div>
        )}
      </div>

      {/* Fabric Services Legend */}
      <FabricServicesLegend />
    </div>
  )
}
