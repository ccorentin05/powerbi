import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Map,
  Monitor,
  Cloud,
  Server,
  Smartphone,
  Bot,
  Shield,
  CalendarDays,
  ThumbsUp,
  Zap,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Users,
  Code,
  Settings,
  BarChart3,
  ExternalLink,
  Star,
  Sparkles,
  Clock,
  Eye,
  MessageSquare,
  Rocket,
  Filter,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Quarter = 'Q2 2025' | 'Q3 2025' | 'Q4 2025' | '2026+'
type Category =
  | 'Power BI Desktop'
  | 'Power BI Service'
  | 'Fabric Platform'
  | 'Copilot & IA'
  | 'Governance'
  | 'Mobile'
type Status = 'preview' | 'ga' | 'development' | 'announced' | 'rumor'
type Impact = 'Transformateur' | 'Important' | 'Incrémental'
type Audience = 'Analysts' | 'Engineers' | 'Admins' | 'Developers'

interface RoadmapItem {
  id: string
  title: string
  description: string
  quarter: Quarter
  category: Category
  status: Status
  impact: Impact
  audiences: Audience[]
  relatedPage?: { label: string; path: string }
}

/* ------------------------------------------------------------------ */
/*  Config maps                                                        */
/* ------------------------------------------------------------------ */

const statusConfig: Record<
  Status,
  { label: string; color: string; bg: string }
> = {
  preview: {
    label: 'En Preview',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.15)',
  },
  ga: { label: 'GA prévu', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  development: {
    label: 'En développement',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.15)',
  },
  announced: {
    label: 'Annoncé',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.15)',
  },
  rumor: {
    label: 'Rumeur communauté',
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.15)',
  },
}

const impactConfig: Record<
  Impact,
  { label: string; color: string; bg: string; icon: typeof Zap }
> = {
  Transformateur: {
    label: 'Transformateur',
    color: '#f2c811',
    bg: 'rgba(242,200,17,0.15)',
    icon: Zap,
  },
  Important: {
    label: 'Important',
    color: '#0078d4',
    bg: 'rgba(0,120,212,0.15)',
    icon: TrendingUp,
  },
  Incrémental: {
    label: 'Incrémental',
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.15)',
    icon: ArrowRight,
  },
}

const categoryConfig: Record<
  Category,
  { icon: typeof Monitor; color: string }
> = {
  'Power BI Desktop': { icon: Monitor, color: '#f2c811' },
  'Power BI Service': { icon: Server, color: '#10b981' },
  'Fabric Platform': { icon: Cloud, color: '#0078d4' },
  'Copilot & IA': { icon: Bot, color: '#a855f7' },
  Governance: { icon: Shield, color: '#ef4444' },
  Mobile: { icon: Smartphone, color: '#f59e0b' },
}

const audienceConfig: Record<Audience, { icon: typeof Users; color: string }> =
  {
    Analysts: { icon: BarChart3, color: '#f2c811' },
    Engineers: { icon: Code, color: '#0078d4' },
    Admins: { icon: Settings, color: '#ef4444' },
    Developers: { icon: Code, color: '#10b981' },
  }

const quarters: (Quarter | 'Tous')[] = [
  'Q2 2025',
  'Q3 2025',
  'Q4 2025',
  '2026+',
  'Tous',
]

const allCategories: Category[] = [
  'Power BI Desktop',
  'Power BI Service',
  'Fabric Platform',
  'Copilot & IA',
  'Governance',
  'Mobile',
]

/* ------------------------------------------------------------------ */
/*  Roadmap Data                                                       */
/* ------------------------------------------------------------------ */

