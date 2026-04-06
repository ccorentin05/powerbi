import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
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
  },
  {
    id: 'outils',
    label: 'Outils',
    icon: Wrench,
    items: [
      { path: '/simulator', label: 'Simulateur Fabric', icon: Calculator, description: 'Simuler les couts Fabric' },
      { path: '/licenses', label: 'Comparateur Licences', icon: CreditCard, description: 'Comparer les licences Power BI' },
      { path: '/roi', label: 'Calculateur ROI', icon: TrendingUp, description: 'Calculer le retour sur investissement' },
      { path: '/formatter', label: 'Formateur DAX/M', icon: AlignLeft, description: 'Formater du code DAX et M' },
      { path: '/performance', label: 'Checklist Performance', icon: Zap, description: "Checklist d'optimisation des performances" },
    ],
  },
  {
    id: 'apprendre',
    label: 'Apprendre',
    icon: BookOpen,
    items: [
      { path: '/dax', label: 'Reference DAX', icon: Code2, description: 'Fonctions et patterns DAX' },
      { path: '/fiches', label: 'Fiches Techniques', icon: BookOpen, description: 'Fiches de reference rapide' },
      { path: '/exercises', label: 'Exercices', icon: PenTool, description: 'Exercices pour pratiquer' },
      { path: '/certifications', label: 'Certifications', icon: Award, description: 'Preparer les certifications Microsoft' },
    ],
  },
  {
    id: 'fabric',
    label: 'Fabric',
    icon: Cloud,
    items: [
      { path: '/fabric', label: 'Plongee Fabric', icon: Cloud, description: 'Guide approfondi Microsoft Fabric' },
      { path: '/architecture', label: 'Patterns Architecture', icon: Network, description: "Patterns d'architecture Fabric" },
      { path: '/sharing', label: 'Partage & Acces', icon: Share2, description: "Gestion du partage et de l'acces" },
    ],
  },
  {
    id: 'dev',
    label: 'Developpeur',
    icon: Plug,
    items: [
      { path: '/api', label: 'Reference API', icon: Plug, description: 'Documentation des APIs Power BI' },
      { path: '/notebooks', label: 'Templates Notebook', icon: FileCode, description: 'Templates de notebooks Fabric' },
      { path: '/cicd', label: 'Pipelines CI/CD', icon: GitBranch, description: 'Pipelines CI/CD pour Power BI' },
    ],
  },
  {
    id: 'news',
    label: 'Actualites',
    icon: Newspaper,
    items: [
      { path: '/ai', label: 'IA & Power BI', icon: Bot, description: 'Intelligence artificielle et Power BI' },
      { path: '/tools', label: 'Outils & Telechargements', icon: Download, description: 'Outils et ressources a telecharger' },
      { path: '/whatsnew', label: 'Quoi de neuf', icon: Sparkles, description: 'Dernieres nouveautes Power BI' },
      { path: '/roadmap', label: 'Roadmap', icon: Map, description: 'Feuille de route Microsoft' },
      { path: '/resources', label: 'Ressources', icon: GraduationCap, description: 'Liens et ressources utiles' },
    ],
  },
]

// Flatten all pages for search
function getAllPages(): NavPage[] {
  const pages: NavPage[] = []
  for (const entry of navigation) {
    if (isCategory(entry)) {
      pages.push(...entry.items)
    } else {
      pages.push({ path: entry.path, label: entry.label, icon: entry.icon, description: '' })
    }
  }
  return pages
}

// --- Navbar Search ---

