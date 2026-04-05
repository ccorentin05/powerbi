import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Video,
  Globe,
  Users,
  Award,
  BookOpen,
  Newspaper,
  Search,
  ExternalLink,
  Heart,
  Star,
  Filter,
  X,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category =
  | 'youtube'
  | 'blog'
  | 'community'
  | 'certification'
  | 'book'
  | 'newsletter'

type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'all'

interface Resource {
  id: string
  name: string
  author: string
  description: string
  category: Category
  difficulty: Difficulty
  url: string
}

/* ------------------------------------------------------------------ */
/*  Category config                                                    */
/* ------------------------------------------------------------------ */

const categoryConfig: Record<
  Category,
  { label: string; icon: typeof Video; color: string; bg: string }
> = {
  youtube: {
    label: 'YouTube',
    icon: Video,
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/30',
  },
  blog: {
    label: 'Blog / Website',
    icon: Globe,
    color: 'text-info',
    bg: 'bg-info/10 border-info/30',
  },
  community: {
    label: 'Community',
    icon: Users,
    color: 'text-success',
    bg: 'bg-success/10 border-success/30',
  },
  certification: {
    label: 'Certification',
    icon: Award,
    color: 'text-warning',
    bg: 'bg-warning/10 border-warning/30',
  },
  book: {
    label: 'Book',
    icon: BookOpen,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/30',
  },
  newsletter: {
    label: 'Newsletter / Podcast',
    icon: Newspaper,
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/30',
  },
}