const roadmapItems: RoadmapItem[] = [
  // ── Q2 2025 — Power BI Desktop ──────────────────────────────────
  {
    id: 'q2-desktop-1',
    title: 'Enhanced Visual Calculations GA',
    description:
      'Les visual calculations passent en disponibilité générale avec davantage de fonctions (COLLAPSE, EXPAND, MOVINGAVERAGE) et des performances nettement améliorées. Cela simplifie les calculs visuels complexes sans mesures DAX supplémentaires.',
    quarter: 'Q2 2025',
    category: 'Power BI Desktop',
    status: 'ga',
    impact: 'Transformateur',
    audiences: ['Analysts', 'Developers'],
    relatedPage: { label: 'Référence DAX', path: '/dax' },
  },
  {
    id: 'q2-desktop-2',
    title: 'Nouveau volet de mise en forme',
    description:
      "Améliorations du volet de mise en forme avec prise en charge étendue du formatage conditionnel, préréglages personnalisables et copier/coller de styles entre visuels. L'expérience de design devient plus fluide.",
    quarter: 'Q2 2025',
    category: 'Power BI Desktop',
    status: 'preview',
    impact: 'Important',
    audiences: ['Analysts'],
  },
  {
    id: 'q2-desktop-3',
    title: 'Création de mises en page mobiles améliorée',
    description:
      "Refonte de l'éditeur de mise en page mobile dans Desktop : responsive design natif, prévisualisation multi-appareils et disposition automatique intelligente. Facilite grandement la création de rapports mobiles.",
    quarter: 'Q2 2025',
    category: 'Power BI Desktop',
    status: 'development',
    impact: 'Important',
    audiences: ['Analysts', 'Developers'],
  },
  {
    id: 'q2-desktop-4',
    title: 'Intégration Git pour fichiers PBIP',
    description:
      "Meilleure prise en charge du contrôle de source pour les fichiers PBIP : diff visuel, résolution de conflits, et intégration native avec Azure DevOps et GitHub. L'approche CI/CD pour Power BI se concrétise.",
    quarter: 'Q2 2025',
    category: 'Power BI Desktop',
    status: 'preview',
    impact: 'Transformateur',
    audiences: ['Developers', 'Engineers'],
    relatedPage: { label: 'CI/CD Pipelines', path: '/ci-cd' },
  },
  {
    id: 'q2-desktop-5',
    title: 'Mesures au niveau du rapport',
    description:
      "Possibilité de créer des mesures scopées au rapport plutôt qu'au modèle sémantique. Permet des calculs spécifiques à un rapport sans polluer le modèle partagé. Idéal pour le prototypage rapide.",
    quarter: 'Q2 2025',
    category: 'Power BI Desktop',
    status: 'announced',
    impact: 'Important',
    audiences: ['Analysts', 'Developers'],
    relatedPage: { label: 'Référence DAX', path: '/dax' },
  },
  // ── Q2 2025 — Power BI Service ──────────────────────────────────
  {
    id: 'q2-service-1',
    title: 'Pipelines de déploiement améliorés',
    description:
      'Gestion des dépendances cross-workspace, déploiement sélectif par artefact, et rollback automatique en cas de problème. Les pipelines de déploiement deviennent vraiment enterprise-ready.',
    quarter: 'Q2 2025',
    category: 'Power BI Service',
    status: 'development',
    impact: 'Important',
    audiences: ['Engineers', 'Admins'],
    relatedPage: { label: 'CI/CD Pipelines', path: '/ci-cd' },
  },
  {
    id: 'q2-service-2',
    title: "Vue de lignage améliorée et analyse d'impact",
    description:
      "La vue de lignage s'enrichit d'une analyse d'impact détaillée : visualisez qui sera affecté par un changement de modèle, avec notifications proactives aux propriétaires de rapports dépendants.",
    quarter: 'Q2 2025',
    category: 'Power BI Service',
    status: 'preview',
    impact: 'Important',
    audiences: ['Admins', 'Engineers'],
  },
  {
    id: 'q2-service-3',
    title: 'Power BI Apps v2',
    description:
      "Nouvelle version des Power BI Apps avec navigation par sous-pages, audiences ciblées avancées, et personnalisation de l'expérience utilisateur. L'app devient un vrai portail analytique.",
    quarter: 'Q2 2025',
    category: 'Power BI Service',
    status: 'ga',
    impact: 'Important',
    audiences: ['Analysts', 'Admins'],
  },
  {
    id: 'q2-service-4',
    title: 'Modèles composites sur Direct Lake',
    description:
      'Combinez Direct Lake avec DirectQuery et Import dans un même modèle composite. Accédez aux données OneLake en temps réel tout en enrichissant avec des sources externes. Un game-changer pour les architectures hybrides.',
    quarter: 'Q2 2025',
    category: 'Power BI Service',
    status: 'preview',
    impact: 'Transformateur',
    audiences: ['Engineers', 'Developers'],
    relatedPage: { label: 'Architecture', path: '/architecture' },
  },
  // ── Q2 2025 — Fabric Platform ───────────────────────────────────
  {
    id: 'q2-fabric-1',
    title: 'Fabric Databases (SQL) GA',
    description:
      'Base de données SQL entièrement managée dans Fabric en disponibilité générale. Compatible T-SQL, intégrée à OneLake, avec scaling automatique. Simplifie radicalement les architectures data.',
    quarter: 'Q2 2025',
    category: 'Fabric Platform',
    status: 'ga',
    impact: 'Transformateur',
    audiences: ['Engineers', 'Developers'],
    relatedPage: { label: 'Simulateur Fabric', path: '/fabric-simulator' },
  },
  {
    id: 'q2-fabric-2',
    title: 'Mirroring MySQL et PostgreSQL',
    description:
      "Nouvelles sources de mirroring : MySQL et PostgreSQL rejoignent SQL Server et Cosmos DB. Répliquez vos bases opérationnelles dans OneLake en temps quasi-réel sans ETL complexe.",
    quarter: 'Q2 2025',
    category: 'Fabric Platform',
    status: 'preview',
    impact: 'Important',
    audiences: ['Engineers'],
  },
  {
    id: 'q2-fabric-3',
    title: 'Eventstream amélioré',
    description:
      "Plus de transformations inline, meilleur monitoring des flux, et nouvelles sources/destinations. L'ingestion en streaming dans Fabric gagne en maturité.",
    quarter: 'Q2 2025',
    category: 'Fabric Platform',
    status: 'development',
    impact: 'Incrémental',
    audiences: ['Engineers'],
  },
  {
    id: 'q2-fabric-4',
    title: 'Data Activator — nouveaux déclencheurs',
    description:
      "Data Activator s'enrichit de déclencheurs plus complexes : conditions composées, fenêtres temporelles, et intégration avec Power Automate. L'alerting data-driven se sophistique.",
    quarter: 'Q2 2025',
    category: 'Fabric Platform',
    status: 'development',
    impact: 'Important',
    audiences: ['Analysts', 'Engineers'],
  },
  {
    id: 'q2-fabric-5',
    title: 'Workload Development Kit amélioré',
    description:
      'Améliorations du SDK pour créer des workloads personnalisés dans Fabric : meilleure documentation, templates, et marketplace pour les ISVs. Fabric devient une vraie plateforme extensible.',
    quarter: 'Q2 2025',
    category: 'Fabric Platform',
    status: 'development',
    impact: 'Incrémental',
    audiences: ['Developers'],
  },
  // ── Q2 2025 — Copilot & IA ─────────────────────────────────────
  {
    id: 'q2-copilot-1',
    title: 'Copilot pour la création de rapports GA',
    description:
      "Créez des visuels en langage naturel dans le Service. Décrivez ce que vous voulez voir et Copilot génère le visuel, choisit le type de graphique et configure les axes. L'IA devient votre assistant de design.",
    quarter: 'Q2 2025',
    category: 'Copilot & IA',
    status: 'ga',
    impact: 'Transformateur',
    audiences: ['Analysts'],
    relatedPage: { label: 'IA & Power BI', path: '/ai-powerbi' },
  },
  {
    id: 'q2-copilot-2',
    title: 'Copilot dans les requêtes DAX',
    description:
      "Génération et explication de requêtes DAX directement dans le Service. Copilot comprend votre modèle et suggère des mesures optimisées. Idéal pour l'apprentissage et le prototypage.",
    quarter: 'Q2 2025',
    category: 'Copilot & IA',
    status: 'preview',
    impact: 'Important',
    audiences: ['Analysts', 'Developers'],
    relatedPage: { label: 'Référence DAX', path: '/dax' },
  },
  {
    id: 'q2-copilot-3',
    title: 'Résumés narratifs améliorés',
    description:
      "Les smart narratives alimentés par l'IA deviennent plus contextuels : prise en compte des tendances, comparaisons automatiques, et ton personnalisable pour s'adapter à votre audience.",
    quarter: 'Q2 2025',
    category: 'Copilot & IA',
    status: 'development',
    impact: 'Incrémental',
    audiences: ['Analysts'],
  },
  {
    id: 'q2-copilot-4',
    title: 'Copilot dans Data Factory',
    description:
      "Assistance IA pour la création de pipelines dans Data Factory : suggestion de transformations, détection d'erreurs, et optimisation automatique des flux. L'ETL assisté par IA.",
    quarter: 'Q2 2025',
    category: 'Copilot & IA',
    status: 'preview',
    impact: 'Important',
    audiences: ['Engineers'],
  },
  // ── Q3 2025 — Power BI Desktop ──────────────────────────────────
  {
    id: 'q3-desktop-1',
    title: 'Intégration Power Query Online renforcée',
    description:
      "Basculez de manière transparente entre Power Query dans Desktop et le cloud. Les transformations sont synchronisées, permettant l'édition collaborative et le partage de requêtes entre équipes.",
    quarter: 'Q3 2025',
    category: 'Power BI Desktop',
    status: 'development',
    impact: 'Important',
    audiences: ['Analysts', 'Engineers'],
  },
  {
    id: 'q3-desktop-2',
    title: 'Groupes de calcul — support visuel étendu',
    description:
      'Les calculation groups bénéficient de contrôles de formatage améliorés et de la compatibilité avec davantage de types de visuels. Le format dynamique devient une réalité plus accessible.',
    quarter: 'Q3 2025',
    category: 'Power BI Desktop',
    status: 'development',
    impact: 'Incrémental',
    audiences: ['Developers', 'Analysts'],
    relatedPage: { label: 'Référence DAX', path: '/dax' },
  },
  {
    id: 'q3-desktop-3',
    title: 'Performance des modèles composites améliorée',
    description:
      "Optimisations majeures pour les modèles composites : mise en cache intelligente, parallélisation des requêtes, et réduction de l'empreinte mémoire. Les rapports hybrides deviennent plus rapides.",
    quarter: 'Q3 2025',
    category: 'Power BI Desktop',
    status: 'development',
    impact: 'Important',
    audiences: ['Engineers', 'Developers'],
    relatedPage: { label: 'Performance', path: '/performance' },
  },
  {
    id: 'q3-desktop-4',
    title: 'Rapports multi-modèles',
    description:
      "Un seul rapport peut désormais se connecter à plusieurs modèles sémantiques simultanément. Plus besoin de modèles composites pour combiner des sources — chaque modèle reste indépendant et gouverné.",
    quarter: 'Q3 2025',
    category: 'Power BI Desktop',
    status: 'announced',
    impact: 'Transformateur',
    audiences: ['Analysts', 'Engineers', 'Developers'],
  },
  // ── Q3 2025 — Power BI Service ──────────────────────────────────
  {
    id: 'q3-service-1',
    title: 'Abonnements dynamiques',
    description:
      "Envoyez des rapports email personnalisés par destinataire avec des filtres RLS automatiques. Chaque utilisateur reçoit uniquement ses données. Idéal pour la distribution à grande échelle.",
    quarter: 'Q3 2025',
    category: 'Power BI Service',
    status: 'development',
    impact: 'Important',
    audiences: ['Admins', 'Analysts'],
  },
  {
    id: 'q3-service-2',
    title: "API d'embedding v3",
    description:
      "Nouvelle génération d'APIs d'embedding : meilleures performances, gestion fine des tokens, plus de contrôle sur l'interactivité, et support complet du theming dynamique.",
    quarter: 'Q3 2025',
    category: 'Power BI Service',
    status: 'development',
    impact: 'Important',
    audiences: ['Developers'],
    relatedPage: { label: 'API Reference', path: '/api' },
  },
  {
    id: 'q3-service-3',
    title: 'RLS pour Direct Lake GA',
    description:
      "La sécurité au niveau des lignes (RLS) pour les modèles Direct Lake passe en disponibilité générale. Appliquez des règles de sécurité dynamiques sur vos données OneLake sans compromis de performance.",
    quarter: 'Q3 2025',
    category: 'Power BI Service',
    status: 'ga',
    impact: 'Transformateur',
    audiences: ['Admins', 'Engineers'],
  },
  {
    id: 'q3-service-4',
    title: 'API REST Power BI v2',
    description:
      "Surface d'API unifiée et simplifiée : conventions RESTful cohérentes, pagination standard, filtrage OData, et meilleure documentation OpenAPI. Facilite l'automatisation.",
    quarter: 'Q3 2025',
    category: 'Power BI Service',
    status: 'announced',
    impact: 'Important',
    audiences: ['Developers', 'Engineers'],
    relatedPage: { label: 'API Reference', path: '/api' },
  },
  // ── Q3 2025 — Fabric Platform ───────────────────────────────────
  {
    id: 'q3-fabric-1',
    title: 'API GraphQL pour Fabric',
    description:
      "Interrogez les items Fabric via GraphQL : requêtes flexibles, typage fort, et introspection du schéma. Une alternative moderne aux APIs REST pour les développeurs Fabric.",
    quarter: 'Q3 2025',
    category: 'Fabric Platform',
    status: 'preview',
    impact: 'Important',
    audiences: ['Developers'],
  },
  {
    id: 'q3-fabric-2',
    title: 'Sécurité OneLake renforcée',
    description:
      "ACLs granulaires par dossier et fichier dans OneLake. Contrôlez précisément qui accède à quelles données au niveau le plus fin. Essentiel pour les organisations multi-équipes.",
    quarter: 'Q3 2025',
    category: 'Fabric Platform',
    status: 'development',
    impact: 'Transformateur',
    audiences: ['Admins', 'Engineers'],
  },
  {
    id: 'q3-fabric-3',
    title: 'Auto-scale des capacités Fabric GA',
    description:
      "Scaling automatique des capacités Fabric en fonction de la charge. Plus de sur-provisionnement : la capacité s'adapte dynamiquement aux pics d'utilisation puis redescend.",
    quarter: 'Q3 2025',
    category: 'Fabric Platform',
    status: 'ga',
    impact: 'Important',
    audiences: ['Admins'],
    relatedPage: {
      label: 'Comparateur de licences',
      path: '/license-comparator',
    },
  },
  {
    id: 'q3-fabric-4',
    title: 'Requêtes cross-database Data Warehouse GA',
    description:
      "Joignez des données entre plusieurs entrepôts Fabric dans une seule requête T-SQL. Le data warehouse distribué devient une réalité sans déplacement de données.",
    quarter: 'Q3 2025',
    category: 'Fabric Platform',
    status: 'ga',
    impact: 'Important',
    audiences: ['Engineers'],
  },
  {
    id: 'q3-fabric-5',
    title: 'Shortcuts vers BigQuery et Databricks',
    description:
      "Nouveaux shortcuts OneLake vers Google BigQuery et Databricks. Accédez aux données multi-cloud sans copie, avec pushdown des requêtes pour des performances optimales.",
    quarter: 'Q3 2025',
    category: 'Fabric Platform',
    status: 'announced',
    impact: 'Important',
    audiences: ['Engineers'],
  },
  {
    id: 'q3-fabric-6',
    title: 'Fabric EPM (Enterprise Performance Management)',
    description:
      "Planification, budgétisation et prévisions directement dans Fabric. Combinez les données réelles de OneLake avec des saisies manuelles pour une vision financière complète.",
    quarter: 'Q3 2025',
    category: 'Fabric Platform',
    status: 'announced',
    impact: 'Transformateur',
    audiences: ['Analysts', 'Engineers'],
  },
  // ── Q3 2025 — Copilot & IA ─────────────────────────────────────
  {
    id: 'q3-copilot-1',
    title: 'Copilot dans les notebooks GA',
    description:
      "Assistance IA complète dans les notebooks Fabric : génération de code Python/Spark, explication de code existant, débogage intelligent, et suggestions de visualisations.",
    quarter: 'Q3 2025',
    category: 'Copilot & IA',
    status: 'ga',
    impact: 'Important',
    audiences: ['Engineers', 'Developers'],
    relatedPage: { label: 'Templates Notebooks', path: '/notebooks' },
  },
  {
    id: 'q3-copilot-2',
    title: 'Règles de qualité de données par IA',
    description:
      "Détection automatique d'anomalies, valeurs aberrantes et incohérences dans vos données. L'IA propose des règles de qualité et alerte proactivement sur les dégradations.",
    quarter: 'Q3 2025',
    category: 'Copilot & IA',
    status: 'development',
    impact: 'Important',
    audiences: ['Engineers', 'Admins'],
  },
  {
    id: 'q3-copilot-3',
    title: 'Langage naturel vers KQL',
    description:
      "Interrogez vos bases de données en langage naturel, Copilot génère le KQL correspondant. Rend l'exploration de données temps réel accessible à tous, pas seulement aux experts KQL.",
    quarter: 'Q3 2025',
    category: 'Copilot & IA',
    status: 'preview',
    impact: 'Incrémental',
    audiences: ['Analysts', 'Engineers'],
  },
  // ── Q4 2025 — Power BI Desktop ──────────────────────────────────
  {
    id: 'q4-desktop-1',
    title: 'Framework visuel amélioré',
    description:
      "Nouveau runtime pour les visuels personnalisés : meilleures performances de rendu, API plus riche, et sandbox sécurisé amélioré. Les custom visuals deviennent plus rapides et plus puissants.",
    quarter: 'Q4 2025',
    category: 'Power BI Desktop',
    status: 'development',
    impact: 'Important',
    audiences: ['Developers'],
  },
  {
    id: 'q4-desktop-2',
    title: 'Power BI Desktop sur Mac (web)',
    description:
      "Expérience de création Power BI basée sur le navigateur, permettant aux utilisateurs Mac de créer des rapports sans Windows. Une demande de longue date enfin adressée.",
    quarter: 'Q4 2025',
    category: 'Power BI Desktop',
    status: 'announced',
    impact: 'Transformateur',
    audiences: ['Analysts', 'Developers'],
  },
  {
    id: 'q4-desktop-3',
    title: '50+ nouveaux connecteurs de données',
    description:
      "Vague massive de nouveaux connecteurs : SaaS populaires, bases NoSQL, APIs industrielles. Power BI étend encore son écosystème de connectivité pour couvrir tous les cas d'usage.",
    quarter: 'Q4 2025',
    category: 'Power BI Desktop',
    status: 'development',
    impact: 'Incrémental',
    audiences: ['Engineers', 'Analysts'],
  },
  // ── Q4 2025 — Power BI Service ──────────────────────────────────
  {
    id: 'q4-service-1',
    title: 'Collaboration temps réel sur les rapports',
    description:
      "Édition multi-utilisateurs simultanée sur un même rapport, à la Google Docs. Voyez les curseurs de vos collègues, commentez en temps réel, et fusionnez automatiquement les modifications.",
    quarter: 'Q4 2025',
    category: 'Power BI Service',
    status: 'development',
    impact: 'Transformateur',
    audiences: ['Analysts', 'Developers'],
  },
  {
    id: 'q4-service-2',
    title: 'Objectifs et métriques Power BI améliorés',
    description:
      "Intégration OKR native, suivi de métriques cross-rapports, et scorecards dynamiques. Alignez vos KPIs Power BI avec les objectifs stratégiques de l'organisation.",
    quarter: 'Q4 2025',
    category: 'Power BI Service',
    status: 'development',
    impact: 'Important',
    audiences: ['Analysts', 'Admins'],
  },
  {
    id: 'q4-service-3',
    title: "Centre d'administration unifié Power BI + Fabric",
    description:
      "Un seul portail d'administration pour Power BI et Fabric : gestion des capacités, gouvernance, audit, et configuration depuis une interface unique et cohérente.",
    quarter: 'Q4 2025',
    category: 'Power BI Service',
    status: 'announced',
    impact: 'Important',
    audiences: ['Admins'],
  },
  // ── Q4 2025 — Governance ────────────────────────────────────────
  {
    id: 'q4-gov-1',
    title: 'Fabric pour industries réglementées',
    description:
      "Conformité HIPAA, FedRAMP et certifications sectorielles pour Fabric. Les organisations dans la santé, la finance et le gouvernement peuvent enfin adopter Fabric en toute confiance.",
    quarter: 'Q4 2025',
    category: 'Governance',
    status: 'development',
    impact: 'Transformateur',
    audiences: ['Admins'],
  },
  {
    id: 'q4-gov-2',
    title: 'Monitoring unifié cross-workloads',
    description:
      "Métriques unifiées pour tous les workloads Fabric dans un seul dashboard : capacité, performance, erreurs, et tendances d'utilisation. La supervision Fabric simplifiée.",
    quarter: 'Q4 2025',
    category: 'Governance',
    status: 'development',
    impact: 'Important',
    audiences: ['Admins', 'Engineers'],
  },
  // ── Q4 2025 — Fabric Platform ───────────────────────────────────
  {
    id: 'q4-fabric-1',
    title: 'Fabric Data Mesh GA',
    description:
      "Partage de données gouverné entre domaines en disponibilité générale. Chaque équipe est propriétaire de ses données produit tout en les rendant accessibles via un catalogue centralisé.",
    quarter: 'Q4 2025',
    category: 'Fabric Platform',
    status: 'ga',
    impact: 'Transformateur',
    audiences: ['Engineers', 'Admins'],
    relatedPage: { label: 'Architecture', path: '/architecture' },
  },
  {
    id: 'q4-fabric-2',
    title: 'Mirroring SAP et Oracle',
    description:
      "Mirroring étendu aux systèmes d'entreprise les plus utilisés : SAP et Oracle. Répliquez vos données ERP dans OneLake en temps quasi-réel sans middleware intermédiaire.",
    quarter: 'Q4 2025',
    category: 'Fabric Platform',
    status: 'announced',
    impact: 'Important',
    audiences: ['Engineers'],
  },
  {
    id: 'q4-fabric-3',
    title: 'Catalogue OneLake — Data Marketplace',
    description:
      "Expérience complète de marketplace de données : découvrez, prévisualisez et consommez des datasets certifiés depuis un catalogue centralisé avec recherche sémantique et recommandations IA.",
    quarter: 'Q4 2025',
    category: 'Fabric Platform',
    status: 'development',
    impact: 'Important',
    audiences: ['Analysts', 'Engineers', 'Admins'],
  },
  // ── Q4 2025 — Copilot & IA ─────────────────────────────────────
  {
    id: 'q4-copilot-1',
    title: 'Agents Copilot personnalisés',
    description:
      "Créez des agents IA spécialisés pour votre domaine métier. L'agent connaît votre modèle de données, votre terminologie, et peut répondre aux questions spécifiques de vos utilisateurs.",
    quarter: 'Q4 2025',
    category: 'Copilot & IA',
    status: 'announced',
    impact: 'Transformateur',
    audiences: ['Developers', 'Engineers'],
    relatedPage: { label: 'IA & Power BI', path: '/ai-powerbi' },
  },
  {
    id: 'q4-copilot-2',
    title: 'Modèles sémantiques auto-générés',
    description:
      "L'IA analyse vos données sources et propose un modèle sémantique optimisé : tables, relations, mesures et hiérarchies. Le data modeling assisté par IA réduit drastiquement le temps de conception.",
    quarter: 'Q4 2025',
    category: 'Copilot & IA',
    status: 'development',
    impact: 'Transformateur',
    audiences: ['Analysts', 'Engineers'],
  },
  {
    id: 'q4-copilot-3',
    title: "Optimisation de performance par l'IA",
    description:
      "Copilot analyse vos rapports lents, identifie les goulets d'étranglement (DAX, modèle, visuels) et applique automatiquement les corrections. Le Performance Analyzer augmenté par l'IA.",
    quarter: 'Q4 2025',
    category: 'Copilot & IA',
    status: 'development',
    impact: 'Important',
    audiences: ['Developers', 'Engineers'],
    relatedPage: { label: 'Performance', path: '/performance' },
  },
  // ── 2026+ — Vision ──────────────────────────────────────────────
  {
    id: '2026-vision-1',
    title: 'BI en langage naturel',
    description:
      "Posez n'importe quelle question en langage naturel et obtenez une réponse instantanée avec visualisation. L'interface disparaît au profit de la conversation. La démocratisation ultime de la BI.",
    quarter: '2026+',
    category: 'Copilot & IA',
    status: 'rumor',
    impact: 'Transformateur',
    audiences: ['Analysts'],
  },
  {
    id: '2026-vision-2',
    title: 'Pipelines de données autonomes',
    description:
      "Pipelines ETL auto-réparateurs et auto-optimisants. L'IA détecte les erreurs, adapte les schémas, et optimise les performances sans intervention humaine. Le DataOps autonome.",
    quarter: '2026+',
    category: 'Fabric Platform',
    status: 'rumor',
    impact: 'Transformateur',
    audiences: ['Engineers'],
  },
  {
    id: '2026-vision-3',
    title: 'Expérience unifiée Microsoft 365 + Fabric',
    description:
      "Fabric s'intègre nativement dans Teams, Excel, Outlook et SharePoint. Les données et insights sont accessibles depuis les outils du quotidien, sans basculer entre les applications.",
    quarter: '2026+',
    category: 'Fabric Platform',
    status: 'announced',
    impact: 'Important',
    audiences: ['Analysts', 'Admins'],
  },
  {
    id: '2026-vision-4',
    title: 'Analytics en périphérie (Edge)',
    description:
      "Exécutez des workloads Fabric sur des appareils edge pour du traitement local, faible latence, et scénarios déconnectés. IoT et analytics convergent dans Fabric.",
    quarter: '2026+',
    category: 'Fabric Platform',
    status: 'rumor',
    impact: 'Incrémental',
    audiences: ['Engineers'],
  },
  {
    id: '2026-vision-5',
    title: 'Fabric multi-cloud (AWS/GCP via Azure Arc)',
    description:
      "Déployez des workloads Fabric sur AWS et GCP via Azure Arc. Les organisations multi-cloud peuvent unifier leur plateforme data sans dépendance exclusive à Azure.",
    quarter: '2026+',
    category: 'Fabric Platform',
    status: 'rumor',
    impact: 'Transformateur',
    audiences: ['Engineers', 'Admins'],
  },
]

