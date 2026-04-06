import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  Shield,
  Zap,
  Code2,
  Layers,
  Cloud,
  Settings,
  BarChart3,
  GitBranch,
  Lock,
  Workflow,
  Server,
  HardDrive,
  RefreshCw,
  Eye,
  Users,
  Gauge,
  Network,
  Box,
  Table2,
  FileCode,
  Cpu,
  Search,
  X,
  CheckCircle2,
  XCircle,
  Tag,
  BookOpen,
} from 'lucide-react'
import { techCards, type TechCard } from '../data/techCards'

/* ------------------------------------------------------------------ */
/*  Icon mapping                                                       */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Database,
  Shield,
  Zap,
  Code2,
  Layers,
  Cloud,
  Settings,
  BarChart3,
  GitBranch,
  Lock,
  Workflow,
  Server,
  HardDrive,
  RefreshCw,
  Eye,
  Users,
  Gauge,
  Network,
  Box,
  Table2,
  FileCode,
  Cpu,
}

/* ------------------------------------------------------------------ */
/*  Category colors                                                    */
/* ------------------------------------------------------------------ */

type Category = TechCard['category']

const categoryColors: Record<Category, { bg: string; text: string; border: string; bar: string }> = {
  Architecture: { bg: 'rgba(0, 120, 212, 0.15)', text: '#4da6ff', border: 'rgba(0, 120, 212, 0.3)', bar: '#0078d4' },
  Performance: { bg: 'rgba(242, 200, 17, 0.15)', text: '#f2c811', border: 'rgba(242, 200, 17, 0.3)', bar: '#f2c811' },
  Security: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)', bar: '#ef4444' },
  DAX: { bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.3)', bar: '#a855f7' },
  'Data Modeling': { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)', bar: '#10b981' },
  Fabric: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)', bar: '#3b82f6' },
  Administration: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)', bar: '#f59e0b' },
}

