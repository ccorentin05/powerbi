import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowRight,
  Calculator,
  Database,
  Workflow,
  Brain,
  Activity,
  Bell,
  Code2,
  Sparkles,
} from 'lucide-react'

/*
 * Reproduction EXACTE du design notion.com (réf : godly.website/website/notion-1013).
 * Structure / palette / typographie / espacements identiques.
 *  - Hero CENTRÉ avec titre énorme + sous-titre 2 lignes + 2 CTAs (bleu solide + lien texte)
 *  - Doodles dessinés à la main de chaque côté du mockup hero
 *  - Sections avec gros mockups produit
 *  - Section "Toutes les briques" avec tabs icônes + mockup
 *  - Footer dark
 */

const NOTION_BLUE = '#2383E2'
const NOTION_BLUE_HOVER = '#0F6FFF'

// --- Doodle SVGs (style hand-drawn Notion) ---

function DoodleLeft() {
  return (
    <svg viewBox="0 0 200 280" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Personnage stylisé */}
      <path
        d="M70 80 Q60 60 75 50 Q95 40 110 55 Q120 75 105 90 Q90 100 75 95 Z"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="white"
      />
      {/* Cheveux flottants noirs */}
      <path
        d="M105 70 Q140 60 170 80 Q190 100 175 130 Q155 150 130 140 Q115 120 110 95"
        fill="#1a1a1a"
      />
      {/* Étoile rouge */}
      <path d="M140 90 L145 100 L156 100 L147 107 L150 118 L140 111 L130 118 L133 107 L124 100 L135 100 Z" fill="#E03E3E" />
      {/* Engrenage jaune */}
      <circle cx="160" cy="115" r="6" fill="#FBC02D" />
      <path d="M160 105 L160 102 M160 125 L160 128 M150 115 L147 115 M170 115 L173 115" stroke="#FBC02D" strokeWidth="2" />
      {/* Check bleu */}
      <rect x="125" y="100" width="14" height="14" rx="2" fill="#2383E2" />
      <path d="M128 107 L131 110 L137 104" stroke="white" strokeWidth="2" fill="none" />
      {/* Corps stylisé */}
      <path
        d="M60 100 Q50 130 55 170 Q60 220 75 260"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M80 100 Q95 140 95 180 Q95 230 100 270"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="none"
      />
      {/* Hachures */}
      <line x1="55" y1="180" x2="100" y2="180" stroke="#1a1a1a" strokeWidth="0.5" />
      <line x1="55" y1="200" x2="100" y2="200" stroke="#1a1a1a" strokeWidth="0.5" />
      <line x1="55" y1="220" x2="100" y2="220" stroke="#1a1a1a" strokeWidth="0.5" />
      <line x1="55" y1="240" x2="100" y2="240" stroke="#1a1a1a" strokeWidth="0.5" />
    </svg>
  )
}

function DoodleRight() {
  return (
    <svg viewBox="0 0 220 280" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Forme noire flottante */}
      <path
        d="M20 60 Q60 30 110 50 Q160 70 190 60 Q210 90 180 130 Q150 170 100 160 Q50 150 20 130 Q0 100 20 60 Z"
        fill="#1a1a1a"
      />
      {/* Étoile jaune */}
      <path d="M70 90 L78 105 L95 105 L82 116 L87 132 L70 122 L53 132 L58 116 L45 105 L62 105 Z" fill="#FBC02D" />
      {/* Lune jaune */}
      <path d="M150 110 Q165 100 170 115 Q165 130 150 125 Q145 115 150 110 Z" fill="#FBC02D" />
      {/* Trait rouge */}
      <path d="M105 95 Q115 100 110 115" stroke="#E03E3E" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Pilule bleue */}
      <ellipse cx="135" cy="135" rx="14" ry="6" fill="#2383E2" />
      {/* Document blanc */}
      <rect x="160" y="60" width="30" height="36" rx="2" fill="white" stroke="#1a1a1a" strokeWidth="1.5" />
      <line x1="165" y1="68" x2="185" y2="68" stroke="#1a1a1a" strokeWidth="1" />
      <line x1="165" y1="74" x2="185" y2="74" stroke="#1a1a1a" strokeWidth="1" />
      <line x1="165" y1="80" x2="180" y2="80" stroke="#1a1a1a" strokeWidth="1" />
      <line x1="165" y1="86" x2="183" y2="86" stroke="#1a1a1a" strokeWidth="1" />
      {/* Squiggle */}
      <path d="M20 200 Q35 190 50 200 Q65 210 80 200 Q95 190 110 200" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      <path d="M120 220 Q135 210 150 220 Q165 230 180 220" stroke="#1a1a1a" strokeWidth="2" fill="none" />
    </svg>
  )
}

// --- Mockup hero (faux app preview) ---

