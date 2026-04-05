import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ExternalLink,
  Star,
  StarOff,
  Monitor,
  Users,
  Code,
  GraduationCap,
  Globe,
  Shield,
  Download,
  Sparkles,
  Database,
  BarChart3,
  FileText,
  Smartphone,
  Server,
  Zap,
  Palette,
  BookOpen,
  Video,
  Play,
  Layout,
  Eye,
  Lock,
  Activity,
  Settings,
  Filter,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Pricing = 'Free' | 'Paid' | 'Freemium'

type Category =
  | 'Microsoft Official'
  | 'Community Tools'
  | 'VS Code Extensions'
  | 'Learning Platforms'
  | 'Online Services'
  | 'Governance & Admin'

interface Tool {
  id: string
  name: string
  description: string
  category: Category
  pricing: Pricing
  url: string
  icon: React.ElementType
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const categoryMeta: Record<Category, { icon: React.ElementType; color: string }> = {
  'Microsoft Official': { icon: Monitor, color: 'bg-fabric/20 text-fabric' },
  'Community Tools': { icon: Users, color: 'bg-success/20 text-success' },
  'VS Code Extensions': { icon: Code, color: 'bg-purple-500/20 text-purple-400' },
  'Learning Platforms': { icon: GraduationCap, color: 'bg-primary/20 text-primary' },
  'Online Services': { icon: Globe, color: 'bg-info/20 text-info' },
  'Governance & Admin': { icon: Shield, color: 'bg-warning/20 text-warning' },
}

const pricingColors: Record<Pricing, string> = {
  Free: 'bg-success/20 text-success border-success/30',
  Paid: 'bg-danger/20 text-danger border-danger/30',
  Freemium: 'bg-warning/20 text-warning border-warning/30',
}

const tools: Tool[] = [
  // ---- Microsoft Official ----
  {
    id: 'pbi-desktop',
    name: 'Power BI Desktop',
    description:
      'Main report authoring tool for creating interactive dashboards and data models.',
    category: 'Microsoft Official',
    pricing: 'Free',
    url: 'https://powerbi.microsoft.com/desktop/',
    icon: BarChart3,
  },
  {
    id: 'report-builder',
    name: 'Power BI Report Builder',
    description:
      'Author pixel-perfect paginated reports for printing and PDF export.',
    category: 'Microsoft Official',
    pricing: 'Free',
    url: 'https://www.microsoft.com/download/details.aspx?id=58158',
    icon: FileText,
  },
  {
    id: 'pbi-mobile',
    name: 'Power BI Mobile',
    description:
      'View and interact with your Power BI content on iOS and Android devices.',
    category: 'Microsoft Official',
    pricing: 'Free',
    url: 'https://powerbi.microsoft.com/mobile/',
    icon: Smartphone,
  },
  {
    id: 'gateway',
    name: 'On-premises Data Gateway',
    description:
      'Bridge between on-premises data sources and Power BI / Fabric cloud services.',
    category: 'Microsoft Official',
    pricing: 'Free',
    url: 'https://powerbi.microsoft.com/gateway/',
    icon: Server,
  },
  {
    id: 'dax-studio-ms',
    name: 'DAX Studio',
    description:
      'The ultimate DAX query tool for writing, debugging, and performance-tuning DAX.',
    category: 'Microsoft Official',
    pricing: 'Free',
    url: 'https://daxstudio.org/',
    icon: Zap,
  },
  {
    id: 'tabular-editor-ms',
    name: 'Tabular Editor',
    description:
      'Professional model development tool for Analysis Services and Power BI datasets.',
    category: 'Microsoft Official',
    pricing: 'Freemium',
    url: 'https://tabulareditor.com/',
    icon: Database,
  },
  {
    id: 'alm-toolkit',
    name: 'ALM Toolkit',
    description:
      'Schema comparison and deployment tool for Power BI datasets and SSAS models.',
    category: 'Microsoft Official',
    pricing: 'Free',
    url: 'http://alm-toolkit.com/',
    icon: Settings,
  },
  {
    id: 'bism-normalizer',
    name: 'BISM Normalizer',
    description:
      'Visual Studio extension for schema diff and merge of tabular models.',
    category: 'Microsoft Official',
    pricing: 'Free',
    url: 'https://bism-normalizer.com/',
    icon: Filter,
  },

  // ---- Community Tools ----
  {
    id: 'dax-studio-community',
    name: 'DAX Studio',
    description:
      'Best-in-class DAX query editor with performance analyzer, server timings, and query plans.',
    category: 'Community Tools',
    pricing: 'Free',
    url: 'https://daxstudio.org/',
    icon: Zap,
  },
  {
    id: 'tabular-editor-2',
    name: 'Tabular Editor 2 (Free)',
    description:
      'Open-source tabular model editor with scripting, best practices analyzer, and CLI.',
    category: 'Community Tools',
    pricing: 'Free',
    url: 'https://tabulareditor.com/',
    icon: Database,
  },
  {
    id: 'tabular-editor-3',
    name: 'Tabular Editor 3 (Paid)',
    description:
      'Premium model editor with DAX debugger, diagram view, and IntelliSense.',
    category: 'Community Tools',
    pricing: 'Paid',
    url: 'https://tabulareditor.com/',
    icon: Database,
  },
  {
    id: 'bravo',
    name: 'Bravo for Power BI',
    description:
      'DAX formatting, auto date table generation, data export, and model analysis.',
    category: 'Community Tools',
    pricing: 'Free',
    url: 'https://bravo.bi/',
    icon: Sparkles,
  },
  {
    id: 'pbi-helper',
    name: 'Power BI Helper',
    description:
      'Automatically document your Power BI model with lineage and dependency analysis.',
    category: 'Community Tools',
    pricing: 'Free',
    url: 'https://radacad.com/power-bi-helper',
    icon: FileText,
  },
  {
    id: 'vertipaq-analyzer',
    name: 'VertiPaq Analyzer',
    description:
      'Analyze memory consumption, cardinality, and storage of your tabular model.',
    category: 'Community Tools',
    pricing: 'Free',
    url: 'https://www.sqlbi.com/tools/vertipaq-analyzer/',
    icon: Activity,
  },
  {
    id: 'pbi-sentinel',
    name: 'Power BI Sentinel',
    description:
      'Governance and monitoring platform for enterprise Power BI deployments.',
    category: 'Community Tools',
    pricing: 'Paid',
    url: 'https://powerbisentinel.com/',
    icon: Shield,
  },
  {
    id: 'pbi-tools',
    name: 'pbi-tools',
    description:
      'Source control for PBIX files — extract, compile, and diff Power BI projects.',
    category: 'Community Tools',
    pricing: 'Free',
    url: 'https://pbi.tools/',
    icon: Code,
  },
  {
    id: 'pbi-rest-api',
    name: 'Power BI REST API',
    description:
      'Automate workspace management, dataset refresh, and report embedding via REST.',
    category: 'Community Tools',
    pricing: 'Free',
    url: 'https://learn.microsoft.com/rest/api/power-bi/',
    icon: Globe,
  },

  // ---- VS Code Extensions ----
  {
    id: 'vsc-power-query',
    name: 'Power Query / M Language',
    description:
      'Syntax highlighting, IntelliSense, and formatting for M / Power Query scripts.',
    category: 'VS Code Extensions',
    pricing: 'Free',
    url: 'https://marketplace.visualstudio.com/items?itemName=PowerQuery.vscode-powerquery',
    icon: Code,
  },
  {
    id: 'vsc-dax',
    name: 'DAX Language Extension',
    description:
      'DAX syntax highlighting and snippets for VS Code.',
    category: 'VS Code Extensions',
    pricing: 'Free',
    url: 'https://marketplace.visualstudio.com/items?itemName=Meaxis.dax-language',
    icon: Code,
  },
  {
    id: 'vsc-fabric-notebooks',
    name: 'Fabric Notebooks Extension',
    description:
      'Author and manage Microsoft Fabric notebooks directly in VS Code.',
    category: 'VS Code Extensions',
    pricing: 'Free',
    url: 'https://marketplace.visualstudio.com/items?itemName=ms-fabric.fabric-notebooks',
    icon: BookOpen,
  },
  {
    id: 'vsc-tmdl',
    name: 'TMDL Extension',
    description:
      'Tabular Model Definition Language support with validation and IntelliSense.',
    category: 'VS Code Extensions',
    pricing: 'Free',
    url: 'https://marketplace.visualstudio.com/items?itemName=analysis-services.TMDL',
    icon: Layout,
  },

  // ---- Learning Platforms ----
  {
    id: 'ms-learn',
    name: 'Microsoft Learn (Power BI)',
    description:
      'Official free learning paths, modules, and certifications for Power BI.',
    category: 'Learning Platforms',
    pricing: 'Free',
    url: 'https://learn.microsoft.com/training/powerplatform/power-bi',
    icon: GraduationCap,
  },
  {
    id: 'sqlbi',
    name: 'SQLBI',
    description:
      'The DAX bible — in-depth articles, books, and video courses by Marco Russo & Alberto Ferrari.',
    category: 'Learning Platforms',
    pricing: 'Freemium',
    url: 'https://sqlbi.com/',
    icon: BookOpen,
  },
  {
    id: 'guy-in-a-cube',
    name: 'Guy in a Cube',
    description:
      'Weekly YouTube videos covering Power BI tips, tricks, and best practices.',
    category: 'Learning Platforms',
    pricing: 'Free',
    url: 'https://www.youtube.com/@GuyInACube',
    icon: Video,
  },
  {
    id: 'curbal',
    name: 'Curbal',
    description:
      'YouTube channel with Power BI tutorials, DAX Fridays, and Power Query tips.',
    category: 'Learning Platforms',
    pricing: 'Free',
    url: 'https://www.youtube.com/@CurbalEN',
    icon: Video,
  },
  {
    id: 'enterprise-dna',
    name: 'Enterprise DNA',
    description:
      'Comprehensive Power BI education platform with courses, forums, and challenges.',
    category: 'Learning Platforms',
    pricing: 'Freemium',
    url: 'https://enterprisedna.co/',
    icon: Play,
  },
  {
    id: 'pbi-tips',
    name: 'Power BI Tips',
    description:
      'Community site with themes, templates, and practical Power BI tips.',
    category: 'Learning Platforms',
    pricing: 'Free',
    url: 'https://powerbi.tips/',
    icon: Sparkles,
  },

  // ---- Online Services ----
  {
    id: 'pbi-service',
    name: 'Power BI Service',
    description:
      'Cloud-based platform to publish, share, and collaborate on Power BI content.',
    category: 'Online Services',
    pricing: 'Freemium',
    url: 'https://app.powerbi.com/',
    icon: Globe,
  },
  {
    id: 'ms-fabric',
    name: 'Microsoft Fabric',
    description:
      'Unified analytics platform combining data engineering, science, and BI.',
    category: 'Online Services',
    pricing: 'Paid',
    url: 'https://app.fabric.microsoft.com/',
    icon: Palette,
  },
  {
    id: 'dax-do',
    name: 'DAX.do',
    description:
      'Online DAX playground — write and test DAX queries instantly in your browser.',
    category: 'Online Services',
    pricing: 'Free',
    url: 'https://dax.do/',
    icon: Zap,
  },
  {
    id: 'dax-formatter',
    name: 'DAX Formatter',
    description:
      'Paste your DAX and get perfectly formatted code in one click.',
    category: 'Online Services',
    pricing: 'Free',
    url: 'https://www.daxformatter.com/',
    icon: Sparkles,
  },
  {
    id: 'dax-guide',
    name: 'DAX Guide',
    description:
      'Complete DAX function reference with examples, syntax, and related patterns.',
    category: 'Online Services',
    pricing: 'Free',
    url: 'https://dax.guide/',
    icon: BookOpen,
  },
  {
    id: 'dax-patterns',
    name: 'DAX Patterns',
    description:
      'Ready-to-use DAX patterns for common business calculations (YTD, ABC, budgets).',
    category: 'Online Services',
    pricing: 'Freemium',
    url: 'https://www.daxpatterns.com/',
    icon: FileText,
  },

  // ---- Governance & Admin ----
  {
    id: 'admin-portal',
    name: 'Power BI Admin Portal',
    description:
      'Manage tenant settings, usage metrics, and capacity configuration.',
    category: 'Governance & Admin',
    pricing: 'Free',
    url: 'https://app.powerbi.com/admin-portal',
    icon: Settings,
  },
  {
    id: 'purview',
    name: 'Microsoft Purview',
    description:
      'Data governance, cataloging, and sensitivity labeling for Power BI assets.',
    category: 'Governance & Admin',
    pricing: 'Freemium',
    url: 'https://purview.microsoft.com/',
    icon: Eye,
  },
  {
    id: 'azure-monitor-fabric',
    name: 'Azure Monitor for Fabric',
    description:
      'Monitor Fabric capacity performance, query durations, and throttling events.',
    category: 'Governance & Admin',
    pricing: 'Paid',
    url: 'https://learn.microsoft.com/fabric/admin/monitoring-hub',
    icon: Activity,
  },
  {
    id: 'scanner-api',
    name: 'Power BI Scanner API',
    description:
      'Programmatically scan your tenant for dataset metadata, lineage, and endorsement.',
    category: 'Governance & Admin',
    pricing: 'Free',
    url: 'https://learn.microsoft.com/power-bi/enterprise/service-admin-metadata-scanning',
    icon: Lock,
  },
  {
    id: 'capacity-metrics',
    name: 'Fabric Capacity Metrics App',
    description:
      'Pre-built app to monitor capacity utilization, overloads, and throttling.',
    category: 'Governance & Admin',
    pricing: 'Free',
    url: 'https://appsource.microsoft.com/product/power-bi/pbi_pcmm.microsoftpremiumfabricpreviewreport',
    icon: BarChart3,
  },
]

const categories: Category[] = [
  'Microsoft Official',
  'Community Tools',
  'VS Code Extensions',
  'Learning Platforms',
  'Online Services',
  'Governance & Admin',
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const FAVORITES_KEY = 'pbi-tools-favorites'

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveFavorites(favs: Set<string>) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favs]))
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ToolsDownloads() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = tools.filter((t) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    const matchesCategory =
      activeCategory === 'All' || t.category === activeCategory
    const matchesFav = !showFavoritesOnly || favorites.has(t.id)
    return matchesSearch && matchesCategory && matchesFav
  })

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto pt-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold gradient-text mb-3">
          <Download className="inline-block w-9 h-9 mr-3 -mt-1" />
          Outils &amp; Ressources Power BI
        </h1>
        <p className="text-pbi-muted text-lg max-w-2xl mx-auto">
          Tous les outils essentiels pour Power BI et Microsoft Fabric :
          logiciels, extensions, formations et services en ligne.
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-4 items-center"
      >
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pbi-muted" />
          <input
            type="text"
            placeholder="Rechercher un outil..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-pbi-darker border border-pbi-border rounded-lg pl-10 pr-4 py-2.5 text-pbi-text placeholder:text-pbi-muted focus:outline-none focus:border-fabric transition-colors"
          />
        </div>

        {/* Favorites toggle */}
        <button
          onClick={() => setShowFavoritesOnly((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all whitespace-nowrap ${
            showFavoritesOnly
              ? 'bg-primary/20 border-primary/40 text-primary'
              : 'bg-pbi-darker border-pbi-border text-pbi-muted hover:text-pbi-text'
          }`}
        >
          <Star className="w-4 h-4" />
          Favoris
        </button>
      </motion.div>

      {/* Category pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === 'All'
              ? 'bg-fabric text-white'
              : 'bg-pbi-card border border-pbi-border text-pbi-muted hover:text-pbi-text hover:border-fabric/50'
          }`}
        >
          Tous ({tools.length})
        </button>
        {categories.map((cat) => {
          const meta = categoryMeta[cat]
          const Icon = meta.icon
          const count = tools.filter((t) => t.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-fabric text-white'
                  : 'bg-pbi-card border border-pbi-border text-pbi-muted hover:text-pbi-text hover:border-fabric/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat} ({count})
            </button>
          )
        })}
      </motion.div>

      {/* Results count */}
      <p className="text-pbi-muted text-sm mb-4">
        {filtered.length} outil{filtered.length !== 1 ? 's' : ''} trouv
        {filtered.length !== 1 ? 'es' : 'e'}
      </p>

      {/* Tool cards grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((tool, i) => {
            const Icon = tool.icon
            const catMeta = categoryMeta[tool.category]
            const CatIcon = catMeta.icon
            const isFav = favorites.has(tool.id)

            return (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
                className="glass-card p-5 flex flex-col gap-3 hover:border-fabric/40 transition-all group"
              >
                {/* Top row: icon + name + fav */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-pbi-darker flex items-center justify-center text-fabric">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-pbi-text truncate">
                      {tool.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleFavorite(tool.id)}
                    className="shrink-0 p-1 rounded hover:bg-pbi-card-hover transition-colors"
                    title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    {isFav ? (
                      <Star className="w-4 h-4 text-primary fill-primary" />
                    ) : (
                      <StarOff className="w-4 h-4 text-pbi-muted hover:text-primary" />
                    )}
                  </button>
                </div>

                {/* Description */}
                <p className="text-pbi-muted text-sm leading-relaxed flex-1">
                  {tool.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${catMeta.color}`}
                  >
                    <CatIcon className="w-3 h-3" />
                    {tool.category}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border ${pricingColors[tool.pricing]}`}
                  >
                    {tool.pricing}
                  </span>
                </div>

                {/* Link button */}
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-fabric/10 text-fabric text-sm font-medium hover:bg-fabric/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ouvrir
                </a>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Search className="w-12 h-12 text-pbi-muted mx-auto mb-4 opacity-40" />
          <p className="text-pbi-muted text-lg">Aucun outil ne correspond a votre recherche.</p>
          <button
            onClick={() => {
              setSearch('')
              setActiveCategory('All')
              setShowFavoritesOnly(false)
            }}
            className="mt-4 text-fabric hover:underline text-sm"
          >
            Reinitialiser les filtres
          </button>
        </motion.div>
      )}
    </div>
  )
}
