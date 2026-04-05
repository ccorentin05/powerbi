import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Calculator,
  Scale,
  FunctionSquare,
  FileText,
  TrendingUp,
  CheckSquare,
  Network,
  Zap,
  CreditCard,
  Database,
  AlignLeft,
  Download,
  GraduationCap,
  Sparkles,
  Bot,
  Award,
  FileCode,
  GitBranch,
  Code2,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import AnimatedCounter from '../components/AnimatedCounter'
import { fabricCapacities } from '../data/fabricCapacities'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const stats: { label: string; value: number; suffix: string; prefix?: string }[] = [
  { label: 'Fiches Techniques', value: 50, suffix: '+' },
  { label: 'Fonctions DAX', value: 190, suffix: '+' },
  { label: 'Patterns Architecture', value: 20, suffix: '' },
  { label: 'Outils & Pages', value: 16, suffix: '' },
]

const features = [
  {
    icon: Calculator,
    title: 'Simulateur de Couts',
    desc: 'Estimez vos couts Fabric en temps reel selon votre usage.',
    to: '/simulator',
    color: 'primary',
  },
  {
    icon: Scale,
    title: 'Comparateur de Licences',
    desc: 'Pro vs Premium vs Fabric — trouvez la licence ideale.',
    to: '/licenses',
    color: 'fabric',
  },
  {
    icon: FunctionSquare,
    title: 'Reference DAX',
    desc: 'Toutes les fonctions DAX avec exemples et bonnes pratiques.',
    to: '/dax',
    color: 'primary',
  },
  {
    icon: FileText,
    title: 'Fiches Techniques',
    desc: 'Fiches de synthese sur chaque composant Power BI & Fabric.',
    to: '/fiches',
    color: 'fabric',
  },
  {
    icon: TrendingUp,
    title: 'Calculateur ROI',
    desc: 'Mesurez le retour sur investissement de votre migration Fabric.',
    to: '/roi',
    color: 'primary',
  },
  {
    icon: CheckSquare,
    title: 'Checklist Performance',
    desc: 'Optimisez vos modeles avec notre checklist exhaustive.',
    to: '/performance',
    color: 'fabric',
  },
  {
    icon: Network,
    title: 'Patterns Architecture',
    desc: 'Architectures de reference pour chaque scenario.',
    to: '/architecture',
    color: 'primary',
  },
  {
    icon: AlignLeft,
    title: 'Formateur DAX / M',
    desc: 'Indentez et formatez votre code DAX et Power Query en un clic.',
    to: '/formatter',
    color: 'fabric',
  },
  {
    icon: Download,
    title: 'Outils & Telechargements',
    desc: 'Tous les outils essentiels Power BI avec liens directs.',
    to: '/tools',
    color: 'primary',
  },
  {
    icon: GraduationCap,
    title: 'Ressources',
    desc: 'YouTube, blogs, livres, podcasts — la creme de la communaute.',
    to: '/resources',
    color: 'fabric',
  },
  {
    icon: Sparkles,
    title: 'Nouveautes',
    desc: 'Timeline des dernieres mises a jour Power BI & Fabric.',
    to: '/whatsnew',
    color: 'primary',
  },
  {
    icon: Bot,
    title: 'IA & Power BI',
    desc: 'Copilot, Vibe BI, MCP, pbi-cli — l\'IA au service de la BI.',
    to: '/ai',
    color: 'fabric',
  },
  {
    icon: Award,
    title: 'Certifications',
    desc: 'Guide complet PL-300, DP-600 avec plan d\'etude personnalise.',
    to: '/certifications',
    color: 'primary',
  },
  {
    icon: FileCode,
    title: 'Templates Notebooks',
    desc: 'Code PySpark pret a l\'emploi pour vos notebooks Fabric.',
    to: '/notebooks',
    color: 'fabric',
  },
  {
    icon: Code2,
    title: 'API Reference',
    desc: 'Endpoints REST Power BI & Fabric avec exemples de code.',
    to: '/api',
    color: 'primary',
  },
  {
    icon: GitBranch,
    title: 'CI/CD & GitHub Actions',
    desc: 'Workflows d\'automatisation pour deployer vos solutions.',
    to: '/cicd',
    color: 'fabric',
  },
]

const whyFabric = [
  {
    icon: Zap,
    title: 'Unified Platform',
    desc: 'Une seule plateforme pour l\'ingestion, le traitement, l\'analyse et la visualisation.',
  },
  {
    icon: CreditCard,
    title: 'Pay as you go',
    desc: 'Scalez instantanement — ne payez que ce que vous consommez.',
  },
  {
    icon: Database,
    title: 'OneLake',
    desc: 'Un data lake unifie, zero duplication, gouvernance integree.',
  },
]

const chartData = fabricCapacities.slice(0, 7).map((c) => ({
  name: c.sku,
  price: c.monthlyPrice,
}))

/* ------------------------------------------------------------------ */
/*  Floating shapes                                                    */
/* ------------------------------------------------------------------ */

