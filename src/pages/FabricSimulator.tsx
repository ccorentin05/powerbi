import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Server,
  Cpu,
  HardDrive,
  Zap,
  Users,
  Clock,
  TrendingUp,
  ChevronRight,
  Database,
  RefreshCw,
  BookOpen,
  Sparkles,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  SlidersHorizontal,
} from 'lucide-react'
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { fabricCapacities, type FabricCapacity } from '../data/fabricCapacities'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatEuro(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n)
}

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={Math.round(value)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {formatEuro(value)}
    </motion.span>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FabricSimulator() {
  // Capacity selector
  const [selectedIdx, setSelectedIdx] = useState(2) // F8 default
  const selected: FabricCapacity = fabricCapacities[selectedIdx]

  // Cost calculator
  const [yearly, setYearly] = useState(false)
  const [hoursPerDay, setHoursPerDay] = useState(8)
  const [payg, setPayg] = useState(false)

  // Workload estimator
  const [datasets, setDatasets] = useState(10)
  const [avgSize, setAvgSize] = useState(2)
  const [dailyRefreshes, setDailyRefreshes] = useState(4)
  const [concurrentUsers, setConcurrentUsers] = useState(50)
  const [sparkNotebooks, setSparkNotebooks] = useState(0)

  /* ---------- derived costs ---------- */
  const multiplier = payg ? 1.5 : 1
  const hourFraction = hoursPerDay / 24
  const monthlyCost = selected.monthlyPrice * multiplier * hourFraction
  const yearlyCost = monthlyCost * 12
  const displayCost = yearly ? yearlyCost : monthlyCost

  const reservedMonthly = selected.monthlyPrice * hourFraction
  const paygMonthly = selected.monthlyPrice * 1.5 * hourFraction
  const savingsMonthly = paygMonthly - reservedMonthly
  const savingsYearly = savingsMonthly * 12

  /* ---------- comparison chart data ---------- */
  const comparisonData = useMemo(
    () =>
      fabricCapacities.map((c) => {
        const cost = yearly
          ? c.monthlyPrice * multiplier * hourFraction * 12
          : c.monthlyPrice * multiplier * hourFraction
        return {
          sku: c.sku,
          cost: Math.round(cost),
          costPerCU: +(cost / c.cuPerSecond).toFixed(2),
        }
      }),
    [multiplier, hourFraction, yearly],
  )

  /* ---------- workload recommendation ---------- */
  const { recommendedIdx, utilization } = useMemo(() => {
    const memoryNeed = datasets * avgSize
    const concurrencyNeed = Math.ceil(concurrentUsers / 25)
    const sparkNeed = sparkNotebooks * 4
    const refreshNeed = dailyRefreshes * datasets * 0.05

    let bestIdx = 0
    let bestUtil = 999

    for (let i = 0; i < fabricCapacities.length; i++) {
      const cap = fabricCapacities[i]
      const memUtil = (memoryNeed / cap.maxMemoryGB) * 100
      const jobUtil = (concurrencyNeed / cap.maxConcurrentJobs) * 100
      const sparkUtil = cap.sparkVCores > 0 ? (sparkNeed / cap.sparkVCores) * 100 : sparkNeed > 0 ? 999 : 0
      const cuUtil = (refreshNeed / cap.cuPerSecond) * 100
      const maxUtil = Math.max(memUtil, jobUtil, sparkUtil, cuUtil)

      if (maxUtil <= 100) {
        bestIdx = i
        bestUtil = maxUtil
        break
      }
      bestIdx = i
      bestUtil = maxUtil
    }
    return { recommendedIdx: bestIdx, utilization: Math.min(bestUtil, 100) }
  }, [datasets, avgSize, dailyRefreshes, concurrentUsers, sparkNotebooks])

  const recommended = fabricCapacities[recommendedIdx]

  /* ---------- pie chart data ---------- */
  const pieData = useMemo(() => {
    const compute = displayCost * 0.72
    const storage = displayCost * 0.18
    const networking = displayCost * 0.10
    return [
      { name: 'Compute', value: Math.round(compute), color: '#0078d4' },
      { name: 'Stockage', value: Math.round(storage), color: '#f2c811' },
      { name: 'Reseau', value: Math.round(networking), color: '#10b981' },
    ]
  }, [displayCost])

  /* ---------- spec items ---------- */
  const specs = [
    { icon: Cpu, label: 'CU / seconde', value: selected.cuPerSecond },
    { icon: HardDrive, label: 'Memoire max', value: `${selected.maxMemoryGB} GB` },
    { icon: Users, label: 'Jobs simultanes', value: selected.maxConcurrentJobs },
    { icon: Zap, label: 'Spark vCores', value: selected.sparkVCores || '--' },
    { icon: Database, label: 'OneLake', value: `${selected.oneLakeStorageTB} TB` },
  ]

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-10">
      {/* -------- HEADER -------- */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-2">
          Simulateur de Couts Fabric
        </h1>
        <p className="text-pbi-muted max-w-2xl">
          Estimez les couts Microsoft Fabric en temps reel. Selectionnez une capacite, ajustez les
          parametres et visualisez l'impact sur votre budget.
        </p>
      </motion.div>

      {/* -------- CAPACITY SELECTOR -------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-pbi-text">
          <Server className="w-5 h-5 text-fabric" />
          Selectionnez une capacite
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
          {fabricCapacities.map((cap, idx) => {
            const active = idx === selectedIdx
            return (
              <motion.button
                key={cap.sku}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedIdx(idx)}
                className={`relative rounded-xl px-3 py-3 text-center transition-colors cursor-pointer ${
                  active
                    ? 'bg-fabric/20 border-2 border-fabric text-white'
                    : 'glass-card hover:bg-pbi-card-hover text-pbi-muted border border-pbi-border/40'
                }`}
                style={
                  active
                    ? { boxShadow: '0 0 24px rgba(0,120,212,0.35), 0 0 60px rgba(0,120,212,0.1)' }
                    : undefined
                }
              >
                <span className="block text-sm font-bold">{cap.sku}</span>
                <span className="block text-[10px] mt-0.5 opacity-70">{cap.cuPerSecond} CU/s</span>
                {active && (
                  <motion.div
                    layoutId="capacity-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-fabric"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Specs for selected capacity */}
        <motion.div
          key={selected.sku}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-5 flex flex-wrap gap-6 items-center"
        >
          <div className="flex items-center gap-2 mr-auto">
            <div className="w-10 h-10 rounded-lg bg-fabric/15 flex items-center justify-center">
              <Server className="w-5 h-5 text-fabric" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">{selected.sku}</p>
              <p className="text-xs text-pbi-muted">{selected.bestFor}</p>
            </div>
          </div>
          {specs.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <s.icon className="w-4 h-4 text-pbi-muted" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-pbi-muted">{s.label}</p>
                <p className="text-sm font-semibold text-pbi-text">{s.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* -------- TWO COLUMN: COST CALCULATOR + COMPARISON CHART -------- */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cost Calculator */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-6 space-y-6"
        >
          <div className="flex items-center gap-2 text-lg font-semibold text-pbi-text">
            <DollarSign className="w-5 h-5 text-primary" />
            Calculateur de couts
          </div>

          {/* Monthly / Yearly toggle */}
          <div className="flex items-center gap-3">
            <span className={`text-sm ${!yearly ? 'text-primary font-semibold' : 'text-pbi-muted'}`}>
              Mensuel
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className="relative w-12 h-6 rounded-full bg-pbi-border transition-colors cursor-pointer"
              style={yearly ? { background: 'rgba(0,120,212,0.5)' } : undefined}
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                animate={{ left: yearly ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm ${yearly ? 'text-fabric font-semibold' : 'text-pbi-muted'}`}>
              Annuel
            </span>
          </div>

          {/* Hours per day slider */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-pbi-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Heures / jour
              </span>
              <span className="text-white font-semibold">{hoursPerDay}h</span>
            </div>
            <input
              type="range"
              min={1}
              max={24}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(+e.target.value)}
            />
          </div>

          {/* Reserved vs PAYG */}
          <div className="flex items-center gap-3">
            <span className={`text-sm ${!payg ? 'text-success font-semibold' : 'text-pbi-muted'}`}>
              Reserve
            </span>
            <button
              onClick={() => setPayg(!payg)}
              className="relative w-12 h-6 rounded-full bg-pbi-border transition-colors cursor-pointer"
              style={payg ? { background: 'rgba(239,68,68,0.4)' } : undefined}
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                animate={{ left: payg ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm ${payg ? 'text-danger font-semibold' : 'text-pbi-muted'}`}>
              PAYG (x1.5)
            </span>
          </div>

          {/* Cost display */}
          <div className="rounded-xl bg-pbi-darker/60 p-5 text-center space-y-1">
            <p className="text-pbi-muted text-sm">
              Cout estime {yearly ? 'annuel' : 'mensuel'}
            </p>
            <p className="text-3xl md:text-4xl font-extrabold text-white">
              <AnimatedNumber value={displayCost} />
            </p>
            <p className="text-xs text-pbi-muted">
              {selected.sku} &middot; {hoursPerDay}h/jour &middot; {payg ? 'PAYG' : 'Reserve'}
            </p>
          </div>

          {/* Savings */}
          <div className="rounded-xl border border-success/20 bg-success/5 p-4 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-success">Economie Reserve vs PAYG</p>
              <p className="text-white font-bold text-lg">
                {formatEuro(yearly ? savingsYearly : savingsMonthly)}{' '}
                <span className="text-pbi-muted text-xs font-normal">
                  / {yearly ? 'an' : 'mois'}
                </span>
              </p>
            </div>
          </div>
        </motion.section>

        {/* Comparison Chart */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-lg font-semibold text-pbi-text">
            <BarChart3 className="w-5 h-5 text-fabric" />
            Comparaison des SKU
          </div>
          <p className="text-xs text-pbi-muted">
            Cout {yearly ? 'annuel' : 'mensuel'} ({payg ? 'PAYG' : 'Reserve'}, {hoursPerDay}h/j) et
            cout/CU
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={comparisonData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,58,92,0.5)" />
                <XAxis
                  dataKey="sku"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#2a3a5c' }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#16213e',
                    border: '1px solid #2a3a5c',
                    borderRadius: 12,
                    color: '#e2e8f0',
                    fontSize: 13,
                  }}
                  formatter={(value: any, name: any) => {
                    if (name === 'cost') return [formatEuro(value), 'Cout']
                    return [`${value} EUR/CU`, 'Cout/CU']
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="cost"
                  fill="#0078d4"
                  radius={[4, 4, 0, 0]}
                  opacity={0.85}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="costPerCU"
                  stroke="#f2c811"
                  strokeWidth={2}
                  dot={{ fill: '#f2c811', r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>

      {/* -------- TWO COLUMN: WORKLOAD ESTIMATOR + PIE CHART -------- */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Workload Estimator */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-6 space-y-5"
        >
          <div className="flex items-center gap-2 text-lg font-semibold text-pbi-text">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            Estimateur de charge
          </div>
          <p className="text-xs text-pbi-muted">
            Decrivez votre usage pour obtenir une recommandation de capacite.
          </p>

          {/* Workload sliders */}
          {[
            { label: 'Datasets', icon: Database, value: datasets, set: setDatasets, min: 1, max: 200, step: 1, unit: '' },
            { label: 'Taille moyenne (GB)', icon: HardDrive, value: avgSize, set: setAvgSize, min: 0.5, max: 50, step: 0.5, unit: ' GB' },
            { label: 'Rafraichissements / jour', icon: RefreshCw, value: dailyRefreshes, set: setDailyRefreshes, min: 1, max: 48, step: 1, unit: '' },
            { label: 'Utilisateurs simultanes', icon: Users, value: concurrentUsers, set: setConcurrentUsers, min: 1, max: 500, step: 1, unit: '' },
            { label: 'Spark notebooks', icon: BookOpen, value: sparkNotebooks, set: setSparkNotebooks, min: 0, max: 50, step: 1, unit: '' },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-pbi-muted flex items-center gap-1">
                  <s.icon className="w-3.5 h-3.5" /> {s.label}
                </span>
                <span className="text-white font-semibold">
                  {s.value}{s.unit}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={s.value}
                onChange={(e) => s.set(+e.target.value)}
              />
            </div>
          ))}

          {/* Recommendation result */}
          <AnimatePresence mode="wait">
            <motion.div
              key={recommended.sku}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-fabric/30 bg-fabric/5 p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-fabric" />
                <p className="font-semibold text-white">
                  Capacite recommandee :{' '}
                  <span className="text-fabric">{recommended.sku}</span>
                </p>
              </div>

              {/* Utilization bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-pbi-muted">Utilisation estimee</span>
                  <span
                    className={`font-semibold ${
                      utilization > 80 ? 'text-danger' : utilization > 50 ? 'text-warning' : 'text-success'
                    }`}
                  >
                    {Math.round(utilization)}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-pbi-darker/60 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(utilization, 100)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                      background:
                        utilization > 80
                          ? '#ef4444'
                          : utilization > 50
                            ? '#f59e0b'
                            : '#10b981',
                    }}
                  />
                </div>
              </div>

              <p className="text-xs text-pbi-muted">
                {recommended.bestFor} &middot; {recommended.maxMemoryGB} GB memoire &middot;{' '}
                {recommended.maxConcurrentJobs} jobs simultanes
              </p>

              <button
                onClick={() => setSelectedIdx(recommendedIdx)}
                className="flex items-center gap-1 text-sm text-fabric hover:text-fabric-light transition-colors cursor-pointer"
              >
                Appliquer cette capacite <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* Pie Chart - Cost Breakdown */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-lg font-semibold text-pbi-text">
            <PieChartIcon className="w-5 h-5 text-primary" />
            Repartition des couts
          </div>
          <p className="text-xs text-pbi-muted">
            Estimation de la repartition {yearly ? 'annuelle' : 'mensuelle'} pour {selected.sku}
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#16213e',
                    border: '1px solid #2a3a5c',
                    borderRadius: 12,
                    color: '#e2e8f0',
                    fontSize: 13,
                  }}
                  formatter={(value: any) => formatEuro(value)}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
                  formatter={(value: string) => <span style={{ color: '#e2e8f0' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend detail cards */}
          <div className="grid grid-cols-3 gap-3">
            {pieData.map((d) => (
              <motion.div
                key={d.name}
                layout
                className="rounded-lg bg-pbi-darker/50 p-3 text-center"
              >
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-1"
                  style={{ background: d.color }}
                />
                <p className="text-[10px] uppercase tracking-wider text-pbi-muted">{d.name}</p>
                <p className="text-sm font-bold text-white">{formatEuro(d.value)}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
