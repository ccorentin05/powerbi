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
  Sparkles,
  Zap,
  TrendingUp,
} from 'lucide-react'
import AnimatedCounter from '../components/AnimatedCounter'

const stats = [
  { label: 'Fonctions DAX', value: 190, suffix: '+' },
  { label: 'Fiches Techniques', value: 80, suffix: '+' },
  { label: 'Patterns Architecture', value: 20, suffix: '+' },
  { label: 'Exercices Pratiques', value: 22, suffix: '' },
  { label: 'Items Roadmap', value: 40, suffix: '+' },
]

const bentoCards = [
  {
    icon: Calculator,
    eyebrow: 'Outils',
    title: 'Simulez vos couts Fabric',
    desc: 'Calculez votre capacite F2 a F2048, comparez les licences, evaluez le ROI de votre migration.',
    bg: 'var(--bento-peach)',
    iconBg: '#F4A881',
    to: '/simulator',
    span: 'md:col-span-2',
  },
  {
    icon: GraduationCap,
    eyebrow: 'Apprentissage',
    title: '190+ fonctions DAX documentees',
    desc: 'Reference complete avec exemples, complexite, et cas d\'usage.',
    bg: 'var(--bento-mint)',
    iconBg: '#7BC298',
    to: '/dax',
    span: '',
  },
  {
    icon: Layers,
    eyebrow: 'Fabric',
    title: 'Plongez dans chaque workload',
    desc: 'Data Engineering, Data Factory, Real-Time Intelligence, OneLake — guide complet.',
    bg: 'var(--bento-sky)',
    iconBg: '#7E9DD9',
    to: '/fabric',
    span: '',
  },
  {
    icon: Code2,
    eyebrow: 'Developpeur',
    title: 'API REST & CI/CD prets a l\'emploi',
    desc: '28 endpoints documentes, templates GitHub Actions, notebooks PySpark.',
    bg: 'var(--bento-lavender)',
    iconBg: '#A589D9',
    to: '/api',
    span: 'md:col-span-2',
  },
  {
    icon: BrainCircuit,
    eyebrow: 'Intelligence Artificielle',
    title: 'Copilot, Vibe BI & MCP',
    desc: 'Tirez parti de l\'IA generative dans Power BI et Fabric.',
    bg: 'var(--bento-yellow)',
    iconBg: '#E5C04A',
    to: '/ai',
    span: '',
  },
  {
    icon: PenTool,
    eyebrow: 'Pratique',
    title: '22 exercices avec corrections',
    desc: 'Mettez en pratique vos connaissances DAX, modelisation et architecture.',
    bg: 'var(--bento-rose)',
    iconBg: '#E58797',
    to: '/exercises',
    span: '',
  },
  {
    icon: Newspaper,
    eyebrow: 'Actualites',
    title: 'Roadmap & nouveautes',
    desc: '40+ items roadmap Q2-Q4 2025, mises a jour mensuelles, ressources communaute.',
    bg: 'var(--bento-cream)',
    iconBg: '#E5B656',
    to: '/whatsnew',
    span: '',
  },
  {
    icon: ClipboardCheck,
    eyebrow: 'Performance',
    title: 'Checklist d\'optimisation',
    desc: '35 points pour des modeles rapides et legers.',
    bg: 'var(--bento-sage)',
    iconBg: '#9BB680',
    to: '/performance',
    span: '',
  },
]

