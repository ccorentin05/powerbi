import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Calculator,
  Network,
  Zap,
  GraduationCap,
  Code2,
  ArrowRight,
  BarChart3,
  BookOpen,
  Layers,
  Newspaper,
  Search,
  ClipboardCheck,
  BrainCircuit,
  PenTool,
  ChevronRight,
  Star,
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

const stats: { label: string; value: number; suffix: string }[] = [
  { label: 'Fonctions DAX', value: 190, suffix: '+' },
  { label: 'Fiches Techniques', value: 80, suffix: '+' },
  { label: 'Patterns Architecture', value: 20, suffix: '+' },
  { label: 'Exercices Pratiques', value: 22, suffix: '' },
  { label: 'Items Roadmap', value: 40, suffix: '+' },
]

const categories = [
  {
    icon: Calculator,
    title: 'Outils interactifs',
    desc: 'Simulez vos couts Fabric, comparez les licences, calculez votre ROI migration, formatez votre code DAX/M.',
    items: ['Simulateur Fabric', 'Comparateur licences', 'Calculateur ROI', 'Formateur DAX/M'],
    to: '/simulator',
    color: 'primary' as const,
  },
  {
    icon: GraduationCap,
    title: 'Apprentissage',
    desc: '190+ fonctions DAX documentees, 80+ fiches techniques, exercices pratiques corriges, guide certifications PL-300/DP-600.',
    items: ['Reference DAX', 'Fiches techniques', 'Exercices corriges', 'Certifications'],
    to: '/dax',
    color: 'fabric' as const,
  },
  {
    icon: Layers,
    title: 'Fabric en profondeur',
    desc: 'Guide complet de chaque workload, patterns d\'architecture, templates notebooks PySpark, CI/CD & automatisation.',
    items: ['Workloads Fabric', 'Architecture patterns', 'Notebooks PySpark', 'CI/CD'],
    to: '/architecture',
    color: 'primary' as const,
  },
  {
    icon: Code2,
    title: 'Developpeur',
    desc: 'API REST Power BI & Fabric, IA & Copilot, outils et telechargements essentiels.',
    items: ['API REST', 'IA & Copilot', 'Outils essentiels', 'GitHub Actions'],
    to: '/api',
    color: 'fabric' as const,
  },
  {
    icon: Newspaper,
    title: 'Actualites',
    desc: 'Timeline des mises a jour, roadmap Q2-Q4 2025, ressources communaute.',
    items: ['Nouveautes mensuelles', 'Roadmap 2025', 'Ressources communaute', 'Blogs & podcasts'],
    to: '/whatsnew',
    color: 'primary' as const,
  },
]

const timelineEvents = [
  { year: '2009', title: 'Project Crescent', desc: 'Le projet interne Microsoft qui deviendra Power BI.' },
  { year: '2010', title: 'PowerPivot pour Excel', desc: 'Premier moteur xVelocity (VertiPaq) integre a Excel.' },
  { year: '2011', title: 'Power View', desc: 'Visualisation interactive dans SharePoint.' },
  { year: '2013', title: 'Power Query', desc: 'Outil d\'extraction et transformation de donnees dans Excel.' },
  { year: '2014', title: 'Power BI for Office 365', desc: 'Premiere version cloud.' },
  { year: '2015', title: 'Power BI GA', desc: 'Lancement officiel du service Power BI et Power BI Desktop gratuit. Revolution de la BI self-service.' },
  { year: '2016', title: 'Power BI Embedded', desc: 'Integration dans les applications. Power BI Mobile. DirectQuery.' },
  { year: '2017', title: 'Power BI Premium', desc: 'Capacites dediees pour les entreprises. Power BI Report Server.' },
  { year: '2018', title: 'Dataflows', desc: 'Preparation de donnees centralisee. Composite Models. AI Visuals.' },
  { year: '2019', title: 'Paginated Reports', desc: 'Rapports pixel-perfect. Large models. XMLA endpoint.' },
  { year: '2020', title: 'Deployment Pipelines', desc: 'CI/CD natif. Power BI Goals. Enhanced datasets.' },
  { year: '2021', title: 'Hybrid Tables', desc: 'Import + DirectQuery dans un meme modele. Premium Per User (PPU).' },
  { year: '2022', title: 'Datamarts', desc: 'Self-service data warehouse. Visual calculations (preview).' },
  { year: '2023', title: 'Microsoft Fabric annonce', desc: 'Unification de Power BI, Azure Synapse, ADF en une seule plateforme SaaS. OneLake, Lakehouse, Direct Lake mode.' },
  { year: '2023', title: 'Fabric GA', desc: 'Lancement officiel a Ignite. Capacites F2-F2048.' },
  { year: '2024', title: 'Copilot in Power BI', desc: 'IA generative integree. Data Activator. Real-Time Intelligence. Mirroring.' },
  { year: '2025', title: 'Fabric maturite', desc: 'pbi-cli & Vibe BI, MCP Protocol, Fabric Databases, EPM, Data Mesh.' },
]

