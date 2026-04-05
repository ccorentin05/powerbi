import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Database,
  Server,
  Layers,
  Zap,
  BarChart3,
  Shield,
  Cpu,
  Eye,
  Bell,
  Cloud,
  Network,
  HardDrive,
  RefreshCw,
  GitBranch,
  Clock,
  Users,
  Lock,
  FileCode,
  Settings,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Workflow,
  Radio,
  Factory,
  Box,
  TrendingUp,
  Gauge,
  BookOpen,
  Lightbulb,
  Target,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                   */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: 'overview', label: "Vue d'ensemble", icon: Eye },
  { id: 'ingestion', label: 'Connexion & Ingestion', icon: Database },
  { id: 'transformation', label: 'Transformation', icon: RefreshCw },
  { id: 'storage', label: 'Stockage', icon: HardDrive },
  { id: 'orchestration', label: 'Orchestration', icon: Workflow },
  { id: 'visualization', label: 'Visualisation', icon: BarChart3 },
  { id: 'alerting', label: 'Alerting', icon: Bell },
  { id: 'governance', label: 'Gouvernance', icon: Shield },
  { id: 'optimization', label: 'CU & Optimisation', icon: Cpu },
] as const

type TabId = (typeof TABS)[number]['id']

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
}

/* ------------------------------------------------------------------ */
/*  Reusable Sub-components                                             */
/* ------------------------------------------------------------------ */

function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <motion.h2
      className="flex items-center gap-3 text-2xl font-bold mb-6"
      style={{ color: '#f2c811' }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {Icon && <Icon size={28} />}
      {children}
    </motion.h2>
  )
}

function SubSection({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <motion.div
      className="rounded-xl p-6 mb-6 border"
      style={{ background: '#16213e', borderColor: '#2a3a5c' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h3 className="flex items-center gap-2 text-xl font-semibold mb-4" style={{ color: '#e2e8f0' }}>
        {Icon && <Icon size={22} className="text-[#0078d4]" />}
        {title}
      </h3>
      {children}
    </motion.div>
  )
}

function InfoCard({ title, value, subtitle, color = '#0078d4' }: { title: string; value: string; subtitle?: string; color?: string }) {
  return (
    <motion.div
      className="rounded-xl p-5 border text-center"
      style={{ background: '#16213e', borderColor: '#2a3a5c' }}
      whileHover={{ scale: 1.03, borderColor: color }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-sm mb-1" style={{ color: '#94a3b8' }}>{title}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      {subtitle && <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>{subtitle}</p>}
    </motion.div>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg p-4 my-4 border" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)' }}>
      <Lightbulb size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />
      <p className="text-sm" style={{ color: '#e2e8f0' }}>{children}</p>
    </div>
  )
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg p-4 my-4 border" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)' }}>
      <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
      <p className="text-sm" style={{ color: '#e2e8f0' }}>{children}</p>
    </div>
  )
}

function Badge({ children, color = '#0078d4' }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {children}
    </span>
  )
}

function PageLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline transition-colors"
      style={{ color: '#0078d4' }}
    >
      {label} <ExternalLink size={14} />
    </Link>
  )
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border my-4" style={{ borderColor: '#2a3a5c' }}>
      <table className="w-full text-sm" style={{ color: '#e2e8f0' }}>
        <thead>
          <tr style={{ background: '#0f0f1e' }}>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold" style={{ color: '#f2c811', borderBottom: '1px solid #2a3a5c' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="transition-colors"
              style={{ background: ri % 2 === 0 ? '#16213e' : '#1a2744' }}
            >
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3" style={{ borderBottom: '1px solid #2a3a5c' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FeatureList({ items }: { items: { label: string; ok: boolean }[] }) {
  return (
    <ul className="space-y-2 my-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-sm" style={{ color: '#e2e8f0' }}>
          {item.ok
            ? <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            : <XCircle size={16} style={{ color: '#ef4444' }} />}
          {item.label}
        </li>
      ))}
    </ul>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 my-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#e2e8f0' }}>
          <ChevronRight size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#0078d4' }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3 my-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#e2e8f0' }}>
          <span
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#0078d4', color: '#fff' }}
          >
            {i + 1}
          </span>
          <span className="pt-0.5">{item}</span>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab Content Components                                              */
/* ------------------------------------------------------------------ */

function OverviewTab() {
  return (
    <motion.div {...stagger} initial="initial" animate="animate">
      <SectionTitle icon={Eye}>Vue d'ensemble de Microsoft Fabric</SectionTitle>

      <SubSection title="Qu'est-ce que Microsoft Fabric ?" icon={Cloud}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Microsoft Fabric est une <strong style={{ color: '#f2c811' }}>plateforme analytique SaaS unifiee</strong> qui regroupe
          sous un seul toit l'ensemble des services de donnees : ingestion, transformation, stockage, analyse, visualisation,
          alerting et gouvernance. Contrairement a une approche multi-services (Azure Data Factory + Synapse + Power BI + ...),
          Fabric offre une experience integree avec une facturation unique basee sur les <strong style={{ color: '#0078d4' }}>Capacity Units (CU)</strong>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <InfoCard title="Modele" value="SaaS Unifie" subtitle="Pas d'infra a gerer" color="#0078d4" />
          <InfoCard title="Facturation" value="Capacity Units" subtitle="Un seul metre de cout" color="#f2c811" />
          <InfoCard title="Stockage" value="OneLake" subtitle="Delta/Parquet natif" color="#10b981" />
        </div>
        <Tip>
          Fabric remplace progressivement Azure Synapse Analytics, Azure Data Factory et Power BI Premium.
          Si vous demarrez un nouveau projet, privilegiez Fabric plutot que ces services individuels.
        </Tip>
      </SubSection>

      <SubSection title="OneLake : le lac de donnees unifie" icon={Database}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          OneLake est le <strong style={{ color: '#f2c811' }}>stockage unifie</strong> de Fabric. Chaque tenant dispose
          d'un seul OneLake (comme OneDrive pour les fichiers). Toutes les donnees Fabric sont stockees en format
          ouvert <strong>Delta Lake</strong> (Parquet + logs de transaction).
        </p>
        <BulletList items={[
          'Protocole ABFS (Azure Blob File System) — compatible avec l\'ecosysteme Hadoop/Spark',
          'Format ouvert : Delta Lake (Parquet columnar + transaction log JSON)',
          'Un seul lac par tenant Microsoft 365 — pas de silos',
          'Shortcuts : pointeurs zero-copy vers des donnees externes (ADLS, S3, GCS)',
          'Integration native avec tous les moteurs Fabric (Spark, SQL, KQL, Power BI)',
          'Stockage facture separement : ~0.023 EUR/GB/mois (pay-as-you-go)',
        ]} />
        <Tip>
          OneLake supprime le besoin de copier les donnees entre services. Un Lakehouse, un Warehouse et Power BI
          lisent tous depuis le meme emplacement physique dans OneLake.
        </Tip>
      </SubSection>

      <SubSection title="Modele de capacite (CU)" icon={Cpu}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Fabric utilise un modele de <strong style={{ color: '#f2c811' }}>Capacity Units (CU)</strong> partage entre
          toutes les charges de travail. Chaque operation (copie, requete, notebook, rendu de rapport) consomme des CU.
        </p>
        <DataTable
          headers={['SKU', 'CU', 'Equivalent', 'Prix/mois (approx.)', 'Usage type']}
          rows={[
            ['F2', '2 CU', '—', '~260 EUR', 'Dev / POC'],
            ['F4', '4 CU', '—', '~520 EUR', 'Dev / Small team'],
            ['F8', '8 CU', '~P1', '~1 040 EUR', 'Small production'],
            ['F16', '16 CU', '~P2', '~2 080 EUR', 'Medium production'],
            ['F32', '32 CU', '~P3', '~4 160 EUR', 'Large production'],
            ['F64', '64 CU', '~P4', '~8 320 EUR', 'Enterprise'],
            ['F128', '128 CU', '~P5', '~16 640 EUR', 'Enterprise+'],
            ['F256', '256 CU', '—', '~33 280 EUR', 'Very large enterprise'],
            ['F512', '512 CU', '—', '~66 560 EUR', 'Mega enterprise'],
          ]}
        />
        <PageLink to="/simulator" label="Simuler votre cout avec le Fabric Simulator" />
      </SubSection>

      <SubSection title="Architecture des Workspaces" icon={Layers}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Les workspaces sont les conteneurs logiques dans Fabric. Chaque workspace est attache a une capacite
          et contient des items (Lakehouses, Warehouses, Notebooks, Reports, etc.).
        </p>
        <BulletList items={[
          'Workspace = conteneur logique rattache a une capacite Fabric',
          'Un workspace peut contenir n\'importe quel type d\'item Fabric',
          'Les roles workspace : Admin, Member, Contributor, Viewer',
          'Best practice : 1 workspace par environnement (dev, staging, prod) et par domaine',
          'Les Domains (nouveaute Fabric) regroupent les workspaces par domaine metier',
          'Git integration : connecter un workspace a un repo Azure DevOps ou GitHub',
        ]} />
        <PageLink to="/cicd" label="Voir les patterns CI/CD pour Fabric" />
      </SubSection>

      <SubSection title="Types d'items Fabric (30+)" icon={Box}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Fabric propose plus de 30 types d'items. Voici l'inventaire complet :
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Lakehouse', cat: 'Stockage', color: '#10b981' },
            { name: 'Warehouse', cat: 'Stockage', color: '#10b981' },
            { name: 'KQL Database', cat: 'Stockage', color: '#10b981' },
            { name: 'KQL Queryset', cat: 'Stockage', color: '#10b981' },
            { name: 'Eventstream', cat: 'Ingestion', color: '#f59e0b' },
            { name: 'Data Pipeline', cat: 'Orchestration', color: '#3b82f6' },
            { name: 'Dataflow Gen2', cat: 'Transformation', color: '#3b82f6' },
            { name: 'Notebook', cat: 'Transformation', color: '#3b82f6' },
            { name: 'Spark Job Definition', cat: 'Transformation', color: '#3b82f6' },
            { name: 'ML Model', cat: 'Data Science', color: '#8b5cf6' },
            { name: 'ML Experiment', cat: 'Data Science', color: '#8b5cf6' },
            { name: 'Semantic Model', cat: 'Power BI', color: '#f2c811' },
            { name: 'Report', cat: 'Power BI', color: '#f2c811' },
            { name: 'Paginated Report', cat: 'Power BI', color: '#f2c811' },
            { name: 'Dashboard', cat: 'Power BI', color: '#f2c811' },
            { name: 'Scorecard', cat: 'Power BI', color: '#f2c811' },
            { name: 'Real-Time Dashboard', cat: 'Visualisation', color: '#f2c811' },
            { name: 'Data Activator (Reflex)', cat: 'Alerting', color: '#ef4444' },
            { name: 'Mirrored Database', cat: 'Ingestion', color: '#f59e0b' },
            { name: 'Shortcut', cat: 'Connexion', color: '#f59e0b' },
            { name: 'Environment', cat: 'Configuration', color: '#94a3b8' },
            { name: 'SQL analytics endpoint', cat: 'Stockage', color: '#10b981' },
            { name: 'Eventhouse', cat: 'Stockage', color: '#10b981' },
            { name: 'Copy Job', cat: 'Ingestion', color: '#f59e0b' },
            { name: 'Datamart', cat: 'Stockage', color: '#10b981' },
            { name: 'Datapipeline', cat: 'Orchestration', color: '#3b82f6' },
            { name: 'GraphQL API', cat: 'API', color: '#0078d4' },
            { name: 'Capacity Metrics App', cat: 'Monitoring', color: '#94a3b8' },
            { name: 'Deployment Pipeline', cat: 'CI/CD', color: '#3b82f6' },
            { name: 'Domain', cat: 'Gouvernance', color: '#8b5cf6' },
            { name: 'Git Integration', cat: 'CI/CD', color: '#3b82f6' },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-lg px-4 py-2 border"
              style={{ background: '#1a2744', borderColor: '#2a3a5c' }}
            >
              <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{item.name}</span>
              <Badge color={item.color}>{item.cat}</Badge>
            </div>
          ))}
        </div>
      </SubSection>
    </motion.div>
  )
}

