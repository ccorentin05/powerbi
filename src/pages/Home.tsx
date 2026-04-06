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
  CheckCircle2,
} from 'lucide-react'
import AnimatedCounter from '../components/AnimatedCounter'

const stats = [
  { label: 'Fonctions DAX', value: 190, suffix: '+' },
  { label: 'Fiches Techniques', value: 80, suffix: '+' },
  { label: 'Patterns Architecture', value: 20, suffix: '+' },
  { label: 'Exercices', value: 22, suffix: '' },
  { label: 'Items Roadmap', value: 40, suffix: '+' },
]

const techStack = [
  'Power BI',
  'Microsoft Fabric',
  'OneLake',
  'DAX',
  'Power Query',
  'Lakehouse',
  'Data Factory',
  'Real-Time Intelligence',
  'Synapse',
  'Copilot',
  'PySpark',
  'Delta Lake',
]

const bentoCards = [
  {
    icon: Calculator,
    eyebrow: 'Outils',
    title: 'Simulez vos couts Fabric en temps reel',
    desc: 'Calculez votre capacite de F2 a F2048, comparez les licences, evaluez le ROI de votre migration. Tout est interactif.',
    bg: 'linear-gradient(135deg, #FFE5D4 0%, #FFD0B5 100%)',
    iconBg: '#F4805C',
    accent: '#F4805C',
    to: '/simulator',
    span: 'md:col-span-2 md:row-span-2',
    big: true,
  },
  {
    icon: GraduationCap,
    eyebrow: 'DAX',
    title: '190+ fonctions documentees',
    desc: 'Reference complete avec exemples, complexite et cas d\'usage.',
    bg: 'linear-gradient(135deg, #D6F0E0 0%, #B5E6C9 100%)',
    iconBg: '#5BA876',
    accent: '#5BA876',
    to: '/dax',
    span: '',
    big: false,
  },
  {
    icon: Layers,
    eyebrow: 'Fabric',
    title: 'Plongez dans chaque workload',
    desc: 'Data Engineering, Data Factory, Real-Time Intelligence, OneLake.',
    bg: 'linear-gradient(135deg, #DCE7F7 0%, #C0D4EF 100%)',
    iconBg: '#5C7EC4',
    accent: '#5C7EC4',
    to: '/fabric',
    span: '',
    big: false,
  },
  {
    icon: Code2,
    eyebrow: 'Developpeur',
    title: 'API REST & CI/CD prets a l\'emploi',
    desc: '28 endpoints documentes, templates GitHub Actions, notebooks PySpark optimises pour la production.',
    bg: 'linear-gradient(135deg, #E8DFF5 0%, #D1BEF0 100%)',
    iconBg: '#8366B8',
    accent: '#8366B8',
    to: '/api',
    span: 'md:col-span-2',
    big: false,
  },
  {
    icon: BrainCircuit,
    eyebrow: 'IA',
    title: 'Copilot, Vibe BI & MCP',
    desc: 'Tirez parti de l\'IA generative dans Power BI et Fabric.',
    bg: 'linear-gradient(135deg, #FFF3C4 0%, #FFE89B 100%)',
    iconBg: '#D4A92E',
    accent: '#D4A92E',
    to: '/ai',
    span: '',
    big: false,
  },
  {
    icon: PenTool,
    eyebrow: 'Pratique',
    title: '22 exercices avec corrections',
    desc: 'Mettez en pratique vos connaissances DAX, modelisation et architecture.',
    bg: 'linear-gradient(135deg, #FFD6DC 0%, #FFB5C0 100%)',
    iconBg: '#D4566B',
    accent: '#D4566B',
    to: '/exercises',
    span: '',
    big: false,
  },
  {
    icon: Newspaper,
    eyebrow: 'Actualites',
    title: 'Roadmap & nouveautes mensuelles',
    desc: '40+ items roadmap Q2-Q4 2025, ressources communaute, blogs et podcasts.',
    bg: 'linear-gradient(135deg, #FFF6E8 0%, #FFE6B5 100%)',
    iconBg: '#D49A2E',
    accent: '#D49A2E',
    to: '/whatsnew',
    span: 'md:col-span-2',
    big: false,
  },
  {
    icon: ClipboardCheck,
    eyebrow: 'Performance',
    title: 'Checklist d\'optimisation',
    desc: '35 points pour des modeles rapides et legers.',
    bg: 'linear-gradient(135deg, #E5EEDC 0%, #C7DBA8 100%)',
    iconBg: '#7B9C47',
    accent: '#7B9C47',
    to: '/performance',
    span: '',
    big: false,
  },
]

