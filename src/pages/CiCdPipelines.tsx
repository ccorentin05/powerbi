import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch,
  GitPullRequest,
  Rocket,
  Copy,
  Check,
  ChevronRight,
  Clock,
  Shield,
  Server,
  ArrowRight,
  Settings,
  Key,
  Users,
  FileCode,
  RefreshCw,
  Search,
  Scale,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Layers,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface WorkflowTemplate {
  id: string
  title: string
  description: string
  trigger: string
  icon: typeof GitBranch
  color: string
  yaml: string
}

const templates: WorkflowTemplate[] = [
  {
    id: 'fabric-sync',
    title: 'Deploy via Fabric Git Sync',
    description:
      'Synchronise automatiquement vos items Fabric (rapports, semantic models, notebooks) quand du code est poussé sur main.',
    trigger: 'push on main (fabric/**)',
    icon: RefreshCw,
    color: '#0078d4',
    yaml: `name: Sync Fabric Items
on:
  push:
    branches: [main]
    paths: ['fabric/**']

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Get Azure Token
        id: auth
        run: |
          TOKEN=$(curl -s -X POST \\
            "https://login.microsoftonline.com/\${{ secrets.TENANT_ID }}/oauth2/v2.0/token" \\
            -d "client_id=\${{ secrets.CLIENT_ID }}" \\
            -d "client_secret=\${{ secrets.CLIENT_SECRET }}" \\
            -d "scope=https://api.fabric.microsoft.com/.default" \\
            -d "grant_type=client_credentials" | jq -r '.access_token')
          echo "token=$TOKEN" >> $GITHUB_OUTPUT

      - name: Trigger Fabric Git Sync
        run: |
          curl -X POST \\
            "https://api.fabric.microsoft.com/v1/workspaces/\${{ secrets.WORKSPACE_ID }}/git/updateFromGit" \\
            -H "Authorization: Bearer \${{ steps.auth.outputs.token }}" \\
            -H "Content-Type: application/json" \\
            -d '{"remoteCommitHash": "\${{ github.sha }}"}'`,
  },
  {
    id: 'scheduled-refresh',
    title: 'Automated Dataset Refresh',
    description:
      'Planifiez le rafraichissement de vos datasets Power BI du lundi au vendredi avec notification en cas d\'echec.',
    trigger: 'cron (Mon-Fri 6 AM UTC)',
    icon: Clock,
    color: '#f59e0b',
    yaml: `name: Scheduled Dataset Refresh
on:
  schedule:
    - cron: '0 6 * * 1-5'  # Mon-Fri at 6 AM UTC
  workflow_dispatch:

env:
  DATASET_ID: \${{ secrets.DATASET_ID }}
  GROUP_ID: \${{ secrets.GROUP_ID }}

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Get Token
        id: auth
        run: |
          TOKEN=$(curl -s -X POST \\
            "https://login.microsoftonline.com/\${{ secrets.TENANT_ID }}/oauth2/v2.0/token" \\
            -d "client_id=\${{ secrets.CLIENT_ID }}&client_secret=\${{ secrets.CLIENT_SECRET }}&scope=https://analysis.windows.net/powerbi/api/.default&grant_type=client_credentials" \\
            | jq -r '.access_token')
          echo "token=$TOKEN" >> $GITHUB_OUTPUT

      - name: Trigger Refresh
        run: |
          curl -X POST \\
            "https://api.powerbi.com/v1.0/myorg/groups/$GROUP_ID/datasets/$DATASET_ID/refreshes" \\
            -H "Authorization: Bearer \${{ steps.auth.outputs.token }}" \\
            -H "Content-Type: application/json" \\
            -d '{"notifyOption": "MailOnFailure"}'

      - name: Wait & Check Status
        run: |
          sleep 60
          STATUS=$(curl -s \\
            "https://api.powerbi.com/v1.0/myorg/groups/$GROUP_ID/datasets/$DATASET_ID/refreshes?\\$top=1" \\
            -H "Authorization: Bearer \${{ steps.auth.outputs.token }}" \\
            | jq -r '.value[0].status')
          echo "Refresh status: $STATUS"
          if [ "$STATUS" = "Failed" ]; then exit 1; fi`,
  },
  {
    id: 'export-tmdl',
    title: 'Export TMDL / BIM Definition',
    description:
      'Exportez quotidiennement la definition de votre semantic model (TMDL) dans Git via Tabular Editor CLI.',
    trigger: 'cron (daily midnight) + manual',
    icon: FileCode,
    color: '#10b981',
    yaml: `name: Export Semantic Model Definition
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:

jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0'

      - name: Install Tabular Editor CLI
        run: |
          dotnet tool install -g TabularEditor.TmdlCli

      - name: Export TMDL
        run: |
          tabular-editor-cli export \\
            --server "powerbi://api.powerbi.com/v1.0/myorg/\${{ secrets.WORKSPACE_NAME }}" \\
            --database "\${{ secrets.DATASET_NAME }}" \\
            --output-folder ./model/tmdl \\
            --auth-mode ServicePrincipal \\
            --tenant-id \${{ secrets.TENANT_ID }} \\
            --app-id \${{ secrets.CLIENT_ID }} \\
            --app-secret \${{ secrets.CLIENT_SECRET }}

      - name: Commit Changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add model/
          git diff --staged --quiet || git commit -m "chore: update semantic model definition"
          git push`,
  },
  {
    id: 'bpa-check',
    title: 'BPA (Best Practice Analyzer) on PR',
    description:
      'Analysez automatiquement votre modele semantique avec les Best Practice Rules a chaque Pull Request.',
    trigger: 'pull_request (model/**)',
    icon: Shield,
    color: '#8b5cf6',
    yaml: `name: BPA Check on PR
on:
  pull_request:
    paths: ['model/**']

jobs:
  bpa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0'

      - name: Install Tabular Editor CLI
        run: dotnet tool install -g TabularEditor.TmdlCli

      - name: Run BPA
        run: |
          tabular-editor-cli analyze \\
            --input-folder ./model/tmdl \\
            --rules ./rules/bpa-rules.json \\
            --output-format json \\
            --output bpa-results.json

      - name: Check Results
        run: |
          ERRORS=$(jq '[.[] | select(.severity == "Error")] | length' bpa-results.json)
          WARNINGS=$(jq '[.[] | select(.severity == "Warning")] | length' bpa-results.json)
          echo "Errors: $ERRORS, Warnings: $WARNINGS"
          if [ "$ERRORS" -gt "0" ]; then
            echo "::error::BPA found $ERRORS errors"
            jq '.[] | select(.severity == "Error") | "::error::(.objectName): (.message)"' -r bpa-results.json
            exit 1
          fi`,
  },
  {
    id: 'deploy-pipeline',
    title: 'Promote Dev -> Test -> Prod',
    description:
      'Deployez vos artefacts Power BI entre environnements via les Deployment Pipelines avec approbation manuelle.',
    trigger: 'workflow_dispatch (manual)',
    icon: Rocket,
    color: '#ef4444',
    yaml: `name: Promote to Production
on:
  workflow_dispatch:
    inputs:
      source_stage:
        description: 'Source stage'
        required: true
        default: 'Test'
        type: choice
        options: [Development, Test]

jobs:
  promote:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Get Token
        id: auth
        run: |
          TOKEN=$(curl -s -X POST \\
            "https://login.microsoftonline.com/\${{ secrets.TENANT_ID }}/oauth2/v2.0/token" \\
            -d "client_id=\${{ secrets.CLIENT_ID }}&client_secret=\${{ secrets.CLIENT_SECRET }}&scope=https://analysis.windows.net/powerbi/api/.default&grant_type=client_credentials" \\
            | jq -r '.access_token')
          echo "token=$TOKEN" >> $GITHUB_OUTPUT

      - name: Deploy via Deployment Pipeline
        run: |
          curl -X POST \\
            "https://api.powerbi.com/v1.0/myorg/pipelines/\${{ secrets.PIPELINE_ID }}/deploy" \\
            -H "Authorization: Bearer \${{ steps.auth.outputs.token }}" \\
            -H "Content-Type: application/json" \\
            -d '{
              "sourceStageOrder": \${{ inputs.source_stage == 'Development' && '0' || '1' }},
              "isBackwardDeployment": false,
              "options": {
                "allowOverwriteArtifact": true,
                "allowCreateArtifact": true
              }
            }'`,
  },
  {
    id: 'capacity-autoscale',
    title: 'Fabric Capacity Auto-Scale',
    description:
      'Optimisez vos couts en suspendant/reprenant automatiquement votre capacite Fabric selon un planning.',
    trigger: 'cron (business hours)',
    icon: Scale,
    color: '#f2c811',
    yaml: `name: Fabric Capacity Auto-Scale
on:
  schedule:
    - cron: '0 7 * * 1-5'   # Scale UP Mon-Fri 7 AM
    - cron: '0 20 * * 1-5'  # Scale DOWN Mon-Fri 8 PM
    - cron: '0 20 * * 5'    # Pause on Friday 8 PM
    - cron: '0 7 * * 1'     # Resume on Monday 7 AM

jobs:
  manage-capacity:
    runs-on: ubuntu-latest
    steps:
      - name: Determine Action
        id: action
        run: |
          HOUR=$(date -u +%H)
          DOW=$(date -u +%u)
          if [ "$DOW" = "5" ] && [ "$HOUR" = "20" ]; then
            echo "action=suspend" >> $GITHUB_OUTPUT
          elif [ "$DOW" = "1" ] && [ "$HOUR" = "07" ]; then
            echo "action=resume" >> $GITHUB_OUTPUT
          elif [ "$HOUR" = "07" ]; then
            echo "action=scale-up" >> $GITHUB_OUTPUT
          else
            echo "action=scale-down" >> $GITHUB_OUTPUT
          fi

      - name: Get Token
        id: auth
        run: |
          TOKEN=$(curl -s -X POST \\
            "https://login.microsoftonline.com/\${{ secrets.TENANT_ID }}/oauth2/v2.0/token" \\
            -d "client_id=\${{ secrets.CLIENT_ID }}&client_secret=\${{ secrets.CLIENT_SECRET }}&scope=https://management.azure.com/.default&grant_type=client_credentials" \\
            | jq -r '.access_token')
          echo "token=$TOKEN" >> $GITHUB_OUTPUT

      - name: Execute Action
        run: |
          BASE="https://management.azure.com/subscriptions/\${{ secrets.SUB_ID }}/resourceGroups/\${{ secrets.RG }}/providers/Microsoft.Fabric/capacities/\${{ secrets.CAPACITY_NAME }}"
          ACTION="\${{ steps.action.outputs.action }}"
          if [ "$ACTION" = "suspend" ]; then
            curl -X POST "$BASE/suspend?api-version=2023-11-01" -H "Authorization: Bearer \${{ steps.auth.outputs.token }}"
          elif [ "$ACTION" = "resume" ]; then
            curl -X POST "$BASE/resume?api-version=2023-11-01" -H "Authorization: Bearer \${{ steps.auth.outputs.token }}"
          fi`,
  },
]