function NavbarSearch() {
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
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pbi-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Rechercher..."
          className="w-48 lg:w-64 pl-9 pr-16 py-1.5 rounded-lg text-sm bg-[var(--color-pbi-darker)] border border-[var(--color-pbi-border)] text-[var(--color-pbi-text)] placeholder-[var(--color-pbi-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/50 transition-all"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--color-pbi-muted)] bg-white px-1.5 py-0.5 rounded border border-[var(--color-pbi-border)] font-mono">
          Ctrl+K
        </span>
      </div>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white border border-[var(--color-pbi-border)] shadow-lg shadow-black/5 overflow-hidden z-50 max-h-80 overflow-y-auto">
          {results.map((page) => (
            <button
              key={page.path}
              onMouseDown={() => handleSelect(page.path)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-pbi-darker)] transition-colors text-left cursor-pointer"
            >
              <page.icon className="w-4 h-4 text-[var(--color-pbi-muted)] shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-[var(--color-pbi-text)] truncate">{page.label}</div>
                {page.description && (
                  <div className="text-xs text-[var(--color-pbi-muted)] truncate">{page.description}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// --- Dropdown for nav categories ---

function NavDropdown({
  category,
  currentPath,
  onNavigate,
}: {
  category: NavCategory
  currentPath: string
  onNavigate?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasActive = category.items.some((item) => item.path === currentPath)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          hasActive
            ? 'text-[var(--color-primary)]'
            : 'text-[var(--color-pbi-muted)] hover:text-[var(--color-pbi-text)] hover:bg-[var(--color-pbi-darker)]'
        }`}
      >
        {category.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`absolute left-0 top-full pt-1 z-50 transition-all duration-150 ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
        }`}
      >
        <div className="w-64 rounded-xl bg-white border border-[var(--color-pbi-border)] shadow-lg shadow-black/5 overflow-hidden py-1">
          {category.items.map((item) => {
            const isActive = currentPath === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  setIsOpen(false)
                  onNavigate?.()
                }}
                className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                    : 'text-[var(--color-pbi-text)] hover:bg-[var(--color-pbi-darker)]'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-pbi-muted)]'}`} />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  <div className={`text-xs truncate ${isActive ? 'text-[var(--color-primary)]/70' : 'text-[var(--color-pbi-muted)]'}`}>
                    {item.description}
                  </div>
                </div>
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// --- Mobile Menu ---

function MobileMenu({
  isOpen,
  onClose,
  currentPath,
}: {
  isOpen: boolean
  onClose: () => void
  currentPath: string
}) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const toggleCategory = useCallback((id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id))
  }, [])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-[57px] left-0 right-0 z-50 bg-white border-b border-[var(--color-pbi-border)] shadow-lg shadow-black/5 max-h-[calc(100vh-57px)] overflow-y-auto">
        <nav className="py-2 px-4">
          {navigation.map((entry) => {
            if (!isCategory(entry)) {
              const isActive = currentPath === entry.path
              return (
                <NavLink
                  key={entry.id}
                  to={entry.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/5'
                      : 'text-[var(--color-pbi-text)] hover:bg-[var(--color-pbi-darker)]'
                  }`}
                >
                  <entry.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{entry.label}</span>
                </NavLink>
              )
            }

            const category = entry
            const isExpanded = expandedCategory === category.id
            const hasActive = category.items.some((item) => item.path === currentPath)

            return (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors cursor-pointer ${
                    hasActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-pbi-text)]'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span className="text-sm font-medium flex-1 text-left">{category.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="ml-5 pl-3 border-l-2 border-[var(--color-pbi-border)] py-1">
                    {category.items.map((item) => {
                      const isActive = currentPath === item.path
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            isActive
                              ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/5'
                              : 'text-[var(--color-pbi-muted)] hover:text-[var(--color-pbi-text)] hover:bg-[var(--color-pbi-darker)]'
                          }`}
                        >
                          <item.icon className="w-4 h-4 shrink-0" />
                          <span className="text-sm">{item.label}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </nav>
      </div>
    </>
  )
}

// --- Main Layout ---

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[var(--color-pbi-darker)]">
      {/* Top Navbar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--color-pbi-border)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-primary)]/10">
                  <BarChart3 className="w-4.5 h-4.5 text-[var(--color-primary)]" />
                </div>
                <span className="font-bold text-[var(--color-pbi-text)] text-base hidden sm:block">
                  Power BI & Fabric
                </span>
              </NavLink>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-0.5">
                {navigation.map((entry) =>
                  isCategory(entry) ? (
                    <NavDropdown
                      key={entry.id}
                      category={entry}
                      currentPath={currentPath}
                    />
                  ) : (
                    <NavLink
                      key={entry.id}
                      to={entry.path}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPath === entry.path
                          ? 'text-[var(--color-primary)]'
                          : 'text-[var(--color-pbi-muted)] hover:text-[var(--color-pbi-text)] hover:bg-[var(--color-pbi-darker)]'
                      }`}
                    >
                      {entry.label}
                    </NavLink>
                  )
                )}
              </nav>
            </div>

            {/* Right: Search + Mobile toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <NavbarSearch />
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="lg:hidden p-2 -mr-2 rounded-lg text-[var(--color-pbi-muted)] hover:text-[var(--color-pbi-text)] hover:bg-[var(--color-pbi-darker)] transition-colors cursor-pointer"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} currentPath={currentPath} />

      {/* Main Content */}
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
