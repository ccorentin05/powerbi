import { useState, useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Layers,
  Shield,
  Zap,
  Brain,
  GitMerge,
  Copy,
  Check,
  Server,
  Database,
  Users,
  BarChart3,
  Calculator,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts'
import { fabricCapacities } from '../data/fabricCapacities'

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                   */
/* ------------------------------------------------------------------ */

interface PremiumCapacity {
  name: string
  monthlyCost: number
}

const premiumCapacities: PremiumCapacity[] = [
  { name: 'Aucune', monthlyCost: 0 },
  { name: 'P1 (8 vCores)', monthlyCost: 4995 },
  { name: 'P2 (16 vCores)', monthlyCost: 9990 },
  { name: 'P3 (32 vCores)', monthlyCost: 19980 },
  { name: 'P4 (64 vCores)', monthlyCost: 39960 },
  { name: 'P5 (128 vCores)', monthlyCost: 79920 },
]

const PRO_LICENSE_COST = 9.40 // EUR/user/month
const PPU_LICENSE_COST = 18.70 // EUR/user/month
const ONELAKE_COST_PER_TB = 23 // EUR/TB/month approx

const PIE_COLORS = ['#f2c811', '#0078d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899']

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                     */
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
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/*  Slider Input                                                        */
/* ------------------------------------------------------------------ */

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  prefix = '',
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  prefix?: string
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm text-pbi-muted">{label}</label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-xs text-pbi-muted">{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (v >= min && v <= max) onChange(v)
            }}
            className="w-24 text-right text-sm bg-pbi-darker border border-pbi-border rounded-lg px-2 py-1 text-pbi-text focus:outline-none focus:border-primary"
          />
          {unit && <span className="text-xs text-pbi-muted ml-1">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Chart Tooltips                                                      */
/* ------------------------------------------------------------------ */

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-4 py-2 text-sm">
      <p className="text-primary font-semibold">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.fill || p.color }}>
          {p.name}: {Number(p.value).toLocaleString('fr-FR')} EUR
        </p>
      ))}
    </div>
  )
}

function LineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-4 py-2 text-sm">
      <p className="text-pbi-muted font-semibold">Mois {label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.stroke }}>
          {p.name}: {Number(p.value).toLocaleString('fr-FR')} EUR
        </p>
      ))}
    </div>
  )
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-4 py-2 text-sm">
      <p className="text-primary font-semibold">{payload[0].name}</p>
      <p className="text-pbi-text">{Number(payload[0].value).toLocaleString('fr-FR')} EUR/mois</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  KPI Card                                                            */
/* ------------------------------------------------------------------ */

