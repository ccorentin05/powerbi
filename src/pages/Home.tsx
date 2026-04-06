import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/*
 * Design EXACT inspiré de notion.com (réf : godly.website/website/notion-1013).
 * Règles strictes :
 *  - Fond blanc pur, texte noir
 *  - Typo serif/sans très serrée (letter-spacing négatif)
 *  - Hero énorme + 2 CTAs (noir solide + outline)
 *  - Bento grid avec cards COULEURS VIVES (teal, rouge, bleu, jaune) — pas pastel
 *  - Footer noir
 *  - Aucune ombre fancy, aucun gradient flashy, minimalisme assumé
 */

const clients = [
  'Power BI',
  'Microsoft Fabric',
  'OneLake',
  'DAX',
  'Power Query',
  'Lakehouse',
  'Data Factory',
  'Copilot',
]

const stats = [
  { value: '190+', label: 'fonctions DAX documentées' },
  { value: '80+', label: 'fiches techniques' },
  { value: '22', label: 'exercices pratiques' },
  { value: '20+', label: 'patterns architecture' },
]

const bento = [
  {
    bg: '#0F7A6E',
    eyebrow: 'Simulateur',
    title: 'Calculez votre capacité Fabric en quelques clics.',
    desc: 'Estimez les CU/s, le coût mensuel et la SKU optimale selon votre charge.',
    href: '/simulateur',
    span: 'lg:col-span-2 lg:row-span-2',
    artClass: 'bg-white/10',
  },
  {
    bg: '#C13B2A',
    eyebrow: 'DAX',
    title: '190+ fonctions à portée de main.',
    desc: 'Référence interactive avec exemples et catégories.',
    href: '/dax',
    span: 'lg:col-span-2',
  },
  {
    bg: '#1E6FD9',
    eyebrow: 'Workloads Fabric',
    title: 'Plongez dans chaque brique.',
    desc: 'Lakehouse, Warehouse, Real-Time, Data Science, Activator.',
    href: '/fabric-deep-dive',
    span: '',
  },
  {
    bg: '#E8A317',
    eyebrow: 'Patterns',
    title: '20+ architectures éprouvées.',
    desc: 'Médaillon, Data Vault, star schema, lambda, kappa.',
    href: '/architecture-patterns',
    span: '',
  },
  {
    bg: '#7D3FBF',
    eyebrow: 'Copilot & MCP',
    title: 'Vibe BI — la nouvelle façon de coder vos rapports.',
    desc: 'Agents Copilot et serveurs MCP pour développer en langage naturel.',
    href: '/copilot-mcp',
    span: 'lg:col-span-2',
  },
  {
    bg: '#0A0A0A',
    eyebrow: 'CI/CD',
    title: 'API REST, Git & déploiements automatisés.',
    desc: 'Pipelines de déploiement, branches Git, intégration continue.',
    href: '/api-cicd',
    span: '',
  },
  {
    bg: '#D6336C',
    eyebrow: 'Optimisation',
    title: 'Checklist de performance.',
    desc: 'Auditez vos modèles, mesures et requêtes.',
    href: '/optimisation',
    span: '',
  },
]

const useCases = [
  {
    title: 'Analystes BI',
    desc: 'Maîtrisez DAX, Power Query et la modélisation en étoile pour livrer des rapports rapides et fiables.',
  },
  {
    title: 'Data Engineers',
    desc: 'Construisez des Lakehouses Fabric, orchestrez vos pipelines et exposez la donnée gouvernée.',
  },
  {
    title: 'Architectes',
    desc: 'Choisissez les bons patterns, dimensionnez la capacité, et planifiez la migration vers Fabric.',
  },
  {
    title: 'Décideurs',
    desc: 'Comprenez les coûts, la roadmap et le ROI de Microsoft Fabric pour votre organisation.',
  },
]

