import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  Globe,
  Zap,
  Calendar,
  Calculator,
  Play,
  Star,
  AlertCircle,
  Info,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SkillDomain {
  name: string
  weight: string
  topics: string[]
}

interface Certification {
  id: string
  code: string
  title: string
  level: string
  price: string
  duration: string
  questions: string
  passingScore: string
  languages: string[]
  skills: SkillDomain[]
  resources: string[]
  tips: string[]
  renewal: string
  prerequisites: string
  status: 'available' | 'coming'
  color: string
  learnPath: string
  registrationUrl: string
}

interface Lab {
  title: string
  duration: string
  description: string
  url: string
}

interface StudyWeek {
  week: number
  title: string
  topics: string[]
  resources: string[]
  practice: boolean
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const certifications: Certification[] = [
  {
    id: 'pl-300',
    code: 'PL-300',
    title: 'Microsoft Power BI Data Analyst',
    level: 'Associate',
    price: '165\u20AC',
    duration: '120 minutes',
    questions: '40-60 questions',
    passingScore: '700/1000',
    languages: [
      'English', 'Japanese', 'Chinese (Simplified)', 'Chinese (Traditional)',
      'Korean', 'French', 'German', 'Spanish', 'Portuguese (Brazil)',
      'Indonesian', 'Arabic', 'Italian', 'Russian',
    ],
    skills: [
      {
        name: 'Pr\u00E9parer les donn\u00E9es',
        weight: '25-30%',
        topics: [
          'R\u00E9cup\u00E9rer des donn\u00E9es depuis diff\u00E9rentes sources',
          'Nettoyer et transformer les donn\u00E9es avec Power Query',
          'Concevoir un mod\u00E8le de donn\u00E9es (sch\u00E9ma en \u00E9toile)',
          'Profiler les donn\u00E9es pour d\u00E9tecter les anomalies',
        ],
      },
      {
        name: 'Mod\u00E9liser les donn\u00E9es',
        weight: '25-30%',
        topics: [
          'Concevoir et impl\u00E9menter un mod\u00E8le de donn\u00E9es',
          'Cr\u00E9er des mesures DAX et des colonnes calcul\u00E9es',
          'Optimiser les performances du mod\u00E8le',
          'G\u00E9rer les relations et la cardinalit\u00E9',
        ],
      },
      {
        name: 'Visualiser et analyser les donn\u00E9es',
        weight: '25-30%',
        topics: [
          'Cr\u00E9er des rapports et tableaux de bord',
          'Am\u00E9liorer les rapports avec des interactions',
          'Identifier les tendances et mod\u00E8les',
          'Utiliser les fonctions analytiques avanc\u00E9es',
        ],
      },
      {
        name: 'D\u00E9ployer et maintenir',
        weight: '15-20%',
        topics: [
          'G\u00E9rer les espaces de travail et les acc\u00E8s',
          'Configurer la s\u00E9curit\u00E9 au niveau des lignes (RLS)',
          'G\u00E9rer les actualisations de donn\u00E9es',
          'R\u00E9soudre les probl\u00E8mes de performance',
        ],
      },
    ],
    resources: [
      'Microsoft Learn \u2013 Parcours gratuit PL-300',
      'Exam Sandbox (simulation gratuite)',
      'Practice Assessment sur Microsoft Learn',
      'DAX Studio pour pratiquer le DAX',
      'SQLBI.com \u2013 Articles et vid\u00E9os DAX',
      'Guy in a Cube \u2013 Cha\u00EEne YouTube',
    ],
    tips: [
      'Concentrez-vous sur le DAX et la mod\u00E9lisation de donn\u00E9es \u2013 50-60% de l\u0027examen',
      'Pratiquez avec DAX Studio et Tabular Editor',
      'Ma\u00EEtrisez le sch\u00E9ma en \u00E9toile et les relations',
      'Faites le Practice Assessment au moins 3 fois',
      'Lisez attentivement les \u00E9tudes de cas (case studies)',
      'G\u00E9rez votre temps : ~2 min par question',
    ],
    renewal: 'Renouvellement gratuit en ligne chaque ann\u00E9e via Microsoft Learn',
    prerequisites: 'Aucun pr\u00E9requis officiel, mais exp\u00E9rience Power BI recommand\u00E9e',
    status: 'available',
    color: '#f2c811',
    learnPath: 'https://learn.microsoft.com/en-us/credentials/certifications/power-bi-data-analyst-associate/',
    registrationUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/power-bi-data-analyst-associate/',
  },
  {
    id: 'dp-600',
    code: 'DP-600',
    title: 'Microsoft Fabric Analytics Engineer Associate',
    level: 'Associate',
    price: '165\u20AC',
    duration: '120 minutes',
    questions: '40-60 questions',
    passingScore: '700/1000',
    languages: [
      'English', 'Japanese', 'Chinese (Simplified)', 'Korean',
      'French', 'German', 'Spanish', 'Portuguese (Brazil)',
    ],
    skills: [
      {
        name: 'Planifier et g\u00E9rer une solution',
        weight: '10-15%',
        topics: [
          'Planifier une solution analytique Fabric',
          'Impl\u00E9menter et g\u00E9rer un workspace',
          'G\u00E9rer le cycle de vie de la solution',
          'Configurer la s\u00E9curit\u00E9 et la gouvernance',
        ],
      },
      {
        name: 'Pr\u00E9parer et servir les donn\u00E9es',
        weight: '40-45%',
        topics: [
          'Cr\u00E9er et g\u00E9rer un Lakehouse',
          'Cr\u00E9er et g\u00E9rer un Warehouse',
          'Transformer les donn\u00E9es avec des notebooks',
          'Utiliser les Dataflows Gen2',
          'Configurer Direct Lake',
        ],
      },
      {
        name: 'Impl\u00E9menter les mod\u00E8les s\u00E9mantiques',
        weight: '20-25%',
        topics: [
          'Concevoir un mod\u00E8le s\u00E9mantique',
          'Cr\u00E9er des mesures DAX avanc\u00E9es',
          'Optimiser les performances du mod\u00E8le',
          'G\u00E9rer le mode Direct Lake',
        ],
      },
      {
        name: 'Explorer et analyser les donn\u00E9es',
        weight: '20-25%',
        topics: [
          'Explorer les donn\u00E9es avec SQL et notebooks',
          'Analyser avec les visuels Power BI',
          'Utiliser les KQL queries',
          'Configurer les alertes et monitoring',
        ],
      },
    ],
    resources: [
      'Microsoft Learn \u2013 Parcours DP-600',
      'Fabric Trial gratuit (60 jours)',
      'Fabric Community \u2013 Forums et blogs',
      'WillThompson YouTube \u2013 Fabric deep dives',
      'Microsoft Fabric documentation officielle',
      'Practice Assessment DP-600',
    ],
    tips: [
      'Obtenez un Fabric Trial et pratiquez activement',
      'Focus sur Lakehouse et Direct Lake (40-45% de l\u0027examen)',
      'Comprenez les diff\u00E9rences Lakehouse vs Warehouse',
      'Ma\u00EEtrisez les notebooks PySpark',
      'Connaissez les modes de connectivit\u00E9 (Import, DirectQuery, Direct Lake)',
      'Pr\u00E9requis: bonne connaissance de Power BI (PL-300 recommand\u00E9)',
    ],
    renewal: 'Renouvellement gratuit en ligne chaque ann\u00E9e via Microsoft Learn',
    prerequisites: 'Connaissance de Power BI + notions de base des workloads Fabric',
    status: 'available',
    color: '#0078d4',
    learnPath: 'https://learn.microsoft.com/en-us/credentials/certifications/fabric-analytics-engineer-associate/',
    registrationUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/fabric-analytics-engineer-associate/',
  },
  {
    id: 'dp-700',
    code: 'DP-700',
    title: 'Microsoft Fabric Data Engineer',
    level: 'Associate',
    price: '~165\u20AC (estim\u00E9)',
    duration: '120 minutes',
    questions: '40-60 questions (estim\u00E9)',
    passingScore: '700/1000',
    languages: ['English (initialement)', 'Autres langues \u00E0 venir'],
    skills: [
      {
        name: 'Ing\u00E9rer et transformer les donn\u00E9es',
        weight: '35-40%',
        topics: [
          'Cr\u00E9er des pipelines de donn\u00E9es',
          'Utiliser les notebooks Spark',
          'Configurer les dataflows',
          'G\u00E9rer l\u0027ing\u00E9tion en batch et streaming',
        ],
      },
      {
        name: 'Concevoir et impl\u00E9menter le stockage',
        weight: '25-30%',
        topics: [
          'Concevoir l\u0027architecture Lakehouse',
          'G\u00E9rer les fichiers Delta Lake',
          'Optimiser le stockage OneLake',
          'Configurer les raccourcis (shortcuts)',
        ],
      },
      {
        name: 'Orchestrer et monitorer',
        weight: '20-25%',
        topics: [
          'Orchestrer avec Data Factory',
          'Configurer les d\u00E9clencheurs et planifications',
          'Monitorer les pipelines',
          'G\u00E9rer les erreurs et les retries',
        ],
      },
      {
        name: 'S\u00E9curiser et gouverner',
        weight: '10-15%',
        topics: [
          'Configurer la s\u00E9curit\u00E9 des donn\u00E9es',
          'Impl\u00E9menter la gouvernance',
          'G\u00E9rer les acc\u00E8s et permissions',
          'Auditer les activit\u00E9s',
        ],
      },
    ],
    resources: [
      'Microsoft Learn \u2013 Parcours Data Engineering Fabric',
      'Documentation Microsoft Fabric',
      'Fabric Community',
      'Fabric Trial pour pratiquer',
    ],
    tips: [
      'Certification en cours de d\u00E9veloppement',
      'Commencez par DP-600 pour les fondamentaux Fabric',
      'Pratiquez avec les pipelines Data Factory dans Fabric',
      'Familiarisez-vous avec PySpark et Delta Lake',
    ],
    renewal: '\u00C0 confirmer',
    prerequisites: 'Exp\u00E9rience en data engineering, connaissance de Fabric recommand\u00E9e',
    status: 'coming',
    color: '#8b5cf6',
    learnPath: 'https://learn.microsoft.com/en-us/fabric/',
    registrationUrl: '#',
  },
]

const microsoftLearnLabs: Lab[] = [
  {
    title: 'Explorer les donn\u00E9es avec Power BI',
    duration: '~45 min',
    description:
      'Apprenez \u00E0 connecter des sources de donn\u00E9es, cr\u00E9er des visualisations et publier un rapport Power BI.',
    url: 'https://learn.microsoft.com/en-us/training/modules/explore-power-bi/',
  },
  {
    title: 'Cr\u00E9er un Lakehouse dans Fabric',
    duration: '~60 min',
    description:
      'Cr\u00E9ez votre premier Lakehouse, chargez des donn\u00E9es et explorez-les avec SQL et Spark.',
    url: 'https://learn.microsoft.com/en-us/training/modules/get-started-lakehouses/',
  },
  {
    title: 'Utiliser les notebooks dans Microsoft Fabric',
    duration: '~45 min',
    description:
      'Explorez les notebooks Spark pour transformer et analyser les donn\u00E9es dans Fabric.',
    url: 'https://learn.microsoft.com/en-us/training/modules/use-apache-spark-work-files-lakehouse/',
  },
  {
    title: 'D\u00E9marrer avec Real-Time Intelligence',
    duration: '~30 min',
    description:
      'D\u00E9couvrez le traitement en temps r\u00E9el avec Eventstream et les KQL databases.',
    url: 'https://learn.microsoft.com/en-us/training/modules/get-started-kusto-fabric/',
  },
  {
    title: 'Cr\u00E9er un Data Warehouse Fabric',
    duration: '~60 min',
    description:
      'Construisez un entrepot de donn\u00E9es avec T-SQL dans Microsoft Fabric.',
    url: 'https://learn.microsoft.com/en-us/training/modules/get-started-data-warehouse/',
  },
  {
    title: 'Cr\u00E9er un rapport dans Power BI Desktop',
    duration: '~90 min',
    description:
      'Lab complet : import de donn\u00E9es, mod\u00E9lisation, DAX et cr\u00E9ation de visuels interactifs.',
    url: 'https://learn.microsoft.com/en-us/training/modules/build-power-bi-visuals/',
  },
]

/* Study plan data */
type ExperienceLevel = 'beginner' | 'intermediate' | 'expert'
type CertTarget = 'pl-300' | 'dp-600'
type HoursPerWeek = 5 | 10 | 15 | 20

interface StudyPlan {
  totalWeeks: number
  weeks: StudyWeek[]
}

function generateStudyPlan(
  cert: CertTarget,
  level: ExperienceLevel,
  hours: HoursPerWeek,
): StudyPlan {
  const baseWeeks: Record<CertTarget, Record<ExperienceLevel, number>> = {
    'pl-300': { beginner: 12, intermediate: 8, expert: 4 },
    'dp-600': { beginner: 14, intermediate: 10, expert: 6 },
  }

  const speedFactor: Record<HoursPerWeek, number> = { 5: 1.5, 10: 1, 15: 0.75, 20: 0.6 }
  const totalWeeks = Math.ceil(baseWeeks[cert][level] * speedFactor[hours])

  const pl300Modules: StudyWeek[] = [
    {
      week: 1,
      title: 'Introduction & Power Query',
      topics: ['Interface Power BI Desktop', 'Connexion aux sources', 'Transformations de base'],
      resources: ['Microsoft Learn Module 1', 'Guy in a Cube: PQ basics'],
      practice: false,
    },
    {
      week: 2,
      title: 'Power Query Avanc\u00E9',
      topics: ['Fusion de requ\u00EAtes', 'Param\u00E8tres', 'Gestion des erreurs', 'M language basics'],
      resources: ['Microsoft Learn Module 2', 'Documentation Power Query M'],
      practice: false,
    },
    {
      week: 3,
      title: 'Mod\u00E9lisation de donn\u00E9es',
      topics: ['Sch\u00E9ma en \u00E9toile', 'Relations', 'Cardinalit\u00E9', 'Tables de dates'],
      resources: ['SQLBI: Star Schema guide', 'Microsoft Learn Module 3'],
      practice: false,
    },
    {
      week: 4,
      title: 'DAX Fondamentaux',
      topics: ['CALCULATE', 'FILTER', 'ALL/ALLEXCEPT', 'Contexte de filtre'],
      resources: ['SQLBI: Intro to DAX', 'DAX Guide', 'DAX Studio'],
      practice: true,
    },
    {
      week: 5,
      title: 'DAX Avanc\u00E9',
      topics: ['Time Intelligence', 'Variables', 'RANKX', 'Iterator functions'],
      resources: ['SQLBI: DAX Patterns', 'Practice with DAX Studio'],
      practice: true,
    },
    {
      week: 6,
      title: 'Visualisations',
      topics: ['Types de visuels', 'Interactions', 'Bookmarks', 'Drillthrough'],
      resources: ['Microsoft Learn Module 5', 'Power BI Best Practices'],
      practice: false,
    },
    {
      week: 7,
      title: 'D\u00E9ploiement & S\u00E9curit\u00E9',
      topics: ['Workspaces', 'RLS', 'Actualisations', 'Apps', 'Pipelines de d\u00E9ploiement'],
      resources: ['Microsoft Learn Module 6', 'Documentation Power BI Service'],
      practice: false,
    },
    {
      week: 8,
      title: 'R\u00E9vision & Examen blanc',
      topics: ['R\u00E9vision g\u00E9n\u00E9rale', 'Points faibles', 'Practice Assessment'],
      resources: ['Practice Assessment Microsoft', 'Exam Sandbox'],
      practice: true,
    },
  ]

  const dp600Modules: StudyWeek[] = [
    {
      week: 1,
      title: 'Introduction \u00E0 Fabric',
      topics: ['Architecture Fabric', 'OneLake', 'Workspaces', 'Capacit\u00E9s'],
      resources: ['Microsoft Learn: Get started with Fabric', 'Fabric Trial'],
      practice: false,
    },
    {
      week: 2,
      title: 'Lakehouse',
      topics: ['Cr\u00E9ation Lakehouse', 'Delta tables', 'Shortcuts', 'SQL Endpoint'],
      resources: ['Microsoft Learn: Lakehouse module', 'Fabric documentation'],
      practice: true,
    },
    {
      week: 3,
      title: 'Notebooks & Spark',
      topics: ['PySpark basics', 'Transformations', 'DataFrames', 'Spark SQL'],
      resources: ['Microsoft Learn: Notebooks module', 'PySpark documentation'],
      practice: true,
    },
    {
      week: 4,
      title: 'Data Warehouse',
      topics: ['Cr\u00E9ation Warehouse', 'T-SQL dans Fabric', 'Diff\u00E9rences avec Lakehouse'],
      resources: ['Microsoft Learn: Warehouse module', 'T-SQL reference'],
      practice: true,
    },
    {
      week: 5,
      title: 'Dataflows Gen2 & Pipelines',
      topics: ['Dataflows Gen2', 'Data Factory pipelines', 'Orchestration'],
      resources: ['Microsoft Learn: Dataflows module', 'Data Factory docs'],
      practice: false,
    },
    {
      week: 6,
      title: 'Mod\u00E8les s\u00E9mantiques & Direct Lake',
      topics: ['Mode Direct Lake', 'Mod\u00E8le s\u00E9mantique', 'DAX dans Fabric', 'Optimisation'],
      resources: ['Microsoft Learn: Semantic models', 'SQLBI: Direct Lake'],
      practice: true,
    },
    {
      week: 7,
      title: 'S\u00E9curit\u00E9 & Gouvernance',
      topics: ['RLS', 'OLS', 'Workspace roles', 'Data governance', 'Monitoring'],
      resources: ['Microsoft Learn: Security module', 'Fabric admin docs'],
      practice: false,
    },
    {
      week: 8,
      title: 'KQL & Real-Time Intelligence',
      topics: ['KQL Database', 'Eventstream', 'Real-Time dashboards'],
      resources: ['Microsoft Learn: KQL module', 'KQL quick reference'],
      practice: false,
    },
    {
      week: 9,
      title: 'Sc\u00E9narios int\u00E9gr\u00E9s',
      topics: ['Pipeline end-to-end', 'Lakehouse + Direct Lake + Report'],
      resources: ['Microsoft Learn: End-to-end tutorials'],
      practice: true,
    },
    {
      week: 10,
      title: 'R\u00E9vision & Examen blanc',
      topics: ['R\u00E9vision g\u00E9n\u00E9rale', 'Points faibles', 'Practice Assessment'],
      resources: ['Practice Assessment DP-600', 'Exam Sandbox'],
      practice: true,
    },
  ]

  const modules = cert === 'pl-300' ? pl300Modules : dp600Modules

  // Scale modules to fit totalWeeks
  const scaledWeeks: StudyWeek[] = []
  const ratio = totalWeeks / modules.length
  for (let i = 0; i < modules.length; i++) {
    scaledWeeks.push({
      ...modules[i],
      week: Math.round((i + 1) * ratio),
    })
  }

  return { totalWeeks, weeks: scaledWeeks }
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
} as any

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

/* ------------------------------------------------------------------ */
/*  Small components                                                   */
/* ------------------------------------------------------------------ */

function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon: typeof Award }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 mb-8"
    >
      <div
        className="p-3 rounded-xl"
        style={{ background: 'rgba(242,200,17,0.15)' }}
      >
        <Icon className="w-6 h-6" style={{ color: '#f2c811' }} />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1e293b' }}>
        {children}
      </h2>
    </motion.div>
  )
}

