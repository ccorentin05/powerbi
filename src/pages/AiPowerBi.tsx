import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Bot,
  Sparkles,
  MessageSquare,
  Zap,
  Code2,
  Database,
  BarChart3,
  TrendingUp,
  Search,
  Shield,
  Layers,
  Network,
  Terminal,
  Cpu,
  Lightbulb,
  Eye,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCode,
  Workflow,
  Puzzle,
  Gauge,
  TreePine,
  Clock,
  Rocket,
  Globe,
  Settings,
  Microscope,
  Wrench,
  LineChart,
  Image,
  type LucideIcon,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

function useAnimRef() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return { ref, inView }
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
} as any

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.45 },
  }),
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

function Section({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const { ref, inView } = useAnimRef()
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`mb-20 ${className}`}
    >
      {children}
    </motion.section>
  )
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  color = '#f2c811',
  index = 0,
}: {
  icon: LucideIcon
  title: string
  subtitle?: string
  color?: string
  index?: number
}) {
  return (
    <motion.div variants={fadeUp} custom={index} className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="p-2 rounded-xl"
          style={{ background: `${color}20` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#e2e8f0]">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-[#94a3b8] text-lg ml-14">{subtitle}</p>
      )}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Expandable card                                                    */
/* ------------------------------------------------------------------ */

function ExpandableCard({
  title,
  icon: Icon,
  color,
  children,
  defaultOpen = false,
  index = 0,
}: {
  title: string
  icon: LucideIcon
  color: string
  children: React.ReactNode
  defaultOpen?: boolean
  index?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="rounded-2xl border border-[#2a3a5c] overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgba(22,33,62,0.95), rgba(26,39,68,0.85))',
        backdropFilter: 'blur(12px)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1a2744]/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} style={{ color }} />
          <span className="text-[#e2e8f0] font-semibold text-lg">{title}</span>
        </div>
        {open ? (
          <ChevronUp size={18} className="text-[#94a3b8]" />
        ) : (
          <ChevronDown size={18} className="text-[#94a3b8]" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-[#94a3b8] leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Code block                                                         */
/* ------------------------------------------------------------------ */

function CodeBlock({
  code,
  language = 'python',
}: {
  code: string
  language?: string
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#2a3a5c] my-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0f0f1e] border-b border-[#2a3a5c]">
        <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
        <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
        <div className="w-3 h-3 rounded-full bg-[#10b981]" />
        <span className="ml-2 text-xs text-[#94a3b8] font-mono">
          {language}
        </span>
      </div>
      <pre className="p-4 bg-[#0a0a18] text-sm overflow-x-auto">
        <code className="text-[#e2e8f0] font-mono whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Badge                                                              */
/* ------------------------------------------------------------------ */

function Badge({
  label,
  color,
}: {
  label: string
  color: string
}) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: `${color}20`, color }}
    >
      {label}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Stat pill (for Vibe BI section)                                    */
/* ------------------------------------------------------------------ */

function StatPill({
  value,
  label,
  color,
}: {
  value: string
  label: string
  color: string
}) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-black" style={{ color }}>
        {value}
      </div>
      <div className="text-[#94a3b8] text-sm mt-1">{label}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  DATA — Copilot capabilities                                        */
/* ------------------------------------------------------------------ */

const copilotCapabilities = [
  {
    icon: BarChart3,
    title: 'Generer des rapports',
    desc: 'Creez des pages de rapport completes a partir de prompts en langage naturel. Copilot choisit les visuels, les champs et la mise en page.',
  },
  {
    icon: Code2,
    title: 'Creer des mesures DAX',
    desc: "Decrivez votre calcul en francais, Copilot genere la mesure DAX correspondante avec gestion d'erreurs.",
  },
  {
    icon: FileCode,
    title: 'Resumer les donnees',
    desc: 'Obtenez des syntheses textuelles automatiques de vos visuels et de vos jeux de donnees.',
  },
  {
    icon: MessageSquare,
    title: 'Q&A en langage naturel',
    desc: 'Posez des questions sur vos donnees en francais et obtenez des reponses visuelles instantanees.',
  },
]

const copilotAvailability = [
  { label: 'Power BI Service', status: 'GA', color: '#10b981' },
  { label: 'Power BI Desktop', status: 'Preview', color: '#f59e0b' },
  { label: 'Power BI Mobile', status: 'Preview', color: '#f59e0b' },
  { label: 'Fabric Notebooks', status: 'GA', color: '#10b981' },
  { label: 'Data Pipelines', status: 'Preview', color: '#f59e0b' },
  { label: 'KQL Queries', status: 'GA', color: '#10b981' },
]

const copilotTips = [
  'Soyez specifique : "Cree un graphique en barres du CA par region pour 2024" > "montre-moi les ventes"',
  'Donnez du contexte : mentionnez les noms exacts de colonnes et de tables',
  'Iterez : affinez le resultat avec des prompts successifs',
  'Utilisez les synonymes definis dans votre modele semantique',
  "Commencez par des requetes simples avant d'enchainer les complexes",
]

/* ------------------------------------------------------------------ */
/*  DATA — AI Features in Fabric                                       */
/* ------------------------------------------------------------------ */

interface AiFeature {
  icon: LucideIcon
  title: string
  description: string
  details: string
  color: string
  badge: string
}

const aiFeatures: AiFeature[] = [
  {
    icon: FileCode,
    title: 'Smart Narratives',
    description:
      'Resumes textuels auto-generes a partir de vos visuels. Expliquent les tendances, anomalies et points cles.',
    details:
      "Configurez les narratifs intelligents pour qu'ils s'actualisent automatiquement. Supportent le langage naturel et les variables dynamiques. Ideaux pour les rapports execu­tifs.",
    color: '#f2c811',
    badge: 'GA',
  },
  {
    icon: TrendingUp,
    title: 'Key Influencers',
    description:
      "Analyse ML automatique des facteurs qui influencent le plus une metrique. Identifie les segments a fort impact.",
    details:
      'Utilise des modeles de regression et de classification en arriere-plan. Supporte les variables categorielles et continues. Permet de decouvrir des insights caches sans ecrire une seule ligne de code.',
    color: '#0078d4',
    badge: 'GA',
  },
  {
    icon: TreePine,
    title: 'Decomposition Tree',
    description:
      "Analyse drill-down guidee par l'IA. Decompose une metrique selon plusieurs dimensions automatiquement.",
    details:
      "L'IA suggere la dimension suivante la plus pertinente a chaque niveau. Modes : Valeur haute, Valeur basse, Comptage, et personnalise. Excellent pour l'analyse des causes racines.",
    color: '#10b981',
    badge: 'GA',
  },
  {
    icon: AlertTriangle,
    title: 'Anomaly Detection',
    description:
      'Detection automatique des valeurs aberrantes dans les series temporelles. Intervalles de confiance personnalisables.',
    details:
      "Basee sur l'algorithme SR-CNN (Spectral Residual + CNN). Fonctionne directement dans les visuels de type ligne. Parametres ajustables : sensibilite, saisonnalite attendue, et gestion des jours feries.",
    color: '#ef4444',
    badge: 'GA',
  },
  {
    icon: Search,
    title: 'Q&A Visual',
    description:
      'Posez des questions en langage naturel directement dans vos rapports. Le visuel se genere automatiquement.',
    details:
      'Supporte les synonymes personnalises pour adapter le vocabulaire metier. Fonctionne en anglais, francais, et +40 langues. Peut etre integre comme visuel fixe ou comme barre de recherche.',
    color: '#3b82f6',
    badge: 'GA',
  },
  {
    icon: Microscope,
    title: 'AI Insights (Dataflows)',
    description:
      'Analyse de sentiments, extraction de phrases cles, et tagging d\'images directement dans les dataflows.',
    details:
      "Utilise Azure Cognitive Services en arriere-plan (Text Analytics, Computer Vision). S'applique comme etape de transformation dans Power Query. Necessite une capacite Premium/Fabric.",
    color: '#a855f7',
    badge: 'Premium',
  },
  {
    icon: Cpu,
    title: 'Azure ML Integration',
    description:
      'Connectez vos modeles ML Azure directement dans Power BI pour des predictions en temps reel.',
    details:
      'Supporté via AutoML dans Power BI (dataflows) ou via des endpoints Azure ML. Les resultats se rafraichissent avec le modele semantique. Ideal pour le scoring, la classification, et les previsions.',
    color: '#f59e0b',
    badge: 'GA',
  },
  {
    icon: LineChart,
    title: 'Predict Visual',
    description:
      'Predictions AutoML directement dans les rapports. Previsions de series temporelles sans code.',
    details:
      'Utilise des modeles exponential smoothing / ARIMA auto-selectionnes. Configurable : horizon de prevision, intervalle de confiance, saisonnalite. Fonctionne sur tout visuel de type ligne avec un axe date.',
    color: '#10b981',
    badge: 'Preview',
  },
  {
    icon: Bot,
    title: 'Copilot in Notebooks',
    description:
      'Assistant IA pour le code PySpark / Python dans les notebooks Fabric. Genere, explique, et debogue.',
    details:
      "Autocomplete intelligent base sur le contexte du notebook. Explique les erreurs et suggere des corrections. Genere des cellules completes a partir de prompts. Supporte PySpark, Python, SQL, et R.",
    color: '#0078d4',
    badge: 'GA',
  },
]

/* ------------------------------------------------------------------ */
/*  DATA — MCP Servers                                                 */
/* ------------------------------------------------------------------ */

const mcpServers = [
  {
    title: 'Fabric MCP Server',
    description:
      "Connectez vos outils IA (Claude, ChatGPT) directement aux workspaces Fabric. Listez les artefacts, executez des requetes, et gerez les pipelines via le protocole MCP.",
    color: '#0078d4',
  },
  {
    title: 'Power BI REST API via MCP',
    description:
      "Automatisez la gestion des rapports, datasets, et workspaces. Declenchez des rafraichissements, gerez les permissions, et deployez via l'IA.",
    color: '#f2c811',
  },
  {
    title: 'Semantic Model MCP',
    description:
      "Interrogez vos modeles semantiques en langage naturel. L'IA genere le DAX, l'execute, et formate les resultats.",
    color: '#10b981',
  },
]

const mcpUseCases = [
  'Modelisation assistee par IA : creez tables, relations, et mesures par conversation',
  "Gouvernance automatisee : verifiez les bonnes pratiques sur l'ensemble de vos modeles",
  'Langage naturel vers DAX : posez des questions metier, obtenez du DAX optimise',
  'Deploiement conversationnel : exportez et importez TMDL sans quitter le terminal',
]

/* ------------------------------------------------------------------ */
/*  DATA — AI Tools                                                    */
/* ------------------------------------------------------------------ */

const aiTools = [
  {
    icon: Shield,
    title: 'Tabular Editor BPA',
    desc: "Analyse basee sur des regles de bonnes pratiques. 60+ regles predefinies pour l'optimisation de modeles.",
    color: '#f2c811',
  },
  {
    icon: Gauge,
    title: 'DAX Studio',
    desc: "Analyse de performance avec Server Timings et Query Plans. Detecte les patterns anti-performants.",
    color: '#0078d4',
  },
  {
    icon: Network,
    title: 'Semantic Link (Fabric)',
    desc: 'Bibliotheque Python pour interagir avec les modeles semantiques dans les notebooks Fabric.',
    color: '#10b981',
  },
  {
    icon: Puzzle,
    title: 'SemPy Library',
    desc: 'Analyse semantique avancee dans les notebooks. Correlation, dependances, et profiling automatique.',
    color: '#a855f7',
  },
  {
    icon: Globe,
    title: 'Azure OpenAI + Power BI',
    desc: "Patterns d'integration : enrichissement de donnees, generation de commentaires, et chatbots analytiques.",
    color: '#3b82f6',
  },
]

/* ------------------------------------------------------------------ */
/*  DATA — Future roadmap                                              */
/* ------------------------------------------------------------------ */

const roadmapItems = [
  {
    icon: Workflow,
    title: 'Pipelines ETL generes par IA',
    desc: 'Decrivez votre flux de donnees, l\'IA genere le pipeline complet avec transformations et gestion d\'erreurs.',
    timeline: '2025-2026',
    color: '#f2c811',
  },
  {
    icon: Database,
    title: 'Langage naturel vers Data Model',
    desc: "Creez un modele semantique complet a partir d'une description metier. Tables, relations, hierarchies, et mesures.",
    timeline: '2025',
    color: '#0078d4',
  },
  {
    icon: Zap,
    title: 'Optimisation automatique',
    desc: "L'IA analyse les query plans et applique automatiquement les optimisations : partitioning, agrégations, et reformulation DAX.",
    timeline: '2025-2026',
    color: '#10b981',
  },
  {
    icon: Clock,
    title: 'Insights temps reel',
    desc: "Detection d'anomalies et alertes en temps reel sur les flux Eventstream, avec explications en langage naturel.",
    timeline: '2026',
    color: '#ef4444',
  },
  {
    icon: Image,
    title: 'Analyse multi-modale',
    desc: 'Combinez images, texte, et donnees tabulaires dans une meme analyse. Screenshot-to-report et OCR intelligent.',
    timeline: '2026+',
    color: '#a855f7',
  },
]

/* ================================================================== */
/*  Page component                                                     */
/* ================================================================== */

export default function AiPowerBi() {
  return (
    <div className="min-h-screen bg-[#0f0f1e] pb-20">
      {/* ============================================================ */}
      {/*  1. HERO                                                      */}
      {/* ============================================================ */}
      <HeroSection />

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* ============================================================ */}
        {/*  2. COPILOT IN POWER BI                                      */}
        {/* ============================================================ */}
        <CopilotSection />

        {/* ============================================================ */}
        {/*  3. VIBE BI / pbi-cli                                        */}
        {/* ============================================================ */}
        <VibeBiSection />

        {/* ============================================================ */}
        {/*  4. MCP & POWER BI                                           */}
        {/* ============================================================ */}
        <McpSection />

        {/* ============================================================ */}
        {/*  5. AI FEATURES IN FABRIC                                    */}
        {/* ============================================================ */}
        <AiFeaturesSection />

        {/* ============================================================ */}
        {/*  6. AUTOMATED HEALTH CHECKS                                  */}
        {/* ============================================================ */}
        <HealthChecksSection />

        {/* ============================================================ */}
        {/*  7. AI TOOLS & INTEGRATIONS                                  */}
        {/* ============================================================ */}
        <AiToolsSection />

        {/* ============================================================ */}
        {/*  8. FUTURE OF AI IN BI                                       */}
        {/* ============================================================ */}
        <FutureSection />
      </div>
    </div>
  )
}

/* ================================================================== */
/*  1. HERO SECTION                                                    */
/* ================================================================== */

function HeroSection() {
  const { ref, inView } = useAnimRef()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-24 pb-20 mb-12"
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,120,212,0.18) 0%, rgba(242,200,17,0.06) 50%, transparent 100%)',
        }}
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTYwIDBIMHY2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2cpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative max-w-4xl mx-auto text-center px-4"
      >
        {/* Floating AI icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8"
          style={{
            background:
              'linear-gradient(135deg, rgba(242,200,17,0.2), rgba(0,120,212,0.2))',
            border: '1px solid rgba(242,200,17,0.3)',
          }}
        >
          <Brain size={40} className="text-[#f2c811]" />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-black mb-6">
          <span
            style={{
              background: 'linear-gradient(135deg, #f2c811 0%, #0078d4 50%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            IA & Power BI
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-[#94a3b8] max-w-2xl mx-auto mb-10">
          L'intelligence artificielle au service de la Business Intelligence
        </p>

        {/* Glowing pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {['Copilot', 'Vibe BI', 'MCP Protocol', 'AutoML', 'Smart Narratives'].map(
            (tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="px-4 py-2 rounded-full text-sm font-semibold border"
                style={{
                  color: i % 2 === 0 ? '#f2c811' : '#0078d4',
                  borderColor: i % 2 === 0 ? 'rgba(242,200,17,0.3)' : 'rgba(0,120,212,0.3)',
                  background:
                    i % 2 === 0
                      ? 'rgba(242,200,17,0.08)'
                      : 'rgba(0,120,212,0.08)',
                }}
              >
                {tag}
              </motion.span>
            ),
          )}
        </div>
      </motion.div>
    </section>
  )
}

/* ================================================================== */
/*  2. COPILOT SECTION                                                 */
/* ================================================================== */

function CopilotSection() {
  return (
    <Section>
      <SectionTitle
        icon={Bot}
        title="Copilot in Power BI"
        subtitle="L'assistant IA integre a l'ecosysteme Power BI & Fabric"
        color="#a855f7"
      />

      {/* Capabilities grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {copilotCapabilities.map((cap, i) => (
          <motion.div
            key={cap.title}
            variants={fadeUp}
            custom={i + 1}
            className="p-5 rounded-2xl border border-[#2a3a5c] hover:border-[#a855f7]/40 transition-colors"
            style={{
              background:
                'linear-gradient(135deg, rgba(22,33,62,0.9), rgba(26,39,68,0.8))',
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-xl shrink-0"
                style={{ background: 'rgba(168,85,247,0.15)' }}
              >
                <cap.icon size={20} className="text-[#a855f7]" />
              </div>
              <div>
                <h3 className="text-[#e2e8f0] font-semibold mb-1">
                  {cap.title}
                </h3>
                <p className="text-[#94a3b8] text-sm">{cap.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Requirements callout */}
      <motion.div
        variants={fadeUp}
        custom={5}
        className="p-5 rounded-2xl border border-[#f59e0b]/30 mb-8"
        style={{ background: 'rgba(245,158,11,0.06)' }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-[#f59e0b] mt-0.5 shrink-0" />
          <div>
            <h3 className="text-[#f59e0b] font-semibold mb-2">
              Pre-requis
            </h3>
            <ul className="text-[#94a3b8] text-sm space-y-1">
              <li>
                <strong className="text-[#e2e8f0]">Capacite :</strong> F64+
                ou Power BI Premium Per User (PPU)
              </li>
              <li>
                <strong className="text-[#e2e8f0]">Admin :</strong> Activer
                le toggle "Bing Search" dans le portail d'admin Fabric
              </li>
              <li>
                <strong className="text-[#e2e8f0]">Region :</strong>{' '}
                Disponible dans les regions supportant Azure OpenAI
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Availability grid */}
      <motion.div variants={fadeUp} custom={6} className="mb-8">
        <h3 className="text-[#e2e8f0] font-semibold mb-4 flex items-center gap-2">
          <Eye size={18} className="text-[#0078d4]" />
          Disponibilite
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {copilotAvailability.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-3 rounded-xl border border-[#2a3a5c] bg-[#16213e]/80"
            >
              <span className="text-[#e2e8f0] text-sm">{item.label}</span>
              <Badge label={item.status} color={item.color} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tips */}
      <ExpandableCard
        title="Conseils pour des prompts efficaces"
        icon={Lightbulb}
        color="#f2c811"
        index={7}
      >
        <ul className="space-y-2">
          {copilotTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2
                size={16}
                className="text-[#10b981] mt-0.5 shrink-0"
              />
              <span className="text-sm">{tip}</span>
            </li>
          ))}
        </ul>
      </ExpandableCard>

      {/* Limitations */}
      <div className="mt-4">
        <ExpandableCard
          title="Limitations et considerations"
          icon={Shield}
          color="#ef4444"
          index={8}
        >
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#ef4444]">&#8226;</span>
              Les reponses peuvent etre imprecises — toujours verifier le DAX genere
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ef4444]">&#8226;</span>
              Ne supporte pas encore les modeles DirectQuery complexes
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ef4444]">&#8226;</span>
              Contexte limite : Copilot ne "voit" pas l'ensemble du modele, seulement le contexte du visuel actif
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ef4444]">&#8226;</span>
              Les donnees ne quittent pas votre tenant — conformite RGPD assuree
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ef4444]">&#8226;</span>
              Pas de support pour les mesures de calcul group avancees
            </li>
          </ul>
        </ExpandableCard>
      </div>
    </Section>
  )
}