interface OverviewItem {
  icon: typeof GitBranch
  title: string
  description: string
  color: string
  features: string[]
}

const overviewItems: OverviewItem[] = [
  {
    icon: GitBranch,
    title: 'Fabric Git Integration',
    description: 'Integration native de Git dans Microsoft Fabric pour le versioning et la collaboration.',
    color: '#0078d4',
    features: ['Branching natif', 'Sync bidirectionnel', 'Conflict resolution'],
  },
  {
    icon: Layers,
    title: 'Azure DevOps Pipelines',
    description: 'Pipelines CI/CD classiques avec Azure DevOps pour les organisations Microsoft.',
    color: '#3b82f6',
    features: ['YAML pipelines', 'Release gates', 'Approvals'],
  },
  {
    icon: Terminal,
    title: 'GitHub Actions',
    description: 'Workflows automatises directement dans GitHub avec integration Fabric & Power BI.',
    color: '#10b981',
    features: ['Marketplace actions', 'Matrix builds', 'Secrets management'],
  },
  {
    icon: Rocket,
    title: 'Deployment Pipelines',
    description: 'Pipelines de deploiement natifs Power BI : Dev, Test, Production.',
    color: '#f2c811',
    features: ['3 stages', 'Rules de deploiement', 'Comparaison de contenu'],
  },
]

