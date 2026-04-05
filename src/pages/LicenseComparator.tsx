import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  X,
  Users,
  TrendingUp,
  Lightbulb,
  Crown,
  SlidersHorizontal,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { licenses, type License } from '../data/licenses'
import GlowCard from '../components/GlowCard'

/* ---------- helpers ---------- */

function totalCost(license: License, userCount: number): number {
  if (license.pricePerCapacityMonth !== null) {
    return license.pricePerCapacityMonth
  }
  return (license.pricePerUserMonth ?? 0) * userCount
}

function formatEur(n: number): string {
  return n.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  })
}

function bestLicenseIndex(userCount: number): number {
  let best = 0
  let bestCost = Infinity
  licenses.forEach((lic, i) => {
    // Skip Free -- it has no sharing, not a real option for teams
    if (lic.pricePerUserMonth === 0 && lic.pricePerCapacityMonth === null) return
    const cost = totalCost(lic, userCount)
    if (cost < bestCost) {
      bestCost = cost
      best = i
    }
  })
  return best
}

const featureCategories: { label: string; features: string[] }[] = [
  {
    label: 'Core',
    features: ['Create reports', 'Personal workspace', 'Share dashboards', 'App workspaces'],
  },
  {
    label: 'Premium',
    features: ['Paginated reports', 'Dataflows Gen2', 'AI features', 'Deployment pipelines'],
  },
  {
    label: 'Enterprise',
    features: ['XMLA endpoint', 'Auto page refresh', 'Dataset size limit', 'Refresh frequency'],
  },
]

const allFeatures = featureCategories.flatMap((c) => c.features)

function glowColor(hex: string): 'yellow' | 'blue' | 'green' | 'none' {
  if (hex === '#f2c811') return 'yellow'
  if (hex === '#3b82f6') return 'blue'
  if (hex === '#10b981') return 'green'
  return 'none'
}

/* ---------- chart data ---------- */

function buildChartData() {
  const points: Record<string, number | string>[] = []
  for (let u = 10; u <= 2000; u += 10) {
    const row: Record<string, number | string> = { users: u }
    licenses.forEach((lic) => {
      row[lic.name] = totalCost(lic, u)
    })
    points.push(row)
  }
  return points
}

/* ---------- recommendation ---------- */

function getRecommendation(userCount: number) {
  const idx = bestLicenseIndex(userCount)
  const lic = licenses[idx]
  const cost = totalCost(lic, userCount)

  const reasons: Record<string, string> = {
    'Power BI Pro': `Power BI Pro est le choix optimal a ${formatEur(cost)}/mois. Chaque utilisateur dispose d'un acces complet au partage et a la collaboration pour seulement ${formatEur(lic.pricePerUserMonth ?? 0)}/utilisateur.`,
    'Power BI PPU': `Power BI PPU offre le meilleur rapport fonctionnalites/prix a ${formatEur(cost)}/mois. Vous beneficiez des fonctionnalites Premium (paginated reports, AI, pipelines) sans investir dans une capacite dediee.`,
    'Fabric Capacity': `La capacite Fabric est la plus rentable a ${formatEur(cost)}/mois pour ${userCount.toLocaleString('fr-FR')} utilisateurs. Le cout fixe de la capacite est inferieur au cout par utilisateur des licences individuelles, et vous obtenez toutes les fonctionnalites Premium + Fabric.`,
    'Power BI Free': `Power BI Free convient pour de l'exploration individuelle, mais ne permet pas le partage. Envisagez Power BI Pro pour collaborer.`,
  }

  return {
    license: lic,
    cost,
    text: reasons[lic.name] ?? '',
  }
}

/* ---------- component ---------- */