const timelineEvents = [
  { year: '2009', title: 'Project Crescent', desc: 'Le projet interne Microsoft qui deviendra Power BI.' },
  { year: '2010', title: 'PowerPivot', desc: 'Premier moteur xVelocity (VertiPaq) integre a Excel.' },
  { year: '2015', title: 'Power BI GA', desc: 'Lancement officiel du service et Power BI Desktop gratuit.' },
  { year: '2017', title: 'Power BI Premium', desc: 'Capacites dediees pour les entreprises.' },
  { year: '2023', title: 'Microsoft Fabric', desc: 'Unification de Power BI, Synapse, ADF en une plateforme SaaS.' },
  { year: '2024', title: 'Copilot in Power BI', desc: 'IA generative integree, Data Activator, Real-Time Intelligence.' },
  { year: '2025', title: 'Fabric maturite', desc: 'pbi-cli, Vibe BI, MCP Protocol, Fabric Databases, EPM.' },
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
    <div style={{ background: 'var(--background)' }}>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 pt-24 md:pt-32 pb-20 md:pb-28">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border"
                style={{
                  background: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--muted-foreground)',
                }}
              >
                <Sparkles size={13} style={{ color: 'var(--primary)' }} />
                La reference francophone Power BI &amp; Fabric
              </span>
            </motion.div>

            <motion.h1
              className="mt-10 font-bold tracking-tight"
              style={{
                color: 'var(--foreground)',
                fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
                lineHeight: '1.05',
                letterSpacing: '-0.04em',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Devenez expert
              <br />
              <span style={{ color: 'var(--primary)' }}>Power BI &amp; Fabric.</span>
            </motion.h1>

            <motion.p
              className="mt-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'var(--muted-foreground)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Une plateforme tout-en-un. Outils interactifs, 190+ fonctions DAX,
              80+ fiches techniques, patterns d'architecture et bien plus.
            </motion.p>

            <motion.div
              className="mt-12 flex gap-3 flex-wrap justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                to="/simulator"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all"
                style={{ background: 'var(--foreground)', color: 'var(--background)' }}
              >
                Explorer les outils
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/dax"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  background: 'var(--card)',
                }}
              >
                <BookOpen size={16} />
                Commencer a apprendre
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ STATS ============================ */}
      <section className="mx-auto w-full max-w-7xl px-6 sm:px-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border grid grid-cols-2 md:grid-cols-5 gap-8 p-10"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div
                className="text-4xl md:text-5xl font-bold"
                style={{ color: 'var(--foreground)', letterSpacing: '-0.03em' }}
              >
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <p
                className="mt-2 text-sm font-medium"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ============================ BENTO GRID ============================ */}
      <section className="mx-auto w-full max-w-7xl px-6 sm:px-10 py-24 md:py-32">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold tracking-tight"
            style={{
              color: 'var(--foreground)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.03em',
            }}
          >
            Tout ce dont vous avez besoin.
            <br />
            <span style={{ color: 'var(--muted-foreground)' }}>Sur une seule plateforme.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bentoCards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.4 }}
                className={`${card.span} group`}
              >
                <Link
                  to={card.to}
                  className="block h-full rounded-3xl p-8 md:p-10 transition-all duration-300 relative overflow-hidden"
                  style={{ background: card.bg, minHeight: '280px' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: card.iconBg, color: '#ffffff' }}
                    >
                      <Icon size={22} />
                    </div>
                    <ArrowRight
                      size={20}
                      style={{ color: '#171717' }}
                      className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                    />
                  </div>

                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: '#171717', opacity: 0.6 }}
                  >
                    {card.eyebrow}
                  </p>
                  <h3
                    className="font-bold mb-3 leading-tight"
                    style={{
                      color: '#171717',
                      fontSize: '1.5rem',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#171717', opacity: 0.7 }}
                  >
                    {card.desc}
                  </p>
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
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 py-24 md:py-32">
          <div className="text-center mb-20">
            <h2
              className="font-bold tracking-tight"
              style={{
                color: 'var(--foreground)',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                lineHeight: '1.1',
                letterSpacing: '-0.03em',
              }}
            >
              15 ans d'innovation.
              <br />
              <span style={{ color: 'var(--muted-foreground)' }}>De Crescent a Fabric.</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {timelineEvents.map((ev, i) => (
                <motion.div
                  key={`${ev.year}-${ev.title}`}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex gap-8 items-start"
                >
                  <div
                    className="shrink-0 w-20 text-2xl font-bold"
                    style={{
                      color: 'var(--primary)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {ev.year}
                  </div>
                  <div className="flex-1 pb-2">
                    <h4
                      className="text-xl font-semibold mb-1.5"
                      style={{
                        color: 'var(--foreground)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {ev.title}
                    </h4>
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {ev.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ QUICK ACCESS ============================ */}
      <section className="mx-auto w-full max-w-7xl px-6 sm:px-10 py-24 md:py-32">
        <div className="text-center mb-16">
          <h2
            className="font-bold tracking-tight mb-4"
            style={{
              color: 'var(--foreground)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              letterSpacing: '-0.03em',
            }}
          >
            Acces rapide
          </h2>
          <p
            className="text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Les pages les plus consultees, en un clic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  className="group flex items-center gap-5 rounded-2xl border p-6 transition-all"
                  style={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(110,124,241,0.1)',
                      color: 'var(--primary)',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <span
                    className="text-base font-semibold flex-1"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {item.label}
                  </span>
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                    style={{ color: 'var(--muted-foreground)' }}
                  />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ============================ FINAL CTA ============================ */}
      <section className="mx-auto w-full max-w-7xl px-6 sm:px-10 pb-24 md:pb-32">
        <div
          className="rounded-3xl p-12 md:p-20 text-center"
          style={{ background: 'var(--foreground)' }}
        >
          <div className="flex justify-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <Zap size={26} style={{ color: 'var(--background)' }} />
            </div>
          </div>
          <h3
            className="font-bold tracking-tight mb-6"
            style={{
              color: 'var(--background)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.03em',
            }}
          >
            Pret a maitriser
            <br />
            Power BI &amp; Fabric ?
          </h3>
          <p
            className="text-lg mb-10 max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Explorez tous les outils, fiches et exercices pour devenir expert.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/simulator"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all"
              style={{ background: 'var(--background)', color: 'var(--foreground)' }}
            >
              <TrendingUp size={16} />
              Commencer maintenant
            </Link>
            <Link
              to="/fiches"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all"
              style={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'var(--background)',
                background: 'transparent',
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