const difficultyLabels: Record<Difficulty, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'text-success' },
  intermediate: { label: 'Intermediate', color: 'text-warning' },
  advanced: { label: 'Advanced', color: 'text-danger' },
  all: { label: 'All levels', color: 'text-info' },
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const resources: Resource[] = [
  // YouTube channels
  {
    id: 'yt-guy-in-a-cube',
    name: 'Guy in a Cube',
    author: 'Adam Saxton & Patrick LeBlanc',
    description:
      'Weekly news, tips, and how-tos covering Power BI, Fabric, and the broader Microsoft data platform.',
    category: 'youtube',
    difficulty: 'all',
    url: 'https://www.youtube.com/@GuyInACube',
  },
  {
    id: 'yt-sqlbi',
    name: 'SQLBI',
    author: 'Marco Russo & Alberto Ferrari',
    description:
      'Deep-dive content on advanced DAX patterns, data modeling best practices, and VertiPaq optimization.',
    category: 'youtube',
    difficulty: 'advanced',
    url: 'https://www.youtube.com/@SQLBI',
  },
  {
    id: 'yt-curbal',
    name: 'Curbal',
    author: 'Ruth Pozuelo',
    description:
      'Bite-sized Power BI tips, Power Query tricks, and creative visualization techniques.',
    category: 'youtube',
    difficulty: 'intermediate',
    url: 'https://www.youtube.com/@CurbalEN',
  },
  {
    id: 'yt-havens',
    name: 'Havens Consulting',
    author: 'Reid Havens',
    description:
      'Expert visualization and report design content focused on storytelling with data.',
    category: 'youtube',
    difficulty: 'intermediate',
    url: 'https://www.youtube.com/@HavensConsulting',
  },
  {
    id: 'yt-enterprise-dna',
    name: 'Enterprise DNA',
    author: 'Sam McKay',
    description:
      'Advanced analytics, complex DAX scenarios, and real-world business intelligence solutions.',
    category: 'youtube',
    difficulty: 'advanced',
    url: 'https://www.youtube.com/@EnterpriseDNA',
  },
  {
    id: 'yt-fernan',
    name: 'Fernan Espejo',
    author: 'Fernan Espejo',
    description:
      'Power BI development techniques, custom visuals, and advanced report building.',
    category: 'youtube',
    difficulty: 'advanced',
    url: 'https://www.youtube.com/@FernanEspejo',
  },
  {
    id: 'yt-pbi-tips',
    name: 'Power BI Tips',
    author: 'Mike Carlo & Seth Bauer',
    description:
      'Practical tips, tricks, and community-driven content including the Hot Dog theme.',
    category: 'youtube',
    difficulty: 'intermediate',
    url: 'https://www.youtube.com/@PowerBITips',
  },
  {
    id: 'yt-pragmatic',
    name: 'Pragmatic Works',
    author: 'Pragmatic Works',
    description:
      'Structured training content spanning Power BI, Azure, SQL, and the full Microsoft data stack.',
    category: 'youtube',
    difficulty: 'beginner',
    url: 'https://www.youtube.com/@PragmaticWorks',
  },
  {
    id: 'yt-bi-elite',
    name: 'BI Elite',
    author: 'Dustin Ryan',
    description:
      'Advanced Power BI topics including enterprise deployment, governance, and administration.',
    category: 'youtube',
    difficulty: 'advanced',
    url: 'https://www.youtube.com/@BIElite',
  },
  {
    id: 'yt-how-to-pbi',
    name: 'How to Power BI',
    author: 'Bas Dohmen',
    description:
      'Step-by-step tutorials perfect for beginners learning Power BI from scratch.',
    category: 'youtube',
    difficulty: 'beginner',
    url: 'https://www.youtube.com/@HowtoPowerBI',
  },
  {
    id: 'yt-avi-singh',
    name: 'Avi Singh',
    author: 'Avi Singh',
    description:
      'Power BI, Power Apps, and Power Platform content bridging analytics and app development.',
    category: 'youtube',
    difficulty: 'intermediate',
    url: 'https://www.youtube.com/@AviSingh',
  },
  {
    id: 'yt-leila',
    name: 'Leila Gharani',
    author: 'Leila Gharani',
    description:
      'Excel and Power BI tutorials with a focus on accessibility and clear explanations.',
    category: 'youtube',
    difficulty: 'beginner',
    url: 'https://www.youtube.com/@LeilaGharani',
  },
  {
    id: 'yt-kevin',
    name: 'Solutions Abroad',
    author: 'Kevin Stratvert',
    description:
      'Clear, well-produced tutorials on Power BI, Microsoft 365, and productivity tools.',
    category: 'youtube',
    difficulty: 'beginner',
    url: 'https://www.youtube.com/@KevinStratvert',
  },

  // Blogs & Websites
  {
    id: 'blog-sqlbi',
    name: 'SQLBI.com',
    author: 'Marco Russo & Alberto Ferrari',
    description:
      'The gold standard for DAX content. In-depth articles, whitepapers, and the DAX Guide reference.',
    category: 'blog',
    difficulty: 'advanced',
    url: 'https://www.sqlbi.com',
  },
  {
    id: 'blog-chris-webb',
    name: "Chris Webb's BI Blog",
    author: 'Chris Webb',
    description:
      'The go-to resource for Power Query / M language expertise and advanced data transformation.',
    category: 'blog',
    difficulty: 'advanced',
    url: 'https://blog.crossjoin.co.uk',
  },
  {
    id: 'blog-radacad',
    name: 'Radacad.com',
    author: 'Reza Rad',
    description:
      'End-to-end Power BI tutorials from data ingestion to report publishing with real-world scenarios.',
    category: 'blog',
    difficulty: 'intermediate',
    url: 'https://radacad.com',
  },
  {
    id: 'blog-data-mozart',
    name: 'Data Mozart',
    author: 'Nikola Ilic',
    description:
      'Best practices, performance optimization, and thoughtful Power BI development guidance.',
    category: 'blog',
    difficulty: 'intermediate',
    url: 'https://data-mozart.com',
  },
  {
    id: 'blog-pbi-official',
    name: 'Power BI Blog',
    author: 'Microsoft',
    description:
      'Official Microsoft blog for Power BI announcements, feature releases, and roadmap updates.',
    category: 'blog',
    difficulty: 'all',
    url: 'https://powerbi.microsoft.com/blog/',
  },
  {
    id: 'blog-fabric-official',
    name: 'Fabric Blog',
    author: 'Microsoft',
    description:
      'Official Microsoft Fabric blog covering new features, architecture guidance, and ecosystem news.',
    category: 'blog',
    difficulty: 'all',
    url: 'https://blog.fabric.microsoft.com',
  },
  {
    id: 'blog-fourmoo',
    name: 'FourMoo',
    author: 'Gilbert Quevauvilliers',
    description:
      'Practical tips and real-world Power BI solutions from an experienced consultant.',
    category: 'blog',
    difficulty: 'intermediate',
    url: 'https://fourmoo.com',
  },
  {
    id: 'blog-dataveld',
    name: 'DataVeld',
    author: 'David Eldersveld',
    description:
      'Power BI development, REST API, and automation-focused content for technical users.',
    category: 'blog',
    difficulty: 'advanced',
    url: 'https://dataveld.com',
  },
  {
    id: 'blog-pbi-gorilla',
    name: 'Power BI Gorilla',
    author: 'Power BI Gorilla',
    description:
      'Quick tips, tricks, and solutions for common Power BI challenges.',
    category: 'blog',
    difficulty: 'beginner',
    url: 'https://powerbigorilla.com',
  },
  {
    id: 'blog-bi-gorilla',
    name: 'BI Gorilla',
    author: 'Rick de Groot',
    description:
      'Comprehensive Power Query function reference and M language tutorials.',
    category: 'blog',
    difficulty: 'intermediate',
    url: 'https://gorilla.bi',
  },

  // Community & Forums
  {
    id: 'comm-forum',
    name: 'Power BI Community Forum',
    author: 'Microsoft',
    description:
      'The official Microsoft community forum for Q&A, idea submissions, and peer support.',
    category: 'community',
    difficulty: 'all',
    url: 'https://community.powerbi.com',
  },
  {
    id: 'comm-reddit',
    name: 'Reddit r/PowerBI',
    author: 'Reddit Community',
    description:
      'Active subreddit for discussions, troubleshooting, showcases, and career advice.',
    category: 'community',
    difficulty: 'all',
    url: 'https://www.reddit.com/r/PowerBI/',
  },
  {
    id: 'comm-twitter',
    name: 'Twitter/X #PowerBI',
    author: 'X Community',
    description:
      'Follow #PowerBI and #MicrosoftFabric for real-time news, tips, and community engagement.',
    category: 'community',
    difficulty: 'all',
    url: 'https://twitter.com/hashtag/PowerBI',
  },
  {
    id: 'comm-linkedin',
    name: 'LinkedIn Power BI Groups',
    author: 'LinkedIn Community',
    description:
      'Professional networking groups for Power BI practitioners, job postings, and thought leadership.',
    category: 'community',
    difficulty: 'all',
    url: 'https://www.linkedin.com/groups/5096169/',
  },
  {
    id: 'comm-user-groups',
    name: 'Power BI User Groups',
    author: 'Microsoft',
    description:
      'Find local and virtual Power BI user group meetups to learn and network with peers.',
    category: 'community',
    difficulty: 'all',
    url: 'https://community.fabric.microsoft.com/t5/Power-BI-User-Groups/ct-p/pbi_usergroups',
  },
  {
    id: 'comm-fabric',
    name: 'Microsoft Fabric Community',
    author: 'Microsoft',
    description:
      'The central hub for Fabric discussions, forums, events, and learning resources.',
    category: 'community',
    difficulty: 'all',
    url: 'https://community.fabric.microsoft.com',
  },

  // Certifications & Training
  {
    id: 'cert-pl300',
    name: 'PL-300: Power BI Data Analyst',
    author: 'Microsoft',
    description:
      'The core certification for Power BI professionals. Covers data preparation, modeling, visualization, and deployment.',
    category: 'certification',
    difficulty: 'intermediate',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/power-bi-data-analyst-associate/',
  },
  {
    id: 'cert-dp600',
    name: 'DP-600: Fabric Analytics Engineer',
    author: 'Microsoft',
    description:
      'Validates expertise in implementing and managing enterprise-scale analytics solutions with Microsoft Fabric.',
    category: 'certification',
    difficulty: 'advanced',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/fabric-analytics-engineer-associate/',
  },
  {
    id: 'cert-dp700',
    name: 'DP-700: Fabric Data Engineer',
    author: 'Microsoft',
    description:
      'Upcoming certification focusing on data engineering workloads within Microsoft Fabric.',
    category: 'certification',
    difficulty: 'advanced',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/',
  },
  {
    id: 'cert-ms-learn',
    name: 'Microsoft Learn Free Paths',
    author: 'Microsoft',
    description:
      'Free, structured learning paths for Power BI and Fabric with hands-on labs and sandbox environments.',
    category: 'certification',
    difficulty: 'beginner',
    url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi',
  },
  {
    id: 'cert-sqlbi-courses',
    name: 'SQLBI Courses',
    author: 'Marco Russo & Alberto Ferrari',
    description:
      'Premium courses including Mastering DAX and Optimizing DAX — the definitive advanced DAX training.',
    category: 'certification',
    difficulty: 'advanced',
    url: 'https://www.sqlbi.com/training/',
  },

  // Books
  {
    id: 'book-definitive-dax',
    name: 'The Definitive Guide to DAX',
    author: 'Marco Russo & Alberto Ferrari',
    description:
      'The comprehensive reference for DAX. Covers every function, evaluation context, and advanced pattern in depth.',
    category: 'book',
    difficulty: 'advanced',
    url: 'https://www.sqlbi.com/books/the-definitive-guide-to-dax/',
  },
  {
    id: 'book-analyzing-data',
    name: 'Analyzing Data with Power BI and Power Pivot',
    author: 'Alberto Ferrari & Marco Russo',
    description:
      'A practical guide to data analysis using the tabular model, Power Pivot, and Power BI.',
    category: 'book',
    difficulty: 'intermediate',
    url: 'https://www.sqlbi.com/books/analyzing-data-with-microsoft-power-bi-and-power-pivot/',
  },
  {
    id: 'book-power-query',
    name: 'Collect, Combine & Transform Data Using Power Query',
    author: 'Gil Raviv',
    description:
      'The essential guide to Power Query for data preparation, ETL, and data transformation.',
    category: 'book',
    difficulty: 'intermediate',
    url: 'https://www.amazon.com/Collect-Combine-Transform-Using-Power/dp/1509307958',
  },
  {
    id: 'book-cookbook',
    name: 'Power BI Cookbook',
    author: 'Brett Powell',
    description:
      'Practical recipes for common Power BI challenges including modeling, DAX, and administration.',
    category: 'book',
    difficulty: 'intermediate',
    url: 'https://www.amazon.com/Microsoft-Power-Cookbook-expertise-hands/dp/1801813043',
  },
  {
    id: 'book-dax-patterns',
    name: 'DAX Patterns',
    author: 'Marco Russo & Alberto Ferrari',
    description:
      'Ready-to-use DAX patterns for time intelligence, segmentation, budget allocation, and more.',
    category: 'book',
    difficulty: 'advanced',
    url: 'https://www.daxpatterns.com',
  },

  // Newsletters & Podcasts
  {
    id: 'nl-pbi-weekly',
    name: 'Power BI Weekly',
    author: 'Power BI Weekly Team',
    description:
      'A curated weekly newsletter with the best Power BI articles, updates, and community highlights.',
    category: 'newsletter',
    difficulty: 'all',
    url: 'https://powerbiweekly.info',
  },
  {
    id: 'nl-raw-data',
    name: 'Raw Data by P3 Adaptive',
    author: 'P3 Adaptive (Rob Collie)',
    description:
      'Podcast exploring real-world data analytics stories, Power BI use cases, and industry insights.',
    category: 'newsletter',
    difficulty: 'intermediate',
    url: 'https://p3adaptive.com/rawdatapodcast',
  },
  {
    id: 'nl-bifocal',
    name: 'BIFocal Podcast',
    author: 'BIFocal Team',
    description:
      'Conversations about Power BI, data culture, and the evolving Microsoft analytics ecosystem.',
    category: 'newsletter',
    difficulty: 'intermediate',
    url: 'https://bifocal.show',
  },
  {
    id: 'nl-fabric-friday',
    name: 'Fabric Friday',
    author: 'Fabric Community',
    description:
      'Weekly newsletter covering Microsoft Fabric updates, tutorials, and community contributions.',
    category: 'newsletter',
    difficulty: 'all',
    url: 'https://community.fabric.microsoft.com',
  },
]

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