const features = [
  { icon: CheckCircle2, label: '100% francophone' },
  { icon: CheckCircle2, label: 'Mis a jour mensuellement' },
  { icon: CheckCircle2, label: 'Outils interactifs' },
  { icon: CheckCircle2, label: 'Exemples pratiques' },
]

const timelineEvents = [
  { year: '2009', title: 'Project Crescent', desc: 'Le projet interne Microsoft qui deviendra Power BI.' },
  { year: '2010', title: 'PowerPivot', desc: 'Premier moteur xVelocity (VertiPaq) integre a Excel.' },
  { year: '2015', title: 'Power BI GA', desc: 'Lancement officiel du service et Power BI Desktop gratuit.' },
  { year: '2017', title: 'Power BI Premium', desc: 'Capacites dediees pour les entreprises.' },
  { year: '2023', title: 'Microsoft Fabric', desc: 'Unification de Power BI, Synapse et ADF en une plateforme SaaS.' },
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
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, #6e7cf1 0%, transparent 70%)',
              filter: 'blur(80px)',
              transform: 'translate(-50%, -30%)',
            }}
          />
          <div
            className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full opacity-25"
            style={{
              background: 'radial-gradient(circle, #f17eb8 0%, transparent 70%)',
              filter: 'blur(80px)',
              transform: 'translate(50%, -20%)',
            }}
          />
          <div
            className="absolute top-40 left-1/2 w-[400px] h-[400px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, #67c5d8 0%, transparent 70%)',
              filter: 'blur(80px)',
              transform: 'translate(-50%, 0)',
            }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-10 pt-32 md:pt-44 pb-20 md:pb-32">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border backdrop-blur-sm"
                style={{
                  background: 'rgba(255,255,255,0.7)',
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
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                lineHeight: '0.95',
                letterSpacing: '-0.045em',
                color: 'var(--foreground)',
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Devenez expert
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #6e7cf1 0%, #9b8afb 50%, #f17eb8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Power BI &amp; Fabric.
              </span>
            </motion.h1>

            <motion.p
              className="mt-10 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
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
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: 'var(--foreground)',
                  color: 'var(--background)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
                }}
              >
                Explorer les outils
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/dax"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold border backdrop-blur-sm transition-all"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  background: 'rgba(255,255,255,0.7)',
                }}
              >
                <BookOpen size={16} />
                Commencer a apprendre
              </Link>
            </motion.div>

            <motion.div
              className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-2">
                  <f.icon size={14} style={{ color: 'var(--primary)' }} />
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {f.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ TECH MARQUEE ============================ */}
      <section
        className="border-t border-b py-10 overflow-hidden"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <p
          className="text-center text-xs font-bold uppercase tracking-widest mb-8"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Couvert en profondeur
        </p>
        <div
          className="flex gap-12 whitespace-nowrap"
          style={{ animation: 'scroll-x 40s linear infinite' }}
        >
          {[...techStack, ...techStack].map((tech, i) => (
            <span
              key={i}
              className="text-2xl md:text-3xl font-bold shrink-0"
              style={{
                color: 'var(--foreground)',
                opacity: 0.4,
                letterSpacing: '-0.02em',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes scroll-x {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ============================ STATS ============================ */}
      <section className="mx-auto w-full max-w-7xl px-6 sm:px-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border grid grid-cols-2 md:grid-cols-5 gap-8 p-12"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
          }}
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div
                className="text-5xl md:text-6xl font-bold"
                style={{
                  color: 'var(--foreground)',
                  letterSpacing: '-0.04em',
                  lineHeight: '1',
                }}
              >
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <p
                className="mt-3 text-sm font-medium"
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
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            style={{
              background: 'rgba(110,124,241,0.1)',
              color: 'var(--primary)',
            }}
          >
            Tout ce dont vous avez besoin
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold tracking-tight"
            style={{
              color: 'var(--foreground)',
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              lineHeight: '1.05',
              letterSpacing: '-0.035em',
            }}
          >
            Une suite complete
            <br />
            <span style={{ color: 'var(--muted-foreground)' }}>
              pour aller plus loin.
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] gap-5">
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
                  style={{ background: card.bg }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.005)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  }}
                >
                  {/* Decorative shape */}
                  <div
                    className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full opacity-20"
                    style={{ background: card.iconBg }}
                  />

                  <div className="relative h-full flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{
                          background: card.iconBg,
                          color: '#ffffff',
                          boxShadow: `0 8px 20px ${card.iconBg}40`,
                        }}
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
                      style={{ color: '#171717', opacity: 0.55 }}
                    >
                      {card.eyebrow}
                    </p>
                    <h3
                      className="font-bold mb-3 leading-tight"
                      style={{
                        color: '#171717',
                        fontSize: card.big ? '2rem' : '1.4rem',
                        letterSpacing: '-0.025em',
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed mt-auto"
                      style={{ color: '#171717', opacity: 0.7, maxWidth: '90%' }}
                    >
                      {card.desc}
                    </p>
                  </div>
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
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{
                background: 'rgba(110,124,241,0.1)',
                color: 'var(--primary)',
              }}
            >
              Histoire
            </span>
            <h2
              className="font-bold tracking-tight"
              style={{
                color: 'var(--foreground)',
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                lineHeight: '1.05',
                letterSpacing: '-0.035em',
              }}
            >
              15 ans d'innovation.
              <br />
              <span style={{ color: 'var(--muted-foreground)' }}>
                De Crescent a Fabric.
              </span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-2">
              {timelineEvents.map((ev, i) => (
                <motion.div
                  key={`${ev.year}-${ev.title}`}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex gap-8 items-start py-6 border-b last:border-b-0"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div
                    className="shrink-0 w-24 text-3xl font-bold"
                    style={{
                      color: 'var(--primary)',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {ev.year}
                  </div>
                  <div className="flex-1">
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
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              letterSpacing: '-0.03em',
            }}
          >
            Acces rapide
          </h2>
          <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
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
          className="relative rounded-3xl p-12 md:p-20 text-center overflow-hidden"
          style={{ background: 'var(--foreground)' }}
        >
          {/* Gradient blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div
              className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-30"
              style={{
                background: 'radial-gradient(circle, #6e7cf1 0%, transparent 70%)',
                filter: 'blur(60px)',
                transform: 'translate(-50%, -30%)',
              }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-30"
              style={{
                background: 'radial-gradient(circle, #f17eb8 0%, transparent 70%)',
                filter: 'blur(60px)',
                transform: 'translate(50%, 30%)',
              }}
            />
          </div>

          <div className="relative">
            <div className="flex justify-center mb-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <Zap size={28} style={{ color: '#ffffff' }} />
              </div>
            </div>
            <h3
              className="font-bold tracking-tight mb-6"
              style={{
                color: '#ffffff',
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                lineHeight: '1.05',
                letterSpacing: '-0.035em',
              }}
            >
              Pret a maitriser
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #6e7cf1 0%, #f17eb8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Power BI &amp; Fabric ?
              </span>
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
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: '#ffffff',
                  color: 'var(--foreground)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                <TrendingUp size={16} />
                Commencer maintenant
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/fiches"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold border transition-all backdrop-blur-sm"
                style={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                Parcourir les fiches
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