const allCategories: Category[] = [
  'Architecture',
  'Performance',
  'Security',
  'DAX',
  'Data Modeling',
  'Fabric',
  'Administration',
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getIcon(name: string) {
  return iconMap[name] || BookOpen
}

function getCategoryCount(category: Category) {
  return techCards.filter((c) => c.category === category).length
}

/* ------------------------------------------------------------------ */
/*  Category Badge                                                     */
/* ------------------------------------------------------------------ */

function CategoryBadge({ category }: { category: Category }) {
  const colors = categoryColors[category]
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {category}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Card Component                                                     */
/* ------------------------------------------------------------------ */

function TechCardItem({
  card,
  onSelect,
  index,
}: {
  card: TechCard
  onSelect: (card: TechCard) => void
  index: number
}) {
  const Icon = getIcon(card.icon)
  const colors = categoryColors[card.category]

  return (
    <motion.div
      layoutId={`card-${card.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => onSelect(card)}
      className="cursor-pointer glass-card p-6 group transition-all duration-300 hover:glow-blue"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: colors.bg, color: colors.text }}
        >
          <Icon size={24} />
        </div>
        <CategoryBadge category={card.category} />
      </div>

      <h3 className="text-lg font-semibold text-pbi-text mb-2 group-hover:text-pbi-text transition-colors">
        {card.title}
      </h3>

      <p className="text-sm text-pbi-muted leading-relaxed line-clamp-3">{card.summary}</p>

      <div className="mt-4 flex items-center gap-2 text-xs text-pbi-muted">
        <span>{card.keyPoints.length} points cles</span>
        <span className="w-1 h-1 rounded-full bg-pbi-border" />
        <span>{card.bestPractices.length} bonnes pratiques</span>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Expanded Card Modal                                                */
/* ------------------------------------------------------------------ */

function ExpandedCard({
  card,
  onClose,
  onTagClick,
}: {
  card: TechCard
  onClose: () => void
  onTagClick: (tag: string) => void
}) {
  const Icon = getIcon(card.icon)
  const colors = categoryColors[card.category]

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          layoutId={`card-${card.id}`}
          className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto pointer-events-auto"
          style={{ border: `1px solid ${colors.border}` }}
        >
          {/* Header */}
          <div
            className="sticky top-0 z-10 p-6 pb-4"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.bg, color: colors.text }}
                >
                  <Icon size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-pbi-text">{card.title}</h2>
                  <div className="mt-1">
                    <CategoryBadge category={card.category} />
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-pbi-border/50 transition-colors text-pbi-muted hover:text-pbi-text"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-6">
            {/* Summary */}
            <p className="text-pbi-text leading-relaxed">{card.summary}</p>

            {/* Key Points */}
            <div>
              <h3 className="text-sm font-semibold text-pbi-muted uppercase tracking-wider mb-3">
                Points Cles
              </h3>
              <ul className="space-y-2">
                {card.keyPoints.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex items-start gap-3 text-sm text-pbi-text"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ background: colors.text }}
                    />
                    {point}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Best Practices */}
            <div>
              <h3 className="text-sm font-semibold text-pbi-muted uppercase tracking-wider mb-3">
                Bonnes Pratiques
              </h3>
              <div className="space-y-2">
                {card.bestPractices.map((practice, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg text-sm"
                    style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span className="text-pbi-text">{practice}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Anti-Patterns */}
            <div>
              <h3 className="text-sm font-semibold text-pbi-muted uppercase tracking-wider mb-3">
                Anti-Patterns
              </h3>
              <div className="space-y-2">
                {card.antiPatterns.map((pattern, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg text-sm"
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}
                  >
                    <XCircle size={16} className="text-danger mt-0.5 flex-shrink-0" />
                    <span className="text-pbi-text">{pattern}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Related Topics */}
            <div>
              <h3 className="text-sm font-semibold text-pbi-muted uppercase tracking-wider mb-3">
                Sujets Lies
              </h3>
              <div className="flex flex-wrap gap-2">
                {card.relatedTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      onTagClick(topic)
                      onClose()
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      background: 'rgba(229, 231, 235, 0.5)',
                      border: '1px solid rgba(229, 231, 235, 0.8)',
                      color: '#1e293b',
                    }}
                  >
                    <Tag size={12} />
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Stats Dashboard                                                    */
/* ------------------------------------------------------------------ */

function StatsDashboard() {
  const maxCount = Math.max(...allCategories.map(getCategoryCount))

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-card p-8"
    >
      <h2 className="text-xl font-bold mb-2 text-pbi-text">Couverture Technique</h2>
      <p className="text-sm text-pbi-muted mb-6">
        {techCards.length} fiches techniques reparties sur {allCategories.length} categories
      </p>

      <div className="space-y-4">
        {allCategories.map((category) => {
          const count = getCategoryCount(category)
          const colors = categoryColors[category]
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium" style={{ color: colors.text }}>
                  {category}
                </span>
                <span className="text-sm text-pbi-muted">
                  {count} fiche{count > 1 ? 's' : ''}
                </span>
              </div>
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ background: 'rgba(229, 231, 235, 0.5)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: colors.bar }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="mt-8 pt-6"
        style={{ borderTop: '1px solid rgba(229, 231, 235, 0.5)' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-pbi-muted">Total des fiches</span>
          <span className="text-2xl font-bold gradient-text">{techCards.length}</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function TechCards() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCard, setSelectedCard] = useState<TechCard | null>(null)

  const filteredCards = useMemo(() => {
    let cards = techCards

    if (selectedCategory !== 'all') {
      cards = cards.filter((c) => c.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      cards = cards.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.keyPoints.some((p) => p.toLowerCase().includes(q)) ||
          c.bestPractices.some((p) => p.toLowerCase().includes(q))
      )
    }

    return cards
  }, [selectedCategory, searchQuery])

  const handleTagClick = useCallback((tag: string) => {
    setSearchQuery(tag)
    setSelectedCategory('all')
  }, [])

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto pt-12">
      {/* ==================== HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Fiches Techniques</span>
        </h1>
        <div className="flex items-center gap-4 text-pbi-muted text-sm">
          <span>{techCards.length} fiches disponibles</span>
          <span className="w-1 h-1 rounded-full bg-pbi-border" />
          <span>{allCategories.length} categories</span>
        </div>
      </motion.div>

      {/* ==================== SEARCH ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative mb-6"
      >
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-pbi-muted"
        />
        <input
          type="text"
          placeholder="Rechercher par titre, resume, points cles, bonnes pratiques..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-10 py-3.5 rounded-xl text-sm text-pbi-text placeholder-pbi-muted outline-none transition-all duration-300 focus:glow-blue"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(229, 231, 235, 0.5)',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-pbi-muted hover:text-pbi-text transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </motion.div>

      {/* ==================== CATEGORY FILTERS ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="flex flex-wrap gap-2 mb-10"
      >
        <button
          onClick={() => setSelectedCategory('all')}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
          style={{
            background:
              selectedCategory === 'all'
                ? 'rgba(242, 200, 17, 0.2)'
                : 'rgba(229, 231, 235, 0.4)',
            border: `1px solid ${
              selectedCategory === 'all'
                ? 'rgba(242, 200, 17, 0.4)'
                : 'rgba(229, 231, 235, 0.5)'
            }`,
            color: selectedCategory === 'all' ? '#f2c811' : '#94a3b8',
          }}
        >
          Toutes ({techCards.length})
        </button>
        {allCategories.map((category) => {
          const colors = categoryColors[category]
          const count = getCategoryCount(category)
          const isActive = selectedCategory === category
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? colors.bg : 'rgba(229, 231, 235, 0.4)',
                border: `1px solid ${isActive ? colors.border : 'rgba(229, 231, 235, 0.5)'}`,
                color: isActive ? colors.text : '#94a3b8',
              }}
            >
              {category} ({count})
            </button>
          )
        })}
      </motion.div>

      {/* ==================== RESULTS COUNT ==================== */}
      {(searchQuery || selectedCategory !== 'all') && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-pbi-muted mb-6"
        >
          {filteredCards.length} resultat{filteredCards.length !== 1 ? 's' : ''}{' '}
          trouve{filteredCards.length !== 1 ? 's' : ''}
        </motion.p>
      )}

      {/* ==================== CARD GRID ==================== */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
      >
        <AnimatePresence mode="popLayout">
          {filteredCards.map((card, index) => (
            <TechCardItem
              key={card.id}
              card={card}
              onSelect={setSelectedCard}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filteredCards.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Search size={48} className="text-pbi-border mx-auto mb-4" />
          <p className="text-pbi-muted text-lg">Aucune fiche trouvee</p>
          <p className="text-pbi-muted text-sm mt-1">
            Essayez de modifier votre recherche ou vos filtres
          </p>
        </motion.div>
      )}

      {/* ==================== STATS DASHBOARD ==================== */}
      <div className="max-w-2xl mx-auto mb-16">
        <StatsDashboard />
      </div>

      {/* ==================== EXPANDED CARD MODAL ==================== */}
      <AnimatePresence>
        {selectedCard && (
          <ExpandedCard
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            onTagClick={handleTagClick}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