function KpiCard({
  label,
  value,
  unit,
  color,
  icon: Icon,
  delay = 0,
}: {
  label: string
  value: string
  unit?: string
  color: 'green' | 'blue' | 'yellow' | 'red'
  icon: any
  delay?: number
}) {
  const colorMap = {
    green: { bg: 'bg-success/15', text: 'text-success', border: 'border-success/20' },
    blue: { bg: 'bg-fabric/15', text: 'text-fabric', border: 'border-fabric/20' },
    yellow: { bg: 'bg-primary/15', text: 'text-primary', border: 'border-primary/20' },
    red: { bg: 'bg-danger/15', text: 'text-danger', border: 'border-danger/20' },
  }
  const c = colorMap[color]

  return (
    <motion.div
      className={`glass-card p-6 border ${c.border}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        <span className="text-sm text-pbi-muted">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span
          className={`text-3xl font-extrabold ${c.text}`}
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {value}
        </motion.span>
        {unit && <span className="text-sm text-pbi-muted">{unit}</span>}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Benefit Card                                                        */
/* ------------------------------------------------------------------ */

function BenefitCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: any
  title: string
  description: string
  delay?: number
}) {
  return (
    <motion.div
      className="glass-card p-6 hover:glow-blue transition-shadow duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <div className="w-12 h-12 rounded-xl bg-fabric/15 text-fabric flex items-center justify-center mb-4">
        <Icon size={24} />
      </div>
      <h4 className="text-lg font-semibold mb-2 text-pbi-text">{title}</h4>
      <p className="text-sm text-pbi-muted leading-relaxed">{description}</p>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */

export default function RoiCalculator() {
  // --- Current state inputs ---
  const [infraCost, setInfraCost] = useState(5000)
  const [dataSources, setDataSources] = useState(10)
  const [proLicenses, setProLicenses] = useState(50)
  const [ppuLicenses, setPpuLicenses] = useState(0)
  const [premiumIndex, setPremiumIndex] = useState(0)
  const [adfCost, setAdfCost] = useState(500)
  const [synapseCost, setSynapseCost] = useState(0)
  const [adlsCost, setAdlsCost] = useState(200)
  const [databricksCost, setDatabricksCost] = useState(0)
  const [etlPipelines, setEtlPipelines] = useState(20)
  const [dailyDataGB, setDailyDataGB] = useState(50)
  const [fteCount, setFteCount] = useState(3)
  const [fteCost, setFteCost] = useState(60000)

  // --- Fabric target inputs ---
  const [fabricSkuIndex, setFabricSkuIndex] = useState(2) // F8 default
  const [usageHours, setUsageHours] = useState(10)
  const [isReserved, setIsReserved] = useState(true)
  const [oneLakeStorageTB, setOneLakeStorageTB] = useState(1)
  const [migrationCost, setMigrationCost] = useState(50000)
  const [fteAfter, setFteAfter] = useState(2)

  const [copied, setCopied] = useState(false)

  // --- Calculations ---
  const calculations = useMemo(() => {
    const premium = premiumCapacities[premiumIndex]
    const fabricCap = fabricCapacities[fabricSkuIndex]

    // Current monthly costs
    const currentProCost = proLicenses * PRO_LICENSE_COST
    const currentPpuCost = ppuLicenses * PPU_LICENSE_COST
    const currentPremiumCost = premium.monthlyCost
    const currentAzureCost = adfCost + synapseCost + adlsCost + databricksCost
    const currentFteMonthlyCost = (fteCount * fteCost) / 12
    const currentTotalMonthly =
      infraCost + currentProCost + currentPpuCost + currentPremiumCost + currentAzureCost + currentFteMonthlyCost

    // Fabric monthly costs
    const fabricCapacityCost = isReserved
      ? fabricCap.monthlyPrice
      : fabricCap.monthlyPrice * (usageHours / 24) * 1.5 // PAYG ~1.5x but pro-rated by hours
    const fabricLicenseCost = proLicenses * PRO_LICENSE_COST // Pro licenses still needed
    const fabricStorageCost = oneLakeStorageTB * ONELAKE_COST_PER_TB
    const fabricFteMonthlyCost = (fteAfter * fteCost) / 12
    const fabricTotalMonthly =
      fabricCapacityCost + fabricLicenseCost + fabricStorageCost + fabricFteMonthlyCost

    // ROI metrics
    const monthlySavings = currentTotalMonthly - fabricTotalMonthly
    const annualSavings = monthlySavings * 12
    const roiPercent =
      fabricTotalMonthly > 0
        ? ((currentTotalMonthly - fabricTotalMonthly) / fabricTotalMonthly) * 100
        : 0
    const paybackMonths =
      monthlySavings > 0 ? Math.ceil(migrationCost / monthlySavings) : monthlySavings === 0 ? Infinity : -1
    const tcoCurrentThreeYear = currentTotalMonthly * 36
    const tcoFabricThreeYear = fabricTotalMonthly * 36 + migrationCost

    // Chart data: cost breakdown comparison
    const breakdownData = [
      {
        name: 'Infrastructure',
        Actuel: infraCost,
        Fabric: 0,
      },
      {
        name: 'Licences',
        Actuel: currentProCost + currentPpuCost,
        Fabric: fabricLicenseCost,
      },
      {
        name: 'Premium/Capacite',
        Actuel: currentPremiumCost,
        Fabric: fabricCapacityCost,
      },
      {
        name: 'Azure Services',
        Actuel: currentAzureCost,
        Fabric: 0,
      },
      {
        name: 'Stockage',
        Actuel: adlsCost,
        Fabric: fabricStorageCost,
      },
      {
        name: 'RH (FTE)',
        Actuel: currentFteMonthlyCost,
        Fabric: fabricFteMonthlyCost,
      },
    ]

    // Line chart: cumulative over 36 months
    const cumulativeData = Array.from({ length: 37 }, (_, m) => ({
      month: m,
      Actuel: Math.round(currentTotalMonthly * m),
      Fabric: Math.round(fabricTotalMonthly * m + migrationCost),
    }))

    // Pie chart data
    const currentPieData = [
      { name: 'Infrastructure', value: Math.round(infraCost) },
      { name: 'Licences Pro', value: Math.round(currentProCost) },
      { name: 'Licences PPU', value: Math.round(currentPpuCost) },
      { name: 'Premium', value: Math.round(currentPremiumCost) },
      { name: 'Azure Services', value: Math.round(currentAzureCost) },
      { name: 'RH (FTE)', value: Math.round(currentFteMonthlyCost) },
    ].filter((d) => d.value > 0)

    const fabricPieData = [
      { name: 'Capacite Fabric', value: Math.round(fabricCapacityCost) },
      { name: 'Licences Pro', value: Math.round(fabricLicenseCost) },
      { name: 'OneLake Stockage', value: Math.round(fabricStorageCost) },
      { name: 'RH (FTE)', value: Math.round(fabricFteMonthlyCost) },
    ].filter((d) => d.value > 0)

    return {
      currentTotalMonthly,
      fabricTotalMonthly,
      monthlySavings,
      annualSavings,
      roiPercent,
      paybackMonths,
      tcoCurrentThreeYear,
      tcoFabricThreeYear,
      breakdownData,
      cumulativeData,
      currentPieData,
      fabricPieData,
      fabricCap,
      premium,
    }
  }, [
    infraCost, dataSources, proLicenses, ppuLicenses, premiumIndex,
    adfCost, synapseCost, adlsCost, databricksCost, etlPipelines, dailyDataGB,
    fteCount, fteCost, fabricSkuIndex, usageHours, isReserved,
    oneLakeStorageTB, migrationCost, fteAfter,
  ])

  const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR')
  const fmtSign = (n: number) => (n >= 0 ? '+' : '') + fmt(n)

  // --- Export ---
  const handleExport = () => {
    const c = calculations
    const text = `=== CALCULATEUR ROI MIGRATION FABRIC ===
Date: ${new Date().toLocaleDateString('fr-FR')}

--- SITUATION ACTUELLE ---
Cout infrastructure: ${fmt(infraCost)} EUR/mois
Sources de donnees: ${dataSources}
Licences Pro: ${proLicenses} (${fmt(proLicenses * PRO_LICENSE_COST)} EUR/mois)
Licences PPU: ${ppuLicenses} (${fmt(ppuLicenses * PPU_LICENSE_COST)} EUR/mois)
Capacite Premium: ${c.premium.name} (${fmt(c.premium.monthlyCost)} EUR/mois)
Azure Data Factory: ${fmt(adfCost)} EUR/mois
Azure Synapse: ${fmt(synapseCost)} EUR/mois
Azure Data Lake: ${fmt(adlsCost)} EUR/mois
Databricks: ${fmt(databricksCost)} EUR/mois
Pipelines ETL: ${etlPipelines}
Volume quotidien: ${dailyDataGB} GB
FTE: ${fteCount} x ${fmt(fteCost)} EUR/an
TOTAL MENSUEL ACTUEL: ${fmt(c.currentTotalMonthly)} EUR/mois

--- CONFIGURATION FABRIC CIBLE ---
Capacite: ${c.fabricCap.sku} (${isReserved ? 'Reserve' : 'Pay-as-you-go'})
Heures utilisation/jour: ${usageHours}h
Stockage OneLake: ${oneLakeStorageTB} TB
Cout migration: ${fmt(migrationCost)} EUR
FTE apres migration: ${fteAfter}
TOTAL MENSUEL FABRIC: ${fmt(c.fabricTotalMonthly)} EUR/mois

--- RESULTATS ROI ---
Economies mensuelles: ${fmtSign(c.monthlySavings)} EUR
Economies annuelles: ${fmtSign(c.annualSavings)} EUR
ROI: ${c.roiPercent.toFixed(1)}%
Delai de rentabilite: ${c.paybackMonths === Infinity ? 'N/A' : c.paybackMonths < 0 ? 'Non rentable' : c.paybackMonths + ' mois'}
TCO 3 ans (Actuel): ${fmt(c.tcoCurrentThreeYear)} EUR
TCO 3 ans (Fabric): ${fmt(c.tcoFabricThreeYear)} EUR
Economie TCO 3 ans: ${fmt(c.tcoCurrentThreeYear - c.tcoFabricThreeYear)} EUR`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const isSaving = calculations.monthlySavings > 0

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ==================== HEADER ==================== */}
        <Section className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Calculator size={16} />
            Outil de calcul interactif
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Calculateur ROI <span className="gradient-text">Migration Fabric</span>
          </h1>
          <p className="text-pbi-muted text-lg max-w-2xl mx-auto">
            Estimez les economies et le retour sur investissement de votre migration
            vers Microsoft Fabric. Ajustez les parametres pour refleter votre situation.
          </p>
        </Section>

        {/* ==================== INPUT PANELS ==================== */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* --- Current State --- */}
          <Section delay={0.1}>
            <div className="glass-card glow-yellow p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                  <Server size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-pbi-text">Etat Actuel</h2>
                  <p className="text-xs text-pbi-muted">Votre infrastructure et couts actuels</p>
                </div>
              </div>

              <SliderInput label="Cout infrastructure / mois" value={infraCost} onChange={setInfraCost} min={0} max={50000} step={100} unit="EUR" />
              <SliderInput label="Nombre de sources de donnees" value={dataSources} onChange={setDataSources} min={1} max={50} />
              <SliderInput label="Licences Power BI Pro" value={proLicenses} onChange={setProLicenses} min={1} max={5000} />
              <SliderInput label="Licences Premium Per User (PPU)" value={ppuLicenses} onChange={setPpuLicenses} min={0} max={1000} />

              {/* Premium capacity dropdown */}
              <div className="mb-4">
                <label className="text-sm text-pbi-muted block mb-1.5">Capacite Premium actuelle</label>
                <select
                  value={premiumIndex}
                  onChange={(e) => setPremiumIndex(Number(e.target.value))}
                  className="w-full bg-pbi-darker border border-pbi-border rounded-lg px-3 py-2 text-sm text-pbi-text focus:outline-none focus:border-primary"
                >
                  {premiumCapacities.map((p, i) => (
                    <option key={i} value={i}>
                      {p.name} {p.monthlyCost > 0 ? `— ${p.monthlyCost.toLocaleString('fr-FR')} EUR/mois` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 mb-2">
                <p className="text-sm text-pbi-muted font-medium mb-3 flex items-center gap-2">
                  <Database size={14} /> Services Azure actuels
                </p>
              </div>
              <SliderInput label="Azure Data Factory" value={adfCost} onChange={setAdfCost} min={0} max={10000} step={50} unit="EUR/mois" />
              <SliderInput label="Azure Synapse" value={synapseCost} onChange={setSynapseCost} min={0} max={20000} step={50} unit="EUR/mois" />
              <SliderInput label="Azure Data Lake Storage" value={adlsCost} onChange={setAdlsCost} min={0} max={5000} step={50} unit="EUR/mois" />
              <SliderInput label="Databricks" value={databricksCost} onChange={setDatabricksCost} min={0} max={30000} step={100} unit="EUR/mois" />

              <SliderInput label="Nombre de pipelines ETL" value={etlPipelines} onChange={setEtlPipelines} min={1} max={200} />
              <SliderInput label="Volume de donnees quotidien" value={dailyDataGB} onChange={setDailyDataGB} min={1} max={10000} step={10} unit="GB" />

              <div className="mt-4 mb-2">
                <p className="text-sm text-pbi-muted font-medium mb-3 flex items-center gap-2">
                  <Users size={14} /> Ressources humaines
                </p>
              </div>
              <SliderInput label="FTE plateforme data" value={fteCount} onChange={setFteCount} min={1} max={20} />
              <SliderInput label="Cout moyen FTE / an" value={fteCost} onChange={setFteCost} min={30000} max={150000} step={1000} unit="EUR" />

              <div className="mt-4 pt-4 border-t border-pbi-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-pbi-muted">Total mensuel actuel</span>
                  <span className="text-xl font-bold text-primary">
                    {fmt(calculations.currentTotalMonthly)} EUR
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* --- Fabric Target --- */}
          <Section delay={0.2}>
            <div className="glass-card glow-blue p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-fabric/15 text-fabric flex items-center justify-center">
                  <Layers size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-pbi-text">Configuration Fabric Cible</h2>
                  <p className="text-xs text-pbi-muted">Parametrez votre future architecture</p>
                </div>
              </div>

              {/* Fabric SKU dropdown */}
              <div className="mb-4">
                <label className="text-sm text-pbi-muted block mb-1.5">Capacite Fabric</label>
                <select
                  value={fabricSkuIndex}
                  onChange={(e) => setFabricSkuIndex(Number(e.target.value))}
                  className="w-full bg-pbi-darker border border-pbi-border rounded-lg px-3 py-2 text-sm text-pbi-text focus:outline-none focus:border-fabric"
                >
                  {fabricCapacities.map((cap, i) => (
                    <option key={i} value={i}>
                      {cap.sku} — {cap.monthlyPrice.toLocaleString('fr-FR')} EUR/mois — {cap.bestFor}
                    </option>
                  ))}
                </select>
              </div>

              <SliderInput label="Heures d'utilisation / jour" value={usageHours} onChange={setUsageHours} min={1} max={24} unit="h" />

              {/* Reserved vs PAYG toggle */}
              <div className="mb-4">
                <label className="text-sm text-pbi-muted block mb-2">Mode de facturation</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsReserved(true)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      isReserved
                        ? 'bg-fabric text-white'
                        : 'bg-pbi-darker border border-pbi-border text-pbi-muted hover:text-pbi-text'
                    }`}
                  >
                    Reserve
                  </button>
                  <button
                    onClick={() => setIsReserved(false)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      !isReserved
                        ? 'bg-fabric text-white'
                        : 'bg-pbi-darker border border-pbi-border text-pbi-muted hover:text-pbi-text'
                    }`}
                  >
                    Pay-as-you-go
                  </button>
                </div>
                {!isReserved && (
                  <p className="text-xs text-warning mt-2">
                    PAYG: facturation au prorata des heures, avec un coefficient ~1.5x sur le tarif reserve.
                  </p>
                )}
              </div>

              <SliderInput label="Stockage OneLake additionnel" value={oneLakeStorageTB} onChange={setOneLakeStorageTB} min={0} max={100} step={1} unit="TB" />
              <SliderInput label="Cout de migration (one-time)" value={migrationCost} onChange={setMigrationCost} min={0} max={500000} step={5000} unit="EUR" />
              <SliderInput label="FTE apres migration" value={fteAfter} onChange={setFteAfter} min={0} max={20} />

              <div className="mt-4 pt-4 border-t border-pbi-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-pbi-muted">Total mensuel Fabric</span>
                  <span className="text-xl font-bold text-fabric">
                    {fmt(calculations.fabricTotalMonthly)} EUR
                  </span>
                </div>
              </div>

              {/* Summary info */}
              <div className="mt-4 p-4 rounded-xl bg-pbi-darker/50 border border-pbi-border">
                <p className="text-xs text-pbi-muted mb-2">Detail capacite selectionnee:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-pbi-muted">CU/seconde:</span>
                  <span className="text-pbi-text font-medium">{calculations.fabricCap.cuPerSecond}</span>
                  <span className="text-pbi-muted">Memoire max:</span>
                  <span className="text-pbi-text font-medium">{calculations.fabricCap.maxMemoryGB} GB</span>
                  <span className="text-pbi-muted">Jobs simultanes:</span>
                  <span className="text-pbi-text font-medium">{calculations.fabricCap.maxConcurrentJobs}</span>
                  <span className="text-pbi-muted">Spark vCores:</span>
                  <span className="text-pbi-text font-medium">{calculations.fabricCap.sparkVCores}</span>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* ==================== KPI RESULTS ==================== */}
        <Section className="mb-12" delay={0.1}>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Resultats <span className="gradient-text">ROI</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <KpiCard
              label="Economies mensuelles"
              value={fmtSign(calculations.monthlySavings)}
              unit="EUR"
              color={isSaving ? 'green' : 'red'}
              icon={isSaving ? TrendingUp : TrendingDown}
              delay={0}
            />
            <KpiCard
              label="Economies annuelles"
              value={fmtSign(calculations.annualSavings)}
              unit="EUR"
              color={isSaving ? 'green' : 'red'}
              icon={DollarSign}
              delay={0.08}
            />
            <KpiCard
              label="ROI"
              value={calculations.roiPercent.toFixed(1)}
              unit="%"
              color={calculations.roiPercent > 0 ? 'green' : 'red'}
              icon={BarChart3}
              delay={0.16}
            />
            <KpiCard
              label="Delai de rentabilite"
              value={
                calculations.paybackMonths === Infinity
                  ? 'N/A'
                  : calculations.paybackMonths < 0
                  ? '---'
                  : String(calculations.paybackMonths)
              }
              unit={calculations.paybackMonths > 0 && calculations.paybackMonths !== Infinity ? 'mois' : undefined}
              color={calculations.paybackMonths > 0 && calculations.paybackMonths <= 12 ? 'green' : calculations.paybackMonths <= 24 ? 'yellow' : 'red'}
              icon={Clock}
              delay={0.24}
            />
            <KpiCard
              label="Economie TCO 3 ans"
              value={fmt(calculations.tcoCurrentThreeYear - calculations.tcoFabricThreeYear)}
              unit="EUR"
              color={calculations.tcoCurrentThreeYear > calculations.tcoFabricThreeYear ? 'green' : 'red'}
              icon={TrendingUp}
              delay={0.32}
            />
          </div>

          {/* TCO Summary */}
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="glass-card p-4 flex justify-between items-center">
              <span className="text-sm text-pbi-muted">TCO 3 ans — Actuel</span>
              <span className="text-lg font-bold text-primary">{fmt(calculations.tcoCurrentThreeYear)} EUR</span>
            </div>
            <div className="glass-card p-4 flex justify-between items-center">
              <span className="text-sm text-pbi-muted">TCO 3 ans — Fabric</span>
              <span className="text-lg font-bold text-fabric">{fmt(calculations.tcoFabricThreeYear)} EUR</span>
            </div>
          </div>
        </Section>

        {/* ==================== CHARTS ==================== */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Bar chart: breakdown comparison */}
          <Section delay={0.1}>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-1">Comparaison des couts mensuels</h3>
              <p className="text-xs text-pbi-muted mb-6">Par categorie — Actuel vs Fabric</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calculations.breakdownData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,58,92,0.5)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={{ stroke: '#2a3a5c' }}
                      tickLine={false}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                    />
                    <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                    <Bar dataKey="Actuel" fill="#f2c811" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
                    <Bar dataKey="Fabric" fill="#0078d4" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Section>

          {/* Line chart: cumulative cost */}
          <Section delay={0.2}>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-1">Cout cumule sur 36 mois</h3>
              <p className="text-xs text-pbi-muted mb-6">Point de croisement visible si migration rentable</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={calculations.cumulativeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,58,92,0.5)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={{ stroke: '#2a3a5c' }}
                      tickLine={false}
                      label={{ value: 'Mois', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) =>
                        v >= 1000000
                          ? `${(v / 1000000).toFixed(1)}M`
                          : v >= 1000
                          ? `${(v / 1000).toFixed(0)}k`
                          : String(v)
                      }
                    />
                    <Tooltip content={<LineTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                    <Line
                      type="monotone"
                      dataKey="Actuel"
                      stroke="#f2c811"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: '#f2c811' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Fabric"
                      stroke="#0078d4"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: '#0078d4' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Section>
        </div>

        {/* Pie charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Section delay={0.1}>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-1">Repartition actuelle</h3>
              <p className="text-xs text-pbi-muted mb-6">Ventilation des couts mensuels actuels</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={calculations.currentPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                      labelLine={{ stroke: '#94a3b8' }}
                    >
                      {calculations.currentPieData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} fillOpacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Section>

          <Section delay={0.2}>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-1">Repartition Fabric</h3>
              <p className="text-xs text-pbi-muted mb-6">Ventilation des couts mensuels apres migration</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={calculations.fabricPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                      labelLine={{ stroke: '#94a3b8' }}
                    >
                      {calculations.fabricPieData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} fillOpacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Section>
        </div>

        {/* ==================== QUALITATIVE BENEFITS ==================== */}
        <Section className="mb-12">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Benefices <span className="gradient-text">qualitatifs</span>
          </h2>
          <p className="text-pbi-muted text-sm text-center mb-8 max-w-xl mx-auto">
            Au-dela des economies financieres, la migration Fabric apporte des avantages strategiques majeurs.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <BenefitCard
              icon={Layers}
              title="Plateforme unifiee"
              description="Un seul environnement pour l'ingestion, le traitement, le stockage et la visualisation des donnees. Fini le patchwork de services Azure."
              delay={0}
            />
            <BenefitCard
              icon={GitMerge}
              title="Complexite reduite"
              description="Moins de services a gerer, moins de connecteurs a maintenir, moins de points de defaillance. Architecture simplifiee et plus resiliente."
              delay={0.08}
            />
            <BenefitCard
              icon={Shield}
              title="Gouvernance amelioree"
              description="OneLake centralise toutes les donnees avec des politiques de securite, lineage et catalogue unifies. Conformite facilitee."
              delay={0.16}
            />
            <BenefitCard
              icon={Zap}
              title="Time-to-insight reduit"
              description="De la donnee brute au dashboard en quelques minutes grace aux shortcuts, Dataflows Gen2 et le mode Direct Lake."
              delay={0.24}
            />
            <BenefitCard
              icon={Brain}
              title="Copilot & IA integree"
              description="Tirez parti des capacites IA natives: Copilot dans Power BI, generation automatique de DAX, insights en langage naturel."
              delay={0.32}
            />
            <BenefitCard
              icon={TrendingUp}
              title="Scalabilite elastique"
              description="Montez ou descendez en capacite instantanement. Payez a l'usage ou reservez selon vos besoins. Zero sur-provisionnement."
              delay={0.4}
            />
          </div>
        </Section>

        {/* ==================== EXPORT BUTTON ==================== */}
        <Section className="text-center pb-12">
          <motion.button
            onClick={handleExport}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-pbi-darker font-bold text-lg hover:bg-primary-dark transition-colors"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {copied ? <Check size={22} /> : <Copy size={22} />}
            {copied ? 'Copie dans le presse-papier !' : 'Exporter le resume'}
          </motion.button>
          <p className="text-xs text-pbi-muted mt-3">
            Copie un resume textuel complet dans votre presse-papier.
          </p>
        </Section>
      </div>
    </div>
  )
}
