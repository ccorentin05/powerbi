import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calculator,
  CreditCard,
  Code2,
  BookOpen,
  TrendingUp,
  Zap,
  Network,
  BarChart3,
  AlignLeft,
  Download,
  GraduationCap,
  Sparkles,
  Bot,
  Award,
  FileCode,
  GitBranch,
  Plug,
  PenTool,
  Cloud,
  Newspaper,
  Map,
  Wrench,
  ChevronDown,
  Search,
  Menu,
  X,
  Share2,
  type LucideIcon,
} from 'lucide-react'

// --- Types ---

interface NavPage {
  path: string
  label: string
  icon: LucideIcon
  description: string
}

interface NavCategory {
  id: string
  label: string
  icon: LucideIcon
  items: NavPage[]
}

interface NavStandalone {
  id: string
  path: string
  label: string
  icon: LucideIcon
  description: string
}

type NavEntry = NavCategory | NavStandalone

function isCategory(entry: NavEntry): entry is NavCategory {
  return 'items' in entry
}

// --- Navigation data ---

const navigation: NavEntry[] = [
  {
    id: 'home',
    path: '/',
    label: 'Accueil',
    icon: LayoutDashboard,
    description: 'Tableau de bord principal',
  },
  {
    id: 'outils',
    label: 'Outils',
    icon: Wrench,
    items: [
      { path: '/simulator', label: 'Simulateur Fabric', icon: Calculator, description: 'Simuler les coûts Fabric' },
      { path: '/licenses', label: 'Comparateur Licences', icon: CreditCard, description: 'Comparer les licences Power BI' },
      { path: '/roi', label: 'Calculateur ROI', icon: TrendingUp, description: 'Calculer le retour sur investissement' },
      { path: '/formatter', label: 'Formateur DAX/M', icon: AlignLeft, description: 'Formater du code DAX et M' },
    ],
  },
  {
    id: 'apprendre',
    label: 'Apprendre',
    icon: BookOpen,
    items: [
      { path: '/dax', label: 'Référence DAX', icon: Code2, description: 'Fonctions et patterns DAX' },
      { path: '/fiches', label: 'Fiches Techniques', icon: BookOpen, description: 'Fiches de référence rapide' },
      { path: '/exercises', label: 'Exercices Pratiques', icon: PenTool, description: 'Exercices pour pratiquer' },
      { path: '/certifications', label: 'Certifications', icon: Award, description: 'Préparer les certifications Microsoft' },
    ],
  },
  {
    id: 'fabric',
    label: 'Fabric',
    icon: Cloud,
    items: [
      { path: '/fabric', label: 'Guide Complet Fabric', icon: Cloud, description: 'Guide approfondi Microsoft Fabric' },
      { path: '/architecture', label: 'Patterns Architecture', icon: Network, description: "Patterns d'architecture Fabric" },
      { path: '/notebooks', label: 'Templates Notebooks', icon: FileCode, description: 'Templates de notebooks Fabric' },
      { path: '/cicd', label: 'CI/CD & GitHub Actions', icon: GitBranch, description: 'Pipelines CI/CD pour Power BI' },
      { path: '/sharing', label: 'Partage & Accès', icon: Share2, description: "Gestion du partage et de l'accès" },
    ],
  },
  {
    id: 'dev',
    label: 'Développeur',
    icon: Plug,
    items: [
      { path: '/api', label: 'API Reference', icon: Plug, description: 'Documentation des APIs Power BI' },
      { path: '/ai', label: 'IA & Power BI', icon: Bot, description: 'Intelligence artificielle et Power BI' },
      { path: '/tools', label: 'Outils & Téléchargements', icon: Download, description: 'Outils et ressources à télécharger' },
    ],
  },
  {
    id: 'news',
    label: 'Actualités',
    icon: Newspaper,
    items: [
      { path: '/whatsnew', label: 'Nouveautés', icon: Sparkles, description: 'Dernières nouveautés Power BI' },
      { path: '/roadmap', label: 'Roadmap', icon: Map, description: 'Feuille de route Microsoft' },
      { path: '/resources', label: 'Ressources', icon: GraduationCap, description: 'Liens et ressources utiles' },
    ],
  },
  {
    id: 'performance',
    path: '/performance',
    label: 'Checklist Performance',
    icon: Zap,
    description: "Checklist d'optimisation des performances",
  },
]

// Flatten all pages for search
function getAllPages(): NavPage[] {
  const pages: NavPage[] = []
  for (const entry of navigation) {
    if (isCategory(entry)) {
      pages.push(...entry.items)
    } else {
      pages.push({ path: entry.path, label: entry.label, icon: entry.icon, description: entry.description })
    }
  }
  return pages
}

// Find which category a path belongs to
function findCategoryForPath(path: string): string | null {
  for (const entry of navigation) {
    if (isCategory(entry) && entry.items.some((item) => item.path === path)) {
      return entry.id
    }
  }
  return null
}

// --- localStorage helpers ---

const STORAGE_KEY = 'pbi-nav-open-categories'