export default function LicenseComparator() {
  const [userCount, setUserCount] = useState(100)
  const chartData = useMemo(buildChartData, [])
  const recommended = bestLicenseIndex(userCount)
  const recommendation = useMemo(() => getRecommendation(userCount), [userCount])

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-12 pb-8 px-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className="gradient-text">Comparateur de Licences Power BI</span>
        </h1>
        <p className="text-pbi-muted text-lg max-w-2xl mx-auto">
          Comparez les licences en temps reel et trouvez la meilleure option selon votre nombre
          d'utilisateurs.
        </p>
      </motion.section>

      {/* Slider */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <GlowCard color="yellow" className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <SlidersHorizontal className="text-primary" size={22} />
            <h2 className="text-xl font-semibold text-pbi-text">Nombre d'utilisateurs</h2>
          </div>
          <div className="flex items-center gap-6">
            <input
              type="range"
              min={10}
              max={5000}
              step={10}
              value={userCount}
              onChange={(e) => setUserCount(Number(e.target.value))}
              className="flex-1"
            />
            <motion.span
              key={userCount}
              initial={{ scale: 1.2, color: '#f2c811' }}
              animate={{ scale: 1, color: '#e2e8f0' }}
              className="text-3xl font-bold tabular-nums min-w-[5ch] text-right"
            >
              {userCount.toLocaleString('fr-FR')}
            </motion.span>
            <Users className="text-pbi-muted" size={20} />
          </div>
        </GlowCard>
      </section>

      {/* License Cards */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {licenses.map((lic, i) => {
            const cost = totalCost(lic, userCount)
            const isBest = i === recommended

            return (
              <motion.div
                key={lic.name}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* Best badge */}
                <AnimatePresence>
                  {isBest && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: lic.color, color: '#1a1a2e' }}
                    >
                      <Crown size={12} />
                      Recommande
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  animate={{
                    borderColor: isBest ? lic.color : 'rgba(42, 58, 92, 0.5)',
                    boxShadow: isBest
                      ? `0 0 30px ${lic.color}33, 0 0 80px ${lic.color}11`
                      : '0 0 0 transparent',
                  }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl overflow-hidden border"
                  style={{
                    background: 'rgba(22, 33, 62, 0.7)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Color bar */}
                  <div className="h-1.5" style={{ background: lic.color }} />

                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-1" style={{ color: lic.color }}>
                      {lic.name}
                    </h3>
                    <p className="text-pbi-muted text-sm mb-4">{lic.description}</p>

                    {/* Pricing */}
                    <div className="mb-4">
                      {lic.pricePerUserMonth !== null ? (
                        <div>
                          <span className="text-2xl font-bold text-pbi-text">
                            {formatEur(lic.pricePerUserMonth)}
                          </span>
                          <span className="text-pbi-muted text-sm"> /utilisateur/mois</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-2xl font-bold text-pbi-text">
                            {formatEur(lic.pricePerCapacityMonth ?? 0)}
                          </span>
                          <span className="text-pbi-muted text-sm"> /capacite/mois</span>
                        </div>
                      )}
                    </div>

                    {/* Total cost */}
                    <motion.div
                      key={cost}
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                      className="rounded-lg p-3 mb-4"
                      style={{ background: `${lic.color}15` }}
                    >
                      <div className="text-xs text-pbi-muted mb-0.5">
                        Cout total ({userCount.toLocaleString('fr-FR')} utilisateurs)
                      </div>
                      <div className="text-xl font-bold" style={{ color: lic.color }}>
                        {formatEur(cost)}
                        <span className="text-sm font-normal text-pbi-muted"> /mois</span>
                      </div>
                    </motion.div>

                    {/* Features */}
                    <ul className="space-y-1.5">
                      {allFeatures.map((feat) => {
                        const val = lic.features[feat]
                        return (
                          <li key={feat} className="flex items-center gap-2 text-sm">
                            {val === true ? (
                              <Check size={14} className="text-success shrink-0" />
                            ) : val === false ? (
                              <X size={14} className="text-danger shrink-0" />
                            ) : (
                              <span
                                className="w-3.5 h-3.5 shrink-0 text-xs flex items-center justify-center rounded"
                                style={{ background: `${lic.color}25`, color: lic.color }}
                              >
                                ~
                              </span>
                            )}
                            <span className="text-pbi-muted">
                              {feat}
                              {typeof val === 'string' && (
                                <span className="ml-1 text-pbi-text font-medium">({val})</span>
                              )}
                            </span>
                          </li>
                        )
                      })}
                    </ul>

                    <div className="mt-4 pt-3 border-t border-pbi-border">
                      <p className="text-xs text-pbi-muted">
                        <span className="font-medium text-pbi-text">Ideal pour :</span>{' '}
                        {lic.bestFor}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <GlowCard color="blue" className="overflow-hidden">
          <div className="p-6 pb-2">
            <h2 className="text-2xl font-bold text-pbi-text">Matrice de fonctionnalites</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr style={{ background: 'rgba(15, 15, 30, 0.95)' }}>
                  <th className="text-left py-3 px-5 text-pbi-muted font-medium">
                    Fonctionnalite
                  </th>
                  {licenses.map((lic) => (
                    <th
                      key={lic.name}
                      className="py-3 px-4 font-semibold text-center"
                      style={{ color: lic.color }}
                    >
                      {lic.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureCategories.map((cat) => (
                  <>
                    {/* Category header */}
                    <tr key={`cat-${cat.label}`}>
                      <td
                        colSpan={licenses.length + 1}
                        className="py-2 px-5 text-xs uppercase tracking-wider font-bold text-primary"
                        style={{ background: 'rgba(242, 200, 17, 0.06)' }}
                      >
                        {cat.label}
                      </td>
                    </tr>
                    {cat.features.map((feat) => (
                      <tr
                        key={feat}
                        className="transition-colors duration-200 hover:bg-pbi-card-hover"
                        style={{ borderBottom: '1px solid rgba(42, 58, 92, 0.3)' }}
                      >
                        <td className="py-2.5 px-5 text-pbi-text">{feat}</td>
                        {licenses.map((lic) => {
                          const val = lic.features[feat]
                          return (
                            <td key={lic.name} className="py-2.5 px-4 text-center">
                              {val === true ? (
                                <Check size={16} className="inline text-success" />
                              ) : val === false ? (
                                <X size={16} className="inline text-danger opacity-50" />
                              ) : (
                                <span className="text-pbi-text font-medium">{val}</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </GlowCard>
      </section>

      {/* Break-even Chart */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <GlowCard color="green" className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-success" size={22} />
            <h2 className="text-2xl font-bold text-pbi-text">Seuil de rentabilite</h2>
          </div>
          <p className="text-pbi-muted text-sm mb-6">
            Cout mensuel en fonction du nombre d'utilisateurs. La ligne en pointilles represente
            votre selection actuelle ({userCount.toLocaleString('fr-FR')} utilisateurs).
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 58, 92, 0.5)" />
              <XAxis
                dataKey="users"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                label={{
                  value: 'Utilisateurs',
                  position: 'insideBottomRight',
                  offset: -5,
                  fill: '#94a3b8',
                }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                label={{
                  value: 'EUR/mois',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -5,
                  fill: '#94a3b8',
                }}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(22, 33, 62, 0.95)',
                  border: '1px solid rgba(42, 58, 92, 0.5)',
                  borderRadius: 12,
                  color: '#e2e8f0',
                }}
                formatter={(value: any, name: any) => [formatEur(value), name]}
                labelFormatter={(label: any) => `${label} utilisateurs`}
              />
              <Legend wrapperStyle={{ color: '#e2e8f0' }} />
              {licenses.map((lic) => (
                <Line
                  key={lic.name}
                  type="monotone"
                  dataKey={lic.name}
                  stroke={lic.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              ))}
              {userCount <= 2000 && (
                <ReferenceLine
                  x={userCount}
                  stroke="#f2c811"
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  label={{
                    value: `${userCount}`,
                    position: 'top',
                    fill: '#f2c811',
                    fontSize: 12,
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </GlowCard>
      </section>

      {/* Smart Recommendation */}
      <section className="max-w-5xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={recommendation.license.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <GlowCard color={glowColor(recommendation.license.color)} className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${recommendation.license.color}20` }}
                >
                  <Lightbulb size={24} style={{ color: recommendation.license.color }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold mb-1"
                    style={{ color: recommendation.license.color }}
                  >
                    Recommandation pour {userCount.toLocaleString('fr-FR')} utilisateurs
                  </h2>
                  <p className="text-pbi-muted leading-relaxed">{recommendation.text}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
                    <div>
                      <span className="text-pbi-muted">Licence :</span>{' '}
                      <span className="font-semibold text-pbi-text">
                        {recommendation.license.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-pbi-muted">Cout mensuel :</span>{' '}
                      <span
                        className="font-semibold"
                        style={{ color: recommendation.license.color }}
                      >
                        {formatEur(recommendation.cost)}
                      </span>
                    </div>
                    {recommendation.license.pricePerUserMonth !== null && userCount > 0 && (
                      <div>
                        <span className="text-pbi-muted">Par utilisateur :</span>{' '}
                        <span className="font-semibold text-pbi-text">
                          {formatEur(recommendation.cost / userCount)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  )
}
