import { useState, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Monitor,
  Cloud,
  Server,
  Smartphone,
  Bot,
  ChevronDown,
  ChevronUp,
  Rocket,
  Clock,
  Filter,
  CalendarDays,
  Star,
  Zap,
  Eye,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category = 'Desktop' | 'Fabric' | 'Service' | 'Mobile' | 'Copilot/AI'
type Impact = 'Major' | 'Minor' | 'Preview'

interface Update {
  id: string
  date: string
  month: string
  category: Category
  title: string
  description: string
  details: string
  impact: Impact
}

interface ComingSoon {
  title: string
  description: string
  category: Category
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const categories: { key: Category; icon: typeof Monitor; color: string }[] = [
  { key: 'Desktop', icon: Monitor, color: '#f2c811' },
  { key: 'Fabric', icon: Cloud, color: '#0078d4' },
  { key: 'Service', icon: Server, color: '#10b981' },
  { key: 'Mobile', icon: Smartphone, color: '#f59e0b' },
  { key: 'Copilot/AI', icon: Bot, color: '#a855f7' },
]

const categoryColor: Record<Category, string> = {
  Desktop: '#f2c811',
  Fabric: '#0078d4',
  Service: '#10b981',
  Mobile: '#f59e0b',
  'Copilot/AI': '#a855f7',
}

const impactConfig: Record<Impact, { label: string; color: string; bg: string }> = {
  Major: { label: 'Major', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  Minor: { label: 'Minor', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  Preview: { label: 'Preview', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
}

const comingSoon: ComingSoon[] = [
  {
    title: 'Power BI Enhanced Embedding',
    description:
      'New embedding APIs with improved performance, better auth flows, and richer interactivity for embedded analytics.',
    category: 'Service',
  },
  {
    title: 'Fabric Eventstream Improvements',
    description:
      'Enhanced real-time event processing with new connectors, transformations, and monitoring capabilities.',
    category: 'Fabric',
  },
  {
    title: 'More Copilot Capabilities',
    description:
      'Expanded AI assistance for DAX authoring, data modeling suggestions, and natural language Q&A improvements.',
    category: 'Copilot/AI',
  },
  {
    title: 'Enhanced Governance Features',
    description:
      'New admin controls for sensitivity labels, endorsement workflows, and cross-workspace lineage tracking.',
    category: 'Service',
  },
]

const updates: Update[] = [
  // March 2025
  {
    id: 'mar25-1',
    date: 'March 12, 2025',
    month: 'March 2025',
    category: 'Copilot/AI',
    title: 'Fabric Copilot GA',
    description:
      'AI assistance is now generally available across all Fabric workloads, bringing intelligent suggestions to every stage of the data pipeline.',
    details:
      'Copilot is now integrated into Data Factory, Data Engineering, Data Warehouse, Real-Time Intelligence, and Power BI within Fabric. Users can generate T-SQL, KQL, DAX, Python, and Spark code with natural language prompts. The GA release includes improved accuracy, workspace-aware context, and enterprise-grade data security with no data leaving the tenant boundary.',
    impact: 'Major',
  },
  {
    id: 'mar25-2',
    date: 'March 10, 2025',
    month: 'March 2025',
    category: 'Desktop',
    title: 'Enhanced Visual Calculations',
    description:
      'Power BI visual calculations now support more functions including RUNNINGSUM, MOVINGAVERAGE, and custom window functions.',
    details:
      'This update expands the visual calculations feature with additional aggregate and window functions. RUNNINGSUM and MOVINGAVERAGE work directly in the visual layer without requiring separate DAX measures. Custom window frame definitions allow precise control over calculation ranges. Performance has been optimized for large datasets with millions of rows.',
    impact: 'Major',
  },
  {
    id: 'mar25-3',
    date: 'March 5, 2025',
    month: 'March 2025',
    category: 'Fabric',
    title: 'OneLake Shortcuts for Google Cloud Storage',
    description:
      'OneLake now supports shortcuts to Google Cloud Storage, expanding multi-cloud data access capabilities.',
    details:
      'Organizations using Google Cloud Storage can now create OneLake shortcuts directly to their GCS buckets. Data remains in place while being accessible through the OneLake unified namespace. Supports Parquet, Delta, and CSV formats. Authentication is handled via service account keys with optional workload identity federation.',
    impact: 'Minor',
  },

  // February 2025
  {
    id: 'feb25-1',
    date: 'February 18, 2025',
    month: 'February 2025',
    category: 'Desktop',
    title: 'Power BI Desktop February Update',
    description:
      'New visual formatting options including dynamic format strings, enhanced small multiples, and improved color picker.',
    details:
      'The February Desktop update introduces dynamic format strings that adapt based on data context — for example, showing percentages for ratios and currency for amounts in the same visual. Small multiples now support independent axis scaling and custom sort orders. The color picker has been redesigned with recent colors, theme-aware palettes, and accessibility contrast checking.',
    impact: 'Major',
  },
  {
    id: 'feb25-2',
    date: 'February 12, 2025',
    month: 'February 2025',
    category: 'Fabric',
    title: 'Real-Time Intelligence Improvements',
    description:
      'Fabric Real-Time Intelligence gets enhanced KQL queryset experience and new streaming connectors.',
    details:
      'KQL querysets now support multi-tab editing, IntelliSense improvements, and result visualization directly in the query editor. New streaming connectors include Apache Kafka (managed), Amazon Kinesis, and Google Pub/Sub. Eventstream processing now supports tumbling, hopping, and session windows with at-least-once delivery guarantees.',
    impact: 'Minor',
  },
  {
    id: 'feb25-3',
    date: 'February 8, 2025',
    month: 'February 2025',
    category: 'Fabric',
    title: 'Direct Lake Mode Enhancements',
    description:
      'Direct Lake now supports more data types, improved fallback behavior, and better monitoring tools.',
    details:
      'Direct Lake mode adds support for binary and geography data types. The automatic fallback to DirectQuery is now more intelligent, falling back at the partition level rather than the entire table. New monitoring views in DMVs expose framing status, fallback reasons, and cache hit rates. Column encoding has been optimized, reducing memory consumption by up to 30% for string-heavy models.',
    impact: 'Major',
  },
  {
    id: 'feb25-4',
    date: 'February 3, 2025',
    month: 'February 2025',
    category: 'Service',
    title: 'Git Integration for Fabric Items',
    description:
      'Full Git integration now available for all Fabric item types including notebooks, pipelines, and warehouses.',
    details:
      'All Fabric item types can now be version-controlled via Azure DevOps Git repositories. The integration supports branching, pull requests, and conflict resolution directly within the Fabric portal. Item definitions are serialized in human-readable formats (JSON, TMDL, .py) for meaningful diffs. CI/CD deployment pipelines can be automated using the new Fabric REST APIs for Git operations.',
    impact: 'Major',
  },

  // January 2025
  {
    id: 'jan25-1',
    date: 'January 22, 2025',
    month: 'January 2025',
    category: 'Fabric',
    title: 'Fabric Capacity Metrics App v2',
    description:
      'Completely redesigned capacity monitoring app with real-time metrics, alerting, and historical trend analysis.',
    details:
      'The v2 Capacity Metrics app features a redesigned interface with real-time utilization dashboards, per-item CU consumption breakdowns, and 30-day historical trends. New alerting capabilities trigger notifications when utilization exceeds configurable thresholds. Smoothing and throttling metrics are visualized with clear explanations. The app now supports monitoring multiple capacities in a single view.',
    impact: 'Major',
  },
  {
    id: 'jan25-2',
    date: 'January 15, 2025',
    month: 'January 2025',
    category: 'Copilot/AI',
    title: 'Power BI Copilot Improvements',
    description:
      'Copilot now understands model relationships better and can generate more complex DAX patterns.',
    details:
      'Copilot has been updated with improved understanding of star-schema relationships, enabling more accurate measure suggestions across related tables. New capabilities include generating time-intelligence patterns (YTD, QTD, prior period comparisons) and semi-additive measures. The natural language report page generation now supports conditional formatting rules and dynamic titles.',
    impact: 'Minor',
  },
  {
    id: 'jan25-3',
    date: 'January 8, 2025',
    month: 'January 2025',
    category: 'Fabric',
    title: 'Enhanced Dataflow Gen2 Connectors',
    description:
      'Dataflow Gen2 adds 15 new connectors including MongoDB Atlas, Snowflake, and several SaaS platforms.',
    details:
      'New connectors include MongoDB Atlas, Snowflake, Databricks, Salesforce Marketing Cloud, HubSpot, Zendesk, Stripe, Shopify, ServiceNow, Dynamics 365 Business Central, SAP HANA Cloud, Jira, Confluence, Asana, and Notion. Each connector supports incremental refresh, schema drift detection, and staging to OneLake. Query folding is supported for all database connectors.',
    impact: 'Minor',
  },

  // December 2024
  {
    id: 'dec24-1',
    date: 'December 15, 2024',
    month: 'December 2024',
    category: 'Fabric',
    title: 'Fabric GA Anniversary Features',
    description:
      'One year after GA, Microsoft announces a wave of Fabric enhancements including improved governance and cross-workload integration.',
    details:
      'To mark the first anniversary of Fabric GA, Microsoft released a bundle of enhancements: unified governance policies across all workloads, cross-workload lineage visualization, shared compute pools between data engineering and data warehousing, and a new Fabric admin center with consolidated monitoring. Usage billing now provides item-level cost attribution.',
    impact: 'Major',
  },
  {
    id: 'dec24-2',
    date: 'December 10, 2024',
    month: 'December 2024',
    category: 'Desktop',
    title: 'Power BI December Update',
    description:
      'Matrix visual improvements with stepped layout enhancements, expand/collapse all, and subtotal positioning options.',
    details:
      'The matrix visual receives significant updates: stepped layout now supports custom indentation and row padding, expand/collapse all buttons can be positioned in headers or as floating actions, and subtotals can be placed at top or bottom of each group independently. Additionally, the matrix now supports image URLs in row headers and conditional icons based on values.',
    impact: 'Minor',
  },
  {
    id: 'dec24-3',
    date: 'December 3, 2024',
    month: 'December 2024',
    category: 'Fabric',
    title: 'Fabric Workload Development Kit GA',
    description:
      'The Workload Development Kit is now generally available, allowing ISVs and enterprises to build custom Fabric workloads.',
    details:
      'The Workload Development Kit enables third-party developers to create custom Fabric workloads that appear natively in the Fabric portal. Workloads can leverage OneLake storage, Fabric authentication, and the shared compute infrastructure. The kit includes a local development environment, testing harness, and deployment tools. Several partner workloads are already available in AppSource.',
    impact: 'Major',
  },

  // November 2024
  {
    id: 'nov24-1',
    date: 'November 19, 2024',
    month: 'November 2024',
    category: 'Fabric',
    title: 'Microsoft Fabric Ignite Announcements',
    description:
      'Major announcements at Ignite including Fabric Databases, AI Functions, and enhanced multi-cloud support.',
    details:
      'At Microsoft Ignite 2024, several major Fabric features were announced: Fabric Databases (managed SQL databases within Fabric), AI Functions for embedding AI models directly into data pipelines, expanded multi-cloud support with AWS S3 and GCS shortcuts, and a new Fabric Workload Hub for discovering partner workloads. The Fabric free tier was also expanded with more generous compute allowances.',
    impact: 'Major',
  },
  {
    id: 'nov24-2',
    date: 'November 12, 2024',
    month: 'November 2024',
    category: 'Copilot/AI',
    title: 'Power BI Enhanced AI Features',
    description:
      'New AI visuals including smart narrative improvements, anomaly detection refinements, and Q&A enhancements.',
    details:
      'Smart Narrative now generates more nuanced insights with trend explanations and statistical significance indicators. Anomaly detection supports custom sensitivity tuning per metric and alerts via Power Automate. The Q&A visual has improved natural language understanding for complex questions involving multiple tables and time intelligence, and now suggests follow-up questions.',
    impact: 'Minor',
  },
  {
    id: 'nov24-3',
    date: 'November 5, 2024',
    month: 'November 2024',
    category: 'Fabric',
    title: 'Fabric Mirroring for More Data Sources',
    description:
      'Mirroring now supports Azure Cosmos DB, Snowflake, and additional relational databases for near-real-time replication.',
    details:
      'Fabric Mirroring, which replicates external data into OneLake in near-real-time, now supports Azure Cosmos DB (NoSQL API), Snowflake, PostgreSQL, and MySQL in addition to the existing Azure SQL Database and Azure SQL Managed Instance support. Change data capture (CDC) is used where available, with periodic snapshots as fallback. Mirrored data is stored in Delta format and immediately available for Direct Lake semantic models.',
    impact: 'Major',
  },

  // October 2024
  {
    id: 'oct24-1',
    date: 'October 15, 2024',
    month: 'October 2024',
    category: 'Mobile',
    title: 'Power BI October Update - Enhanced Mobile',
    description:
      'Significantly improved mobile experience with new responsive layouts, offline mode, and gesture navigation.',
    details:
      'The mobile app now supports responsive report layouts that automatically adapt to screen size without requiring separate mobile views. Offline mode allows pinning dashboards and reports for access without connectivity. New gesture navigation includes swipe between pages, pinch-to-zoom on visuals, and long-press for drill-through. Push notifications for data alerts are now supported on both iOS and Android.',
    impact: 'Major',
  },
  {
    id: 'oct24-2',
    date: 'October 8, 2024',
    month: 'October 2024',
    category: 'Fabric',
    title: 'Data Activator Improvements',
    description:
      'Data Activator adds new trigger conditions, action types, and integration with Power Automate flows.',
    details:
      'Data Activator now supports compound trigger conditions (AND/OR logic), rolling window aggregations, and rate-of-change detection. New action types include creating Jira tickets, posting to Slack/Teams channels, and triggering custom Power Automate flows. The monitoring dashboard shows trigger history, fire rates, and action success metrics. Triggers can now reference semantic model measures directly.',
    impact: 'Minor',
  },
  {
    id: 'oct24-3',
    date: 'October 3, 2024',
    month: 'October 2024',
    category: 'Fabric',
    title: 'OneLake File Explorer Improvements',
    description:
      'OneLake File Explorer now supports bidirectional sync, conflict resolution, and selective folder sync.',
    details:
      'The Windows-integrated OneLake File Explorer adds bidirectional sync, allowing local file changes to be pushed back to OneLake. Conflict resolution UI handles simultaneous edits gracefully. Selective sync lets users choose specific lakehouses and folders to sync locally, reducing storage usage. Performance improvements provide 3x faster initial sync for large folders.',
    impact: 'Minor',
  },

  // September 2024
  {
    id: 'sep24-1',
    date: 'September 17, 2024',
    month: 'September 2024',
    category: 'Desktop',
    title: 'Power BI September Update',
    description:
      'New line visual enhancements, slicer improvements, and expanded field parameter capabilities.',
    details:
      'The September update brings error bands and confidence intervals to line charts, hierarchical slicers with search, and field parameters that now support dynamic sorting and conditional visibility. The modeling view adds a new relationship diagram with auto-layout. Performance Analyzer is enhanced with per-visual DAX query timing and storage engine metrics.',
    impact: 'Minor',
  },
  {
    id: 'sep24-2',
    date: 'September 10, 2024',
    month: 'September 2024',
    category: 'Fabric',
    title: 'Capacity Reservation Improvements',
    description:
      'New flexible reservation options with hourly scaling, burst capacity, and reservation pooling across workspaces.',
    details:
      'Fabric capacity reservations now support hourly scaling schedules (scale up during business hours, down at night). Burst capacity allows temporary overages up to 2x the reserved CU, billed at on-demand rates. Reservation pooling enables multiple workspaces to share a capacity reservation with configurable priority levels. Cost management is improved with budget alerts and spend forecasting.',
    impact: 'Minor',
  },
  {
    id: 'sep24-3',
    date: 'September 3, 2024',
    month: 'September 2024',
    category: 'Service',
    title: 'Enhanced Semantic Model Monitoring',
    description:
      'New monitoring hub for semantic models with query performance tracking, refresh history, and usage analytics.',
    details:
      'A new monitoring hub provides comprehensive visibility into semantic model health: query performance percentiles (P50/P95/P99), refresh duration trends, failure analysis with root cause suggestions, and user access patterns. DMV queries can be scheduled to run automatically with results stored in OneLake. Alerts can be configured for refresh failures, query timeouts, and unusual usage patterns.',
    impact: 'Minor',
  },
]

const months = [
  'March 2025',
  'February 2025',
  'January 2025',
  'December 2024',
  'November 2024',
  'October 2024',
  'September 2024',
]

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function CategoryBadge({ category }: { category: Category }) {
  const color = categoryColor[category]
  const cat = categories.find((c) => c.key === category)
  const Icon = cat?.icon ?? Cloud
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: `${color}20`, color }}
    >
      <Icon size={12} />
      {category}
    </span>
  )
}

function ImpactBadge({ impact }: { impact: Impact }) {
  const cfg = impactConfig[impact]
  const Icon = impact === 'Major' ? Star : impact === 'Preview' ? Eye : Zap
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  )
}

function TimelineCard({ update, index }: { update: Update; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`relative flex w-full items-start gap-6 md:gap-10 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 20 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative ml-10 md:ml-0 flex-1 rounded-xl border p-5 cursor-pointer group"
        style={{
          background: '#ffffff',
          borderColor: '#e5e7eb',
        }}
        onClick={() => setExpanded((p) => !p)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f0f0f0'
          e.currentTarget.style.borderColor = categoryColor[update.category] + '60'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ffffff'
          e.currentTarget.style.borderColor = '#e5e7eb'
        }}
      >
        {/* Pointer triangle */}
        <div
          className={`absolute top-5 hidden md:block w-3 h-3 rotate-45 border ${
            isLeft ? '-right-1.5 border-t-0 border-l-0' : '-left-1.5 border-b-0 border-r-0'
          }`}
          style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
        />

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <CategoryBadge category={update.category} />
          <ImpactBadge impact={update.impact} />
          <span className="ml-auto text-xs" style={{ color: '#94a3b8' }}>
            <CalendarDays size={12} className="inline mr-1 -mt-0.5" />
            {update.date}
          </span>
        </div>

        <h3 className="text-lg font-bold mb-1" style={{ color: '#1e293b' }}>
          {update.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
          {update.description}
        </p>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className="mt-3 pt-3 text-sm leading-relaxed"
                style={{ borderTop: '1px solid #e5e7eb', color: '#94a3b8' }}
              >
                {update.details}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: '#0078d4' }}>
          {expanded ? (
            <>
              <ChevronUp size={14} /> Less
            </>
          ) : (
            <>
              <ChevronDown size={14} /> Read more
            </>
          )}
        </div>
      </motion.div>

      {/* Timeline dot (center) */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.05 }}
        className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-5 z-10 flex items-center justify-center rounded-full"
        style={{
          width: 18,
          height: 18,
          background: categoryColor[update.category],
          boxShadow: `0 0 12px ${categoryColor[update.category]}50`,
        }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: '#fafafa' }} />
      </motion.div>

      {/* Spacer for opposite side on desktop */}
      <div className="hidden md:block flex-1" />
    </div>
  )
}

function ComingSoonCard({ item, index }: { item: ComingSoon; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl border p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
        borderColor: '#e5e7eb',
      }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10"
        style={{ background: categoryColor[item.category] }}
      />
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${categoryColor[item.category]}20` }}
        >
          <Rocket size={16} style={{ color: categoryColor[item.category] }} />
        </div>
        <CategoryBadge category={item.category} />
      </div>
      <h4 className="font-bold mb-1" style={{ color: '#1e293b' }}>
        {item.title}
      </h4>
      <p className="text-sm" style={{ color: '#94a3b8' }}>
        {item.description}
      </p>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function WhatsNew() {
  const [activeMonth, setActiveMonth] = useState<string | null>(null)
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set())

  const toggleCategory = (cat: Category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const filtered = useMemo(() => {
    let list = updates
    if (activeMonth) list = list.filter((u) => u.month === activeMonth)
    if (activeCategories.size > 0)
      list = list.filter((u) => activeCategories.has(u.category))
    return list
  }, [activeMonth, activeCategories])

  const monthRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const scrollToMonth = (month: string) => {
    setActiveMonth((prev) => {
      const next = prev === month ? null : month
      if (next && monthRefs.current[next]) {
        monthRefs.current[next]!.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return next
    })
  }

  return (
    <div className="min-h-screen" style={{ background: '#fafafa' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-sm font-medium"
            style={{ background: 'rgba(242,200,17,0.1)', color: '#f2c811' }}
          >
            <Sparkles size={16} />
            Stay up to date
          </div>
          <h1
            className="text-4xl sm:text-5xl font-extrabold mb-3"
            style={{
              background: 'linear-gradient(135deg, #f2c811 0%, #0078d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            What's New
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#94a3b8' }}>
            The latest Power BI & Microsoft Fabric updates, features, and announcements — all in one place.
          </p>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock size={20} style={{ color: '#f2c811' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#1e293b' }}>
              Coming Soon
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {comingSoon.map((item, i) => (
              <ComingSoonCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Filters */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 rounded-xl border p-5"
          style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} style={{ color: '#94a3b8' }} />
            <span className="text-sm font-semibold" style={{ color: '#1e293b' }}>
              Filters
            </span>
          </div>

          {/* Month pills */}
          <div className="mb-4">
            <span className="text-xs font-medium block mb-2" style={{ color: '#94a3b8' }}>
              Month
            </span>
            <div className="flex flex-wrap gap-2">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => scrollToMonth(m)}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                  style={{
                    background: activeMonth === m ? '#0078d4' : '#f0f0f0',
                    color: activeMonth === m ? '#ffffff' : '#94a3b8',
                    border: `1px solid ${activeMonth === m ? '#0078d4' : '#e5e7eb'}`,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Category pills */}
          <div>
            <span className="text-xs font-medium block mb-2" style={{ color: '#94a3b8' }}>
              Category
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map(({ key, icon: Icon, color }) => {
                const active = activeCategories.has(key)
                return (
                  <button
                    key={key}
                    onClick={() => toggleCategory(key)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all"
                    style={{
                      background: active ? `${color}25` : '#f0f0f0',
                      color: active ? color : '#94a3b8',
                      border: `1px solid ${active ? color : '#e5e7eb'}`,
                    }}
                  >
                    <Icon size={12} />
                    {key}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.section>

        {/* Timeline */}
        <section className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[8px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5"
            style={{ background: 'linear-gradient(to bottom, #0078d4, #e5e7eb 80%, transparent)' }}
          />

          <div className="space-y-6">
            {(() => {
              let lastMonth = ''
              const elements: React.ReactNode[] = []

              filtered.forEach((update, i) => {
                if (update.month !== lastMonth) {
                  lastMonth = update.month
                  elements.push(
                    <div
                      key={`month-${update.month}`}
                      ref={(el) => { monthRefs.current[update.month] = el }}
                      className="relative flex items-center justify-center py-4"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10 rounded-full px-5 py-1.5 text-sm font-bold"
                        style={{
                          background: '#f5f5f5',
                          border: '2px solid #0078d4',
                          color: '#0078d4',
                          boxShadow: '0 0 20px rgba(0,120,212,0.2)',
                        }}
                      >
                        {update.month}
                      </motion.div>
                    </div>
                  )
                }

                elements.push(
                  <TimelineCard key={update.id} update={update} index={i} />
                )
              })

              return elements
            })()}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg" style={{ color: '#94a3b8' }}>
                No updates match your filters.
              </p>
            </div>
          )}

          {/* Timeline end marker */}
          {filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex justify-center pt-8"
            >
              <div
                className="rounded-full px-4 py-1.5 text-xs font-medium"
                style={{ background: '#f5f5f5', border: '1px solid #e5e7eb', color: '#94a3b8' }}
              >
                End of timeline
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  )
}