export default function Home() {
  return (
    <div className="bg-white text-black">
      {/* HERO */}
      <section className="px-6 lg:px-12 pt-24 pb-20 lg:pt-32 lg:pb-28 max-w-[1280px] mx-auto">
        <div className="max-w-4xl">
          <h1
            className="font-bold text-black"
            style={{
              fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            La référence francophone Power BI &amp; Fabric.
          </h1>
          <p
            className="mt-8 text-neutral-600 max-w-2xl"
            style={{
              fontSize: 'clamp(1.125rem, 1.4vw, 1.375rem)',
              lineHeight: 1.4,
              letterSpacing: '-0.01em',
            }}
          >
            Outils interactifs, plus de 190 fonctions DAX, 80 fiches techniques et tous les patterns d&apos;architecture pour maîtriser l&apos;écosystème Microsoft data.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/simulateur"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-black text-white font-medium hover:bg-neutral-800 transition-colors"
              style={{ fontSize: '15px', letterSpacing: '-0.005em' }}
            >
              Commencer gratuitement
            </Link>
            <Link
              to="/fabric-deep-dive"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-white text-black font-medium border border-neutral-300 hover:border-black transition-colors"
              style={{ fontSize: '15px', letterSpacing: '-0.005em' }}
            >
              Explorer Fabric
            </Link>
          </div>
        </div>
      </section>

      {/* CLIENTS / TECHS */}
      <section className="border-y border-neutral-200 py-10 lg:py-12">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-6 text-center">
            La stack data Microsoft, couverte de bout en bout
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {clients.map((c) => (
              <span
                key={c}
                className="text-neutral-700 font-medium"
                style={{ fontSize: '17px', letterSpacing: '-0.01em' }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[980px] mx-auto text-center">
          <p
            className="font-medium text-black"
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
            }}
          >
            « La plateforme la plus claire pour comprendre Fabric, sans le marketing. »
          </p>
          <p className="mt-6 text-neutral-500" style={{ fontSize: '15px' }}>
            — Retour communauté francophone Power BI
          </p>
        </div>
      </section>

      {/* BENTO */}
      <section className="px-6 lg:px-12 pb-24 lg:pb-32">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12 lg:mb-16 max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
              Tout ce dont vous avez besoin
            </p>
            <h2
              className="font-bold text-black"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.75rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.035em',
              }}
            >
              Une plateforme. Toutes les briques Fabric.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 auto-rows-[260px] gap-4">
            {bento.map((card) => (
              <Link
                key={card.title}
                to={card.href}
                className={`group relative overflow-hidden rounded-2xl p-8 lg:p-10 flex flex-col justify-between text-white transition-transform hover:-translate-y-1 ${card.span}`}
                style={{ background: card.bg }}
              >
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-70 mb-4">
                    {card.eyebrow}
                  </p>
                  <h3
                    className="font-bold"
                    style={{
                      fontSize: 'clamp(1.5rem, 2vw, 2rem)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.025em',
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="mt-4 opacity-80 max-w-md"
                    style={{ fontSize: '15px', lineHeight: 1.5, letterSpacing: '-0.005em' }}
                  >
                    {card.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium opacity-90 group-hover:opacity-100">
                  <span>Découvrir</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-t border-neutral-200 py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  className="font-bold text-black"
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="mt-3 text-neutral-600"
                  style={{ fontSize: '15px', letterSpacing: '-0.005em' }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="border-t border-neutral-200 py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12 lg:mb-16 max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
              Pour qui
            </p>
            <h2
              className="font-bold text-black"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.75rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.035em',
              }}
            >
              Une ressource pensée pour chaque profil data.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {useCases.map((u) => (
              <div key={u.title} className="border-t border-neutral-200 pt-8">
                <h3
                  className="font-bold text-black"
                  style={{
                    fontSize: '24px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {u.title}
                </h3>
                <p
                  className="mt-3 text-neutral-600 max-w-lg"
                  style={{ fontSize: '16px', lineHeight: 1.55, letterSpacing: '-0.005em' }}
                >
                  {u.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA — DARK */}
      <section className="bg-black text-white py-28 lg:py-40 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto text-center">
          <h2
            className="font-bold"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            Prêt à maîtriser Fabric ?
          </h2>
          <p
            className="mt-8 text-neutral-400 max-w-2xl mx-auto"
            style={{ fontSize: '20px', lineHeight: 1.4, letterSpacing: '-0.01em' }}
          >
            Tous les outils, toutes les ressources, tout en français. Aucune inscription requise.
          </p>
          <div className="mt-12 flex flex-wrap gap-3 justify-center">
            <Link
              to="/simulateur"
              className="inline-flex items-center justify-center px-7 py-4 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
              style={{ fontSize: '15px', letterSpacing: '-0.005em' }}
            >
              Commencer maintenant
            </Link>
            <Link
              to="/fabric-deep-dive"
              className="inline-flex items-center justify-center px-7 py-4 rounded-lg bg-transparent text-white font-medium border border-neutral-700 hover:border-white transition-colors"
              style={{ fontSize: '15px', letterSpacing: '-0.005em' }}
            >
              Explorer la plateforme
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