interface SetupStep {
  step: number
  title: string
  description: string
  icon: typeof Key
  details: string[]
}

const setupSteps: SetupStep[] = [
  {
    step: 1,
    title: 'Enregistrer une App Azure AD',
    description: 'Creez un Service Principal dans Entra ID (Azure AD) pour l\'authentification.',
    icon: Key,
    details: [
      'Allez dans Entra ID > App registrations > New registration',
      'Notez le Client ID et Tenant ID',
      'Creez un Client Secret dans Certificates & secrets',
    ],
  },
  {
    step: 2,
    title: 'Accorder les permissions API',
    description: 'Configurez les permissions Power BI & Fabric necessaires.',
    icon: Shield,
    details: [
      'API permissions > Add > Power BI Service',
      'Dataset.ReadWrite.All, Workspace.ReadWrite.All',
      'Grant admin consent',
    ],
  },
  {
    step: 3,
    title: 'Ajouter le SP au workspace',
    description: 'Donnez acces au Service Principal dans le workspace Power BI / Fabric.',
    icon: Users,
    details: [
      'Workspace Settings > Access > Add member',
      'Recherchez le nom de votre App',
      'Attribuez le role Admin ou Contributor',
    ],
  },
  {
    step: 4,
    title: 'Configurer les GitHub Secrets',
    description: 'Stockez les credentials en toute securite dans GitHub.',
    icon: Settings,
    details: [
      'Settings > Secrets and variables > Actions',
      'TENANT_ID, CLIENT_ID, CLIENT_SECRET',
      'WORKSPACE_ID, DATASET_ID, GROUP_ID',
    ],
  },
  {
    step: 5,
    title: 'Creer le fichier workflow',
    description: 'Ajoutez le YAML dans .github/workflows/ de votre repo.',
    icon: FileCode,
    details: [
      'Creez .github/workflows/deploy.yml',
      'Copiez un des templates ci-dessus',
      'Push sur main pour declencher',
    ],
  },
]