/* ================================================================== */
/*  3. VIBE BI SECTION (FEATURED)                                      */
/* ================================================================== */

function VibeBiSection() {
  const { ref, inView } = useAnimRef()

  return (
    <section ref={ref} className="mb-20">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="relative rounded-3xl overflow-hidden p-[1px]"
        style={{
          background:
            'linear-gradient(135deg, #f2c811, #0078d4, #a855f7, #f2c811)',
          backgroundSize: '300% 300%',
        }}
      >
        {/* Animated gradient border */}
        <motion.div
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-3xl"
          style={{
            background:
              'linear-gradient(135deg, #f2c811, #0078d4, #a855f7, #f2c811)',
            backgroundSize: '300% 300%',
          }}
        />

        <div
          className="relative rounded-3xl p-8 md:p-12"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)' }}
        >
          {/* Top badge */}
          <motion.div
            variants={fadeUp}
            custom={0}
            className="flex items-center gap-2 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={20} className="text-[#f2c811]" />
            </motion.div>
            <span className="text-[#f2c811] font-bold text-sm uppercase tracking-widest">
              Projet phare
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-5xl font-black mb-3"
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #f2c811, #fde68a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Vibe BI
            </span>
            <span className="text-[#94a3b8] text-2xl md:text-3xl ml-3 font-bold">
              pbi-cli v3
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-xl text-[#e2e8f0] mb-8 max-w-2xl"
          >
            Build full Power BI reports chatting with Claude Code
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10 py-6 px-4 rounded-2xl"
            style={{ background: 'rgba(242,200,17,0.04)', border: '1px solid rgba(242,200,17,0.1)' }}
          >
            <StatPill value="32" label="Types de visuels" color="#f2c811" />
            <StatPill value="12" label="Claude Skills" color="#0078d4" />
            <StatPill value="30+" label="Commandes" color="#10b981" />
            <StatPill value="488" label="Tests passing" color="#a855f7" />
            <StatPill value="2" label="Layers complets" color="#f59e0b" />
          </motion.div>

          {/* What's new grid */}
          <motion.div variants={fadeUp} custom={4} className="mb-8">
            <h3 className="text-[#f2c811] font-bold text-lg mb-4">
              Nouveautes v3
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: Layers,
                  title: 'Report Layer complet',
                  desc: 'Pages, visuels, themes, filtres, bookmarks — tout en CLI',
                },
                {
                  icon: BarChart3,
                  title: '32 types de visuels',
                  desc: 'Bar, line, card, KPI, gauge, scatter, matrix, map, et plus',
                },
                {
                  icon: Brain,
                  title: '12 Claude Skills',
                  desc: '7 pour le modeling, 5 pour le reporting — couverture totale',
                },
                {
                  icon: Terminal,
                  title: '30+ commandes',
                  desc: 'Les deux layers (modeling + report) entierement couverts',
                },
              ].map((item, _i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: 'rgba(242,200,17,0.05)',
                    border: '1px solid rgba(242,200,17,0.1)',
                  }}
                >
                  <item.icon size={20} className="text-[#f2c811] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[#e2e8f0] font-semibold text-sm">
                      {item.title}
                    </h4>
                    <p className="text-[#94a3b8] text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div variants={fadeUp} custom={5}>
            <h3 className="text-[#0078d4] font-bold text-lg mb-4">
              Comment ca marche
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              {[
                { label: 'Claude Code', icon: Terminal, color: '#f2c811' },
                { label: '+', icon: null, color: '' },
                { label: 'pbi-cli skills', icon: Puzzle, color: '#0078d4' },
                { label: '=', icon: null, color: '' },
                { label: 'Vibe BI', icon: Sparkles, color: '#10b981' },
              ].map((step, i) =>
                step.icon ? (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border"
                    style={{
                      borderColor: `${step.color}40`,
                      background: `${step.color}10`,
                    }}
                  >
                    <step.icon size={18} style={{ color: step.color }} />
                    <span
                      className="font-semibold text-sm"
                      style={{ color: step.color }}
                    >
                      {step.label}
                    </span>
                  </div>
                ) : (
                  <span
                    key={i}
                    className="text-2xl font-bold text-[#94a3b8]"
                  >
                    {step.label}
                  </span>
                ),
              )}
            </div>
            <p className="text-[#94a3b8] text-sm">
              Disponible comme{' '}
              <span className="text-[#f2c811] font-semibold">
                Claude Code skills
              </span>{' '}
              — installez pbi-cli, connectez-vous a votre modele semantique, et
              commencez a construire des rapports par conversation.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

/* ================================================================== */
/*  4. MCP SECTION                                                     */
/* ================================================================== */

function McpSection() {
  return (
    <Section>
      <SectionTitle
        icon={Network}
        title="MCP & Power BI"
        subtitle="Model Context Protocol : le pont entre IA et outils"
        color="#10b981"
      />

      {/* What is MCP */}
      <motion.div
        variants={fadeUp}
        custom={1}
        className="p-6 rounded-2xl border border-[#10b981]/20 mb-8"
        style={{
          background:
            'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(22,33,62,0.9))',
        }}
      >
        <h3 className="text-[#10b981] font-bold mb-3 flex items-center gap-2">
          <Globe size={18} />
          Qu'est-ce que MCP ?
        </h3>
        <p className="text-[#94a3b8] text-sm leading-relaxed">
          Le <strong className="text-[#e2e8f0]">Model Context Protocol</strong>{' '}
          est un protocole ouvert qui standardise la communication entre les
          outils IA (Claude, ChatGPT, etc.) et les sources de donnees /
          applications. Il permet aux LLMs d'interagir directement avec Power
          BI, Fabric, et d'autres outils via des serveurs MCP dedies.
        </p>
      </motion.div>

      {/* MCP Servers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {mcpServers.map((server, i) => (
          <motion.div
            key={server.title}
            variants={scaleIn}
            custom={i + 2}
            className="p-5 rounded-2xl border border-[#2a3a5c] hover:border-[#10b981]/40 transition-all hover:-translate-y-1"
            style={{
              background:
                'linear-gradient(180deg, rgba(22,33,62,0.95), rgba(15,15,30,0.95))',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${server.color}15` }}
            >
              <Database size={20} style={{ color: server.color }} />
            </div>
            <h4 className="text-[#e2e8f0] font-semibold mb-2">
              {server.title}
            </h4>
            <p className="text-[#94a3b8] text-sm">{server.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Use cases */}
      <motion.div variants={fadeUp} custom={5} className="mb-8">
        <h3 className="text-[#e2e8f0] font-semibold mb-4 flex items-center gap-2">
          <Rocket size={18} className="text-[#f2c811]" />
          Cas d'usage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mcpUseCases.map((uc, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl border border-[#2a3a5c] bg-[#16213e]/60"
            >
              <CheckCircle2
                size={16}
                className="text-[#10b981] mt-0.5 shrink-0"
              />
              <span className="text-[#94a3b8] text-sm">{uc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Setup example */}
      <ExpandableCard
        title="Configuration MCP avec Claude Desktop"
        icon={Settings}
        color="#10b981"
        index={6}
      >
        <p className="text-sm mb-3">
          Ajoutez cette configuration dans votre fichier{' '}
          <code className="px-1.5 py-0.5 rounded bg-[#0a0a18] text-[#f2c811] text-xs">
            claude_desktop_config.json
          </code>{' '}
          :
        </p>
        <CodeBlock
          language="json"
          code={`{
  "mcpServers": {
    "power-bi": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-power-bi"],
      "env": {
        "POWER_BI_TENANT_ID": "<your-tenant-id>",
        "POWER_BI_CLIENT_ID": "<your-client-id>"
      }
    },
    "fabric": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-fabric"],
      "env": {
        "FABRIC_WORKSPACE_ID": "<your-workspace-id>"
      }
    }
  }
}`}
        />
        <p className="text-xs text-[#94a3b8] mt-2">
          Remplacez les valeurs entre chevrons par vos identifiants Azure AD /
          Fabric.
        </p>
      </ExpandableCard>
    </Section>
  )
}

/* ================================================================== */
/*  5. AI FEATURES IN FABRIC                                           */
/* ================================================================== */

function AiFeaturesSection() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <Section>
      <SectionTitle
        icon={Sparkles}
        title="Fonctionnalites IA dans Fabric"
        subtitle="Toutes les capacites d'intelligence artificielle integrées"
        color="#0078d4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiFeatures.map((feature, i) => {
          const isOpen = expanded === feature.title
          return (
            <motion.div
              key={feature.title}
              variants={scaleIn}
              custom={i + 1}
              className="rounded-2xl border border-[#2a3a5c] overflow-hidden transition-all hover:border-opacity-60 cursor-pointer"
              style={{
                borderColor: isOpen ? `${feature.color}60` : undefined,
                background:
                  'linear-gradient(180deg, rgba(22,33,62,0.95), rgba(15,15,30,0.95))',
              }}
              onClick={() =>
                setExpanded(isOpen ? null : feature.title)
              }
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="p-2 rounded-xl"
                    style={{ background: `${feature.color}15` }}
                  >
                    <feature.icon size={20} style={{ color: feature.color }} />
                  </div>
                  <Badge label={feature.badge} color={feature.color} />
                </div>
                <h4 className="text-[#e2e8f0] font-semibold mb-2">
                  {feature.title}
                </h4>
                <p className="text-[#94a3b8] text-sm">
                  {feature.description}
                </p>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-[#2a3a5c]">
                        <p className="text-[#94a3b8] text-sm">
                          {feature.details}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}

/* ================================================================== */
/*  6. AUTOMATED HEALTH CHECKS                                         */
/* ================================================================== */

function HealthChecksSection() {
  return (
    <Section>
      <SectionTitle
        icon={Wrench}
        title="Health Checks automatises"
        subtitle="Surveillance automatique de la qualite de vos modeles semantiques"
        color="#f59e0b"
      />

      <motion.div
        variants={fadeUp}
        custom={1}
        className="p-6 rounded-2xl border border-[#f59e0b]/20 mb-8"
        style={{
          background:
            'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(22,33,62,0.9))',
        }}
      >
        <p className="text-[#94a3b8] leading-relaxed text-sm mb-4">
          Automatisez vos controles qualite en executant le{' '}
          <strong className="text-[#e2e8f0]">Best Practice Analyzer</strong>{' '}
          (BPA) et le{' '}
          <strong className="text-[#e2e8f0]">Memory Analyzer</strong>{' '}
          directement depuis un notebook Fabric Lakehouse. Planifiez des
          executions regulieres et recevez des alertes automatiques.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              icon: Shield,
              title: 'BPA Automation',
              desc: 'Executez 60+ regles de bonnes pratiques automatiquement sur tous vos modeles.',
              color: '#f2c811',
            },
            {
              icon: Gauge,
              title: 'Memory Analyzer',
              desc: 'Identifiez les colonnes et tables les plus couteuses en memoire.',
              color: '#0078d4',
            },
            {
              icon: Clock,
              title: 'Planification',
              desc: 'Scheduling via Fabric Pipelines : quotidien, hebdomadaire, ou sur evenement.',
              color: '#10b981',
            },
            {
              icon: AlertTriangle,
              title: 'Alertes automatiques',
              desc: 'Notifications Teams/email quand un seuil de qualite est depasse.',
              color: '#ef4444',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 p-4 rounded-xl border border-[#2a3a5c] bg-[#16213e]/60"
            >
              <item.icon
                size={18}
                style={{ color: item.color }}
                className="mt-0.5 shrink-0"
              />
              <div>
                <h4 className="text-[#e2e8f0] font-semibold text-sm">
                  {item.title}
                </h4>
                <p className="text-[#94a3b8] text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notebook code example */}
      <ExpandableCard
        title="Exemple : Notebook PySpark pour BPA"
        icon={FileCode}
        color="#f59e0b"
        defaultOpen
        index={2}
      >
        <p className="text-sm mb-3">
          Ce notebook se connecte a votre modele semantique via Semantic Link et
          execute les regles BPA :
        </p>
        <CodeBlock
          language="python"
          code={`import sempy.fabric as fabric
from sempy.fabric import FabricRestClient

# Connect to the semantic model
dataset = "Sales Analytics"
workspace = "Production"

# Load model metadata
model = fabric.evaluate_dax(
    dataset=dataset,
    workspace=workspace,
    dax_string="""
    EVALUATE
    SELECTCOLUMNS(
        INFO.TABLES(),
        "Table", [Name],
        "Rows", [RowsCount],
        "Size", [DataSize]
    )
    """
)

# BPA Rules Check
rules_violated = []

# Rule 1: Tables without relationships
orphan_tables = fabric.evaluate_dax(
    dataset=dataset,
    workspace=workspace,
    dax_string="""
    EVALUATE
    FILTER(
        INFO.TABLES(),
        ISBLANK(
            CALCULATE(
                COUNTROWS(INFO.RELATIONSHIPS()),
                INFO.RELATIONSHIPS()[FromTableID] = INFO.TABLES()[ID]
                    || INFO.RELATIONSHIPS()[ToTableID] = INFO.TABLES()[ID]
            )
        )
    )
    """
)

if len(orphan_tables) > 0:
    rules_violated.append({
        "rule": "Orphan Tables",
        "severity": "Warning",
        "tables": orphan_tables["Name"].tolist()
    })

# Rule 2: Columns with high cardinality (>1M unique)
high_card = fabric.evaluate_dax(
    dataset=dataset,
    workspace=workspace,
    dax_string="""
    EVALUATE
    FILTER(
        SELECTCOLUMNS(
            INFO.COLUMNS(),
            "Column", [ExplicitName],
            "Table", RELATED(INFO.TABLES()[Name]),
            "Cardinality", [Statistics_DistinctCount]
        ),
        [Cardinality] > 1000000
    )
    """
)

if len(high_card) > 0:
    rules_violated.append({
        "rule": "High Cardinality Columns",
        "severity": "Error",
        "columns": high_card.to_dict("records")
    })

# Generate report
print(f"\\n{'='*50}")
print(f"BPA Report for '{dataset}'")
print(f"{'='*50}")
print(f"Rules checked: 60")
print(f"Violations found: {len(rules_violated)}")
for violation in rules_violated:
    print(f"  [{violation['severity']}] {violation['rule']}")
print(f"{'='*50}")`}
        />
      </ExpandableCard>
    </Section>
  )
}

/* ================================================================== */
/*  7. AI TOOLS & INTEGRATIONS                                         */
/* ================================================================== */

function AiToolsSection() {
  return (
    <Section>
      <SectionTitle
        icon={Puzzle}
        title="Outils IA & Integrations"
        subtitle="L'ecosysteme d'outils IA pour Power BI"
        color="#3b82f6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiTools.map((tool, i) => (
          <motion.div
            key={tool.title}
            variants={scaleIn}
            custom={i + 1}
            className="group p-5 rounded-2xl border border-[#2a3a5c] hover:border-opacity-60 transition-all hover:-translate-y-1"
            style={{
              background:
                'linear-gradient(180deg, rgba(22,33,62,0.95), rgba(15,15,30,0.95))',
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{ background: `${tool.color}15` }}
            >
              <tool.icon size={24} style={{ color: tool.color }} />
            </div>
            <h4 className="text-[#e2e8f0] font-semibold mb-2">
              {tool.title}
            </h4>
            <p className="text-[#94a3b8] text-sm">{tool.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Semantic Link example */}
      <div className="mt-8">
        <ExpandableCard
          title="Exemple : Semantic Link + SemPy dans un Notebook"
          icon={Code2}
          color="#3b82f6"
          index={6}
        >
          <CodeBlock
            language="python"
            code={`import sempy.fabric as fabric
from sempy.relationships import plot_relationship_metadata

# List all datasets in workspace
datasets = fabric.list_datasets()
print(datasets[["Dataset Name", "Dataset ID"]])

# Evaluate DAX query
result = fabric.evaluate_dax(
    dataset="Sales Analytics",
    dax_string="""
    EVALUATE
    SUMMARIZECOLUMNS(
        'Date'[Year],
        'Product'[Category],
        "Revenue", SUM(Sales[Amount]),
        "Units", SUM(Sales[Quantity])
    )
    ORDER BY 'Date'[Year] DESC
    """
)

# Analyze relationships
relationships = fabric.list_relationships(
    dataset="Sales Analytics"
)
plot_relationship_metadata(relationships)

# SemPy: auto-detect column dependencies
from sempy.dependencies import plot_dependency_metadata
deps = fabric.evaluate_measure_dependencies(
    dataset="Sales Analytics"
)
plot_dependency_metadata(deps)`}
          />
        </ExpandableCard>
      </div>
    </Section>
  )
}

/* ================================================================== */
/*  8. FUTURE OF AI IN BI                                              */
/* ================================================================== */

function FutureSection() {
  return (
    <Section>
      <SectionTitle
        icon={Rocket}
        title="Le futur de l'IA dans la BI"
        subtitle="Tendances et evolutions a venir"
        color="#a855f7"
      />

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#f2c811] via-[#0078d4] to-[#a855f7] hidden md:block" />

        <div className="space-y-6">
          {roadmapItems.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              custom={i + 1}
              className="relative md:pl-16"
            >
              {/* Timeline dot */}
              <div
                className="absolute left-4 top-5 w-5 h-5 rounded-full border-2 hidden md:flex items-center justify-center"
                style={{
                  borderColor: item.color,
                  background: '#0f0f1e',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: item.color }}
                />
              </div>

              <div
                className="p-5 rounded-2xl border border-[#2a3a5c] hover:border-opacity-60 transition-all"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(22,33,62,0.95), rgba(26,39,68,0.85))',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <item.icon size={20} style={{ color: item.color }} />
                    <h4 className="text-[#e2e8f0] font-semibold">
                      {item.title}
                    </h4>
                  </div>
                  <Badge label={item.timeline} color={item.color} />
                </div>
                <p className="text-[#94a3b8] text-sm ml-8">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Closing CTA */}
      <motion.div
        variants={fadeUp}
        custom={roadmapItems.length + 1}
        className="mt-12 text-center p-8 rounded-2xl border border-[#2a3a5c]"
        style={{
          background:
            'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(0,120,212,0.06), rgba(242,200,17,0.06))',
        }}
      >
        <Brain size={32} className="text-[#a855f7] mx-auto mb-4" />
        <h3 className="text-[#e2e8f0] text-xl font-bold mb-2">
          L'IA transforme la BI
        </h3>
        <p className="text-[#94a3b8] max-w-lg mx-auto">
          De la generation de rapports a l'optimisation automatique des modeles,
          l'intelligence artificielle redefinit notre facon de travailler avec
          les donnees. Restez a la pointe avec les outils et techniques
          presentes sur cette page.
        </p>
      </motion.div>
    </Section>
  )
}
