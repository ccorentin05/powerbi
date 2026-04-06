import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Code2,
  Database,
  Server,
  BarChart3,
  Brain,
  Shield,
  Clock,
  Sparkles,
  FileCode2,
  Layers,
  Activity,
  Calendar,
  FileText,
  Zap,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category =
  | 'All'
  | 'Health Checks'
  | 'Data Engineering'
  | 'Semantic Model'
  | 'Administration'
  | 'Data Science'

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

interface Template {
  id: string
  title: string
  category: Exclude<Category, 'All'>
  description: string
  code: string
  difficulty: Difficulty
  estimatedMinutes: number
  icon: React.ReactNode
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const categories: Category[] = [
  'All',
  'Health Checks',
  'Data Engineering',
  'Semantic Model',
  'Administration',
  'Data Science',
]

const categoryColors: Record<Exclude<Category, 'All'>, string> = {
  'Health Checks': '#10b981',
  'Data Engineering': '#3b82f6',
  'Semantic Model': '#f59e0b',
  Administration: '#ef4444',
  'Data Science': '#a855f7',
}

const categoryIcons: Record<Exclude<Category, 'All'>, React.ReactNode> = {
  'Health Checks': <Activity className="w-4 h-4" />,
  'Data Engineering': <Database className="w-4 h-4" />,
  'Semantic Model': <Layers className="w-4 h-4" />,
  Administration: <Shield className="w-4 h-4" />,
  'Data Science': <Brain className="w-4 h-4" />,
}

const difficultyConfig: Record<
  Difficulty,
  { color: string; bg: string }
> = {
  Beginner: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  Intermediate: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  Advanced: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
}

const templates: Template[] = [
  {
    id: 'bpa',
    title: 'Semantic Model Best Practice Analyzer',
    category: 'Health Checks',
    description:
      'Analyse automatique du modele semantique avec les regles BPA de Tabular Editor. Verifie les colonnes inutilisees, relations bi-directionnelles, mesures sans description et tables orphelines.',
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    icon: <Activity className="w-5 h-5" />,
    code: `import sempy.fabric as fabric

# Connect to semantic model
dataset_name = "YOUR_MODEL_NAME"
workspace = fabric.resolve_workspace_name()

# Get model metadata
tables = fabric.list_tables(dataset_name)
measures = fabric.list_measures(dataset_name)
columns = fabric.list_columns(dataset_name)
relationships = fabric.list_relationships(dataset_name)

# BPA Rules
issues = []

# Rule 1: Check for unused columns
for _, col in columns.iterrows():
    if col['isHidden'] == False and col['columnType'] == 'Data':
        # Check if column is referenced in any measure
        col_ref = f"[{col['columnName']}]"
        used = any(col_ref in m['expression'] for _, m in measures.iterrows())
        if not used:
            issues.append(f"WARN: Column '{col['tableName']}[{col['columnName']}]' may be unused")

# Rule 2: Check for bi-directional relationships
for _, rel in relationships.iterrows():
    if rel.get('crossFilteringBehavior') == 'BothDirections':
        issues.append(f"WARN: Bi-directional relationship {rel['fromTable']} <-> {rel['toTable']}")

# Rule 3: Measures without descriptions
for _, m in measures.iterrows():
    if not m.get('description'):
        issues.append(f"INFO: Measure '{m['measureName']}' has no description")

# Rule 4: Tables without relationships
connected = set()
for _, r in relationships.iterrows():
    connected.add(r['fromTable'])
    connected.add(r['toTable'])
for _, t in tables.iterrows():
    if t['tableName'] not in connected:
        issues.append(f"WARN: Table '{t['tableName']}' has no relationships")

print(f"\\n{'='*60}")
print(f"BPA REPORT - {dataset_name}")
print(f"{'='*60}")
print(f"Tables: {len(tables)} | Measures: {len(measures)} | Columns: {len(columns)}")
print(f"Issues found: {len(issues)}")
for issue in issues:
    print(f"  - {issue}")`,
  },
  {
    id: 'memory',
    title: 'Memory Analyzer',
    category: 'Health Checks',
    description:
      'Analyse la consommation memoire du modele semantique : taille des tables, nombre de lignes, cardinalite des colonnes.',
    difficulty: 'Beginner',
    estimatedMinutes: 3,
    icon: <Server className="w-5 h-5" />,
    code: `import sempy.fabric as fabric

dataset_name = "YOUR_MODEL_NAME"

# Get table sizes
tables = fabric.list_tables(dataset_name)
columns = fabric.list_columns(dataset_name)

print(f"{'Table':<30} {'Rows':>12} {'Columns':>8}")
print("-" * 52)
for _, t in tables.iterrows():
    table_cols = columns[columns['tableName'] == t['tableName']]
    print(f"{t['tableName']:<30} {t.get('rowCount', 'N/A'):>12} {len(table_cols):>8}")

# Cardinality check
print(f"\\n{'Column':<40} {'Cardinality':>12} {'Type':>10}")
print("-" * 64)
for _, c in columns.iterrows():
    card = c.get('distinctCount', 'N/A')
    print(f"{c['tableName']}.{c['columnName']:<30} {card:>12} {c['dataType']:>10}")`,
  },
  {
    id: 'dax-runner',
    title: 'DAX Query Runner',
    category: 'Semantic Model',
    description:
      'Execute des requetes DAX directement depuis un notebook Fabric avec Semantic Link.',
    difficulty: 'Beginner',
    estimatedMinutes: 2,
    icon: <Code2 className="w-5 h-5" />,
    code: `import sempy.fabric as fabric

dataset_name = "YOUR_MODEL_NAME"

# Run DAX query
result = fabric.evaluate_dax(
    dataset_name,
    """
    EVALUATE
    SUMMARIZECOLUMNS(
        'Date'[Year],
        'Product'[Category],
        "Total Sales", [Total Sales],
        "Order Count", [Order Count]
    )
    ORDER BY 'Date'[Year] DESC, [Total Sales] DESC
    """
)

display(result)`,
  },
  {
    id: 'lakehouse-ingestion',
    title: 'Lakehouse Data Ingestion',
    category: 'Data Engineering',
    description:
      'Pipeline d\'ingestion de donnees CSV vers une table Delta dans le Lakehouse avec nettoyage et deduplication.',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    icon: <Database className="w-5 h-5" />,
    code: `from pyspark.sql import SparkSession
from pyspark.sql.functions import *

# Read from external source
df = spark.read.format("csv") \\
    .option("header", "true") \\
    .option("inferSchema", "true") \\
    .load("Files/raw/sales_data.csv")

# Transform
df_clean = df \\
    .withColumn("date", to_date(col("date_string"), "yyyy-MM-dd")) \\
    .withColumn("amount", col("amount").cast("double")) \\
    .withColumn("load_date", current_timestamp()) \\
    .dropDuplicates(["order_id"]) \\
    .filter(col("amount") > 0)

# Write to delta table in Lakehouse
df_clean.write.mode("overwrite") \\
    .format("delta") \\
    .saveAsTable("silver_sales")

print(f"Loaded {df_clean.count()} rows to silver_sales")`,
  },
  {
    id: 'medallion',
    title: 'Medallion Architecture Pipeline',
    category: 'Data Engineering',
    description:
      'Pipeline complet Bronze, Silver, Gold : ingestion brute, nettoyage, puis agregations metier.',
    difficulty: 'Advanced',
    estimatedMinutes: 15,
    icon: <Layers className="w-5 h-5" />,
    code: `# Bronze -> Silver -> Gold pipeline
from pyspark.sql.functions import *

# BRONZE: Raw ingestion
bronze = spark.read.format("csv") \\
    .option("header", True) \\
    .load("Files/raw/*.csv") \\
    .withColumn("_source_file", input_file_name()) \\
    .withColumn("_ingestion_time", current_timestamp())

bronze.write.mode("append").format("delta").saveAsTable("bronze_events")

# SILVER: Cleansed and conformed
silver = spark.table("bronze_events") \\
    .dropDuplicates(["event_id"]) \\
    .filter(col("event_date").isNotNull()) \\
    .withColumn("event_date", to_date("event_date")) \\
    .withColumn("amount", col("amount").cast("decimal(18,2)"))

silver.write.mode("overwrite").format("delta").saveAsTable("silver_events")

# GOLD: Business aggregates
gold = spark.table("silver_events") \\
    .groupBy("customer_id", "event_date") \\
    .agg(
        sum("amount").alias("total_amount"),
        count("*").alias("event_count"),
        avg("amount").alias("avg_amount")
    )

gold.write.mode("overwrite").format("delta").saveAsTable("gold_customer_daily")`,
  },
  {
    id: 'refresh-monitor',
    title: 'Automated Refresh Monitor',
    category: 'Administration',
    description:
      'Surveillance automatique des rafraichissements de tous les datasets du workspace.',
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    icon: <Zap className="w-5 h-5" />,
    code: `import sempy.fabric as fabric
import datetime

# List all datasets in workspace
datasets = fabric.list_datasets()

print(f"{'Dataset':<35} {'Last Refresh':>20} {'Status':>10}")
print("-" * 67)
for _, ds in datasets.iterrows():
    name = ds['datasetName']
    try:
        refreshes = fabric.list_refresh_requests(name)
        if len(refreshes) > 0:
            last = refreshes.iloc[0]
            status = last.get('status', 'Unknown')
            end_time = last.get('endTime', 'N/A')
            print(f"{name:<35} {str(end_time):>20} {status:>10}")
    except:
        print(f"{name:<35} {'N/A':>20} {'Error':>10}")`,
  },
  {
    id: 'date-table',
    title: 'Date Table Generator',
    category: 'Data Engineering',
    description:
      'Generation d\'une table de dates complete (2020-2030) avec colonnes calculees : annee fiscale, trimestre, semaine, weekend.',
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    icon: <Calendar className="w-5 h-5" />,
    code: `from pyspark.sql.functions import *
from pyspark.sql.types import *
import datetime

# Generate date range
start_date = datetime.date(2020, 1, 1)
end_date = datetime.date(2030, 12, 31)

dates = spark.sql(f"""
    SELECT explode(sequence(
        to_date('{start_date}'),
        to_date('{end_date}'),
        interval 1 day
    )) as Date
""")

# Add all useful columns
date_table = dates \\
    .withColumn("Year", year("Date")) \\
    .withColumn("Month", month("Date")) \\
    .withColumn("MonthName", date_format("Date", "MMMM")) \\
    .withColumn("MonthShort", date_format("Date", "MMM")) \\
    .withColumn("Day", dayofmonth("Date")) \\
    .withColumn("DayOfWeek", dayofweek("Date")) \\
    .withColumn("DayName", date_format("Date", "EEEE")) \\
    .withColumn("Quarter", quarter("Date")) \\
    .withColumn("YearMonth", date_format("Date", "yyyy-MM")) \\
    .withColumn("YearQuarter", concat(year("Date"), lit("-Q"), quarter("Date"))) \\
    .withColumn("WeekOfYear", weekofyear("Date")) \\
    .withColumn("IsWeekend", when(dayofweek("Date").isin(1, 7), True).otherwise(False)) \\
    .withColumn("FiscalYear", when(month("Date") >= 7, year("Date") + 1).otherwise(year("Date")))

date_table.write.mode("overwrite").format("delta").saveAsTable("dim_date")
print(f"Created dim_date with {date_table.count()} rows")`,
  },
  {
    id: 'model-doc',
    title: 'Semantic Link - Model Documentation',
    category: 'Semantic Model',
    description:
      'Generation automatique de documentation Markdown complete pour un modele semantique : tables, colonnes, mesures, relations.',
    difficulty: 'Beginner',
    estimatedMinutes: 3,
    icon: <FileText className="w-5 h-5" />,
    code: `import sempy.fabric as fabric

dataset = "YOUR_MODEL_NAME"

# Full model documentation
tables = fabric.list_tables(dataset)
measures = fabric.list_measures(dataset)
columns = fabric.list_columns(dataset)
relationships = fabric.list_relationships(dataset)

# Generate markdown documentation
doc = f"# Model Documentation: {dataset}\\n\\n"
doc += f"## Summary\\n"
doc += f"- Tables: {len(tables)}\\n"
doc += f"- Measures: {len(measures)}\\n"
doc += f"- Relationships: {len(relationships)}\\n\\n"

doc += "## Tables\\n"
for _, t in tables.iterrows():
    table_cols = columns[columns['tableName'] == t['tableName']]
    doc += f"### {t['tableName']}\\n"
    doc += f"Columns: {len(table_cols)}\\n\\n"
    for _, c in table_cols.iterrows():
        doc += f"- \`{c['columnName']}\` ({c['dataType']})\\n"
    doc += "\\n"

doc += "## Measures\\n"
for _, m in measures.iterrows():
    doc += f"### {m['measureName']}\\n"
    doc += f"\`\`\`dax\\n{m['expression']}\\n\`\`\`\\n\\n"

print(doc)`,
  },
]

/* ------------------------------------------------------------------ */
/*  Syntax Highlighting (simple token-based)                           */
/* ------------------------------------------------------------------ */

function highlightPython(code: string): React.ReactNode[] {
  const keywords = new Set([
    'import', 'from', 'as', 'def', 'class', 'return', 'if', 'else', 'elif',
    'for', 'in', 'while', 'try', 'except', 'with', 'not', 'and', 'or',
    'True', 'False', 'None', 'print', 'any', 'all', 'set', 'len',
  ])
  const builtins = new Set([
    'display', 'range', 'str', 'int', 'float', 'list', 'dict', 'f',
  ])

  const lines = code.split('\n')
  const result: React.ReactNode[] = []

  lines.forEach((line, lineIdx) => {
    // Handle comments
    const commentIdx = line.indexOf('#')
    let codePart = line
    let commentPart = ''
    if (commentIdx !== -1) {
      // Check it's not inside a string (simple heuristic)
      const beforeHash = line.substring(0, commentIdx)
      const singleQuotes = (beforeHash.match(/'/g) || []).length
      const doubleQuotes = (beforeHash.match(/"/g) || []).length
      if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0) {
        codePart = line.substring(0, commentIdx)
        commentPart = line.substring(commentIdx)
      }
    }

    // Tokenize the code part
    const tokens = codePart.split(/(\b\w+\b|"[^"]*"|'[^']*'|f"[^"]*"|f'[^']*'|\s+|[^\w\s])/g)
    tokens.forEach((token, tokenIdx) => {
      if (!token) return
      const key = `${lineIdx}-${tokenIdx}`

      if (keywords.has(token)) {
        result.push(
          <span key={key} style={{ color: '#c678dd' }}>
            {token}
          </span>
        )
      } else if (builtins.has(token)) {
        result.push(
          <span key={key} style={{ color: '#61afef' }}>
            {token}
          </span>
        )
      } else if (/^["']/.test(token) || /^f["']/.test(token)) {
        result.push(
          <span key={key} style={{ color: '#98c379' }}>
            {token}
          </span>
        )
      } else if (/^\d+$/.test(token)) {
        result.push(
          <span key={key} style={{ color: '#d19a66' }}>
            {token}
          </span>
        )
      } else if (/^[.()[\]{},=:+\-*/<>!\\|&%@]$/.test(token)) {
        result.push(
          <span key={key} style={{ color: '#abb2bf' }}>
            {token}
          </span>
        )
      } else {
        result.push(
          <span key={key} style={{ color: '#e2e8f0' }}>
            {token}
          </span>
        )
      }
    })

    if (commentPart) {
      result.push(
        <span key={`comment-${lineIdx}`} style={{ color: '#5c6370', fontStyle: 'italic' }}>
          {commentPart}
        </span>
      )
    }

    if (lineIdx < lines.length - 1) {
      result.push(<br key={`br-${lineIdx}`} />)
    }
  })

  return result
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatsBar({ filteredCount }: { filteredCount: number }) {
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const t of templates) {
      counts[t.category] = (counts[t.category] || 0) + 1
    }
    return counts
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-pbi-text">
            {templates.length} templates disponibles
          </span>
        </div>
        <span className="text-xs text-pbi-muted">
          {filteredCount} affiche{filteredCount > 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <div
            key={cat}
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(229, 231, 235, 0.4)' }}
          >
            <span style={{ color: categoryColors[cat as Exclude<Category, 'All'>] }}>
              {categoryIcons[cat as Exclude<Category, 'All'>]}
            </span>
            <span className="text-xs text-pbi-muted truncate">{cat}</span>
            <span
              className="ml-auto text-xs font-bold"
              style={{ color: categoryColors[cat as Exclude<Category, 'All'>] }}
            >
              {count}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code])

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
      style={{
        background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(229, 231, 235, 0.5)',
        color: copied ? '#10b981' : '#94a3b8',
        border: `1px solid ${copied ? 'rgba(16, 185, 129, 0.3)' : 'rgba(229, 231, 235, 0.8)'}`,
      }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" /> Copie !
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Copier
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function TemplateCard({ template, index }: { template: Template; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const previewLines = 12
  const codeLines = template.code.split('\n')
  const hasMore = codeLines.length > previewLines
  const displayCode = expanded
    ? template.code
    : codeLines.slice(0, previewLines).join('\n') + (hasMore ? '\n...' : '')

  const catColor = categoryColors[template.category]
  const diffConf = difficultyConfig[template.difficulty]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass-card overflow-hidden hover:border-pbi-muted/30 transition-colors"
    >
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${catColor}20`, color: catColor }}
            >
              {template.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-pbi-text leading-tight truncate">
                {template.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
                  style={{ background: `${catColor}20`, color: catColor }}
                >
                  {categoryIcons[template.category]}
                  {template.category}
                </span>
                <span
                  className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium"
                  style={{ background: diffConf.bg, color: diffConf.color }}
                >
                  {template.difficulty}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs text-pbi-muted"
                  style={{ background: 'rgba(229, 231, 235, 0.5)' }}
                >
                  <Clock className="w-3 h-3" />
                  ~{template.estimatedMinutes} min
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-pbi-muted leading-relaxed">{template.description}</p>
      </div>

      {/* Code block */}
      <div className="mx-5 mb-3 rounded-xl overflow-hidden" style={{ background: '#1e1e2e' }}>
        <div className="flex items-center justify-between px-4 py-2" style={{ background: '#181825' }}>
          <div className="flex items-center gap-2">
            <FileCode2 className="w-3.5 h-3.5 text-pbi-muted" />
            <span className="text-xs text-pbi-muted font-mono">Python</span>
          </div>
          <CopyButton code={template.code} />
        </div>
        <div className="relative">
          <pre className="p-4 overflow-x-auto text-[13px] leading-[1.6]" style={{ fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace" }}>
            <code>{highlightPython(displayCode)}</code>
          </pre>
          {hasMore && !expanded && (
            <div
              className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
              style={{
                background: 'linear-gradient(transparent, #1e1e2e)',
              }}
            />
          )}
        </div>
      </div>

      {/* Expand / collapse */}
      {hasMore && (
        <div className="px-5 pb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
            style={{ color: '#0078d4' }}
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" /> Reduire
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Voir tout le code ({codeLines.length} lignes)
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function NotebookTemplates() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = templates
    if (activeCategory !== 'All') {
      list = list.filter((t) => t.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeCategory, search])

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
          style={{ background: 'rgba(0, 120, 212, 0.1)', border: '1px solid rgba(0, 120, 212, 0.2)' }}
        >
          <BookOpen className="w-4 h-4 text-fabric" />
          <span className="text-xs font-medium text-fabric">Notebooks Fabric</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">
          <span className="gradient-text">Templates Notebooks Fabric</span>
        </h1>
        <p className="text-pbi-muted text-lg max-w-2xl mx-auto">
          Code pret a l'emploi pour vos notebooks PySpark & Python
        </p>
      </motion.div>

      {/* Stats */}
      <StatsBar filteredCount={filtered.length} />

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pbi-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un template..."
            className="w-full pl-11 pr-10 py-3 rounded-xl text-sm text-pbi-text placeholder-pbi-muted outline-none transition-colors"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(229, 231, 235, 0.5)',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-pbi-border/30 cursor-pointer"
            >
              <X className="w-4 h-4 text-pbi-muted" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Category pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat
          const color =
            cat === 'All' ? '#f2c811' : categoryColors[cat as Exclude<Category, 'All'>]
          return (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{
                background: isActive ? `${color}20` : 'rgba(229, 231, 235, 0.4)',
                color: isActive ? color : '#94a3b8',
                border: `1px solid ${isActive ? `${color}40` : 'rgba(229, 231, 235, 0.5)'}`,
              }}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({templates.filter((t) => t.category === cat).length})
                </span>
              )}
            </motion.button>
          )
        })}
      </motion.div>

      {/* Template grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + search}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filtered.map((template, i) => (
            <TemplateCard key={template.id} template={template} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Sparkles className="w-12 h-12 text-pbi-muted mx-auto mb-4" />
          <p className="text-pbi-muted text-lg">Aucun template trouve</p>
          <p className="text-pbi-muted/60 text-sm mt-1">
            Essayez de modifier votre recherche ou categorie
          </p>
        </motion.div>
      )}
    </div>
  )
}