/* ------------------------------------------------------------------ */
/*  Most anticipated IDs                                               */
/* ------------------------------------------------------------------ */

const mostAnticipatedIds = [
  'q2-desktop-1',
  'q2-copilot-1',
  'q3-desktop-4',
  'q4-service-1',
  'q4-copilot-1',
]

/* ------------------------------------------------------------------ */
/*  Helper: localStorage votes                                         */
/* ------------------------------------------------------------------ */

const VOTES_KEY = 'roadmap-votes'

function loadVotes(): Record<string, number> {
  try {
    const raw = localStorage.getItem(VOTES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveVotes(v: Record<string, number>) {
  localStorage.setItem(VOTES_KEY, JSON.stringify(v))
}

const VOTED_KEY = 'roadmap-voted'

function loadVotedIds(): string[] {
  try {
    const raw = localStorage.getItem(VOTED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveVotedIds(ids: string[]) {
  localStorage.setItem(VOTED_KEY, JSON.stringify(ids))
}

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: Status }) {
  const c = statusConfig[status]
  return (
    <span
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}30` }}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
    >
      {c.label}
    </span>
  )
}

function ImpactBadge({ impact }: { impact: Impact }) {
  const c = impactConfig[impact]
  const Icon = c.icon
  return (
    <span
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}30` }}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
    >
      <Icon size={12} />
      {c.label}
    </span>
  )
}

function CategoryBadge({ category }: { category: Category }) {
  const c = categoryConfig[category]
  const Icon = c.icon
  return (
    <span
      style={{
        background: `${c.color}15`,
        color: c.color,
        border: `1px solid ${c.color}30`,
      }}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
    >
      <Icon size={12} />
      {category}
    </span>
  )
}

function AudienceTag({ audience }: { audience: Audience }) {
  const c = audienceConfig[audience]
  return (
    <span
      style={{ color: c.color }}
      className="inline-flex items-center gap-0.5 text-xs opacity-80"
    >
      {audience}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  RoadmapCard                                                        */
/* ------------------------------------------------------------------ */

function RoadmapCard({
  item,
  expanded,
  onToggle,
}: {
  item: RoadmapItem
  expanded: boolean
  onToggle: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      onClick={onToggle}
      className="cursor-pointer rounded-xl border transition-colors"
      style={{
        background: '#16213e',
        borderColor: expanded ? categoryConfig[item.category].color + '60' : '#2a3a5c',
      }}
    >
      <div className="p-4 sm:p-5">
        {/* Top badges row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={item.status} />
          <CategoryBadge category={item.category} />
          <ImpactBadge impact={item.impact} />
        </div>

        {/* Title + chevron */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-base font-semibold sm:text-lg"
            style={{ color: '#e2e8f0' }}
          >
            {item.title}
          </h3>
          {expanded ? (
            <ChevronUp size={18} style={{ color: '#94a3b8' }} className="mt-1 shrink-0" />
          ) : (
            <ChevronDown size={18} style={{ color: '#94a3b8' }} className="mt-1 shrink-0" />
          )}
        </div>

        {/* Description (always visible first line, full on expand) */}
        <p
          className={`mt-2 text-sm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}
          style={{ color: '#94a3b8' }}
        >
          {item.description}
        </p>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-3" style={{ borderColor: '#2a3a5c' }}>
                <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>
                  Bénéficiaires :
                </span>
                {item.audiences.map((a) => (
                  <AudienceTag key={a} audience={a} />
                ))}
              </div>
              {item.relatedPage && (
                <Link
                  to={item.relatedPage.path}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    background: 'rgba(0,120,212,0.15)',
                    color: '#0078d4',
                  }}
                >
                  <ExternalLink size={12} />
                  {item.relatedPage.label}
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  MostAnticipatedCard                                                */
/* ------------------------------------------------------------------ */

function MostAnticipatedCard({
  item,
  votes,
  hasVoted,
  onVote,
  rank,
}: {
  item: RoadmapItem
  votes: number
  hasVoted: boolean
  onVote: () => void
  rank: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: rank * 0.08 }}
      className="relative rounded-xl border p-5 sm:p-6"
      style={{
        background: 'linear-gradient(135deg, #16213e 0%, #1a2744 100%)',
        borderColor: '#f2c81140',
      }}
    >
      {/* Rank badge */}
      <div
        className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
        style={{ background: '#f2c811', color: '#1a1a2e' }}
      >
        #{rank + 1}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={item.status} />
        <CategoryBadge category={item.category} />
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            background: 'rgba(242,200,17,0.15)',
            color: '#f2c811',
            border: '1px solid rgba(242,200,17,0.3)',
          }}
        >
          {item.quarter}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-bold" style={{ color: '#e2e8f0' }}>
        {item.title}
      </h3>

      <p className="mb-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
        {item.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {item.audiences.map((a) => (
            <AudienceTag key={a} audience={a} />
          ))}
        </div>

        <button
          onClick={onVote}
          disabled={hasVoted}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
          style={{
            background: hasVoted ? 'rgba(242,200,17,0.2)' : 'rgba(242,200,17,0.1)',
            color: '#f2c811',
            border: `1px solid ${hasVoted ? '#f2c81160' : '#f2c81130'}`,
            cursor: hasVoted ? 'default' : 'pointer',
          }}
        >
          <ThumbsUp size={14} fill={hasVoted ? '#f2c811' : 'none'} />
          {votes}
        </button>
      </div>

      {item.relatedPage && (
        <Link
          to={item.relatedPage.path}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: '#0078d4' }}
        >
          <ExternalLink size={12} />
          {item.relatedPage.label}
        </Link>
      )}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function Roadmap() {
  /* Filters */
  const [quarterFilter, setQuarterFilter] = useState<Quarter | 'Tous'>('Tous')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'Tous'>('Tous')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  /* Votes */
  const [votes, setVotes] = useState<Record<string, number>>(loadVotes)
  const [votedIds, setVotedIds] = useState<string[]>(loadVotedIds)

  useEffect(() => saveVotes(votes), [votes])
  useEffect(() => saveVotedIds(votedIds), [votedIds])

  const handleVote = (id: string) => {
    if (votedIds.includes(id)) return
    setVotes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    setVotedIds((prev) => [...prev, id])
  }

  /* Derived data */
  const filteredItems = useMemo(() => {
    return roadmapItems.filter((item) => {
      if (quarterFilter !== 'Tous' && item.quarter !== quarterFilter) return false
      if (categoryFilter !== 'Tous' && item.category !== categoryFilter) return false
      return true
    })
  }, [quarterFilter, categoryFilter])

  const groupedByQuarter = useMemo(() => {
    const groups: Record<string, RoadmapItem[]> = {}
    const order: Quarter[] = ['Q2 2025', 'Q3 2025', 'Q4 2025', '2026+']
    for (const q of order) groups[q] = []
    for (const item of filteredItems) {
      groups[item.quarter].push(item)
    }
    return Object.entries(groups).filter(([, items]) => items.length > 0)
  }, [filteredItems])

  const mostAnticipated = useMemo(
    () =>
      mostAnticipatedIds
        .map((id) => roadmapItems.find((i) => i.id === id)!)
        .filter(Boolean),
    [],
  )

  /* Stats */
  const totalItems = roadmapItems.length
  const previewCount = roadmapItems.filter((i) => i.status === 'preview').length
  const gaCount = roadmapItems.filter((i) => i.status === 'ga').length
  const transformCount = roadmapItems.filter(
    (i) => i.impact === 'Transformateur',
  ).length

  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  const quarterLabels: Record<Quarter, string> = {
    'Q2 2025': 'Avril - Juin 2025',
    'Q3 2025': 'Juillet - Septembre 2025',
    'Q4 2025': 'Octobre - Décembre 2025',
    '2026+': '2026 et au-delà',
  }

  return (
    <div className="min-h-screen" style={{ background: '#0f0f1e' }}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{ background: 'rgba(242,200,17,0.1)', color: '#f2c811', border: '1px solid rgba(242,200,17,0.3)' }}
          >
            <Map size={16} />
            Roadmap
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span
              style={{
                background: 'linear-gradient(135deg, #f2c811, #0078d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Roadmap Power BI & Fabric
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg" style={{ color: '#94a3b8' }}>
            Ce qui arrive dans les prochains mois
          </p>

          <div
            className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: 'rgba(59,130,246,0.1)',
              color: '#3b82f6',
              border: '1px solid rgba(59,130,246,0.3)',
            }}
          >
            <Clock size={12} />
            Dernière mise à jour : Avril 2025
          </div>

          {/* Quick stats */}
          <div className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Features', value: totalItems, icon: Rocket, color: '#f2c811' },
              { label: 'En Preview', value: previewCount, icon: Eye, color: '#3b82f6' },
              { label: 'GA prévu', value: gaCount, icon: Sparkles, color: '#10b981' },
              { label: 'Transformateurs', value: transformCount, icon: Zap, color: '#f59e0b' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border p-3 text-center"
                style={{ background: '#16213e', borderColor: '#2a3a5c' }}
              >
                <s.icon size={18} style={{ color: s.color }} className="mx-auto mb-1" />
                <div className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>
                  {s.value}
                </div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Status Legend ───────────────────────────────────────── */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: cfg.color }}
              />
              {cfg.label}
            </span>
          ))}
        </div>

        {/* ── Timeline Filter ────────────────────────────────────── */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <CalendarDays size={16} style={{ color: '#94a3b8' }} />
          {quarters.map((q) => (
            <button
              key={q}
              onClick={() => setQuarterFilter(q)}
              className="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
              style={{
                background:
                  quarterFilter === q ? '#f2c811' : 'rgba(242,200,17,0.08)',
                color: quarterFilter === q ? '#1a1a2e' : '#f2c811',
                border: `1px solid ${quarterFilter === q ? '#f2c811' : 'rgba(242,200,17,0.25)'}`,
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* ── Category Filter ────────────────────────────────────── */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          <Filter size={16} style={{ color: '#94a3b8' }} />
          <button
            onClick={() => setCategoryFilter('Tous')}
            className="rounded-full px-3 py-1 text-xs font-medium transition-all"
            style={{
              background:
                categoryFilter === 'Tous' ? '#0078d4' : 'rgba(0,120,212,0.08)',
              color: categoryFilter === 'Tous' ? '#fff' : '#0078d4',
              border: `1px solid ${categoryFilter === 'Tous' ? '#0078d4' : 'rgba(0,120,212,0.25)'}`,
            }}
          >
            Tous
          </button>
          {allCategories.map((cat) => {
            const cfg = categoryConfig[cat]
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all"
                style={{
                  background:
                    categoryFilter === cat ? cfg.color : `${cfg.color}12`,
                  color: categoryFilter === cat ? '#1a1a2e' : cfg.color,
                  border: `1px solid ${categoryFilter === cat ? cfg.color : cfg.color + '30'}`,
                }}
              >
                <cfg.icon size={12} />
                {cat}
              </button>
            )
          })}
        </div>

        {/* ── Most Anticipated Section ───────────────────────────── */}
        {quarterFilter === 'Tous' && categoryFilter === 'Tous' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="mb-6 flex items-center gap-3">
              <Star size={24} style={{ color: '#f2c811' }} fill="#f2c811" />
              <h2 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>
                Les plus attendus
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {mostAnticipated.map((item, i) => (
                <MostAnticipatedCard
                  key={item.id}
                  item={item}
                  rank={i}
                  votes={votes[item.id] || 0}
                  hasVoted={votedIds.includes(item.id)}
                  onVote={() => handleVote(item.id)}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Timeline ───────────────────────────────────────────── */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute top-0 bottom-0 left-4 hidden w-0.5 sm:block"
            style={{ background: 'linear-gradient(to bottom, #f2c811, #0078d4, #0f0f1e)' }}
          />

          {groupedByQuarter.map(([quarter, items]) => (
            <section key={quarter} className="relative mb-12 sm:pl-14">
              {/* Quarter dot on timeline */}
              <div
                className="absolute top-1 left-2 hidden h-5 w-5 rounded-full border-2 sm:block"
                style={{
                  background: '#0f0f1e',
                  borderColor: quarter.startsWith('2026') ? '#94a3b8' : '#f2c811',
                }}
              />

              {/* Quarter header */}
              <div className="mb-5">
                <h2 className="text-xl font-bold sm:text-2xl" style={{ color: '#e2e8f0' }}>
                  {quarter}
                </h2>
                <p className="text-sm" style={{ color: '#94a3b8' }}>
                  {quarterLabels[quarter as Quarter]}
                </p>
              </div>

              {/* Items grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <RoadmapCard
                    key={item.id}
                    item={item}
                    expanded={expandedId === item.id}
                    onToggle={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="py-20 text-center">
            <MessageSquare
              size={48}
              style={{ color: '#94a3b8' }}
              className="mx-auto mb-4 opacity-40"
            />
            <p className="text-lg font-medium" style={{ color: '#94a3b8' }}>
              Aucun item ne correspond aux filtres sélectionnés.
            </p>
          </div>
        )}

        {/* ── Source Attribution ──────────────────────────────────── */}
        <div
          className="mt-16 rounded-xl border p-6 text-center"
          style={{ background: '#16213e', borderColor: '#2a3a5c' }}
        >
          <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
            Basé sur le{' '}
            <a
              href="https://www.microsoft.com/en-us/microsoft-365/roadmap"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: '#0078d4' }}
            >
              Microsoft 365 Roadmap
            </a>{' '}
            public, les annonces Ignite/Build, et les{' '}
            <a
              href="https://powerbi.microsoft.com/en-us/blog/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: '#0078d4' }}
            >
              blogs officiels Microsoft
            </a>
            . Les dates sont indicatives et peuvent changer.
          </p>
        </div>
      </div>
    </div>
  )
}