const quickAccess = [
  { icon: BarChart3, label: 'Simulateur Fabric', to: '/simulator' },
  { icon: Search, label: 'Reference DAX', to: '/dax' },
  { icon: ClipboardCheck, label: 'Checklist Performance', to: '/performance' },
  { icon: Network, label: 'Architecture Patterns', to: '/architecture' },
  { icon: BrainCircuit, label: 'IA & Power BI', to: '/ai' },
  { icon: PenTool, label: 'Exercices', to: '/exercises' },
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
    { size: 70, x: '35%', y: '10%', delay: 2.5, duration: 21, color: 'rgba(242,200,17,0.06)' },
    { size: 110, x: '60%', y: '85%', delay: 3.5, duration: 17, color: 'rgba(0,120,212,0.07)' },
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
/*  Timeline Item                                                      */
/* ------------------------------------------------------------------ */

function TimelineItem({
  event,
  index,
}: {
  event: (typeof timelineEvents)[number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const isLeft = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      className="relative flex items-center w-full mb-8 md:mb-4"
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
    >
      {/* Left side */}
      <div className={`w-full md:w-5/12 ${isLeft ? 'md:text-right md:pr-8' : 'md:order-last md:text-left md:pl-8'}`}>
        <div className={`glass-card p-4 hover:glow-${index % 2 === 0 ? 'yellow' : 'blue'} transition-shadow duration-300 hidden md:block`}>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
            index % 2 === 0
              ? 'bg-primary/20 text-primary'
              : 'bg-fabric/20 text-fabric'
          }`}>
            {event.year}
          </span>
          <h4 className="text-base font-semibold text-pbi-text">{event.title}</h4>
          <p className="text-sm text-pbi-muted mt-1 leading-relaxed">{event.desc}</p>
        </div>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 z-10">
        <motion.div
          className={`w-4 h-4 rounded-full border-2 ${
            index % 2 === 0
              ? 'border-primary bg-primary/30'
              : 'border-fabric bg-fabric/30'
          }`}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        />
      </div>

      {/* Right side (empty on desktop, content on mobile) */}
      <div className={`w-full md:w-5/12 ${isLeft ? 'md:order-last' : ''}`}>
        {/* Mobile card */}
        <div className="glass-card p-4 md:hidden">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
            index % 2 === 0
              ? 'bg-primary/20 text-primary'
              : 'bg-fabric/20 text-fabric'
          }`}>
            {event.year}
          </span>
          <h4 className="text-base font-semibold text-pbi-text">{event.title}</h4>
          <p className="text-sm text-pbi-muted mt-1 leading-relaxed">{event.desc}</p>
        </div>
      </div>
    </motion.div>
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(242,200,17,0.10) 0%, rgba(0,120,212,0.07) 40%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center py-32 px-4 min-h-[75vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Star size={14} />
              La reference francophone Power BI & Fabric
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <span className="gradient-text">Power BI & Fabric</span>
            <br />
            <span className="text-pbi-text text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold">
              Expert Hub
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-pbi-muted max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            La reference francophone pour maitriser l'ecosysteme Microsoft Analytics
          </motion.p>

          <motion.div
            className="mt-10 flex gap-4 flex-wrap justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            <Link
              to="/simulator"
              className="group px-8 py-3.5 rounded-xl bg-primary text-pbi-darker font-bold hover:bg-primary-dark transition-all duration-300 hover:shadow-[0_0_30px_rgba(242,200,17,0.3)] flex items-center gap-2"
            >
              Explorer les outils
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/dax"
              className="group px-8 py-3.5 rounded-xl border border-fabric text-fabric font-bold hover:bg-fabric/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,120,212,0.2)] flex items-center gap-2"
            >
              Commencer a apprendre
              <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ==================== STATS BAR ==================== */}
      <Section className="relative z-10 -mt-8 mx-auto max-w-6xl px-4">
        <div className="glass-card glow-yellow grid grid-cols-2 md:grid-cols-5 gap-6 p-8">
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
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-1 text-sm text-pbi-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ==================== CATEGORIES ==================== */}
      <Section className="max-w-6xl mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Que trouverez-vous <span className="gradient-text">ici</span> ?
        </h2>
        <p className="text-center text-pbi-muted mb-14 max-w-xl mx-auto">
          Un ecosysteme complet pour devenir expert Power BI & Fabric.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            const isYellow = cat.color === 'primary'
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`group glass-card p-6 transition-all duration-300 hover:scale-[1.02] ${
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
                <h3 className="text-xl font-semibold mb-2 text-pbi-text group-hover:text-white transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-pbi-muted mb-4 leading-relaxed">
                  {cat.desc}
                </p>
                <ul className="space-y-1.5 mb-5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-pbi-muted">
                      <ChevronRight size={14} className={isYellow ? 'text-primary' : 'text-fabric'} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={cat.to}
                  className={`inline-flex items-center gap-1 text-sm font-medium ${
                    isYellow ? 'text-primary' : 'text-fabric'
                  } group-hover:gap-2 transition-all`}
                >
                  Explorer <ArrowRight size={16} />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </Section>

      {/* ==================== TIMELINE ==================== */}
      <Section className="max-w-5xl mx-auto px-4 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          L'Histoire de <span className="gradient-text">Power BI & Fabric</span>
        </h2>
        <p className="text-center text-pbi-muted mb-16 max-w-xl mx-auto">
          De Project Crescent a Microsoft Fabric — 15 ans d'innovation.
        </p>

        <div className="relative">
          {/* Vertical line (desktop only) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-fabric to-primary/30" />

          {timelineEvents.map((event, index) => (
            <TimelineItem key={`${event.year}-${event.title}`} event={event} index={index} />
          ))}
        </div>
      </Section>

      {/* ==================== QUICK ACCESS ==================== */}
      <Section className="max-w-5xl mx-auto px-4 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Acces <span className="gradient-text">rapide</span>
        </h2>
        <p className="text-center text-pbi-muted mb-12 max-w-xl mx-auto">
          Les pages les plus consultees, en un clic.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickAccess.map((item, i) => {
            const Icon = item.icon
            const isYellow = i % 2 === 0
            return (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Link
                  to={item.to}
                  className={`group flex items-center gap-3 glass-card p-4 transition-all duration-300 hover:scale-[1.03] ${
                    isYellow ? 'hover:glow-yellow' : 'hover:glow-blue'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isYellow
                        ? 'bg-primary/15 text-primary'
                        : 'bg-fabric/15 text-fabric'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-medium text-pbi-text group-hover:text-white transition-colors">
                    {item.label}
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

      {/* ==================== FOOTER SECTION ==================== */}
      <Section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            className="glass-card p-10"
            whileInView={{ scale: [0.97, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-fabric/20 border border-primary/20 flex items-center justify-center">
                <Zap size={32} className="text-primary" />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-pbi-text mb-3">
              Construit par un Expert <span className="gradient-text">Power BI & Fabric</span>
            </p>
            <p className="text-pbi-muted text-lg">
              Explorez, apprenez, maitrisez.
            </p>
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <Link
                to="/simulator"
                className="px-6 py-2.5 rounded-xl bg-primary text-pbi-darker font-bold hover:bg-primary-dark transition-colors text-sm"
              >
                Commencer maintenant
              </Link>
              <Link
                to="/fiches"
                className="px-6 py-2.5 rounded-xl border border-pbi-border text-pbi-text font-medium hover:border-fabric hover:text-fabric transition-colors text-sm"
              >
                Parcourir les fiches
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  )
}