function FloatingShapes() {
  const shapes = [
    { size: 120, x: '10%', y: '20%', delay: 0, duration: 18, color: 'rgba(242,200,17,0.07)' },
    { size: 80, x: '80%', y: '15%', delay: 2, duration: 22, color: 'rgba(0,120,212,0.08)' },
    { size: 160, x: '70%', y: '60%', delay: 4, duration: 20, color: 'rgba(242,200,17,0.05)' },
    { size: 60, x: '20%', y: '70%', delay: 1, duration: 16, color: 'rgba(0,120,212,0.06)' },
    { size: 100, x: '50%', y: '40%', delay: 3, duration: 24, color: 'rgba(242,200,17,0.04)' },
    { size: 90, x: '85%', y: '80%', delay: 5, duration: 19, color: 'rgba(0,120,212,0.05)' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-2xl"
          style={{
            width: s.size,
            height: s.size,
            left: s.x,
            top: s.y,
            background: s.color,
            border: `1px solid ${s.color}`,
            rotate: '45deg',
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 15, 0, -15, 0],
            rotate: [45, 90, 135, 90, 45],
            scale: [1, 1.08, 1, 0.95, 1],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Custom tooltip for chart                                           */
/* ------------------------------------------------------------------ */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-4 py-2 text-sm">
      <p className="text-primary font-semibold">{label}</p>
      <p className="text-pbi-text">
        {payload[0].value.toLocaleString('fr-FR')} EUR/mois
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section wrapper with inView animation                              */
/* ------------------------------------------------------------------ */

function Section({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
    >
      {children}
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/*  Home Page                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* ==================== HERO ==================== */}
      <div className="relative bg-grid overflow-hidden">
        <FloatingShapes />

        {/* Radial glow behind title */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(242,200,17,0.08) 0%, rgba(0,120,212,0.06) 40%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center py-32 px-4 min-h-[70vh]">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="gradient-text">Power BI & Fabric</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-xl md:text-2xl text-pbi-muted max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            Expert Hub — Votre reference technique
          </motion.p>

          <motion.div
            className="mt-10 flex gap-4 flex-wrap justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link
              to="/simulator"
              className="px-8 py-3 rounded-xl bg-primary text-pbi-darker font-bold hover:bg-primary-dark transition-colors"
            >
              Simulateur Fabric
            </Link>
            <Link
              to="/dax"
              className="px-8 py-3 rounded-xl border border-fabric text-fabric font-bold hover:bg-fabric/10 transition-colors"
            >
              Reference DAX
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ==================== STATS BAR ==================== */}
      <Section className="relative z-10 -mt-8 mx-auto max-w-5xl px-4">
        <div className="glass-card glow-yellow grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="text-3xl md:text-4xl font-extrabold text-primary">
                {s.prefix ? (
                  <span className="text-pbi-muted text-lg font-medium">{s.prefix}</span>
                ) : null}
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-1 text-sm text-pbi-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ==================== FEATURE CARDS ==================== */}
      <Section className="max-w-6xl mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Tout pour maitriser <span className="gradient-text">Power BI & Fabric</span>
        </h2>
        <p className="text-center text-pbi-muted mb-14 max-w-xl mx-auto">
          Outils interactifs, references et guides pour devenir expert.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            const isYellow = f.color === 'primary'
            return (
              <motion.div
                key={f.to}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Link
                  to={f.to}
                  className={`group block h-full glass-card p-6 transition-all duration-300 hover:scale-[1.03] ${
                    isYellow ? 'hover:glow-yellow' : 'hover:glow-blue'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      isYellow
                        ? 'bg-primary/15 text-primary'
                        : 'bg-fabric/15 text-fabric'
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-pbi-text group-hover:text-white transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-pbi-muted mb-4 leading-relaxed">
                    {f.desc}
                  </p>
                  <span
                    className={`text-sm font-medium ${
                      isYellow ? 'text-primary' : 'text-fabric'
                    } group-hover:translate-x-1 inline-block transition-transform`}
                  >
                    Explorer &rarr;
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </Section>

      {/* ==================== FABRIC CAPACITY CHART ==================== */}
      <Section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="glass-card glow-blue p-8">
          <h2 className="text-2xl font-bold mb-2">
            Capacites <span className="gradient-text">Fabric</span> — Prix mensuel
          </h2>
          <p className="text-pbi-muted text-sm mb-8">
            Comparaison des SKUs F2 a F64 (EUR/mois)
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 13 }}
                  axisLine={{ stroke: '#2a3a5c' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                  }
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="price" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={idx % 2 === 0 ? '#f2c811' : '#0078d4'}
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>

      {/* ==================== WHY FABRIC ==================== */}
      <Section className="max-w-5xl mx-auto px-4 pb-28">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Pourquoi <span className="gradient-text">Fabric</span> ?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {whyFabric.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                className="glass-card p-8 text-center hover:glow-blue transition-shadow duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-fabric/15 text-fabric flex items-center justify-center mx-auto mb-5">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-pbi-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}