function HeroMockup() {
  return (
    <div className="relative bg-white rounded-xl border border-neutral-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.18)] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        <div className="ml-4 text-xs text-neutral-500 font-medium">Power BI &amp; Fabric</div>
      </div>
      <div className="grid grid-cols-12 min-h-[420px]">
        {/* Sidebar */}
        <aside className="col-span-3 border-r border-neutral-200 p-4 bg-neutral-50/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded bg-[#F2C811] flex items-center justify-center text-[10px] font-bold text-black">P</div>
            <span className="text-xs font-semibold">Workspace BI</span>
          </div>
          {[
            { label: 'Recherche', muted: true },
            { label: 'Accueil' },
            { label: 'Mises à jour' },
            { label: 'Paramètres' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 px-2 py-1 rounded text-xs text-neutral-700 hover:bg-neutral-100">
              <div className="w-3 h-3 rounded-sm bg-neutral-300" />
              <span>{item.label}</span>
            </div>
          ))}
          <div className="text-[10px] uppercase tracking-wider text-neutral-400 mt-4 mb-1 px-2">Favoris</div>
          {[
            { label: 'Simulateur Fabric', color: '#E8A317' },
            { label: 'Référence DAX', color: '#2383E2' },
            { label: 'Patterns Architecture', color: '#0F7A6E' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 px-2 py-1 rounded text-xs text-neutral-700 hover:bg-neutral-100">
              <div className="w-3 h-3 rounded-sm" style={{ background: item.color }} />
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </aside>
        {/* Main */}
        <div className="col-span-9 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#F2C811] flex items-center justify-center text-lg font-bold text-black">P</div>
          </div>
          <h3 className="text-2xl font-bold mb-6" style={{ letterSpacing: '-0.02em' }}>
            Workspace Power BI &amp; Fabric
          </h3>
          <div className="grid grid-cols-2 gap-x-12 gap-y-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Outils</div>
              {['Simulateur Fabric', 'Comparateur licences', 'Calculateur ROI'].map((t) => (
                <div key={t} className="flex items-center gap-2 py-1 text-sm text-neutral-700">
                  <div className="w-4 h-4 rounded-sm bg-[#2383E2]/15" />
                  {t}
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Apprentissage</div>
              {['Référence DAX', 'Fiches techniques', 'Exercices pratiques'].map((t) => (
                <div key={t} className="flex items-center gap-2 py-1 text-sm text-neutral-700">
                  <div className="w-4 h-4 rounded-sm bg-[#E03E3E]/15" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Mockup Section "Visualize" : faux écran simulateur Fabric ---

function SimulatorMockup() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden max-w-4xl mx-auto">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        <div className="ml-4 text-xs text-neutral-500 font-medium">Simulateur Fabric</div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <Calculator className="w-5 h-5 text-[#2383E2]" />
          <h4 className="font-bold text-base">Capacité Fabric</h4>
          <div className="ml-auto flex gap-2">
            {['F2', 'F4', 'F8', 'F16', 'F32', 'F64'].map((s, i) => (
              <span
                key={s}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  i === 2 ? 'bg-[#2383E2] text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Planning', count: 5, color: '#FBC02D', items: ['Import en masse', 'Mode sombre', 'Vue Journal'] },
            { label: 'Complete', count: 20, color: '#0F7A6E', items: ['Clés projet', 'Notif modal', 'iPad clavier'] },
            { label: 'À risque', count: 11, color: '#E03E3E', items: ['Conformité PCI', 'Anonymes SSO', 'SQLite Electron'] },
          ].map((col) => (
            <div key={col.label} className="bg-neutral-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="text-xs font-semibold">{col.label}</span>
                </div>
                <span className="text-xs text-neutral-500">{col.count}</span>
              </div>
              {col.items.map((item) => (
                <div key={item} className="bg-white rounded p-2.5 mb-2 border border-neutral-200">
                  <div className="text-xs font-medium text-neutral-800">{item}</div>
                  <div className="flex gap-1 mt-1.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">Fabric</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">v2</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 mt-5">
          {['Tableau', 'Liste', 'Calendrier', 'Galerie', 'Timeline'].map((v, i) => (
            <span
              key={v}
              className={`px-3 py-1 rounded text-xs font-medium border ${
                i === 0 ? 'border-neutral-800 bg-white' : 'border-transparent text-neutral-600'
              }`}
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Mockup Section "Every team" : workspace par workload ---

function WorkloadMockup({ workload }: { workload: typeof workloads[number] }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden max-w-4xl mx-auto">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
      </div>
      <div className="grid grid-cols-12 min-h-[360px]">
        {/* Sidebar */}
        <aside className="col-span-3 border-r border-neutral-200 p-4 bg-neutral-50/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded bg-[#F2C811] flex items-center justify-center text-[10px] font-bold text-black">P</div>
            <span className="text-xs font-semibold">Acme BI</span>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-400 mt-3 mb-1 px-2">Workloads</div>
          {workloads.map((w) => (
            <div
              key={w.id}
              className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                w.id === workload.id ? 'bg-neutral-200/60 font-semibold' : 'text-neutral-700'
              }`}
            >
              <div className="w-3 h-3 rounded-sm" style={{ background: w.color }} />
              <span className="truncate">{w.label}</span>
            </div>
          ))}
        </aside>
        {/* Main */}
        <div className="col-span-9 p-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: workload.color + '22' }}
          >
            <workload.icon className="w-6 h-6" style={{ color: workload.color }} />
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ letterSpacing: '-0.02em' }}>
            {workload.label}
          </h3>
          <p className="text-sm text-neutral-600 mb-4">{workload.desc}</p>
          <div className="grid grid-cols-2 gap-3">
            {workload.features.map((f) => (
              <div key={f} className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                <div className="text-xs font-medium text-neutral-800">{f}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Workloads data ---

const workloads = [
  {
    id: 'powerbi',
    label: 'Power BI',
    icon: Activity,
    color: '#F2C811',
    desc: 'Reporting interactif, dashboards, analyse libre-service.',
    features: ['Modèles sémantiques', 'Mesures DAX', 'Rapports paginés', 'Power BI Embedded'],
  },
  {
    id: 'data-engineering',
    label: 'Data Engineering',
    icon: Database,
    color: '#0F7A6E',
    desc: 'Lakehouses, notebooks Spark, transformation à grande échelle.',
    features: ['Lakehouse', 'Notebooks PySpark', 'Delta Tables', 'Spark Job Definitions'],
  },
  {
    id: 'data-factory',
    label: 'Data Factory',
    icon: Workflow,
    color: '#1E6FD9',
    desc: 'Orchestration et ingestion de données depuis 200+ sources.',
    features: ['Pipelines', 'Dataflows Gen2', 'Copy Job', 'Connecteurs natifs'],
  },
  {
    id: 'data-science',
    label: 'Data Science',
    icon: Brain,
    color: '#7D3FBF',
    desc: 'ML et data science avec MLflow intégré et SynapseML.',
    features: ['MLflow', 'SynapseML', 'Notebooks ML', 'Model Registry'],
  },
  {
    id: 'real-time',
    label: 'Real-Time Intelligence',
    icon: Activity,
    color: '#E03E3E',
    desc: 'Ingestion streaming, KQL Database, Eventstream.',
    features: ['Eventstreams', 'KQL Database', 'Reflex', 'Activator'],
  },
  {
    id: 'activator',
    label: 'Activator',
    icon: Bell,
    color: '#E8A317',
    desc: 'Détection d\'événements et déclenchement d\'actions automatisées.',
    features: ['Triggers', 'Alertes Teams', 'Actions Power Automate', 'Webhooks'],
  },
]

// --- Page ---

export default function Home() {
  const [activeWorkload, setActiveWorkload] = useState(workloads[0])

  return (
    <div className="bg-white text-black">
      {/* ===== HERO ===== */}
      <section className="relative px-6 lg:px-12 pt-20 lg:pt-28 pb-16 lg:pb-24 max-w-[1280px] mx-auto">
        {/* Title centré */}
        <h1
          className="text-center font-bold text-black mx-auto max-w-5xl"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
          }}
        >
          Maîtrisez Power BI &amp; Fabric.
        </h1>
        {/* Subtitle centré 2 lignes */}
        <p
          className="text-center mt-6 text-neutral-700 max-w-2xl mx-auto"
          style={{
            fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)',
            lineHeight: 1.4,
            letterSpacing: '-0.005em',
          }}
        >
          Outils interactifs, références complètes et patterns d'architecture
          <br className="hidden sm:block" />
          pour toute la stack data Microsoft.
        </p>
        {/* CTAs centrés : bleu solide + lien texte */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
          <Link
            to="/simulator"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md text-white font-medium transition-colors"
            style={{ background: NOTION_BLUE, fontSize: '15px', letterSpacing: '-0.005em' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = NOTION_BLUE_HOVER)}
            onMouseLeave={(e) => (e.currentTarget.style.background = NOTION_BLUE)}
          >
            Commencer gratuitement
          </Link>
          <Link
            to="/fabric"
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
            style={{ color: NOTION_BLUE, fontSize: '15px', letterSpacing: '-0.005em' }}
          >
            Explorer Fabric
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hero mockup avec doodles */}
        <div className="mt-16 lg:mt-20 relative">
          <div className="grid grid-cols-12 items-center gap-4">
            {/* Doodle gauche */}
            <div className="hidden lg:block col-span-2 h-[280px]">
              <DoodleLeft />
            </div>
            {/* Mockup central */}
            <div className="col-span-12 lg:col-span-8">
              <HeroMockup />
            </div>
            {/* Doodle droit */}
            <div className="hidden lg:block col-span-2 h-[280px]">
              <DoodleRight />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION "Visualize, filter & sort" → Simulateur ===== */}
      <section className="px-6 lg:px-12 py-24 lg:py-32 max-w-[1280px] mx-auto">
        <div className="max-w-3xl mb-12">
          <h2
            className="font-bold text-black"
            style={{
              fontSize: 'clamp(1.875rem, 3.5vw, 2.75rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
            }}
          >
            Simulez, comparez, optimisez votre capacité.
          </h2>
          <p
            className="mt-5 text-neutral-700 max-w-2xl"
            style={{ fontSize: '17px', lineHeight: 1.5, letterSpacing: '-0.005em' }}
          >
            Estimez votre consommation Fabric en quelques clics. Comparez les SKUs, anticipez le coût mensuel et trouvez la configuration optimale pour votre charge.
          </p>
        </div>

        <SimulatorMockup />

        {/* 2-col grid sous le mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 max-w-4xl mx-auto">
          <div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ background: NOTION_BLUE + '15' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: NOTION_BLUE }} />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ letterSpacing: '-0.015em' }}>
              Personnalisez votre simulation
            </h3>
            <p className="text-neutral-600" style={{ fontSize: '15px', lineHeight: 1.55 }}>
              Définissez vos propres workloads, charges, fréquences et catégories pour que la simulation reflète exactement votre réalité.
            </p>
          </div>
          <div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ background: NOTION_BLUE + '15' }}
            >
              <Code2 className="w-5 h-5" style={{ color: NOTION_BLUE }} />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ letterSpacing: '-0.015em' }}>
              Construisez vos modèles
            </h3>
            <p className="text-neutral-600" style={{ fontSize: '15px', lineHeight: 1.55 }}>
              Tout est drag &amp; drop dans Fabric — tables, mesures, jointures, jusqu'aux modèles sémantiques embarqués.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SECTION "Every team, side-by-side" → Workloads ===== */}
      <section className="bg-neutral-50 border-y border-neutral-200 py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto">
          <h2
            className="text-center font-bold text-black mx-auto max-w-3xl"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            Toutes les briques Fabric, côte à côte.
          </h2>

          {/* Tabs row avec icônes */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-12 mb-12">
            {workloads.map((w) => {
              const isActive = w.id === activeWorkload.id
              return (
                <button
                  key={w.id}
                  onClick={() => setActiveWorkload(w)}
                  className={`flex flex-col items-center gap-2 px-5 py-4 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'border-neutral-800 bg-white shadow-sm'
                      : 'border-neutral-200 bg-white/60 hover:bg-white'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: w.color + '18' }}
                  >
                    <w.icon className="w-5 h-5" style={{ color: w.color }} />
                  </div>
                  <span className="text-xs font-semibold text-neutral-800">{w.label}</span>
                </button>
              )
            })}
          </div>

          {/* Mockup workload */}
          <WorkloadMockup workload={activeWorkload} />
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-24 lg:py-32 px-6 lg:px-12 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {[
            { value: '190+', label: 'fonctions DAX' },
            { value: '80+', label: 'fiches techniques' },
            { value: '22', label: 'exercices' },
            { value: '20+', label: 'patterns architecture' },
          ].map((s) => (
            <div key={s.label}>
              <div
                className="font-bold text-black"
                style={{
                  fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}
              >
                {s.value}
              </div>
              <div className="mt-3 text-neutral-600" style={{ fontSize: '15px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER CTA DARK ===== */}
      <section className="bg-black text-white py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto text-center">
          <h2
            className="font-bold mx-auto max-w-3xl"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
            }}
          >
            Prêt à maîtriser Fabric ?
          </h2>
          <p
            className="mt-6 text-neutral-400 max-w-xl mx-auto"
            style={{ fontSize: '18px', lineHeight: 1.4, letterSpacing: '-0.005em' }}
          >
            Tout est gratuit. Aucune inscription. La référence francophone Microsoft data.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <Link
              to="/simulator"
              className="inline-flex items-center justify-center px-5 py-3 rounded-md font-medium transition-colors"
              style={{ background: NOTION_BLUE, fontSize: '15px', letterSpacing: '-0.005em' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = NOTION_BLUE_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.background = NOTION_BLUE)}
            >
              Commencer maintenant
            </Link>
            <Link
              to="/fabric"
              className="inline-flex items-center gap-1.5 font-medium hover:underline"
              style={{ color: NOTION_BLUE, fontSize: '15px', letterSpacing: '-0.005em' }}
            >
              Explorer la plateforme
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