function IngestionTab() {
  return (
    <motion.div {...stagger} initial="initial" animate="animate">
      <SectionTitle icon={Database}>Connexion & Ingestion</SectionTitle>

      {/* Shortcuts */}
      <SubSection title="Shortcuts (pointeurs zero-copy)" icon={GitBranch}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Les <strong style={{ color: '#f2c811' }}>Shortcuts</strong> sont des pointeurs virtuels vers des donnees
          sans les copier. Ils permettent d'acceder a des donnees distantes comme si elles etaient locales dans votre Lakehouse.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Types de Shortcuts</h4>
        <DataTable
          headers={['Type', 'Source', 'Protocole', 'Authentification']}
          rows={[
            ['OneLake', 'Autre Lakehouse/Warehouse Fabric', 'ABFS interne', 'Identite workspace'],
            ['ADLS Gen2', 'Azure Data Lake Storage Gen2', 'ABFS', 'Service Principal / SAS'],
            ['Amazon S3', 'Buckets S3', 'S3 API', 'Access Key / IAM Role'],
            ['Google Cloud Storage', 'Buckets GCS', 'GCS API', 'Service Account Key'],
            ['Dataverse', 'Tables Dataverse / Dynamics 365', 'Dataverse API', 'OAuth Entra ID'],
            ['AWS Glue (preview)', 'Glue Catalog tables', 'S3 + Glue API', 'IAM'],
          ]}
        />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Limitations</h4>
        <FeatureList items={[
          { label: 'Lecture seule — pas de write-back vers la source', ok: false },
          { label: 'Latence reseau si source distante (S3, GCS)', ok: false },
          { label: 'Propagation des permissions limitee', ok: false },
          { label: 'Pas de support Delta time-travel sur shortcuts S3/GCS', ok: false },
          { label: 'Cout CU minimal (metadata only)', ok: true },
          { label: 'Pas de duplication de donnees = economie de stockage', ok: true },
          { label: 'Ideal pour le Data Mesh (cross-domain access)', ok: true },
        ]} />

        <Tip>
          Utilisez les Shortcuts pour implementer un <strong>Data Mesh</strong> dans Fabric :
          chaque domaine maintient son Lakehouse et partage ses donnees via Shortcuts OneLake
          vers les autres domaines, sans duplication.
        </Tip>
      </SubSection>

      {/* Mirroring */}
      <SubSection title="Mirroring (replication quasi temps-reel)" icon={RefreshCw}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Le <strong style={{ color: '#f2c811' }}>Mirroring</strong> replique les donnees d'une base externe
          vers OneLake en quasi temps-reel via <strong>Change Data Capture (CDC)</strong>. Les donnees arrivent
          en format Delta dans un Lakehouse dedie.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Sources supportees</h4>
        <DataTable
          headers={['Source', 'Latence typique', 'Mecanisme', 'GA/Preview']}
          rows={[
            ['Azure SQL Database', '5-15 min', 'CDC natif', 'GA'],
            ['Azure Cosmos DB', '5-30 min', 'Change feed', 'GA'],
            ['Snowflake', '10-30 min', 'Streams + Tasks', 'GA'],
            ['SQL Server (on-prem)', '5-15 min', 'CDC via gateway', 'Preview'],
            ['Azure Database for PostgreSQL', '5-15 min', 'Logical replication', 'Preview'],
            ['Azure Database for MySQL', '5-15 min', 'Binlog replication', 'Preview'],
            ['MongoDB (Atlas)', '5-30 min', 'Change streams', 'Preview'],
          ]}
        />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Fonctionnement</h4>
        <BulletList items={[
          'Initial snapshot : copie complete de la table source vers Delta dans OneLake',
          'Incremental sync : seules les modifications (INSERT/UPDATE/DELETE) sont propagees via CDC',
          'Les tables mirrored sont accessibles via le SQL analytics endpoint (lecture seule T-SQL)',
          'Les donnees sont en format Delta ouvert — accessibles par Spark, SQL et Power BI',
          'Un Mirrored Database apparait comme un item Fabric a part entiere',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Limitations</h4>
        <FeatureList items={[
          { label: 'Latence 5-30 min selon la source (pas du vrai temps-reel)', ok: false },
          { label: 'Certains types de donnees non supportes (geometry, xml, etc.)', ok: false },
          { label: 'Limite de lignes pour le snapshot initial sur certaines sources', ok: false },
          { label: 'Consommation CU dependante du volume de changements', ok: false },
          { label: 'Zero ETL : pas de code a ecrire', ok: true },
          { label: 'Donnees en format ouvert Delta (pas de lock-in)', ok: true },
          { label: 'Ideal pour le reporting operationnel sans impacter la base source', ok: true },
        ]} />

        <Warning>
          Le Mirroring consomme des CU proportionnellement au volume de modifications. Pour une base avec
          beaucoup de write activity, surveillez la consommation dans le Capacity Metrics App.
        </Warning>
      </SubSection>

      {/* Copy Activity */}
      <SubSection title="Data Pipeline — Copy Activity" icon={Factory}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          La <strong style={{ color: '#f2c811' }}>Copy Activity</strong> est le moyen classique d'ingerer des donnees
          dans Fabric. Elle supporte <strong>100+ connecteurs</strong> et offre une grande flexibilite.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Patterns de copie</h4>
        <DataTable
          headers={['Pattern', 'Description', 'Quand utiliser']}
          rows={[
            ['Full Copy', 'Copie complete a chaque execution', 'Tables de reference, petites tables (<100K rows)'],
            ['Incremental Copy', 'Copie uniquement les nouvelles lignes (watermark)', 'Tables de faits avec colonne de date'],
            ['Delta Copy', 'Copie les modifications (CDC)', 'Tables avec tracking des modifications'],
            ['Partition Copy', 'Copie par partition (date, region)', 'Tres grandes tables (>100M rows)'],
          ]}
        />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Consommation CU</h4>
        <DataTable
          headers={['Volume de donnees', 'CU-secondes (approx.)', 'Duree typique']}
          rows={[
            ['1 000 lignes', '~0.01 CU-s', '< 10 sec'],
            ['100 000 lignes', '~0.1 CU-s', '< 30 sec'],
            ['1 million lignes', '~0.5 CU-s', '1-2 min'],
            ['10 millions lignes', '~5 CU-s', '5-10 min'],
            ['100 millions lignes', '~50 CU-s', '15-30 min'],
            ['1 milliard lignes', '~500 CU-s', '1-3 heures'],
          ]}
        />

        <Tip>
          Pour les grosses copies, utilisez toujours un <strong>staging area</strong> dans le Lakehouse (dossier Files/)
          avant de charger dans les Tables managees. Cela permet de decouple ingestion et transformation.
        </Tip>
      </SubSection>

      {/* Eventstream */}
      <SubSection title="Eventstream (ingestion temps-reel)" icon={Radio}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          <strong style={{ color: '#f2c811' }}>Eventstream</strong> permet l'ingestion de donnees en temps-reel
          depuis des sources de streaming vers Fabric.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Sources & Destinations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#10b981' }}>Sources</h5>
            <BulletList items={[
              'Azure Event Hub',
              'Azure IoT Hub',
              'Custom App (SDK)',
              'Apache Kafka (compatible)',
              'Azure Blob Storage (event trigger)',
              'Sample data (pour tests)',
            ]} />
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#ef4444' }}>Destinations</h5>
            <BulletList items={[
              'KQL Database (Eventhouse)',
              'Lakehouse (Delta tables)',
              'Reflex (Data Activator)',
              'Custom endpoint',
              'Derived Eventstream',
            ]} />
          </div>
        </div>

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Transformations in-stream</h4>
        <BulletList items={[
          'Filter : filtrer les evenements par condition',
          'Aggregate : fenetres temporelles (tumbling, hopping, sliding, session)',
          'Group By : regrouper par cle',
          'Manage Fields : selectionner/renommer des champs',
          'Union : fusionner plusieurs streams',
          'Expand : decompresser des arrays ou objets imbriques',
        ]} />

        <Tip>
          Eventstream est ideal pour les cas d'usage IoT, logs applicatifs et telemetrie.
          Pour du reporting operationnel classique (ERP, CRM), privilegiez le Mirroring.
        </Tip>
      </SubSection>
    </motion.div>
  )
}

function TransformationTab() {
  return (
    <motion.div {...stagger} initial="initial" animate="animate">
      <SectionTitle icon={RefreshCw}>Transformation</SectionTitle>

      {/* Data Pipelines */}
      <SubSection title="Data Pipelines (orchestration & transformation)" icon={Workflow}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Les <strong style={{ color: '#f2c811' }}>Data Pipelines</strong> de Fabric (heritage Azure Data Factory)
          permettent d'orchestrer des workflows de donnees avec une interface graphique drag-and-drop.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Activites disponibles</h4>
        <DataTable
          headers={['Activite', 'Description', 'Cout CU']}
          rows={[
            ['Copy Data', 'Copier des donnees entre sources/destinations', 'Proportionnel au volume'],
            ['Dataflow Gen2', 'Executer un Dataflow (Power Query)', 'Proportionnel aux lignes'],
            ['Notebook', 'Executer un notebook PySpark/Python', 'vCores x temps'],
            ['Stored Procedure', 'Executer une procedure stockee Warehouse', 'Proportionnel a la complexite'],
            ['ForEach', 'Boucler sur une liste d\'elements', 'Gratuit (orchestration)'],
            ['If Condition', 'Branchement conditionnel', 'Gratuit (orchestration)'],
            ['Until', 'Boucle conditionnelle', 'Gratuit (orchestration)'],
            ['Wait', 'Pause temporelle', 'Gratuit (orchestration)'],
            ['Web', 'Appeler une API REST', 'Gratuit (orchestration)'],
            ['Set Variable', 'Definir/modifier une variable', 'Gratuit (orchestration)'],
            ['Delete Data', 'Supprimer des fichiers/donnees', 'Minimal'],
            ['Fail', 'Declencher une erreur intentionnelle', 'Gratuit'],
          ]}
        />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Parametres, Variables & Expressions</h4>
        <BulletList items={[
          'Parametres : valeurs passees au pipeline a l\'execution (ex: date de debut, nom de table)',
          'Variables : valeurs mutables pendant l\'execution (compteurs, flags)',
          'Expressions : langage d\'expression ADF (@pipeline().parameters.StartDate, @utcnow())',
          'System variables : pipeline name, run id, trigger time, etc.',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Gestion des erreurs</h4>
        <BulletList items={[
          'Retry policy : nombre de tentatives + intervalle (exponentiel recommande)',
          'On-Failure paths : connecter une activite de failover (notification, log, cleanup)',
          'On-Completion paths : executer une activite quoi qu\'il arrive',
          'On-Skip paths : si l\'activite est ignoree (condition non remplie)',
          'Timeout par activite : eviter les activites qui bloquent indefiniment',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Templates courants</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Incremental Load', desc: 'Watermark + copie incrementale + merge dans Lakehouse', complexity: 'Medium' },
            { title: 'SCD Type 2', desc: 'Slowly Changing Dimension avec historisation via Notebook Spark', complexity: 'Complex' },
            { title: 'Full Refresh', desc: 'Drop + recreate table a chaque execution', complexity: 'Simple' },
          ].map((t) => (
            <div key={t.title} className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
              <h5 className="font-semibold text-sm mb-1" style={{ color: '#f2c811' }}>{t.title}</h5>
              <p className="text-xs mb-2" style={{ color: '#94a3b8' }}>{t.desc}</p>
              <Badge color={t.complexity === 'Simple' ? '#10b981' : t.complexity === 'Medium' ? '#f59e0b' : '#ef4444'}>
                {t.complexity}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <PageLink to="/cicd" label="Patterns CI/CD pour les Data Pipelines" />
        </div>
      </SubSection>

      {/* Notebooks */}
      <SubSection title="Notebooks (PySpark / Python)" icon={FileCode}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Les <strong style={{ color: '#f2c811' }}>Notebooks Fabric</strong> offrent un environnement interactif
          pour le traitement de donnees avec Apache Spark (PySpark) ou Python natif.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Spark Pool</h4>
        <BulletList items={[
          'Auto-provisionne : pas de cluster a creer/gerer manuellement',
          'Configurable : nombre de vCores (4 a 64), memoire (28 GB a 448 GB)',
          'Starter Pool : pool partage, demarrage rapide (~15 sec), ideal pour le dev',
          'Custom Pool : pool dedie, configurable, demarrage ~2-3 min',
          'Auto-scale : ajuste les executors en fonction de la charge',
          'Session timeout : configurable (15 min a 120 min)',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Librairies disponibles</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {['pandas', 'numpy', 'scikit-learn', 'seaborn', 'matplotlib', 'scipy', 'pyspark', 'delta-lake',
            'SemPy (Semantic Link)', 'notebookutils', 'mssparkutils', 'koalas', 'plotly', 'pyarrow',
            'great_expectations', 'mlflow'].map((lib) => (
            <div key={lib} className="rounded-lg px-3 py-2 text-center text-xs font-medium border"
              style={{ background: '#1a2744', borderColor: '#2a3a5c', color: '#e2e8f0' }}>
              {lib}
            </div>
          ))}
        </div>
        <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>
          + possibilite d'installer des librairies custom via <code style={{ color: '#0078d4' }}>%pip install</code> ou
          via un fichier <code style={{ color: '#0078d4' }}>environment.yml</code>.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Semantic Link (SemPy)</h4>
        <p className="text-sm mb-3" style={{ color: '#e2e8f0' }}>
          SemPy permet de <strong style={{ color: '#f2c811' }}>requeter les semantic models Power BI directement depuis Python</strong>.
          C'est un pont unique entre le monde Data Engineering et le monde Power BI.
        </p>
        <div className="rounded-lg p-4 border font-mono text-xs overflow-x-auto" style={{ background: '#0f0f1e', borderColor: '#2a3a5c', color: '#e2e8f0' }}>
          <pre>{`import sempy.fabric as fabric

# Lister les datasets du workspace
datasets = fabric.list_datasets()

# Executer une requete DAX
df = fabric.evaluate_dax(
    dataset="Sales Model",
    dax_string="""
    EVALUATE
    SUMMARIZECOLUMNS(
        'Date'[Year],
        "Total Sales", [Total Sales]
    )
    """
)
print(df.head())`}</pre>
        </div>

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Magic Commands</h4>
        <DataTable
          headers={['Commande', 'Description']}
          rows={[
            ['%%sql', 'Executer une requete SQL Spark directement dans une cellule'],
            ['%%configure', 'Configurer la session Spark (memoire, vCores, librairies)'],
            ['%%pyspark', 'Forcer l\'execution en mode PySpark (default)'],
            ['%%spark', 'Executer du code Scala Spark'],
            ['%%csharp', 'Executer du code C# (.NET Spark)'],
            ['%%R', 'Executer du code R (SparkR)'],
          ]}
        />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Consommation CU</h4>
        <Warning>
          Les Notebooks sont les items les plus gourmands en CU. Un notebook avec 4 vCores pendant 1 heure
          consomme environ <strong>14 400 CU-secondes</strong>. Surveillez attentivement la duree d'execution.
        </Warning>
        <DataTable
          headers={['Configuration', 'CU/heure', 'Usage recommande']}
          rows={[
            ['Starter Pool (4 vCores)', '~14 400 CU-s', 'Dev, exploration, petits volumes'],
            ['8 vCores', '~28 800 CU-s', 'Transformations medium (1-10 GB)'],
            ['16 vCores', '~57 600 CU-s', 'Grosses transformations (10-100 GB)'],
            ['32 vCores', '~115 200 CU-s', 'Tres gros volumes (100+ GB)'],
            ['64 vCores', '~230 400 CU-s', 'Machine Learning, gros datasets'],
          ]}
        />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Bonnes pratiques</h4>
        <BulletList items={[
          'Spark pour les donnees > 1 GB, Python natif (pandas) pour les donnees < 1 GB',
          'Cacher les DataFrames intermediaires (df.cache()) pour eviter les recalculs',
          'Broadcaster les petites tables lors de joins (broadcast join)',
          'Partitionner les donnees de sortie par date pour accelerer les lectures',
          'Limiter le nombre de colonnes des le debut (select early)',
          'Utiliser Delta merge pour les upserts plutot que des full rewrite',
          'Arreter le session Spark des que possible pour economiser les CU',
        ]} />
        <div className="mt-4">
          <PageLink to="/notebooks" label="Voir les templates de notebooks" />
        </div>
      </SubSection>

      {/* Dataflow Gen2 */}
      <SubSection title="Dataflow Gen2 (Power Query Online)" icon={Workflow}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          <strong style={{ color: '#f2c811' }}>Dataflow Gen2</strong> est la version Fabric de Power Query Online.
          Il offre une interface graphique (no-code/low-code) pour transformer des donnees avec 300+ connecteurs.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Fonctionnalites cles</h4>
        <BulletList items={[
          '300+ connecteurs (SQL Server, Oracle, Salesforce, SharePoint, API REST, fichiers...)',
          'Interface graphique drag-and-drop pour les transformations',
          'Staging automatique vers Lakehouse (recommande pour les performances)',
          'Destinations : Lakehouse, Warehouse, KQL Database',
          'Support du Query Folding pour pousser les transformations vers la source',
          'Diagrams view pour visualiser le flux de donnees',
          'Copier/coller des requetes depuis Power BI Desktop (Power Query M)',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Limitations</h4>
        <FeatureList items={[
          { label: 'Timeout de 2 heures par execution', ok: false },
          { label: 'Limites memoire par query (variable selon la capacite)', ok: false },
          { label: 'Pas de boucles ou de logique conditionnelle complexe', ok: false },
          { label: 'Performances moindres que Spark pour les gros volumes', ok: false },
          { label: 'Interface no-code accessible aux analystes metier', ok: true },
          { label: 'Reutilisation des competences Power Query', ok: true },
          { label: 'Prototypage rapide avant de passer en notebook si necessaire', ok: true },
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Consommation CU</h4>
        <DataTable
          headers={['Volume', 'Avec staging', 'Sans staging', 'Recommandation']}
          rows={[
            ['10 000 lignes', '~0.5 CU-s', '~1 CU-s', 'Les deux OK'],
            ['100 000 lignes', '~2 CU-s', '~5 CU-s', 'Staging recommande'],
            ['1 million lignes', '~5 CU-s', '~15 CU-s', 'Staging obligatoire'],
            ['10 millions lignes', '~25 CU-s', '~80 CU-s', 'Envisager un Notebook'],
            ['100 millions lignes', 'Non recommande', 'Non recommande', 'Utiliser un Notebook Spark'],
          ]}
        />

        <Tip>
          Activez toujours le <strong>staging</strong> dans Dataflow Gen2 : les donnees sont d'abord chargees dans un
          Lakehouse de staging, puis transformees. Cela ameliore les performances de 2x a 5x
          et permet le query folding partiel.
        </Tip>

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Quand utiliser Dataflow Gen2 vs Notebook</h4>
        <DataTable
          headers={['Critere', 'Dataflow Gen2', 'Notebook']}
          rows={[
            ['Volume', '< 10 millions lignes', '> 1 million lignes'],
            ['Complexite', 'Simples a medium', 'Complexes (ML, custom logic)'],
            ['Public', 'Analystes, Power BI devs', 'Data Engineers, Data Scientists'],
            ['Performance', 'Moderee', 'Elevee (Spark distribue)'],
            ['Code', 'No-code / Low-code (M)', 'PySpark / Python / SQL'],
            ['Reutilisabilite', 'Requetes M copiables', 'Git, modules, fonctions'],
          ]}
        />
      </SubSection>

      {/* Stored Procedures */}
      <SubSection title="Stored Procedures (Warehouse)" icon={Server}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Le <strong style={{ color: '#f2c811' }}>Warehouse Fabric</strong> supporte les procedures stockees T-SQL
          pour les equipes habituees a SQL Server.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Support T-SQL</h4>
        <FeatureList items={[
          { label: 'CREATE/ALTER/DROP PROCEDURE', ok: true },
          { label: 'Variables, curseurs, boucles WHILE', ok: true },
          { label: 'INSERT, UPDATE, DELETE, MERGE', ok: true },
          { label: 'CTEs, Window Functions, Subqueries', ok: true },
          { label: 'Temporary tables (#temp)', ok: true },
          { label: 'CLR assemblies', ok: false },
          { label: 'Linked servers', ok: false },
          { label: 'OPENROWSET / OPENQUERY', ok: false },
          { label: 'Types geometry / geography', ok: false },
          { label: 'Service Broker', ok: false },
        ]} />

        <Tip>
          La consommation CU des stored procedures est proportionnelle a la quantite de donnees scannees et a la
          complexite des operations. Optimisez avec des predicats de filtre early et evitez les curseurs.
        </Tip>
      </SubSection>
    </motion.div>
  )
}

function StorageTab() {
  return (
    <motion.div {...stagger} initial="initial" animate="animate">
      <SectionTitle icon={HardDrive}>Stockage</SectionTitle>

      {/* Lakehouse */}
      <SubSection title="Lakehouse" icon={Database}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Le <strong style={{ color: '#f2c811' }}>Lakehouse</strong> est le coeur du stockage dans Fabric.
          Il combine la flexibilite d'un data lake avec la structure d'un data warehouse, le tout en format
          <strong> Delta Lake</strong> ouvert.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Format Delta Lake</h4>
        <BulletList items={[
          'Fichiers Parquet columnar pour les donnees',
          'Transaction log JSON pour les ACID transactions',
          'Time travel : acceder a une version anterieure des donnees (RESTORE, VERSION AS OF)',
          'Schema evolution : ajouter des colonnes sans recreer la table',
          'Schema enforcement : rejeter les ecritures non conformes au schema',
          'Z-Ordering : optimiser le layout des fichiers pour accelerer les filtres',
          'V-Ordering : optimisation specifique Fabric pour le format Parquet',
          'OPTIMIZE : compacter les petits fichiers (small file problem)',
          'VACUUM : supprimer les fichiers obsoletes (liberer le stockage)',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Tables vs Files</h4>
        <DataTable
          headers={['Aspect', 'Tables (managees)', 'Files (non managees)']}
          rows={[
            ['Format', 'Delta Lake (obligatoire)', 'Tout format (CSV, JSON, Parquet, images...)'],
            ['Gestion', 'Geree par Fabric (schema, stats)', 'Geree manuellement'],
            ['SQL Endpoint', 'Oui (auto-genere)', 'Non'],
            ['Spark', 'Oui (spark.read.table())', 'Oui (spark.read.format().load())'],
            ['Power BI', 'Direct Lake mode', 'Non (sauf via Spark view)'],
            ['Usage', 'Donnees analytiques structurees', 'Donnees brutes, staging, media'],
          ]}
        />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Endpoints d'acces</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#0078d4' }}>SQL Analytics Endpoint</h5>
            <BulletList items={[
              'Auto-genere pour chaque Lakehouse',
              'Lecture seule (SELECT uniquement)',
              'T-SQL standard',
              'Ideal pour Power BI DirectQuery / Direct Lake',
              'Peut creer des vues SQL',
              'Cross-database queries possibles',
            ]} />
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#10b981' }}>Spark Endpoint</h5>
            <BulletList items={[
              'Acces complet lecture/ecriture',
              'PySpark, Scala, R, SQL Spark',
              'Support Delta Lake natif (merge, time travel)',
              'Acces aux Files/ et Tables/',
              'Ideal pour transformations et ETL',
              'Librairies Python completes',
            ]} />
          </div>
        </div>

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Couts de stockage</h4>
        <DataTable
          headers={['Type', 'Prix', 'Inclus dans la capacite ?']}
          rows={[
            ['Stockage OneLake', '~0.023 EUR/GB/mois', 'Non (pay-as-you-go separe)'],
            ['Stockage BCDR (backup)', '~0.042 EUR/GB/mois', 'Non'],
            ['Acces en lecture', 'Inclus dans les CU', 'Oui'],
            ['Acces en ecriture', 'Inclus dans les CU', 'Oui'],
          ]}
        />

        <Tip>
          Utilisez <strong>Tables/</strong> pour toutes vos donnees analytiques structurees (fait, dimension)
          et <strong>Files/</strong> uniquement pour les donnees brutes en staging ou les fichiers non structures
          (images, PDF, etc.).
        </Tip>
        <div className="mt-4">
          <PageLink to="/architecture" label="Voir le pattern Medallion (Bronze/Silver/Gold) pour le Lakehouse" />
        </div>
      </SubSection>

      {/* Warehouse */}
      <SubSection title="Warehouse" icon={Server}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Le <strong style={{ color: '#f2c811' }}>Warehouse Fabric</strong> offre une experience SQL Server complete
          pour les equipes habituees au T-SQL. Les donnees sont stockees en format Delta dans OneLake.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Fonctionnalites</h4>
        <FeatureList items={[
          { label: 'DML complet : INSERT, UPDATE, DELETE, MERGE', ok: true },
          { label: 'DDL complet : CREATE TABLE, ALTER, DROP', ok: true },
          { label: 'Stored Procedures, Views, Functions', ok: true },
          { label: 'Cross-database queries entre Warehouses et Lakehouses', ok: true },
          { label: 'Temporary tables (#temp, ##global)', ok: true },
          { label: 'Row-Level Security (RLS)', ok: true },
          { label: 'Column-Level Security (CLS)', ok: true },
          { label: 'Dynamic Data Masking', ok: true },
          { label: 'Ingestion en temps-reel (< 1 sec)', ok: false },
          { label: 'CLR, Linked Servers', ok: false },
          { label: 'Full-text search', ok: false },
          { label: 'Certains types de donnees (geometry, hierarchyid, xml)', ok: false },
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Consommation CU</h4>
        <BulletList items={[
          'La consommation est basee sur les donnees scannees (query-based billing)',
          'Les requetes sur des tables bien partitionnees consomment moins de CU',
          'Les statistiques auto sont maintenues pour optimiser les plans de requete',
          'Le cache de resultats reduit la consommation pour les requetes repetitives',
        ]} />

        <Tip>
          Le Warehouse est ideal pour les equipes SQL-heavy avec une expertise T-SQL existante.
          Si vous partez de zero, le Lakehouse + Notebooks est souvent plus flexible.
        </Tip>
      </SubSection>

      {/* KQL Database */}
      <SubSection title="KQL Database (Eventhouse)" icon={BarChart3}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Le <strong style={{ color: '#f2c811' }}>KQL Database</strong> (heberge dans un Eventhouse) est optimise
          pour les donnees <strong>time-series, logs et telemetrie</strong>. Il utilise le Kusto Query Language (KQL).
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Caracteristiques</h4>
        <BulletList items={[
          'Ingestion sub-seconde pour les donnees en streaming',
          'KQL : langage de requete optimise pour l\'exploration de donnees',
          'Politique de retention configurable (hot cache, warm storage, cold)',
          'Indexation automatique sur toutes les colonnes',
          'Support natif pour les series temporelles (make-series, render timechart)',
          'Integration native avec Eventstream pour l\'ingestion temps-reel',
          'Materialized views pour les aggregations pre-calculees',
          'Functions pour la reutilisation de logique KQL',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Exemples KQL</h4>
        <div className="rounded-lg p-4 border font-mono text-xs overflow-x-auto" style={{ background: '#0f0f1e', borderColor: '#2a3a5c', color: '#e2e8f0' }}>
          <pre>{`// Top 10 erreurs des dernieres 24h
AppLogs
| where Timestamp > ago(24h)
| where Level == "Error"
| summarize Count = count() by ErrorMessage
| top 10 by Count

// Serie temporelle : requetes par heure
ApiRequests
| where Timestamp > ago(7d)
| summarize RequestCount = count() by bin(Timestamp, 1h)
| render timechart

// Anomaly detection
SensorData
| where Timestamp > ago(30d)
| make-series value = avg(Temperature) on Timestamp step 1h
| extend anomalies = series_decompose_anomalies(value)`}</pre>
        </div>

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Quand utiliser KQL Database</h4>
        <BulletList items={[
          'Logs applicatifs et diagnostics',
          'IoT / telemetrie de capteurs',
          'Monitoring de performance en temps-reel',
          'Analyse de series temporelles',
          'Securite / SIEM-like analytics',
          'Donnees a tres haut volume d\'ingestion',
        ]} />
      </SubSection>

      {/* Comparison */}
      <SubSection title="Comparaison : Lakehouse vs Warehouse vs KQL" icon={Layers}>
        <DataTable
          headers={['Critere', 'Lakehouse', 'Warehouse', 'KQL Database']}
          rows={[
            ['Langage de requete', 'Spark SQL / PySpark', 'T-SQL', 'KQL (Kusto)'],
            ['Ecriture', 'Spark / Dataflow Gen2', 'T-SQL DML', 'Ingestion API / Eventstream'],
            ['Latence d\'ingestion', 'Secondes a minutes', 'Secondes a minutes', 'Sub-seconde'],
            ['Ideal pour', 'Data Lake + analytics', 'BI / reporting SQL', 'Logs / time-series / IoT'],
            ['Format', 'Delta Lake (Parquet)', 'Delta Lake (Parquet)', 'Kusto natif + OneLake mirror'],
            ['Acces SQL', 'SQL analytics endpoint (read-only)', 'Full T-SQL (read/write)', 'KQL uniquement'],
            ['Acces Spark', 'Natif (full)', 'Via shortcuts', 'Non'],
            ['Power BI mode', 'Direct Lake / DirectQuery', 'DirectQuery / Import', 'DirectQuery (KQL)'],
            ['Efficacite CU', 'Elevee (Spark)', 'Moderee (SQL)', 'Elevee (KQL)'],
            ['Cross-query', 'Oui (Spark SQL)', 'Oui (cross-database)', 'Oui (cross-cluster)'],
            ['RLS', 'Via SQL endpoint views', 'Natif', 'Natif'],
            ['Schema evolution', 'Oui (Delta)', 'Oui (ALTER TABLE)', 'Oui (policy)'],
          ]}
        />

        <Tip>
          La majorite des projets Fabric utilisent le <strong>Lakehouse</strong> comme stockage principal.
          Ajoutez un Warehouse si votre equipe est forte en T-SQL, et un KQL Database uniquement
          pour les cas d'usage temps-reel / logs.
        </Tip>
      </SubSection>
    </motion.div>
  )
}

function OrchestrationTab() {
  return (
    <motion.div {...stagger} initial="initial" animate="animate">
      <SectionTitle icon={Workflow}>Orchestration</SectionTitle>

      <SubSection title="Data Pipeline — Orchestration" icon={Settings}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          L'orchestration dans Fabric est geree par les <strong style={{ color: '#f2c811' }}>Data Pipelines</strong>.
          Les activites d'orchestration (triggers, conditions, boucles) sont <strong>gratuites en CU</strong> —
          seules les activites de calcul (Copy, Notebook, Dataflow) consomment des CU.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Types de Triggers</h4>
        <DataTable
          headers={['Trigger', 'Description', 'Exemple', 'Limitations']}
          rows={[
            ['Schedule', 'Execution cron planifiee', 'Tous les jours a 6h00', 'Minimum 5 min d\'intervalle'],
            ['Tumbling Window', 'Fenetres temporelles fixes', 'Toutes les heures, avec retry automatique', 'Pas de chevauchement'],
            ['Event-based (preview)', 'Declenchement sur evenement', 'Nouveau fichier dans OneLake', 'Latence ~1-5 min'],
            ['Manual', 'Declenchement manuel', 'Bouton "Run" dans l\'UI', 'Aucune'],
            ['API', 'Declenchement via REST API', 'Appel depuis une app externe', 'Authentification requise'],
          ]}
        />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Dependencies entre activites</h4>
        <BulletList items={[
          'On Success : l\'activite suivante s\'execute si la precedente reussit',
          'On Failure : l\'activite suivante s\'execute si la precedente echoue',
          'On Completion : l\'activite suivante s\'execute dans tous les cas',
          'On Skip : l\'activite suivante s\'execute si la precedente est ignoree',
          'Parallelisme : plusieurs activites peuvent s\'executer en parallele (branches)',
          'ForEach : execution sequentielle ou parallele sur une liste',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Monitoring</h4>
        <BulletList items={[
          'Run history : historique complet de chaque execution avec duree et statut',
          'Activity-level monitoring : detail par activite (lignes lues, ecrites, erreurs)',
          'Alertes email sur echec (configurable)',
          'Integration avec Azure Monitor (via Diagnostic Settings)',
          'Monitoring Hub dans Fabric : vue centralisee de toutes les executions',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Patterns d'orchestration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#f2c811' }}>Daily Refresh Pattern</h5>
            <NumberedList items={[
              'Trigger Schedule : 6h00',
              'Copy Activity : ingestion incrementale',
              'Notebook : transformation Bronze → Silver → Gold',
              'Semantic model refresh via REST API',
              'Email notification si echec',
            ]} />
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#f2c811' }}>Hybrid Real-time + Batch</h5>
            <NumberedList items={[
              'Eventstream : ingestion temps-reel → KQL Database',
              'Real-time Dashboard pour monitoring',
              'Batch Pipeline : agregation quotidienne → Lakehouse',
              'Power BI report pour analyse historique',
              'Data Activator pour alertes en temps-reel',
            ]} />
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#f2c811' }}>Retry avec Backoff Exponentiel</h5>
            <NumberedList items={[
              'Activite principale avec retry = 3',
              'Intervalle : 30s → 60s → 120s',
              'On Failure → Web activity (log erreur)',
              'On Failure → Email notification',
              'On Failure → Set Variable (flag echec)',
            ]} />
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#f2c811' }}>Multi-source Parallel Load</h5>
            <NumberedList items={[
              'ForEach : liste des sources (metadata-driven)',
              'Parallel Copy : 4 copies simultanees',
              'Wait for all → Notebook de consolidation',
              'Quality checks → If Condition',
              'On Success → Refresh semantic model',
            ]} />
          </div>
        </div>

        <Warning>
          Attention au parallelisme : si vous executez trop d'activites en parallele, vous risquez de
          saturer votre capacite Fabric et de declencher le throttling. Limitez le parallelisme
          a un niveau adapte a votre SKU.
        </Warning>
      </SubSection>
    </motion.div>
  )
}

function VisualizationTab() {
  return (
    <motion.div {...stagger} initial="initial" animate="animate">
      <SectionTitle icon={BarChart3}>Visualisation</SectionTitle>

      {/* Power BI Modes */}
      <SubSection title="Power BI : Import vs DirectQuery vs Direct Lake" icon={Eye}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Power BI dans Fabric offre trois modes de connexion aux donnees. Le choix du mode a un impact
          majeur sur les performances, la fraicheur des donnees et la consommation CU.
        </p>

        <DataTable
          headers={['Critere', 'Import', 'DirectQuery', 'Direct Lake']}
          rows={[
            ['Stockage', 'Dans le semantic model', 'A la source', 'OneLake (Parquet)'],
            ['Fraicheur', 'Refresh schedule', 'Temps reel', 'Temps reel (Delta)'],
            ['Performance', 'Tres rapide', 'Plus lent (requetes source)', 'Rapide (cache en memoire)'],
            ['Taille max', '~10-400 GB (selon SKU)', 'Illimitee', 'Illimitee (OneLake)'],
            ['CU Query', 'Faible (~0.1 CU-s)', 'Modere (~0.5 CU-s)', 'Faible (~0.1 CU-s)'],
            ['CU Refresh', 'Eleve (import complet)', 'Aucun', 'Aucun (lecture directe)'],
            ['DAX complet', 'Oui', 'Limites (no calculated tables)', 'Oui'],
            ['Calcul groups', 'Oui', 'Limites', 'Oui'],
            ['RLS', 'Oui', 'Oui (dual query)', 'Oui'],
            ['Composite model', 'Oui', 'Oui', 'Oui (avec DQ fallback)'],
          ]}
        />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Direct Lake : le meilleur des deux mondes</h4>
        <BulletList items={[
          'Lit directement les fichiers Parquet depuis OneLake (pas de copie en memoire au demarrage)',
          'Charge les colonnes en memoire a la demande (framing)',
          'Pas besoin de refresh schedule : les donnees Delta sont lues a jour automatiquement',
          'Fallback automatique vers DirectQuery si les donnees sont trop volumineuses pour le cache',
          'Disponible uniquement avec un Lakehouse ou Warehouse Fabric comme source',
          'Performance comparable a Import pour la majorite des cas',
        ]} />

        <Tip>
          <strong>Direct Lake est le mode recommande pour tous les nouveaux projets Fabric.</strong> Il combine
          la performance d'Import avec la fraicheur de DirectQuery, sans cout de refresh.
        </Tip>

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Quand utiliser chaque mode</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#f59e0b' }}>Import</h5>
            <BulletList items={[
              'Sources non-Fabric (SQL on-prem, Oracle)',
              'Besoin de performances maximales',
              'Modeles complexes avec beaucoup de DAX',
              'Pas de Lakehouse/Warehouse Fabric',
            ]} />
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#ef4444' }}>DirectQuery</h5>
            <BulletList items={[
              'Besoin de donnees temps-reel strict',
              'Source non-compatible Direct Lake',
              'Donnees trop volumineuses pour le cache',
              'Securite a la source (passthrough auth)',
            ]} />
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#10b981' }}>Direct Lake</h5>
            <BulletList items={[
              'Donnees dans un Lakehouse Fabric',
              'Besoin de fraicheur sans refresh',
              'Performance elevee requise',
              'Nouveau projet Fabric (recommande)',
            ]} />
          </div>
        </div>
        <div className="mt-4">
          <PageLink to="/fiches" label="Voir les fiches techniques Power BI" />
        </div>
      </SubSection>

      {/* Applications */}
      <SubSection title="Power BI Applications" icon={Box}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Les <strong style={{ color: '#f2c811' }}>Power BI Apps</strong> sont le moyen recommande de distribuer
          du contenu aux utilisateurs finaux. Elles regroupent rapports, dashboards et scorecards
          dans un package navigable.
        </p>

        <BulletList items={[
          'App publishing : bundler plusieurs rapports dans une app avec navigation personnalisee',
          'Audiences : segmenter le contenu par groupe d\'utilisateurs (Finance voit X, Marketing voit Y)',
          'Navigation custom : pages personnalisees, sections, liens externes',
          'Update process : mettre a jour l\'app sans impacter les utilisateurs (publish/update)',
          'Permissions : l\'app gere ses propres permissions (separees du workspace)',
          'Branding : logo, couleur d\'accent, description personnalisee',
          'Installation automatique : push l\'app vers les utilisateurs via admin',
        ]} />
      </SubSection>

      {/* Dashboards */}
      <SubSection title="Dashboards (classiques)" icon={Gauge}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Les <strong style={{ color: '#f59e0b' }}>Dashboards classiques</strong> Power BI permettent d'epingler
          des tuiles provenant de plusieurs rapports sur un meme ecran.
        </p>

        <BulletList items={[
          'Tuiles epinglees depuis differents rapports (cross-report)',
          'Tuiles temps-reel (streaming datasets)',
          'Alertes sur les valeurs des tuiles (threshold-based)',
          'Q&A : poser des questions en langage naturel',
          'Favoris et featured dashboard',
        ]} />

        <Warning>
          Les Dashboards classiques sont progressivement <strong>deprecies</strong> en faveur des rapports
          multi-pages. Microsoft recommande d'utiliser des Reports avec des pages de synthese
          plutot que des Dashboards.
        </Warning>
      </SubSection>

      {/* Real-time Dashboards */}
      <SubSection title="Real-Time Dashboards" icon={Zap}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Les <strong style={{ color: '#f2c811' }}>Real-Time Dashboards</strong> utilisent KQL pour afficher
          des donnees en quasi temps-reel depuis un KQL Database / Eventhouse.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Fonctionnalites</h4>
        <BulletList items={[
          'Auto-refresh configurable : 30 secondes minimum',
          'Tiles : time chart, anomaly chart, map, table, stat card, bar chart, pie chart',
          'Chaque tile est une requete KQL independante',
          'Parametres : filtres dynamiques appliques a toutes les tiles',
          'Partage et embedding possibles',
          'Ideal pour les NOC (Network Operations Center) et les ecrans de monitoring',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Consommation CU</h4>
        <p className="text-sm" style={{ color: '#e2e8f0' }}>
          Chaque refresh execute toutes les requetes KQL des tiles. Avec un refresh de 30 secondes
          et 10 tiles, cela fait <strong>~2 880 requetes/jour</strong>. Assurez-vous d'optimiser
          vos requetes KQL et d'utiliser des materialized views.
        </p>
      </SubSection>

      {/* Paginated Reports */}
      <SubSection title="Paginated Reports" icon={FileCode}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Les <strong style={{ color: '#f2c811' }}>Paginated Reports</strong> (SSRS dans le cloud) produisent
          des rapports <strong>pixel-perfect, print-ready</strong> optimises pour l'impression et l'export.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Caracteristiques</h4>
        <BulletList items={[
          'Report Builder : outil de conception desktop (gratuit)',
          'Parametres : filtres dynamiques a l\'ouverture',
          'Sous-rapports : composition de rapports imbriques',
          'Tables, matrices, listes : tous les types de tablix',
          'Groupes, totaux, sous-totaux automatiques',
          'En-tetes et pieds de page fixes',
          'Expressions RDL pour la logique conditionnelle',
          'Images dynamiques, codes-barres, QR codes',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Formats d\'export</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {['PDF', 'Excel (.xlsx)', 'Word (.docx)', 'PowerPoint (.pptx)', 'CSV', 'XML', 'MHTML', 'Image (TIFF)', 'Accessible PDF'].map((fmt) => (
            <Badge key={fmt} color="#0078d4">{fmt}</Badge>
          ))}
        </div>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Cas d'usage</h4>
        <BulletList items={[
          'Factures et bons de commande',
          'Rapports de conformite reglementaire',
          'Tables detaillees (>1000 lignes par page)',
          'Rapports d\'audit avec formatage precis',
          'Export automatise vers PDF/Excel via API ou abonnement',
          'Rapports operationnels avec parametres dynamiques',
        ]} />

        <Tip>
          Les Paginated Reports consomment des CU au moment du rendu. Un rapport complexe avec
          10 000 lignes peut prendre 10-30 secondes de rendering. Planifiez les exports en batch
          pendant les heures creuses.
        </Tip>
      </SubSection>
    </motion.div>
  )
}

function AlertingTab() {
  return (
    <motion.div {...stagger} initial="initial" animate="animate">
      <SectionTitle icon={Bell}>Alerting — Data Activator (Reflex)</SectionTitle>

      <SubSection title="Qu'est-ce que Data Activator ?" icon={Zap}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          <strong style={{ color: '#f2c811' }}>Data Activator</strong> (anciennement Reflex) est le service d'alerting
          no-code de Fabric. Il surveille des donnees et declenche des actions automatiquement
          lorsque des conditions sont remplies.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Concepts cles</h4>
        <DataTable
          headers={['Concept', 'Description']}
          rows={[
            ['Object', 'L\'entite a surveiller (ex: un produit, un capteur, un client)'],
            ['Event', 'Un flux de donnees entrant (valeurs, metriques)'],
            ['Property', 'Une valeur de l\'objet a surveiller (ex: temperature, stock)'],
            ['Trigger', 'La condition qui declenche l\'action (ex: stock < 10)'],
            ['Action', 'Ce qui se passe quand le trigger s\'active (email, Teams, Flow)'],
          ]}
        />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Types de Triggers</h4>
        <BulletList items={[
          'Threshold : valeur depasse un seuil (> X, < X, = X)',
          'Change : valeur change de plus de X% par rapport a la periode precedente',
          'Entering range / Exiting range : valeur entre ou sort d\'une fourchette',
          'Is above average / Is below average : par rapport a la moyenne historique',
          'Pattern change : detection de changement de tendance',
          'Custom condition : combinaison de conditions avec AND/OR',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Actions disponibles</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="rounded-lg p-4 border text-center" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <div className="text-3xl mb-2">📧</div>
            <h5 className="font-semibold text-sm mb-1" style={{ color: '#e2e8f0' }}>Email</h5>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Envoyer un email avec le detail de l'alerte</p>
          </div>
          <div className="rounded-lg p-4 border text-center" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <div className="text-3xl mb-2">💬</div>
            <h5 className="font-semibold text-sm mb-1" style={{ color: '#e2e8f0' }}>Microsoft Teams</h5>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Poster un message dans un canal Teams</p>
          </div>
          <div className="rounded-lg p-4 border text-center" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <div className="text-3xl mb-2">⚡</div>
            <h5 className="font-semibold text-sm mb-1" style={{ color: '#e2e8f0' }}>Power Automate</h5>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Declencher un flow (webhook, API, ticket, etc.)</p>
          </div>
        </div>

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Sources de donnees</h4>
        <BulletList items={[
          'Power BI visuals : selectionner un visuel dans un rapport Power BI comme source',
          'Eventstream : donnees en temps-reel',
          'KQL queries : resultats de requetes KQL periodiques',
          'Custom : donnees envoyees via API',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Exemples pratiques</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Inventaire faible', desc: 'Alerte quand le stock d\'un produit passe sous le seuil de reapprovisionnement', trigger: 'Stock < Min_Stock', action: 'Email + Teams' },
            { title: 'Baisse de revenus', desc: 'Notification quand le revenu quotidien chute de plus de 20% vs la moyenne', trigger: 'Revenue < Avg - 20%', action: 'Teams + Power Automate' },
            { title: 'Temperature critique', desc: 'Alerte IoT quand un capteur depasse la temperature critique', trigger: 'Temp > 85°C', action: 'Email + Flow (arret machine)' },
            { title: 'SLA non respecte', desc: 'Notification quand le temps de reponse API depasse le SLA', trigger: 'ResponseTime > 2000ms', action: 'Teams + Ticket Jira' },
          ].map((ex) => (
            <div key={ex.title} className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
              <h5 className="font-semibold text-sm mb-1" style={{ color: '#f2c811' }}>{ex.title}</h5>
              <p className="text-xs mb-2" style={{ color: '#94a3b8' }}>{ex.desc}</p>
              <div className="flex gap-2">
                <Badge color="#ef4444">Trigger: {ex.trigger}</Badge>
                <Badge color="#10b981">Action: {ex.action}</Badge>
              </div>
            </div>
          ))}
        </div>

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Consommation CU</h4>
        <p className="text-sm" style={{ color: '#e2e8f0' }}>
          Data Activator consomme des CU en fonction du nombre d'evenements traites et de la frequence
          d'evaluation des triggers. Le cout est generalement faible sauf en cas de tres haut volume
          d'evenements (&gt;10 000/min).
        </p>

        <Tip>
          Data Activator est ideal pour creer des alertes metier sans code. Pour des scenarios
          d'alerting complexes avec des actions custom, combinez avec Power Automate.
        </Tip>
      </SubSection>
    </motion.div>
  )
}

function GovernanceTab() {
  return (
    <motion.div {...stagger} initial="initial" animate="animate">
      <SectionTitle icon={Shield}>Gouvernance</SectionTitle>

      {/* Roles */}
      <SubSection title="Roles Workspace" icon={Users}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Chaque workspace Fabric a 4 niveaux de roles avec des permissions croissantes.
        </p>

        <DataTable
          headers={['Role', 'Voir le contenu', 'Utiliser les items', 'Creer/modifier', 'Gerer le workspace']}
          rows={[
            ['Viewer', 'Oui', 'Oui (rapports)', 'Non', 'Non'],
            ['Contributor', 'Oui', 'Oui', 'Oui', 'Non'],
            ['Member', 'Oui', 'Oui', 'Oui', 'Partiel (partage, apps)'],
            ['Admin', 'Oui', 'Oui', 'Oui', 'Oui (tout)'],
          ]}
        />

        <Tip>
          Appliquez le principe du moindre privilege : donnez le role Viewer aux consommateurs,
          Contributor aux developpeurs, et reservez Admin aux responsables du workspace.
        </Tip>
      </SubSection>

      {/* Sharing */}
      <SubSection title="Partage & Distribution" icon={Network}>
        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Methodes de partage</h4>
        <DataTable
          headers={['Methode', 'Granularite', 'Audience', 'Recommande pour']}
          rows={[
            ['Workspace role', 'Workspace entier', 'Equipe projet', 'Collaborateurs internes'],
            ['App', 'Selection de rapports', 'Groupes definis', 'Distribution large (recommande)'],
            ['Share report', 'Rapport individuel', 'Utilisateurs specifiques', 'Partage ad-hoc'],
            ['Share semantic model', 'Semantic model', 'Developpeurs BI', 'Reutilisation de modeles'],
            ['Embed', 'Rapport integre', 'Externe / intranet', 'Applications custom'],
            ['Public publish', 'Rapport public', 'Internet', 'Open data (attention securite)'],
          ]}
        />
      </SubSection>

      {/* Security */}
      <SubSection title="Securite des donnees" icon={Lock}>
        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Row-Level Security (RLS)</h4>
        <BulletList items={[
          'Filtre les lignes visibles par utilisateur dans un semantic model',
          'Definir des roles avec des filtres DAX (ex: [Region] = USERPRINCIPALNAME())',
          'Tester avec "View as role" dans Power BI Service',
          'Fonctionne avec Import, DirectQuery et Direct Lake',
          'Peut etre combine avec dynamic RLS (table de mapping user→filtre)',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Object-Level Security (OLS)</h4>
        <BulletList items={[
          'Masquer des tables ou colonnes entieres pour certains roles',
          'Defini au niveau du semantic model (XMLA/TMDL)',
          'Les objets masques n\'apparaissent pas dans la liste de champs',
          'Utile pour les donnees sensibles (salaires, donnees personnelles)',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Sensitivity Labels (Microsoft Purview)</h4>
        <BulletList items={[
          'Labels de classification : Public, General, Confidential, Highly Confidential',
          'Appliques aux rapports, semantic models, dataflows',
          'Propagation automatique downstream (rapport herite le label du dataset)',
          'Restriction d\'export selon le label (ex: pas d\'export Excel pour Highly Confidential)',
          'Integration avec Microsoft Purview Information Protection',
        ]} />
        <div className="mt-4">
          <PageLink to="/fiches" label="Voir la fiche technique RLS" />
          <span className="mx-3" style={{ color: '#2a3a5c' }}>|</span>
          <PageLink to="/api" label="APIs Admin pour la gouvernance" />
        </div>
      </SubSection>

      {/* Lineage & Endorsement */}
      <SubSection title="Lineage & Endorsement" icon={GitBranch}>
        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Data Lineage</h4>
        <BulletList items={[
          'Vue graphique de la dependance entre items (source → pipeline → lakehouse → model → report)',
          'Impact analysis : voir quels rapports seront affectes par un changement',
          'Disponible au niveau workspace et au niveau item',
          'Aide a comprendre les flux de donnees et a identifier les points de defaillance',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Endorsement</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#0078d4' }}>Promoted</h5>
            <p className="text-xs mb-2" style={{ color: '#94a3b8' }}>
              Recommande par le proprietaire du contenu. N'importe quel Member/Admin peut promouvoir.
            </p>
            <Badge color="#0078d4">Self-service</Badge>
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-2" style={{ color: '#f2c811' }}>Certified</h5>
            <p className="text-xs mb-2" style={{ color: '#94a3b8' }}>
              Valide officiellement par un admin Fabric. Limite aux utilisateurs designes par le tenant admin.
            </p>
            <Badge color="#f2c811">Gouvernance centrale</Badge>
          </div>
        </div>
      </SubSection>

      {/* Domains */}
      <SubSection title="Domains Fabric" icon={Layers}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Les <strong style={{ color: '#f2c811' }}>Domains</strong> sont une fonctionnalite de gouvernance qui permet
          de regrouper les workspaces par domaine metier (Finance, Marketing, RH, Supply Chain...).
        </p>

        <BulletList items={[
          'Un Domain regroupe plusieurs workspaces lies a un meme domaine metier',
          'Les Domain Admins gerent les workspaces et le contenu de leur domaine',
          'Facilite la decouverte de donnees : les utilisateurs trouvent le contenu par domaine',
          'Separation des responsabilites : chaque domaine gere ses propres standards',
          'Aligne avec le concept de Data Mesh (domaines autonomes)',
          'Visible dans le Data Hub de Fabric',
        ]} />
      </SubSection>
    </motion.div>
  )
}

function OptimizationTab() {
  return (
    <motion.div {...stagger} initial="initial" animate="animate">
      <SectionTitle icon={Cpu}>CU & Optimisation</SectionTitle>

      {/* CU Table */}
      <SubSection title="Table de consommation CU detaillee" icon={TrendingUp}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Chaque operation Fabric consomme des <strong style={{ color: '#f2c811' }}>Capacity Units-secondes (CU-s)</strong>.
          Voici une table de reference detaillee.
        </p>

        <DataTable
          headers={['Operation', 'Cout CU-s', 'Exemple concret', 'Categorie']}
          rows={[
            ['Copy Activity — 1K rows', '~0.01 CU-s', 'Table de reference', 'Ingestion'],
            ['Copy Activity — 100K rows', '~0.1 CU-s', 'Dimension client', 'Ingestion'],
            ['Copy Activity — 1M rows', '~0.5 CU-s', 'Faits mensuels', 'Ingestion'],
            ['Copy Activity — 10M rows', '~5 CU-s', 'Grande table de faits', 'Ingestion'],
            ['Copy Activity — 100M rows', '~50 CU-s', 'Table de faits annuelle', 'Ingestion'],
            ['Copy Activity — 1B rows', '~500 CU-s', 'Historique complet', 'Ingestion'],
            ['Dataflow Gen2 — 100K rows', '~2 CU-s', 'Petite transformation', 'Transformation'],
            ['Dataflow Gen2 — 1M rows', '~5 CU-s', 'Transformation medium', 'Transformation'],
            ['Dataflow Gen2 — 10M rows', '~25 CU-s', 'Grosse transformation', 'Transformation'],
            ['Notebook — 4 vCores × 10 min', '~2 400 CU-s', 'Petite exploration', 'Transformation'],
            ['Notebook — 4 vCores × 1h', '~14 400 CU-s', 'Job Spark medium', 'Transformation'],
            ['Notebook — 8 vCores × 1h', '~28 800 CU-s', 'Gros job Spark', 'Transformation'],
            ['Notebook — 16 vCores × 1h', '~57 600 CU-s', 'Tres gros job Spark', 'Transformation'],
            ['Notebook — 32 vCores × 1h', '~115 200 CU-s', 'Job ML distribue', 'Transformation'],
            ['Warehouse query — 100MB scan', '~0.2 CU-s', 'Requete simple', 'Requete'],
            ['Warehouse query — 1GB scan', '~2 CU-s', 'Join complexe', 'Requete'],
            ['Warehouse query — 10GB scan', '~20 CU-s', 'Requete large scan', 'Requete'],
            ['Direct Lake query', '~0.1 CU-s', 'Chargement page rapport', 'Requete'],
            ['DirectQuery query', '~0.3-1 CU-s', 'Requete a la source', 'Requete'],
            ['Import model refresh — 1M rows', '~5 CU-s', 'Petit refresh', 'Refresh'],
            ['Import model refresh — 100M rows', '~500 CU-s', 'Gros refresh', 'Refresh'],
            ['KQL query', '~0.5 CU-s', 'Requete time-series', 'Requete'],
            ['Report render', '~0.1 CU-s', 'Ouverture d\'une page de rapport', 'Visualisation'],
            ['Paginated report render', '~0.5-5 CU-s', 'Rendu PDF avec donnees', 'Visualisation'],
            ['Mirroring — sync (par lot)', '~1-10 CU-s', 'Sync incrementale CDC', 'Ingestion'],
            ['Eventstream — 1000 events/sec', '~5 CU-s/min', 'Flux temps-reel', 'Ingestion'],
            ['Data Activator — evaluation', '~0.01 CU-s', 'Evaluation d\'un trigger', 'Alerting'],
            ['Pipeline orchestration', '~0 CU-s', 'ForEach, If, Wait', 'Orchestration'],
          ]}
        />

        <Warning>
          Ces valeurs sont des <strong>estimations</strong> basees sur l'experience et la documentation Microsoft.
          Les couts reels varient selon la complexite des donnees, le schema, la compression et la charge
          de la capacite. Utilisez le <strong>Capacity Metrics App</strong> pour mesurer la consommation reelle.
        </Warning>
        <div className="mt-4">
          <PageLink to="/simulator" label="Estimer votre cout total avec le simulateur" />
        </div>
      </SubSection>

      {/* Smoothing & Bursting */}
      <SubSection title="Smoothing, Bursting & Throttling" icon={Gauge}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Fabric utilise un systeme de <strong style={{ color: '#f2c811' }}>lissage (smoothing)</strong> pour
          gerer les pics de charge. Comprendre ce mecanisme est essentiel pour eviter le throttling.
        </p>

        <h4 className="text-base font-semibold mb-3" style={{ color: '#0078d4' }}>Fonctionnement du smoothing</h4>
        <BulletList items={[
          'Fenetre de lissage de 30 secondes pour les workloads interactifs',
          'Fenetre de 24 heures pour les workloads en arriere-plan (background)',
          'Les pics de consommation sont "etales" sur la fenetre',
          'Un burst temporaire est autorise : jusqu\'a 2x la capacite pendant quelques minutes',
          'Au-dela de la fenetre de lissage, le throttling s\'enclenche progressivement',
        ]} />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Workloads Interactifs vs Background</h4>
        <DataTable
          headers={['Type', 'Exemples', 'Fenetre de lissage', 'Priorite']}
          rows={[
            ['Interactif', 'Requetes Power BI, exploration notebook, requetes SQL', '30 secondes', 'Haute (protege)'],
            ['Background', 'Refresh datasets, Notebooks schedules, Copy activities', '24 heures', 'Basse (peut etre retarde)'],
          ]}
        />

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Stages de throttling</h4>
        <div className="space-y-3 mb-4">
          <div className="rounded-lg p-4 border" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)' }}>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={18} style={{ color: '#10b981' }} />
              <span className="font-semibold text-sm" style={{ color: '#10b981' }}>Normal (0-100% capacite)</span>
            </div>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Tout fonctionne normalement. Pas de restriction.</p>
          </div>
          <div className="rounded-lg p-4 border" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)' }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
              <span className="font-semibold text-sm" style={{ color: '#f59e0b' }}>Delai (100-120% capacite)</span>
            </div>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Les workloads background sont retardes. Les interactifs fonctionnent encore.</p>
          </div>
          <div className="rounded-lg p-4 border" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}>
            <div className="flex items-center gap-2 mb-1">
              <XCircle size={18} style={{ color: '#ef4444' }} />
              <span className="font-semibold text-sm" style={{ color: '#ef4444' }}>Rejet (120%+ capacite)</span>
            </div>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Les requetes background sont rejetees. Les interactifs peuvent aussi etre impactes.</p>
          </div>
        </div>

        <h4 className="text-base font-semibold mb-3 mt-4" style={{ color: '#0078d4' }}>Monitoring avec Capacity Metrics App</h4>
        <BulletList items={[
          'Application Power BI gratuite a installer depuis AppSource',
          'Connecter a votre capacite Fabric',
          'Vues : CU par workload, par item, par utilisateur, par heure',
          'Identifier les "CU hogs" : items qui consomment le plus',
          'Voir les events de throttling',
          'Benchmark : comparer la consommation semaine par semaine',
          'Recommandation : verifier quotidiennement la premiere semaine, puis hebdomadairement',
        ]} />
      </SubSection>

      {/* Optimization Tips */}
      <SubSection title="Conseils d'optimisation" icon={Target}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#f2c811' }}>
              <Clock size={16} /> Planning & Scheduling
            </h5>
            <BulletList items={[
              'Planifier les jobs lourds pendant les heures creuses (nuit, weekend)',
              'Etaler les refresh dans le temps (pas tout a la meme heure)',
              'Utiliser la pause de capacite pour les environnements non-production',
              'Configurer l\'auto-pause si votre cloud provider le supporte',
            ]} />
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#f2c811' }}>
              <RefreshCw size={16} /> Refresh & Ingestion
            </h5>
            <BulletList items={[
              'Incremental refresh : ne traiter que les donnees modifiees',
              'Partitionner les tables de faits par date',
              'Eviter les full refresh quand un incremental est possible',
              'Utiliser le Mirroring plutot que la Copy Activity pour les sources supportees',
            ]} />
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#f2c811' }}>
              <BarChart3 size={16} /> DAX & Requetes
            </h5>
            <BulletList items={[
              'Optimiser les mesures DAX (eviter CALCULATE imbriques)',
              'Reduire le nombre de visuels par page (< 15 recommande)',
              'Utiliser les aggregations pre-calculees quand possible',
              'Eviter les relations bidirectionnelles sauf si necessaire',
            ]} />
            <PageLink to="/performance" label="Checklist performance complete" />
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#f2c811' }}>
              <Cpu size={16} /> Spark & Notebooks
            </h5>
            <BulletList items={[
              'Utiliser le Starter Pool pour le dev (demarrage rapide)',
              'Arreter les sessions Spark des que possible',
              'Cacher les DataFrames intermediaires (.cache())',
              'Selectionner les colonnes tot (.select()) pour reduire le shuffle',
            ]} />
            <PageLink to="/notebooks" label="Templates de notebooks optimises" />
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#f2c811' }}>
              <HardDrive size={16} /> Stockage & Format
            </h5>
            <BulletList items={[
              'Executer OPTIMIZE regulierement pour compacter les petits fichiers',
              'Executer VACUUM pour liberer l\'espace des fichiers obsoletes',
              'Utiliser V-Ordering (active par defaut) pour optimiser la lecture Parquet',
              'Partitionner les grandes tables par date (annee/mois)',
            ]} />
            <PageLink to="/architecture" label="Patterns d\'architecture Lakehouse" />
          </div>
          <div className="rounded-lg p-4 border" style={{ background: '#1a2744', borderColor: '#2a3a5c' }}>
            <h5 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#f2c811' }}>
              <Server size={16} /> Capacite
            </h5>
            <BulletList items={[
              'Dimensionner la capacite : F2 pour dev, F8+ pour production',
              'Surveiller avec le Capacity Metrics App',
              'Scaler up temporairement pour les gros chargements',
              'Separer les capacites dev et prod pour eviter les interferences',
            ]} />
            <PageLink to="/simulator" label="Simulateur de cout Fabric" />
          </div>
        </div>
      </SubSection>

      {/* Starter Pack */}
      <SubSection title='Starter Pack : "Premiere semaine avec Fabric"' icon={Sparkles}>
        <p className="text-sm mb-4" style={{ color: '#e2e8f0' }}>
          Checklist pour demarrer avec Microsoft Fabric en une semaine. Suivez ces etapes dans l'ordre
          pour avoir un pipeline complet fonctionnel.
        </p>

        <div className="space-y-4">
          {[
            { step: 'Activer le trial Fabric', desc: '60 jours gratuits avec F64 capacity. Aller dans admin.powerbi.com > Fabric trial.', day: 'Jour 1', link: null },
            { step: 'Creer un workspace Fabric', desc: 'Nommer "MyProject-Dev", assigner a la capacite trial, activer Git integration.', day: 'Jour 1', link: null },
            { step: 'Creer un Lakehouse', desc: 'Nommer "lakehouse_bronze". Explorer l\'interface Tables/ et Files/. Uploader un fichier CSV de test.', day: 'Jour 1', link: null },
            { step: 'Creer un Notebook d\'exploration', desc: 'Charger les donnees avec spark.read, explorer avec display(), ecrire en table Delta.', day: 'Jour 2', link: '/notebooks' },
            { step: 'Construire le modele semantique', desc: 'Depuis le Lakehouse, creer un semantic model Direct Lake. Ajouter des mesures DAX.', day: 'Jour 3', link: '/fiches' },
            { step: 'Creer le premier rapport', desc: 'Construire un rapport Power BI avec 3-5 visuels. Tester les interactions.', day: 'Jour 3', link: null },
            { step: 'Configurer le Data Pipeline', desc: 'Creer un pipeline d\'ingestion simple : source externe → Copy → Lakehouse bronze.', day: 'Jour 4', link: '/cicd' },
            { step: 'Configurer la securite RLS', desc: 'Ajouter un role RLS au semantic model. Tester avec "View as role".', day: 'Jour 4', link: '/fiches' },
            { step: 'Publier une App Power BI', desc: 'Creer une App, configurer la navigation, definir les audiences, publier.', day: 'Jour 5', link: null },
            { step: 'Monitoring avec Capacity Metrics', desc: 'Installer le Capacity Metrics App, connecter a votre capacite, analyser la consommation.', day: 'Jour 5', link: '/simulator' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex gap-4 rounded-lg p-4 border"
              style={{ background: '#1a2744', borderColor: '#2a3a5c' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: '#0078d4', color: '#fff' }}
                >
                  {i + 1}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-semibold text-sm" style={{ color: '#e2e8f0' }}>{item.step}</h5>
                  <Badge color="#f59e0b">{item.day}</Badge>
                </div>
                <p className="text-xs" style={{ color: '#94a3b8' }}>{item.desc}</p>
                {item.link && (
                  <div className="mt-2">
                    <PageLink to={item.link} label="Voir le guide detaille" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <Tip>
          Apres la premiere semaine, explorez l'IA dans Fabric (Copilot pour notebooks, Q&A pour Power BI)
          et les scenarios avances (Mirroring, Eventstream, Data Activator).
        </Tip>
        <div className="mt-4">
          <PageLink to="/ai" label="Decouvrir l'IA dans Power BI et Fabric" />
        </div>
      </SubSection>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */

const TAB_COMPONENTS: Record<TabId, React.FC> = {
  overview: OverviewTab,
  ingestion: IngestionTab,
  transformation: TransformationTab,
  storage: StorageTab,
  orchestration: OrchestrationTab,
  visualization: VisualizationTab,
  alerting: AlertingTab,
  governance: GovernanceTab,
  optimization: OptimizationTab,
}

export default function FabricDeepDive() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const ActiveComponent = TAB_COMPONENTS[activeTab]

  return (
    <div className="min-h-screen" style={{ background: '#0f0f1e' }}>
      {/* Header */}
      <motion.div
        className="text-center py-12 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, #f2c811, #0078d4, #10b981)' }}>
          Microsoft Fabric — Guide Complet
        </h1>
        <p className="text-lg max-w-3xl mx-auto" style={{ color: '#94a3b8' }}>
          Deep dive exhaustif dans chaque workload de la plateforme analytique unifiee de Microsoft.
          De l'ingestion a la visualisation, en passant par la gouvernance et l'optimisation.
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-50 border-b" style={{ background: '#0f0f1e', borderColor: '#2a3a5c' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-thin">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
                  style={{
                    background: isActive ? '#0078d4' : 'transparent',
                    color: isActive ? '#fff' : '#94a3b8',
                    border: isActive ? 'none' : '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#1a2744'
                      e.currentTarget.style.color = '#e2e8f0'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#94a3b8'
                    }
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer navigation */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="rounded-xl p-6 border" style={{ background: '#16213e', borderColor: '#2a3a5c' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#f2c811' }}>Continuer l'exploration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: '/simulator', label: 'Simulateur Fabric', icon: Cpu },
              { to: '/architecture', label: 'Architectures', icon: Network },
              { to: '/notebooks', label: 'Notebooks', icon: FileCode },
              { to: '/api', label: 'API Reference', icon: Settings },
              { to: '/cicd', label: 'CI/CD', icon: GitBranch },
              { to: '/performance', label: 'Performance', icon: Gauge },
              { to: '/fiches', label: 'Fiches techniques', icon: BookOpen },
              { to: '/ai', label: 'IA & Copilot', icon: Sparkles },
            ].map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 border transition-all"
                  style={{ background: '#1a2744', borderColor: '#2a3a5c', color: '#e2e8f0' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0078d4'
                    e.currentTarget.style.background = '#1a2744'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#2a3a5c'
                    e.currentTarget.style.background = '#1a2744'
                  }}
                >
                  <Icon size={16} style={{ color: '#0078d4' }} />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