function LevelBadge({ level, color }: { level: string; color: string }) {
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {level}
    </span>
  )
}

function StatusBadge({ status }: { status: 'available' | 'coming' }) {
  const isAvailable = status === 'available'
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1"
      style={{
        background: isAvailable ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
        color: isAvailable ? '#10b981' : '#f59e0b',
        border: `1px solid ${isAvailable ? '#10b98144' : '#f59e0b44'}`,
      }}
    >
      {isAvailable ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <Clock className="w-3 h-3" />
      )}
      {isAvailable ? 'Disponible' : 'Bient\u00F4t'}
    </span>
  )
}

function ProgressBar({ weight, color }: { weight: string; color: string }) {
  const match = weight.match(/(\d+)-(\d+)/)
  const avg = match ? (parseInt(match[1]) + parseInt(match[2])) / 2 : 20
  return (
    <div className="w-full rounded-full h-2" style={{ background: 'rgba(229,231,235,0.5)' }}>
      <motion.div
        className="h-2 rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${avg}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Certification Card                                                 */
/* ------------------------------------------------------------------ */

function CertificationCard({ cert, index }: { cert: Certification; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#ffffff',
        border: `1px solid ${cert.color}33`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6 flex items-start gap-4 hover:bg-[#f0f0f0] transition-colors cursor-pointer"
      >
        <div
          className="p-3 rounded-xl shrink-0 mt-1"
          style={{ background: `${cert.color}22` }}
        >
          <Award className="w-8 h-8" style={{ color: cert.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="text-xl font-bold"
              style={{ color: cert.color }}
            >
              {cert.code}
            </span>
            <LevelBadge level={cert.level} color={cert.color} />
            <StatusBadge status={cert.status} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#1e293b' }}>
            {cert.title}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#94a3b8' }}>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" /> {cert.price}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {cert.duration}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" /> {cert.questions}
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" /> {cert.passingScore}
            </span>
          </div>
        </div>
        <div className="shrink-0 mt-2" style={{ color: '#94a3b8' }}>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6" style={{ borderTop: '1px solid #e5e7eb' }}>
              {/* Skills measured */}
              <div className="pt-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#1e293b' }}>
                  <Target className="w-5 h-5" style={{ color: cert.color }} />
                  Comp\u00E9tences mesur\u00E9es
                </h4>
                <div className="space-y-4">
                  {cert.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium" style={{ color: '#1e293b' }}>
                          {skill.name}
                        </span>
                        <span className="text-xs font-mono" style={{ color: cert.color }}>
                          {skill.weight}
                        </span>
                      </div>
                      <ProgressBar weight={skill.weight} color={cert.color} />
                      <ul className="mt-2 space-y-1">
                        {skill.topics.map((t) => (
                          <li key={t} className="text-xs flex items-start gap-2" style={{ color: '#94a3b8' }}>
                            <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" style={{ color: '#10b981' }} />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                  <Globe className="w-5 h-5" style={{ color: cert.color }} />
                  Langues disponibles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cert.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-1 rounded text-xs"
                      style={{ background: '#f0f0f0', color: '#94a3b8', border: '1px solid #e5e7eb' }}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#1e293b' }}>
                  <Info className="w-5 h-5" style={{ color: cert.color }} />
                  Pr\u00E9requis
                </h4>
                <p className="text-sm" style={{ color: '#94a3b8' }}>{cert.prerequisites}</p>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                  <BookOpen className="w-5 h-5" style={{ color: cert.color }} />
                  Ressources d\u0027\u00E9tude
                </h4>
                <ul className="space-y-2">
                  {cert.resources.map((r) => (
                    <li key={r} className="text-sm flex items-center gap-2" style={{ color: '#94a3b8' }}>
                      <Star className="w-3 h-3 shrink-0" style={{ color: '#f59e0b' }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#1e293b' }}>
                  <Lightbulb className="w-5 h-5" style={{ color: '#f59e0b' }} />
                  Conseils
                </h4>
                <ul className="space-y-2">
                  {cert.tips.map((tip) => (
                    <li key={tip} className="text-sm flex items-start gap-2" style={{ color: '#94a3b8' }}>
                      <Zap className="w-3 h-3 mt-0.5 shrink-0" style={{ color: '#f2c811' }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Renewal */}
              <div className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
                <Calendar className="w-4 h-4" style={{ color: '#10b981' }} />
                <strong style={{ color: '#1e293b' }}>Renouvellement :</strong> {cert.renewal}
              </div>

              {/* Action buttons */}
              {cert.status === 'available' && (
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={cert.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    style={{
                      background: cert.color,
                      color: cert.color === '#f2c811' ? '#1e293b' : '#fff',
                    }}
                  >
                    S\u0027inscrire <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={cert.learnPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    style={{
                      background: 'transparent',
                      color: cert.color,
                      border: `1px solid ${cert.color}66`,
                    }}
                  >
                    Microsoft Learn <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Roadmap Component                                                  */
/* ------------------------------------------------------------------ */

function CertificationRoadmap() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  const roadmapItems = [
    { code: 'AZ-900', title: 'Azure Fundamentals', color: '#3b82f6', type: 'optional' as const },
    { code: 'DP-900', title: 'Data Fundamentals', color: '#3b82f6', type: 'optional' as const },
    { code: 'PL-300', title: 'Power BI Data Analyst', color: '#f2c811', type: 'main' as const },
    { code: 'DP-600', title: 'Fabric Analytics Engineer', color: '#0078d4', type: 'main' as const },
    { code: 'DP-700', title: 'Fabric Data Engineer', color: '#8b5cf6', type: 'main' as const },
    { code: 'AZ-305', title: 'Azure Solutions Architect', color: '#10b981', type: 'combo' as const },
  ]

  return (
    <div ref={ref}>
      {/* Main path */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#f2c811' }}>
          Parcours principal recommand\u00E9
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          {roadmapItems
            .filter((i) => i.type === 'main')
            .map((item, idx, arr) => (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <div
                  className="px-4 py-3 rounded-xl text-center min-w-[140px]"
                  style={{
                    background: `${item.color}22`,
                    border: `2px solid ${item.color}66`,
                  }}
                >
                  <div className="font-bold text-sm" style={{ color: item.color }}>
                    {item.code}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#94a3b8' }}>
                    {item.title}
                  </div>
                </div>
                {idx < arr.length - 1 && (
                  <ArrowRight className="w-5 h-5 shrink-0" style={{ color: '#94a3b8' }} />
                )}
              </motion.div>
            ))}
        </div>
      </div>

      {/* Fundamentals */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#3b82f6' }}>
          Fondamentaux (optionnel mais recommand\u00E9 pour d\u00E9butants)
        </h4>
        <div className="flex flex-wrap gap-3">
          {roadmapItems
            .filter((i) => i.type === 'optional')
            .map((item, idx) => (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + idx * 0.15, duration: 0.5 }}
                className="px-4 py-3 rounded-xl text-center min-w-[140px]"
                style={{
                  background: `${item.color}15`,
                  border: `1px dashed ${item.color}44`,
                }}
              >
                <div className="font-bold text-sm" style={{ color: item.color }}>
                  {item.code}
                </div>
                <div className="text-xs mt-1" style={{ color: '#94a3b8' }}>
                  {item.title}
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Combo path */}
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#10b981' }}>
          Combo Expert Full-Stack Analytics
        </h4>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="p-4 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div
              className="px-3 py-2 rounded-lg font-bold text-sm"
              style={{ background: '#10b98122', color: '#10b981', border: '1px solid #10b98144' }}
            >
              AZ-305
            </div>
            <span style={{ color: '#94a3b8' }}>+</span>
            <div
              className="px-3 py-2 rounded-lg font-bold text-sm"
              style={{ background: '#f2c81122', color: '#f2c811', border: '1px solid #f2c81144' }}
            >
              PL-300
            </div>
            <span style={{ color: '#94a3b8' }}>=</span>
            <span className="font-semibold text-sm" style={{ color: '#10b981' }}>
              Full-Stack Analytics Expert
            </span>
          </div>
          <p className="text-sm" style={{ color: '#94a3b8' }}>
            Combiner Azure Solutions Architect (AZ-305) avec Power BI Data Analyst (PL-300)
            d\u00E9montre une expertise compl\u00E8te en analytics : de l\u0027architecture cloud
            \u00E0 la visualisation des donn\u00E9es. Ce combo est particuli\u00E8rement valoris\u00E9
            pour les postes de Lead Data / Analytics Architect.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Study Plan Generator                                               */
/* ------------------------------------------------------------------ */

function StudyPlanGenerator() {
  const [cert, setCert] = useState<CertTarget>('pl-300')
  const [level, setLevel] = useState<ExperienceLevel>('intermediate')
  const [hours, setHours] = useState<HoursPerWeek>(10)
  const [showPlan, setShowPlan] = useState(false)

  const plan = useMemo(() => generateStudyPlan(cert, level, hours), [cert, level, hours])

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Certification */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1e293b' }}>
            Certification
          </label>
          <div className="flex gap-2">
            {(['pl-300', 'dp-600'] as CertTarget[]).map((c) => (
              <button
                key={c}
                onClick={() => { setCert(c); setShowPlan(false) }}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                style={{
                  background: cert === c ? (c === 'pl-300' ? '#f2c811' : '#0078d4') : '#f0f0f0',
                  color: cert === c ? (c === 'pl-300' ? '#1e293b' : '#fff') : '#94a3b8',
                  border: `1px solid ${cert === c ? 'transparent' : '#e5e7eb'}`,
                }}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1e293b' }}>
            Niveau actuel
          </label>
          <div className="flex gap-2">
            {([
              { key: 'beginner' as const, label: 'D\u00E9butant' },
              { key: 'intermediate' as const, label: 'Interm.' },
              { key: 'expert' as const, label: 'Expert' },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setLevel(key); setShowPlan(false) }}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                style={{
                  background: level === key ? '#0078d4' : '#f0f0f0',
                  color: level === key ? '#fff' : '#94a3b8',
                  border: `1px solid ${level === key ? 'transparent' : '#e5e7eb'}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1e293b' }}>
            Heures/semaine
          </label>
          <div className="flex gap-2">
            {([5, 10, 15, 20] as HoursPerWeek[]).map((h) => (
              <button
                key={h}
                onClick={() => { setHours(h); setShowPlan(false) }}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                style={{
                  background: hours === h ? '#0078d4' : '#f0f0f0',
                  color: hours === h ? '#fff' : '#94a3b8',
                  border: `1px solid ${hours === h ? 'transparent' : '#e5e7eb'}`,
                }}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={() => setShowPlan(true)}
        className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        style={{ background: '#f2c811', color: '#1e293b' }}
      >
        <Sparkles className="w-4 h-4" />
        G\u00E9n\u00E9rer mon plan d\u0027\u00E9tude
      </button>

      {/* Plan display */}
      <AnimatePresence>
        {showPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Summary */}
            <div
              className="p-4 rounded-xl flex items-center gap-4"
              style={{ background: 'rgba(242,200,17,0.08)', border: '1px solid rgba(242,200,17,0.2)' }}
            >
              <Calendar className="w-8 h-8" style={{ color: '#f2c811' }} />
              <div>
                <div className="font-bold text-lg" style={{ color: '#1e293b' }}>
                  {plan.totalWeeks} semaines estim\u00E9es
                </div>
                <div className="text-sm" style={{ color: '#94a3b8' }}>
                  {cert.toUpperCase()} \u00B7 {level === 'beginner' ? 'D\u00E9butant' : level === 'intermediate' ? 'Interm\u00E9diaire' : 'Expert'} \u00B7 {hours}h/semaine
                </div>
              </div>
            </div>

            {/* Weeks */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
              {plan.weeks.map((week) => (
                <motion.div
                  key={week.week}
                  variants={fadeUp}
                  custom={week.week}
                  className="p-4 rounded-xl"
                  style={{ background: '#f0f0f0', border: '1px solid #e5e7eb' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-bold"
                        style={{ background: '#0078d422', color: '#0078d4' }}
                      >
                        Sem. {week.week}
                      </span>
                      <span className="font-semibold text-sm" style={{ color: '#1e293b' }}>
                        {week.title}
                      </span>
                    </div>
                    {week.practice && (
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1"
                        style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
                      >
                        <Play className="w-3 h-3" /> Pratique
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {week.topics.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded"
                        style={{ background: '#ffffff', color: '#94a3b8' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs" style={{ color: '#94a3b8' }}>
                    <strong>Ressources :</strong> {week.resources.join(' \u00B7 ')}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Cost Calculator                                                    */
/* ------------------------------------------------------------------ */

function CostCalculator() {
  const [examCount, setExamCount] = useState(1)
  const [practiceTest, setPracticeTest] = useState(false)
  const [instructorLed, setInstructorLed] = useState<'none' | 'basic' | 'premium'>('none')

  const examCost = examCount * 165
  const practiceCost = practiceTest ? 50 * examCount : 0
  const trainingCost = instructorLed === 'basic' ? 500 : instructorLed === 'premium' ? 2000 : 0
  const total = examCost + practiceCost + trainingCost

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Exam count */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: '#1e293b' }}>
            Nombre de certifications
          </label>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setExamCount(n)}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                style={{
                  background: examCount === n ? '#f2c811' : '#f0f0f0',
                  color: examCount === n ? '#1e293b' : '#94a3b8',
                  border: `1px solid ${examCount === n ? 'transparent' : '#e5e7eb'}`,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Practice test */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: '#1e293b' }}>
            Test de pratique (~50\u20AC/exam)
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setPracticeTest(false)}
              className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              style={{
                background: !practiceTest ? '#0078d4' : '#f0f0f0',
                color: !practiceTest ? '#fff' : '#94a3b8',
                border: `1px solid ${!practiceTest ? 'transparent' : '#e5e7eb'}`,
              }}
            >
              Non
            </button>
            <button
              onClick={() => setPracticeTest(true)}
              className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              style={{
                background: practiceTest ? '#0078d4' : '#f0f0f0',
                color: practiceTest ? '#fff' : '#94a3b8',
                border: `1px solid ${practiceTest ? 'transparent' : '#e5e7eb'}`,
              }}
            >
              Oui
            </button>
          </div>
        </div>

        {/* Instructor-led */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: '#1e293b' }}>
            Formation avec instructeur
          </label>
          <div className="flex gap-2">
            {([
              { key: 'none' as const, label: 'Non' },
              { key: 'basic' as const, label: '500\u20AC' },
              { key: 'premium' as const, label: '2000\u20AC' },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setInstructorLed(key)}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                style={{
                  background: instructorLed === key ? '#0078d4' : '#f0f0f0',
                  color: instructorLed === key ? '#fff' : '#94a3b8',
                  border: `1px solid ${instructorLed === key ? 'transparent' : '#e5e7eb'}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cost breakdown */}
      <div
        className="p-6 rounded-xl space-y-3"
        style={{ background: '#f0f0f0', border: '1px solid #e5e7eb' }}
      >
        <div className="flex justify-between text-sm" style={{ color: '#94a3b8' }}>
          <span>Examen(s) ({examCount} x 165\u20AC)</span>
          <span style={{ color: '#1e293b' }}>{examCost}\u20AC</span>
        </div>
        {practiceTest && (
          <div className="flex justify-between text-sm" style={{ color: '#94a3b8' }}>
            <span>Test(s) de pratique ({examCount} x 50\u20AC)</span>
            <span style={{ color: '#1e293b' }}>{practiceCost}\u20AC</span>
          </div>
        )}
        {trainingCost > 0 && (
          <div className="flex justify-between text-sm" style={{ color: '#94a3b8' }}>
            <span>Formation instructeur</span>
            <span style={{ color: '#1e293b' }}>{trainingCost}\u20AC</span>
          </div>
        )}
        <div
          className="flex justify-between pt-3 font-bold"
          style={{ borderTop: '1px solid #e5e7eb', color: '#1e293b' }}
        >
          <span>Total estim\u00E9</span>
          <span style={{ color: '#f2c811', fontSize: '1.25rem' }}>{total}\u20AC</span>
        </div>
      </div>

      {/* Tip about free vouchers */}
      <div
        className="p-4 rounded-xl flex items-start gap-3"
        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
      >
        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#10b981' }} />
        <div className="text-sm" style={{ color: '#94a3b8' }}>
          <strong style={{ color: '#10b981' }}>Bon \u00E0 savoir :</strong> Microsoft offre r\u00E9guli\u00E8rement des
          vouchers d\u0027examen gratuits lors d\u0027\u00E9v\u00E9nements comme le Microsoft Ignite,
          Microsoft Build, ou les Microsoft Cloud Skills Challenges. Les Microsoft Learn
          Challenges gratuits incluent aussi parfois un voucher d\u0027examen.
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tips Section                                                       */
/* ------------------------------------------------------------------ */

function ExamTips() {
  const tips = [
    {
      title: 'Gestion du temps',
      icon: Clock,
      color: '#f2c811',
      items: [
        'Vous avez environ 2 minutes par question',
        'Ne restez pas bloqu\u00E9 : marquez et revenez plus tard',
        'Les \u00E9tudes de cas prennent plus de temps \u2013 gardez 20 min',
        'V\u00E9rifiez vos r\u00E9ponses si vous avez du temps restant',
      ],
    },
    {
      title: 'Types de questions',
      icon: FileText,
      color: '#0078d4',
      items: [
        'QCM : choix unique ou multiples (le nombre est indiqu\u00E9)',
        'Drag & Drop : ordonnez les \u00E9tapes ou associez les \u00E9l\u00E9ments',
        '\u00C9tudes de cas : sc\u00E9nario r\u00E9el avec plusieurs questions li\u00E9es',
        'Hot area : cliquez sur la bonne zone d\u0027une interface',
        'Oui/Non : s\u00E9rie de d\u00E9clarations \u00E0 valider',
      ],
    },
    {
      title: 'Ressources gratuites vs payantes',
      icon: DollarSign,
      color: '#10b981',
      items: [
        'GRATUIT : Microsoft Learn, Practice Assessment, documentation',
        'GRATUIT : YouTube (Guy in a Cube, SQLBI, WillThompson)',
        'GRATUIT : Fabric Trial (60 jours), Power BI Desktop',
        'PAYANT : MeasureUp Practice Tests (~50\u20AC) \u2013 recommand\u00E9',
        'PAYANT : Formation instructeur (500-2000\u20AC) \u2013 optionnel',
        'PAYANT : Udemy/Pluralsight (10-30\u20AC/mois) \u2013 compl\u00E9mentaire',
      ],
    },
    {
      title: 'Strat\u00E9gie de pr\u00E9paration',
      icon: Target,
      color: '#f59e0b',
      items: [
        'Faites le Practice Assessment d\u00E8s le d\u00E9but pour identifier vos lacunes',
        'Concentrez-vous sur les domaines \u00E0 fort poids (%)',
        'Pratiquez hands-on : rien ne remplace l\u0027exp\u00E9rience',
        'Refaites le Practice Assessment la veille de l\u0027examen',
        'Dormez bien la nuit pr\u00E9c\u00E9dente',
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tips.map((section) => (
        <motion.div
          key={section.title}
          variants={fadeUp}
          custom={0}
          className="p-5 rounded-xl"
          style={{ background: '#ffffff', border: `1px solid ${section.color}33` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: `${section.color}22` }}>
              <section.icon className="w-5 h-5" style={{ color: section.color }} />
            </div>
            <h4 className="font-semibold" style={{ color: '#1e293b' }}>
              {section.title}
            </h4>
          </div>
          <ul className="space-y-2">
            {section.items.map((item) => (
              <li key={item} className="text-sm flex items-start gap-2" style={{ color: '#94a3b8' }}>
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: section.color }} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function Certifications() {
  return (
    <div className="min-h-screen px-4 py-12 md:px-8" style={{ background: '#fafafa' }}>
      <div className="max-w-5xl mx-auto space-y-16">
        {/* ---- Header ---- */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-10 h-10" style={{ color: '#f2c811' }} />
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold"
            style={{
              background: 'linear-gradient(135deg, #f2c811, #0078d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Certifications Microsoft
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#94a3b8' }}>
            Guide complet pour les certifications Power BI & Fabric
          </p>
        </motion.div>

        {/* ---- Certification Cards ---- */}
        <section>
          <SectionTitle icon={Award}>Certifications</SectionTitle>
          <div className="space-y-6">
            {certifications.map((cert, i) => (
              <CertificationCard key={cert.id} cert={cert} index={i} />
            ))}
          </div>
        </section>

        {/* ---- Roadmap ---- */}
        <section>
          <SectionTitle icon={TrendingUp}>Parcours de certification</SectionTitle>
          <div
            className="p-6 rounded-2xl"
            style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
          >
            <CertificationRoadmap />
          </div>
        </section>

        {/* ---- Microsoft Learn Labs ---- */}
        <section>
          <SectionTitle icon={BookOpen}>Labs Microsoft Learn (gratuits)</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {microsoftLearnLabs.map((lab, i) => (
              <motion.a
                key={lab.title}
                href={lab.url}
                target="_blank"
                rel="noopener noreferrer"
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                className="p-5 rounded-xl group transition-colors"
                style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
                whileHover={{ scale: 1.02, borderColor: '#0078d4' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg shrink-0"
                    style={{ background: 'rgba(0,120,212,0.15)' }}
                  >
                    <Play className="w-5 h-5" style={{ color: '#0078d4' }} />
                  </div>
                  <div>
                    <h4
                      className="font-semibold text-sm mb-1 group-hover:underline"
                      style={{ color: '#1e293b' }}
                    >
                      {lab.title}
                    </h4>
                    <p className="text-xs mb-2" style={{ color: '#94a3b8' }}>
                      {lab.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ background: '#0078d422', color: '#0078d4' }}
                      >
                        {lab.duration}
                      </span>
                      <ExternalLink className="w-3 h-3" style={{ color: '#94a3b8' }} />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* ---- Study Plan Generator ---- */}
        <section>
          <SectionTitle icon={Sparkles}>G\u00E9n\u00E9rateur de plan d\u0027\u00E9tude</SectionTitle>
          <div
            className="p-6 rounded-2xl"
            style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
          >
            <StudyPlanGenerator />
          </div>
        </section>

        {/* ---- Cost Calculator ---- */}
        <section>
          <SectionTitle icon={Calculator}>Calculateur de co\u00FBt</SectionTitle>
          <div
            className="p-6 rounded-2xl"
            style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
          >
            <CostCalculator />
          </div>
        </section>

        {/* ---- Tips ---- */}
        <section>
          <SectionTitle icon={Lightbulb}>Conseils pour r\u00E9ussir</SectionTitle>
          <ExamTips />
        </section>

        {/* ---- Footer note ---- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-8"
        >
          <p className="text-sm" style={{ color: '#94a3b8' }}>
            Derni\u00E8re mise \u00E0 jour : Avril 2026 \u00B7 Les informations peuvent \u00E9voluer,
            consultez toujours{' '}
            <a
              href="https://learn.microsoft.com/en-us/credentials/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: '#0078d4' }}
            >
              Microsoft Learn
            </a>{' '}
            pour les donn\u00E9es officielles.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