interface FabricGitItem {
  name: string
  supported: boolean
  note?: string
}

const fabricGitItems: FabricGitItem[] = [
  { name: 'Semantic Models (datasets)', supported: true },
  { name: 'Reports (.pbir)', supported: true },
  { name: 'Notebooks', supported: true },
  { name: 'Pipelines (Data Factory)', supported: true },
  { name: 'Lakehouses (metadata)', supported: true },
  { name: 'Warehouses (metadata)', supported: true },
  { name: 'Spark Job Definitions', supported: true },
  { name: 'Dashboards', supported: false, note: 'Non supporte actuellement' },
  { name: 'Dataflows Gen1', supported: false, note: 'Utilisez Gen2' },
  { name: 'Paginated Reports', supported: false, note: 'En preview' },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
      style={{
        background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(242,200,17,0.1)',
        color: copied ? '#10b981' : '#f2c811',
        border: `1px solid ${copied ? '#10b981' : 'rgba(242,200,17,0.3)'}`,
      }}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copie !' : 'Copier'}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Section: Overview                                                  */
/* ------------------------------------------------------------------ */

function OverviewSection() {
  return (
    <section className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-pbi-text mb-3"
      >
        Paysage CI/CD pour Power BI & Fabric
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-pbi-muted mb-8 max-w-3xl"
      >
        Plusieurs approches complementaires existent pour automatiser le cycle de vie de vos solutions
        Power BI et Fabric. Voici les principales options disponibles.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {overviewItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl p-6 border border-pbi-border/60 bg-pbi-card hover:bg-pbi-card-hover transition-colors"
          >
            <div className="flex items-start gap-4">
              <div
                className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
                style={{ background: `${item.color}15` }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-pbi-text mb-1">{item.title}</h3>
                <p className="text-sm text-pbi-muted mb-3">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.features.map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-md text-xs font-medium"
                      style={{
                        background: `${item.color}15`,
                        color: item.color,
                        border: `1px solid ${item.color}30`,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section: Workflow Templates                                        */
/* ------------------------------------------------------------------ */

function WorkflowCard({ template, index }: { template: WorkflowTemplate; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl border border-pbi-border/60 bg-pbi-card overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-pbi-card-hover transition-colors"
      >
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
          style={{ background: `${template.color}15` }}
        >
          <template.icon className="w-5 h-5" style={{ color: template.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-pbi-text">{template.title}</h3>
          <p className="text-sm text-pbi-muted mt-0.5 line-clamp-1">{template.description}</p>
        </div>
        <span
          className="px-2.5 py-1 rounded-md text-xs font-mono shrink-0 hidden sm:block"
          style={{
            background: `${template.color}15`,
            color: template.color,
            border: `1px solid ${template.color}30`,
          }}
        >
          {template.trigger}
        </span>
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-pbi-muted shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <p className="text-sm text-pbi-muted mb-4">{template.description}</p>

              {/* YAML Code Block */}
              <div className="rounded-lg overflow-hidden border border-pbi-border/40">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1117] border-b border-pbi-border/30">
                  <span className="text-xs font-mono text-pbi-muted">.github/workflows/</span>
                  <CopyButton text={template.yaml} />
                </div>
                <pre className="p-4 overflow-x-auto bg-[#0d1117] text-sm leading-relaxed">
                  <code className="text-pbi-text font-mono whitespace-pre">{template.yaml}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function TemplatesSection() {
  return (
    <section className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-pbi-text mb-3"
      >
        Templates GitHub Actions
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-pbi-muted mb-8 max-w-3xl"
      >
        Cliquez sur chaque workflow pour voir le YAML complet. Copiez-le directement dans votre repo.
      </motion.p>

      <div className="flex flex-col gap-4">
        {templates.map((t, i) => (
          <WorkflowCard key={t.id} template={t} index={i} />
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section: Setup Guide                                               */
/* ------------------------------------------------------------------ */

function SetupSection() {
  return (
    <section className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-pbi-text mb-3"
      >
        Guide de configuration
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-pbi-muted mb-8 max-w-3xl"
      >
        Suivez ces 5 etapes pour configurer GitHub Actions avec Power BI & Fabric.
      </motion.p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-6 bottom-6 w-px bg-pbi-border/50 hidden md:block" />

        <div className="flex flex-col gap-5">
          {setupSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-5"
            >
              {/* Step number */}
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 shrink-0 z-10">
                <span className="text-primary font-bold text-lg">{step.step}</span>
              </div>

              {/* Content */}
              <div className="flex-1 rounded-xl border border-pbi-border/60 bg-pbi-card p-5">
                <div className="flex items-center gap-3 mb-2">
                  <step.icon className="w-4.5 h-4.5 text-primary" />
                  <h3 className="text-base font-semibold text-pbi-text">{step.title}</h3>
                </div>
                <p className="text-sm text-pbi-muted mb-3">{step.description}</p>
                <ul className="space-y-1.5">
                  {step.details.map((d, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-pbi-muted">
                      <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section: Azure DevOps Comparison                                   */
/* ------------------------------------------------------------------ */

function AzureDevOpsSection() {
  const comparisons = [
    { feature: 'Git Integration', github: 'Native', azureDevOps: 'Native', neutral: true },
    { feature: 'Marketplace / Extensions', github: '15 000+ actions', azureDevOps: '1 000+ extensions', neutral: false },
    { feature: 'YAML Pipelines', github: 'Oui', azureDevOps: 'Oui', neutral: true },
    { feature: 'Environments / Gates', github: 'Oui', azureDevOps: 'Oui (plus avance)', neutral: false },
    { feature: 'Integration Microsoft', github: 'Via API', azureDevOps: 'Native (meme ecosysteme)', neutral: false },
    { feature: 'Prix (repos prives)', github: '2 000 min/mois gratuits', azureDevOps: '1 800 min/mois gratuits', neutral: false },
    { feature: 'Communaute', github: 'Plus large', azureDevOps: 'Entreprises Microsoft', neutral: false },
  ]

  return (
    <section className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-pbi-text mb-3"
      >
        GitHub Actions vs Azure DevOps
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-pbi-muted mb-8 max-w-3xl"
      >
        Les deux plateformes sont valides. Azure DevOps offre une integration plus profonde avec
        l'ecosysteme Microsoft, tandis que GitHub Actions est plus populaire et flexible.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border border-pbi-border/60 bg-pbi-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pbi-border/40">
                <th className="text-left px-5 py-3.5 text-sm font-semibold text-pbi-muted">Fonctionnalite</th>
                <th className="text-left px-5 py-3.5 text-sm font-semibold text-pbi-text">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> GitHub Actions
                  </span>
                </th>
                <th className="text-left px-5 py-3.5 text-sm font-semibold text-pbi-text">
                  <span className="flex items-center gap-2">
                    <Server className="w-4 h-4" /> Azure DevOps
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-pbi-border/20 ${i % 2 === 0 ? 'bg-pbi-card' : 'bg-pbi-darker/30'}`}
                >
                  <td className="px-5 py-3 text-sm text-pbi-muted font-medium">{row.feature}</td>
                  <td className="px-5 py-3 text-sm text-pbi-text">{row.github}</td>
                  <td className="px-5 py-3 text-sm text-pbi-text">{row.azureDevOps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section: Fabric Git Integration                                    */
/* ------------------------------------------------------------------ */

function FabricGitSection() {
  return (
    <section className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-pbi-text mb-3"
      >
        Fabric Git Integration
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-pbi-muted mb-8 max-w-3xl"
      >
        Microsoft Fabric offre une integration Git native permettant de versionner vos items
        directement dans Azure DevOps ou GitHub.
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supported Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-pbi-border/60 bg-pbi-card p-6"
        >
          <h3 className="text-lg font-semibold text-pbi-text mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-fabric" />
            Items supportes
          </h3>
          <div className="space-y-2.5">
            {fabricGitItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 text-sm"
              >
                {item.supported ? (
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                )}
                <span className={item.supported ? 'text-pbi-text' : 'text-pbi-muted'}>
                  {item.name}
                </span>
                {item.note && (
                  <span className="text-xs text-pbi-muted italic ml-auto">{item.note}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Branch Strategy & Tips */}
        <div className="flex flex-col gap-6">
          {/* Branch strategy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-pbi-border/60 bg-pbi-card p-6"
          >
            <h3 className="text-lg font-semibold text-pbi-text mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-fabric" />
              Strategie de branches
            </h3>
            <div className="flex items-center gap-3 mb-4">
              {['dev', 'test', 'main'].map((branch, i) => (
                <div key={branch} className="flex items-center gap-3">
                  <div
                    className="px-4 py-2 rounded-lg text-sm font-mono font-semibold"
                    style={{
                      background:
                        branch === 'dev'
                          ? 'rgba(59,130,246,0.15)'
                          : branch === 'test'
                            ? 'rgba(245,158,11,0.15)'
                            : 'rgba(16,185,129,0.15)',
                      color:
                        branch === 'dev' ? '#3b82f6' : branch === 'test' ? '#f59e0b' : '#10b981',
                      border: `1px solid ${
                        branch === 'dev'
                          ? 'rgba(59,130,246,0.3)'
                          : branch === 'test'
                            ? 'rgba(245,158,11,0.3)'
                            : 'rgba(16,185,129,0.3)'
                      }`,
                    }}
                  >
                    {branch}
                  </div>
                  {i < 2 && <ArrowRight className="w-4 h-4 text-pbi-muted" />}
                </div>
              ))}
            </div>
            <ul className="space-y-2 text-sm text-pbi-muted">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <span>Chaque branche est liee a un workspace Fabric</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <span>Les PRs permettent la revue avant promotion</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <span>Combinez avec Deployment Pipelines pour le meilleur des deux mondes</span>
              </li>
            </ul>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-warning/30 bg-warning/5 p-6"
          >
            <h3 className="text-lg font-semibold text-pbi-text mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Limitations & conseils
            </h3>
            <ul className="space-y-2 text-sm text-pbi-muted">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                <span>Un seul workspace peut etre connecte a une branche a la fois</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                <span>Les donnees (tables) ne sont pas versionnees, uniquement les metadonnees</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                <span>Les conflits de merge doivent etre resolus cote Git avant sync</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                <span>Testez toujours sur un workspace de dev avant de connecter la prod</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function CiCdPipelines() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20">
            <GitPullRequest className="w-7 h-7 text-primary" />
          </div>
        </div>
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(135deg, #f2c811 0%, #0078d4 50%, #10b981 100%)',
          }}
        >
          CI/CD & GitHub Actions
        </h1>
        <p className="text-lg text-pbi-muted max-w-2xl mx-auto">
          Automatisez le deploiement de vos solutions Power BI & Fabric
        </p>

        {/* Pipeline visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-3 mt-8"
        >
          {[
            { label: 'Code', color: '#3b82f6' },
            { label: 'Build', color: '#f59e0b' },
            { label: 'Test', color: '#8b5cf6' },
            { label: 'Deploy', color: '#10b981' },
            { label: 'Monitor', color: '#f2c811' },
          ].map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.12 }}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{
                  background: `${stage.color}15`,
                  color: stage.color,
                  border: `1px solid ${stage.color}40`,
                }}
              >
                {stage.label}
              </motion.div>
              {i < 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.12 }}
                >
                  <ArrowRight className="w-4 h-4 text-pbi-muted" />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Sections */}
      <OverviewSection />
      <TemplatesSection />
      <SetupSection />
      <AzureDevOpsSection />
      <FabricGitSection />
    </div>
  )
}