function useFavorites() {
  const [favs, setFavs] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('pbi-resource-favs')
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    localStorage.setItem('pbi-resource-favs', JSON.stringify([...favs]))
  }, [favs])

  const toggle = (id: string) =>
    setFavs((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return { favs, toggle }
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Resource card                                                      */
/* ------------------------------------------------------------------ */

function ResourceCard({
  resource,
  index,
  isFav,
  onToggleFav,
}: {
  resource: Resource
  index: number
  isFav: boolean
  onToggleFav: () => void
}) {
  const cat = categoryConfig[resource.category]
  const diff = difficultyLabels[resource.difficulty]
  const Icon = cat.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="glass-card group relative flex flex-col p-5 transition-all duration-300 hover:scale-[1.02] hover:border-pbi-muted/40"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border ${cat.bg}`}
        >
          <Icon className={`w-5 h-5 ${cat.color}`} />
        </div>
        <button
          onClick={onToggleFav}
          className="flex-shrink-0 p-1.5 rounded-lg transition-colors hover:bg-pbi-card-hover"
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav
                ? 'fill-danger text-danger'
                : 'text-pbi-muted hover:text-danger'
            }`}
          />
        </button>
      </div>

      {/* Title & author */}
      <h3 className="text-pbi-text font-semibold text-[15px] leading-snug mb-1">
        {resource.name}
      </h3>
      <p className="text-pbi-muted text-xs mb-2">{resource.author}</p>

      {/* Description */}
      <p className="text-pbi-muted text-sm leading-relaxed mb-4 flex-1">
        {resource.description}
      </p>

      {/* Badges */}
      <div className="flex items-center flex-wrap gap-2 mb-4">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${cat.bg} ${cat.color}`}
        >
          {cat.label}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-pbi-border text-[11px] font-medium">
          <Star className={`w-3 h-3 ${diff.color}`} />
          <span className={diff.color}>{diff.label}</span>
        </span>
      </div>

      {/* Link */}
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pbi-card-hover border border-pbi-border text-sm font-medium text-pbi-text transition-all hover:border-fabric hover:text-fabric w-fit"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Visit resource
      </a>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function Resources() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'all'>(
    'all'
  )
  const [showFavsOnly, setShowFavsOnly] = useState(false)
  const { favs, toggle } = useFavorites()

  const allCategories: (Category | 'all')[] = [
    'all',
    'youtube',
    'blog',
    'community',
    'certification',
    'book',
    'newsletter',
  ]

  const allDifficulties: (Difficulty | 'all')[] = [
    'all',
    'beginner',
    'intermediate',
    'advanced',
  ]

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return resources.filter((r) => {
      if (showFavsOnly && !favs.has(r.id)) return false
      if (activeCategory !== 'all' && r.category !== activeCategory)
        return false
      if (
        activeDifficulty !== 'all' &&
        r.difficulty !== activeDifficulty &&
        r.difficulty !== 'all'
      )
        return false
      if (
        q &&
        !r.name.toLowerCase().includes(q) &&
        !r.author.toLowerCase().includes(q) &&
        !r.description.toLowerCase().includes(q)
      )
        return false
      return true
    })
  }, [search, activeCategory, activeDifficulty, showFavsOnly, favs])

  const hasActiveFilters =
    search !== '' ||
    activeCategory !== 'all' ||
    activeDifficulty !== 'all' ||
    showFavsOnly

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <Section>
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gradient-text">Resources</span>
          </motion.h1>
          <motion.p
            className="text-pbi-muted text-lg max-w-2xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            A curated directory of the best Power BI and Microsoft Fabric
            learning resources — channels, blogs, books, certifications, and
            community.
          </motion.p>
        </div>
      </Section>

      {/* Search & Filters */}
      <Section delay={0.1}>
        <div className="max-w-6xl mx-auto px-6 mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pbi-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-pbi-card border border-pbi-border text-pbi-text text-sm placeholder:text-pbi-muted focus:outline-none focus:border-fabric transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pbi-muted hover:text-pbi-text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-pbi-muted mr-1" />
            {allCategories.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isActive
                      ? 'bg-fabric/20 border-fabric text-fabric'
                      : 'bg-pbi-card border-pbi-border text-pbi-muted hover:text-pbi-text hover:border-pbi-muted'
                  }`}
                >
                  {cat === 'all'
                    ? 'All categories'
                    : categoryConfig[cat].label}
                </button>
              )
            })}
          </div>

          {/* Difficulty filter */}
          <div className="flex flex-wrap items-center gap-2">
            <Star className="w-4 h-4 text-pbi-muted mr-1" />
            {allDifficulties.map((d) => {
              const isActive = activeDifficulty === d
              return (
                <button
                  key={d}
                  onClick={() => setActiveDifficulty(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isActive
                      ? 'bg-fabric/20 border-fabric text-fabric'
                      : 'bg-pbi-card border-pbi-border text-pbi-muted hover:text-pbi-text hover:border-pbi-muted'
                  }`}
                >
                  {d === 'all'
                    ? 'All levels'
                    : difficultyLabels[d].label}
                </button>
              )
            })}

            {/* Favorites toggle */}
            <button
              onClick={() => setShowFavsOnly((v) => !v)}
              className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all inline-flex items-center gap-1.5 ${
                showFavsOnly
                  ? 'bg-danger/20 border-danger text-danger'
                  : 'bg-pbi-card border-pbi-border text-pbi-muted hover:text-pbi-text hover:border-pbi-muted'
              }`}
            >
              <Heart
                className={`w-3 h-3 ${showFavsOnly ? 'fill-danger' : ''}`}
              />
              Favorites
            </button>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearch('')
                  setActiveCategory('all')
                  setActiveDifficulty('all')
                  setShowFavsOnly(false)
                }}
                className="ml-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-pbi-border text-pbi-muted hover:text-pbi-text hover:border-pbi-muted transition-all"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* Results count */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <p className="text-pbi-muted text-sm">
          {filtered.length} resource{filtered.length !== 1 ? 's' : ''} found
          {showFavsOnly && ` (favorites only)`}
        </p>
      </div>

      {/* Resource grid */}
      <div className="max-w-6xl mx-auto px-6">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((r, i) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  index={i}
                  isFav={favs.has(r.id)}
                  onToggleFav={() => toggle(r.id)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <Search className="w-10 h-10 text-pbi-muted mx-auto mb-4 opacity-50" />
              <p className="text-pbi-muted text-lg font-medium mb-2">
                No resources match your filters
              </p>
              <p className="text-pbi-muted text-sm">
                Try adjusting your search or clearing the filters.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
