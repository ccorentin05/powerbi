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
import AnimatedCounter from '../components/AnimatedCounter'

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
  },
  {
    icon: GraduationCap,
    title: 'Apprentissage',
    desc: '190+ fonctions DAX documentees, 80+ fiches techniques, exercices pratiques corriges, guide certifications PL-300/DP-600.',
    items: ['Reference DAX', 'Fiches techniques', 'Exercices corriges', 'Certifications'],
    to: '/dax',
  },
  {
    icon: Layers,
    title: 'Fabric en profondeur',
    desc: "Guide complet de chaque workload, patterns d'architecture, templates notebooks PySpark, CI/CD & automatisation.",
    items: ['Workloads Fabric', 'Architecture patterns', 'Notebooks PySpark', 'CI/CD'],
    to: '/architecture',
  },
  {
    icon: Code2,
    title: 'Developpeur',
    desc: 'API REST Power BI & Fabric, IA & Copilot, outils et telechargements essentiels.',
    items: ['API REST', 'IA & Copilot', 'Outils essentiels', 'GitHub Actions'],
    to: '/api',
  },
  {
    icon: Newspaper,
    title: 'Actualites',
    desc: 'Timeline des mises a jour, roadmap Q2-Q4 2025, ressources communaute.',
    items: ['Nouveautes mensuelles', 'Roadmap 2025', 'Ressources communaute', 'Blogs & podcasts'],
    to: '/whatsnew',
  },
]

const timelineEvents = [
  { year: '2009', title: 'Project Crescent', desc: 'Le projet interne Microsoft qui deviendra Power BI.' },
  { year: '2010', title: 'PowerPivot pour Excel', desc: 'Premier moteur xVelocity (VertiPaq) integre a Excel.' },
  { year: '2011', title: 'Power View', desc: 'Visualisation interactive dans SharePoint.' },
  { year: '2013', title: 'Power Query', desc: "Outil d'extraction et transformation de donnees dans Excel." },
  { year: '2014', title: 'Power BI for Office 365', desc: 'Premiere version cloud.' },
  { year: '2015', title: 'Power BI GA', desc: 'Lancement officiel du service Power BI et Power BI Desktop gratuit. Revolution de la BI self-service.' },
  { year: '2016', title: 'Power BI Embedded', desc: 'Integration dans les applications. Power BI Mobile. DirectQuery.' },
  { year: '2017', title: 'Power BI Premium', desc: 'Capacites dediees pour les entreprises. Power BI Report Server.' },
  { year: '2018', title: 'Dataflows', desc: 'Preparation de donnees centralisee. Composite Models. AI Visuals.' },
  { year: '2019', title: 'Paginated Reports', desc: 'Rapports pixel-perfect. Large models. XMLA endpoint.' },
  { year: '2020', title: 'Deployment Pipelines', desc: 'CI/CD natif. Power BI Goals. Enhanced datasets.' },
  { year: '2021', title: 'Hybrid Tables', desc: 'Import + DirectQuery dans un meme modele. Premium Per User (PPU).' },
  { year: '2022', title: 'Datamarts', desc: 'Self-service data warehouse. Visual calculations (preview).' },
  { year: '2023', title: 'Microsoft Fabric annonce', desc: "Unification de Power BI, Azure Synapse, ADF en une seule plateforme SaaS. OneLake, Lakehouse, Direct Lake mode." },
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
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
    >
      {/* Left side */}
      <div className={`w-full md:w-5/12 ${isLeft ? 'md:text-right md:pr-8' : 'md:order-last md:text-left md:pl-8'}`}>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 hidden md:block">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-primary/10 text-primary">
            {event.year}
          </span>
          <h4 className="text-base font-semibold text-gray-900">{event.title}</h4>
          <p className="text-sm text-pbi-muted mt-1 leading-relaxed">{event.desc}</p>
        </div>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 z-10">
        <motion.div
          className="w-3.5 h-3.5 rounded-full border-2 border-primary bg-white"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
      </div>

      {/* Right side (empty on desktop, content on mobile) */}
      <div className={`w-full md:w-5/12 ${isLeft ? 'md:order-last' : ''}`}>
        {/* Mobile card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm md:hidden">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-primary/10 text-primary">
            {event.year}
          </span>
          <h4 className="text-base font-semibold text-gray-900">{event.title}</h4>
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
    <div className="min-h-screen bg-gray-50">
      {/* ==================== HERO ==================== */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-24 md:py-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Star size={14} />
              La reference francophone Power BI & Fabric
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Power BI & Fabric
          </motion.h1>

          <motion.p
            className="mt-2 text-xl md:text-2xl font-medium text-pbi-muted"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Expert Hub
          </motion.p>

          <motion.p
            className="mt-6 text-base md:text-lg text-pbi-muted max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            La plateforme francophone pour maitriser l'ecosysteme Microsoft Analytics.
            Outils interactifs, fiches techniques, exercices et bien plus.
          </motion.p>

          <motion.div
            className="mt-10 flex gap-4 flex-wrap justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/simulator"
              className="group px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2 shadow-sm"
            >
              Explorer les outils
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/dax"
              className="group px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:border-primary hover:text-primary transition-colors duration-200 flex items-center gap-2"
            >
              Commencer a apprendre
              <BookOpen size={18} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ==================== STATS BAR ==================== */}
      <Section className="relative z-10 -mt-6 mx-auto max-w-5xl px-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm grid grid-cols-2 md:grid-cols-5 gap-6 p-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-primary">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-1 text-sm text-pbi-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ==================== CATEGORIES ==================== */}
      <Section className="max-w-5xl mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3">
          Que trouverez-vous ici ?
        </h2>
        <p className="text-center text-pbi-muted mb-14 max-w-xl mx-auto">
          Un ecosysteme complet pour devenir expert Power BI & Fabric.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {cat.title}
                </h3>
                <p className="text-sm text-pbi-muted mb-4 leading-relaxed">
                  {cat.desc}
                </p>
                <ul className="space-y-1.5 mb-5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-pbi-muted">
                      <ChevronRight size={14} className="text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={cat.to}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all"
                >
                  Explorer <ArrowRight size={16} />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </Section>

      {/* ==================== TIMELINE ==================== */}
      <Section className="bg-white border-t border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3">
            L'histoire de Power BI & Fabric
          </h2>
          <p className="text-center text-pbi-muted mb-16 max-w-xl mx-auto">
            De Project Crescent a Microsoft Fabric — 15 ans d'innovation.
          </p>

          <div className="relative">
            {/* Vertical line (desktop only) */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gray-200" />

            {timelineEvents.map((event, index) => (
              <TimelineItem key={`${event.year}-${event.title}`} event={event} index={index} />
            ))}
          </div>
        </div>
      </Section>

      {/* ==================== QUICK ACCESS ==================== */}
      <Section className="max-w-5xl mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3">
          Acces rapide
        </h2>
        <p className="text-center text-pbi-muted mb-12 max-w-xl mx-auto">
          Les pages les plus consultees, en un clic.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickAccess.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <Link
                  to={item.to}
                  className="group flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </Section>

      {/* ==================== FOOTER SECTION ==================== */}
      <Section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap size={28} className="text-primary" />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
              Cree par un Expert Power BI & Fabric
            </p>
            <p className="text-pbi-muted text-base">
              Explorez, apprenez, maitrisez.
            </p>
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <Link
                to="/simulator"
                className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-sm shadow-sm"
              >
                Commencer maintenant
              </Link>
              <Link
                to="/fiches"
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:border-primary hover:text-primary transition-colors text-sm"
              >
                Parcourir les fiches
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