function loadOpenCategories(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveOpenCategories(state: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// --- Components ---

function CategorySection({
  category,
  isOpen,
  onToggle,
  currentPath,
}: {
  category: NavCategory
  isOpen: boolean
  onToggle: () => void
  currentPath: string
}) {
  const hasActive = category.items.some((item) => item.path === currentPath)

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group cursor-pointer ${
          hasActive && !isOpen ? 'text-primary' : 'text-pbi-muted hover:text-pbi-text'
        }`}
      >
        <category.icon className="w-5 h-5 shrink-0" />
        <span className="text-sm font-semibold flex-1 text-left">{category.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-4 pl-3 border-l border-pbi-border/40 flex flex-col gap-0.5 py-1">
              {category.items.map((item) => {
                const isActive = currentPath === item.path
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="relative flex items-center gap-3 px-3 py-2 rounded-xl transition-colors group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: 'rgba(242, 200, 17, 0.1)',
                          border: '1px solid rgba(242, 200, 17, 0.2)',
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon
                      className={`relative z-10 w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-primary' : 'text-pbi-muted group-hover:text-pbi-text'
                      }`}
                    />
                    <span
                      className={`relative z-10 text-sm font-medium ${
                        isActive ? 'text-primary' : 'text-pbi-muted group-hover:text-pbi-text'
                      }`}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StandaloneLink({ entry, currentPath }: { entry: NavStandalone; currentPath: string }) {
  const isActive = currentPath === entry.path
  return (
    <NavLink
      to={entry.path}
      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group"
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'rgba(242, 200, 17, 0.1)',
            border: '1px solid rgba(242, 200, 17, 0.2)',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
      {isActive && (
        <motion.div
          layoutId="sidebar-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
      <entry.icon
        className={`relative z-10 w-5 h-5 shrink-0 transition-colors ${
          isActive ? 'text-primary' : 'text-pbi-muted group-hover:text-pbi-text'
        }`}
      />
      <span
        className={`relative z-10 text-sm font-semibold ${
          isActive ? 'text-primary' : 'text-pbi-muted group-hover:text-pbi-text'
        }`}
      >
        {entry.label}
      </span>
    </NavLink>
  )
}

function GlobalSearch({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const allPages = useMemo(() => getAllPages(), [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allPages.filter(
      (p) => p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )
  }, [query, allPages])

  const showDropdown = isFocused && results.length > 0

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
        setQuery('')
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = (path: string) => {
    navigate(path)
    setQuery('')
    inputRef.current?.blur()
    onNavigate?.()
  }

  return (
    <div className="relative px-3 py-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pbi-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Rechercher..."
          className="w-full pl-10 pr-14 py-2 rounded-xl text-sm bg-pbi-card border border-pbi-border/40 text-pbi-text placeholder-pbi-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-pbi-muted bg-pbi-darker/60 px-1.5 py-0.5 rounded border border-pbi-border/30">
          Ctrl+K
        </span>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-3 right-3 top-full mt-1 rounded-xl bg-pbi-card border border-pbi-border/60 shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto"
          >
            {results.map((page) => (
              <button
                key={page.path}
                onMouseDown={() => handleSelect(page.path)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-pbi-card-hover transition-colors text-left cursor-pointer"
              >
                <page.icon className="w-4 h-4 text-pbi-muted shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-pbi-text truncate">{page.label}</div>
                  <div className="text-xs text-pbi-muted truncate">{page.description}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const currentPath = location.pathname

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const saved = loadOpenCategories()
    // Auto-open category of current path
    const activeCat = findCategoryForPath(currentPath)
    if (activeCat) saved[activeCat] = true
    return saved
  })

  // Auto-open category when route changes
  useEffect(() => {
    const activeCat = findCategoryForPath(currentPath)
    if (activeCat && !openCategories[activeCat]) {
      setOpenCategories((prev) => {
        const next = { ...prev, [activeCat]: true }
        saveOpenCategories(next)
        return next
      })
    }
  }, [currentPath]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleCategory = useCallback((id: string) => {
    setOpenCategories((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      saveOpenCategories(next)
      return next
    })
  }, [])

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-pbi-border/40 shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 shrink-0">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <span className="font-bold text-lg gradient-text whitespace-nowrap">PBI Expert Hub</span>
      </div>

      {/* Search */}
      <GlobalSearch onNavigate={onNavigate} />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 pb-4 overflow-y-auto" onClick={onNavigate}>
        {navigation.map((entry) =>
          isCategory(entry) ? (
            <CategorySection
              key={entry.id}
              category={entry}
              isOpen={!!openCategories[entry.id]}
              onToggle={() => toggleCategory(entry.id)}
              currentPath={currentPath}
            />
          ) : (
            <StandaloneLink key={entry.id} entry={entry} currentPath={currentPath} />
          )
        )}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-pbi-border/40 shrink-0">
        <p className="text-xs text-pbi-muted text-center leading-relaxed">
          Expert Power BI & Fabric
        </p>
        <p className="text-[10px] text-pbi-muted/50 text-center mt-1">v2.0</p>
      </div>
    </>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-pbi-darker">
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-full z-50 flex-col w-[280px]"
        style={{
          background: 'rgba(15, 15, 30, 0.85)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(42, 58, 92, 0.4)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center h-14 px-4"
        style={{
          background: 'rgba(15, 15, 30, 0.92)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(42, 58, 92, 0.4)',
        }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg text-pbi-muted hover:text-pbi-text transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 ml-3">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span className="font-bold gradient-text">PBI Expert Hub</span>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-[60] bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-[70] w-[300px] flex flex-col"
              style={{
                background: 'rgba(15, 15, 30, 0.98)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-pbi-muted hover:text-pbi-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 md:ml-[280px] pt-14 md:pt-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
