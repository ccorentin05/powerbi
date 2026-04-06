import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Calculator,
  Network,
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
  Zap,
} from 'lucide-react'
import AnimatedCounter from '../components/AnimatedCounter'

const stats = [
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
  { year: '2013', title: 'Power Query', desc: "Outil d'extraction et transformation de donnees dans Excel." },
  { year: '2015', title: 'Power BI GA', desc: 'Lancement officiel du service Power BI et Power BI Desktop gratuit.' },
  { year: '2017', title: 'Power BI Premium', desc: 'Capacites dediees pour les entreprises. Power BI Report Server.' },
  { year: '2020', title: 'Deployment Pipelines', desc: 'CI/CD natif. Power BI Goals. Enhanced datasets.' },
  { year: '2023', title: 'Microsoft Fabric annonce', desc: "Unification de Power BI, Azure Synapse, ADF en une seule plateforme SaaS. OneLake, Lakehouse, Direct Lake." },
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

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* ============================ HERO ============================ */}
      <section className="border-b" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 py-24 md:py-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
              style={{
                background: 'rgba(110,124,241,0.08)',
                borderColor: 'rgba(110,124,241,0.2)',
                color: 'var(--primary)',
              }}
            >
              <Star size={14} />
              La reference francophone Power BI &amp; Fabric
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            style={{ color: 'var(--foreground)', letterSpacing: '-0.03em' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Power BI &amp; Fabric
          </motion.h1>

          <motion.p
            className="mt-3 text-xl md:text-2xl font-medium"
            style={{ color: 'var(--muted-foreground)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Expert Hub
          </motion.p>

          <motion.p
            className="mt-8 text-base md:text-lg max-w-2xl leading-relaxed"
            style={{ color: 'var(--muted-foreground)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            La plateforme francophone pour maitriser l'ecosysteme Microsoft Analytics.
            Outils interactifs, fiches techniques, exercices et bien plus.
          </motion.p>

          <motion.div
            className="mt-12 flex gap-4 flex-wrap justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/simulator"
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold transition-all"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              Explorer les outils
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/dax"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold border transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'var(--card)' }}
            >
              <BookOpen size={16} />
              Commencer a apprendre
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================ STATS ============================ */}
      <section className="mx-auto w-full max-w-6xl px-6 sm:px-10 -mt-10 relative z-10">
        <div
          className="rounded-xl border grid grid-cols-2 md:grid-cols-5 gap-8 p-10"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ CATEGORIES ============================ */}
      <section className="mx-auto w-full max-w-6xl px-6 sm:px-10 py-32">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}
          >
            Que trouverez-vous ici ?
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
            Un ecosysteme complet pour devenir expert Power BI &amp; Fabric.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group rounded-xl border p-8 transition-all"
                style={{
                  background: 'var(--card)',
                  borderColor: 'var(--border)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow =
                    '0 2px 4px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.06)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow =
                    '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(110,124,241,0.1)', color: 'var(--primary)' }}
                >
                  <Icon size={22} />
                </div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: 'var(--foreground)', letterSpacing: '-0.01em' }}
                >
                  {cat.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {cat.desc}
                </p>
                <ul className="space-y-2.5 mb-6">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      <ChevronRight size={14} style={{ color: 'var(--primary)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={cat.to}
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-all group-hover:gap-2.5"
                  style={{ color: 'var(--primary)' }}
                >
                  Explorer
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ============================ TIMELINE ============================ */}
      <section
        className="border-t border-b"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 py-32">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}
            >
              L'histoire de Power BI &amp; Fabric
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
              De Project Crescent a Microsoft Fabric — 15 ans d'innovation.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div
              className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px"
              style={{ background: 'var(--border)' }}
            />
            <div className="space-y-12">
              {timelineEvents.map((ev, i) => {
                const isLeft = i % 2 === 0
                return (
                  <motion.div
                    key={`${ev.year}-${ev.title}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4 }}
                    className="relative flex md:items-center"
                  >
                    {/* Dot */}
                    <div
                      className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full z-10 border-2"
                      style={{ background: 'var(--card)', borderColor: 'var(--primary)' }}
                    />
                    <div
                      className={`pl-12 md:pl-0 md:w-1/2 ${
                        isLeft ? 'md:pr-12 md:text-right' : 'md:order-2 md:pl-12'
                      }`}
                    >
                      <div
                        className="inline-block rounded-xl border p-6 text-left"
                        style={{
                          background: 'var(--background)',
                          borderColor: 'var(--border)',
                        }}
                      >
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                          style={{
                            background: 'rgba(110,124,241,0.1)',
                            color: 'var(--primary)',
                          }}
                        >
                          {ev.year}
                        </span>
                        <h4
                          className="text-base font-semibold mb-1.5"
                          style={{ color: 'var(--foreground)' }}
                        >
                          {ev.title}
                        </h4>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {ev.desc}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ QUICK ACCESS ============================ */}
      <section className="mx-auto w-full max-w-6xl px-6 sm:px-10 py-32">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}
          >
            Acces rapide
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
            Les pages les plus consultees, en un clic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickAccess.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  to={item.to}
                  className="group flex items-center gap-4 rounded-xl border p-6 transition-all"
                  style={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow =
                      '0 2px 4px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.06)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow =
                      '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)'
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(110,124,241,0.1)',
                      color: 'var(--primary)',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {item.label}
                  </span>
                  <ArrowRight
                    size={16}
                    className="ml-auto transition-transform group-hover:translate-x-0.5"
                    style={{ color: 'var(--muted-foreground)' }}
                  />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ============================ FOOTER CTA ============================ */}
      <section className="mx-auto w-full max-w-6xl px-6 sm:px-10 pb-32">
        <div
          className="rounded-2xl border p-12 text-center"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div className="flex justify-center mb-6">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(110,124,241,0.1)' }}
            >
              <Zap size={26} style={{ color: 'var(--primary)' }} />
            </div>
          </div>
          <h3
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}
          >
            Cree par un Expert Power BI &amp; Fabric
          </h3>
          <p className="text-base mb-8" style={{ color: 'var(--muted-foreground)' }}>
            Explorez, apprenez, maitrisez.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/simulator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              Commencer maintenant
            </Link>
            <Link
              to="/fiches"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold border transition-all"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                background: 'var(--card)',
              }}
            >
              Parcourir les fiches
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
