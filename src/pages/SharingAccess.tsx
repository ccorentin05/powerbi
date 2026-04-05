import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Shield,
  Users,
  Share2,
  Lock,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Building2,
  Code2,
  Database,
  KeyRound,
  Tag,
  FolderTree,
  GitBranch,
  Activity,
  Search,
  BarChart3,
  Settings,
  ArrowRight,
  Info,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SharingMethod {
  title: string
  icon: LucideIcon
  description: string
  pros: string[]
  cons: string[]
  whenToUse: string
  warning?: string
}

interface RLSPattern {
  name: string
  description: string
  dax: string
}

interface CommonMistake {
  title: string
  description: string
  fix: string
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const WORKSPACE_ROLES = ['Admin', 'Member', 'Contributor', 'Viewer'] as const

const ROLE_ACTIONS: { action: string; admin: boolean; member: boolean; contributor: boolean; viewer: boolean }[] = [
  { action: 'Create, edit & delete content', admin: true, member: true, contributor: true, viewer: false },
  { action: 'Manage workspace settings', admin: true, member: false, contributor: false, viewer: false },
  { action: 'Add/remove members', admin: true, member: true, contributor: false, viewer: false },
  { action: 'Share reports & dashboards', admin: true, member: true, contributor: false, viewer: false },
  { action: 'Build on datasets (Build permission)', admin: true, member: true, contributor: true, viewer: false },
  { action: 'View & interact with content', admin: true, member: true, contributor: true, viewer: true },
  { action: 'Publish apps from workspace', admin: true, member: true, contributor: false, viewer: false },
  { action: 'Update app content', admin: true, member: true, contributor: true, viewer: false },
  { action: 'Create dataflows', admin: true, member: true, contributor: true, viewer: false },
  { action: 'Schedule data refresh', admin: true, member: true, contributor: true, viewer: false },
  { action: 'Configure gateway connections', admin: true, member: false, contributor: false, viewer: false },
  { action: 'Manage deployment pipelines', admin: true, member: true, contributor: false, viewer: false },
]

const SHARING_METHODS: SharingMethod[] = [
  {
    title: 'Direct Sharing',
    icon: Share2,
    description: 'Share specific reports or dashboards directly with individual users or security groups.',
    pros: ['Quick and simple for ad-hoc sharing', 'Granular per-item control', 'Can set read-only or reshare permissions'],
    cons: ['Hard to manage at scale', 'No bundling of related content', 'Easy to lose track of who has access'],
    whenToUse: 'Small teams, one-off sharing, quick access for specific stakeholders.',
  },
  {
    title: 'Power BI Apps',
    icon: Building2,
    description: 'Bundle workspace content into a curated app distributed to large audiences.',
    pros: ['Curated experience for consumers', 'Automatic updates when content changes', 'Audience-based access control', 'Navigation customization'],
    cons: ['Requires Pro or PPU license for authors', 'One app per workspace', 'Consumers need Pro/PPU or Premium capacity'],
    whenToUse: 'Department-wide or org-wide distribution of polished dashboards.',
  },
  {
    title: 'Workspace Access',
    icon: Users,
    description: 'Grant a workspace role to users, giving them access to all workspace content.',
    pros: ['Simple for dev teams', 'Automatic access to new content', 'Clear permission model'],
    cons: ['All-or-nothing within the workspace', 'Not suitable for end-user consumption', 'Can lead to over-sharing'],
    whenToUse: 'Development teams, analysts who need to collaborate on content creation.',
  },
  {
    title: 'Publish to Web',
    icon: Globe,
    description: 'Generate a public embed code accessible by anyone on the internet.',
    pros: ['No authentication required', 'Works on any website', 'Free to consume'],
    cons: ['NO security whatsoever', 'Anyone with the URL can see the data', 'Cannot use RLS'],
    whenToUse: 'Public data only -- press releases, open data portals, public dashboards.',
    warning: 'NEVER use for confidential, internal, or sensitive data. The embed URL is public and indexable by search engines.',
  },
  {
    title: 'Embed in SharePoint / Teams',
    icon: Building2,
    description: 'Embed Power BI reports in SharePoint Online pages or Microsoft Teams tabs.',
    pros: ['Seamless integration with M365', 'Users stay in familiar tools', 'SSO authentication', 'Respects RLS'],
    cons: ['Requires Pro/PPU or Premium', 'Limited interactivity in Teams mobile', 'SharePoint page load can be slow'],
    whenToUse: 'Organizations already using M365, team dashboards, project reporting.',
  },
  {
    title: 'Power BI Embedded',
    icon: Code2,
    description: 'Embed analytics in custom applications using the Power BI REST API and JavaScript SDK.',
    pros: ['Full white-label capability', 'App-owns-data or user-owns-data', 'Pay per capacity, not per user', 'Complete API control'],
    cons: ['Requires development effort', 'Capacity cost can be significant', 'More complex auth flow'],
    whenToUse: 'ISVs, custom portals, customer-facing analytics, apps that need branded BI.',
  },
  {
    title: 'OneLake Data Sharing',
    icon: Database,
    description: 'Share data across workspaces and tenants via OneLake shortcuts in Microsoft Fabric.',
    pros: ['No data duplication', 'Real-time access to source data', 'Cross-workspace and cross-tenant', 'Works with all Fabric engines'],
    cons: ['Requires Fabric capacity', 'Governance complexity increases', 'Limited to Fabric-enabled tenants'],
    whenToUse: 'Multi-team data mesh architectures, cross-domain data sharing in Fabric.',
  },
]

const STATIC_RLS_EXAMPLE: RLSPattern = {
  name: 'Static RLS',
  description: 'Fixed roles with hardcoded DAX filters. Each role sees a predefined subset of data.',
  dax: `// Role: "France Sales"
// Table: Sales
// Filter expression:
[Country] = "France"

// Role: "Germany Sales"
[Country] = "Germany"`,
}

const DYNAMIC_RLS_PATTERNS: RLSPattern[] = [
  {
    name: 'Single Table (USERPRINCIPALNAME)',
    description: 'Filter a fact table directly based on the logged-in user email.',
    dax: `// Table: Sales
// Filter expression:
[SalesPersonEmail] = USERPRINCIPALNAME()`,
  },
  {
    name: 'Lookup Table Pattern',
    description: 'Use a security mapping table that links users to regions/departments.',
    dax: `// Table: UserSecurity
// Columns: UserEmail, Region
// Filter expression on UserSecurity:
[UserEmail] = USERPRINCIPALNAME()

// Relationship: UserSecurity[Region] -> Sales[Region]
// The filter propagates through the relationship`,
  },
  {
    name: 'Hierarchical Security',
    description: 'Managers see their data plus all subordinates. Uses PATH functions.',
    dax: `// Table: Employee
// Column: ManagerPath (created with PATH)
// Filter expression:
PATHCONTAINS(
    [ManagerPath],
    LOOKUPVALUE(
        Employee[EmployeeID],
        Employee[Email],
        USERPRINCIPALNAME()
    )
)`,
  },
  {
    name: 'CUSTOMDATA Pattern',
    description: 'For embedded scenarios where you pass custom context at runtime.',
    dax: `// Table: Sales
// Filter expression:
[TenantID] = CUSTOMDATA()

// The app passes TenantID via the embed token
// Useful for multi-tenant embedded solutions`,
  },
]

const SENSITIVITY_LABELS = [
  { label: 'Public', color: '#10b981', description: 'No restrictions. Data is intended for public consumption.', controls: 'None' },
  { label: 'General', color: '#3b82f6', description: 'Internal business data not intended for public.', controls: 'Light watermark on exports' },
  { label: 'Confidential', color: '#f59e0b', description: 'Sensitive business data. Limited distribution.', controls: 'Export restrictions, encryption, watermarks, access logging' },
  { label: 'Highly Confidential', color: '#ef4444', description: 'Most sensitive data. Strict need-to-know basis.', controls: 'Full encryption, no export, strict access, DLP policies' },
]

const ACCESS_PATTERNS = [
  { scenario: 'Small development team (2-10)', recommendation: 'Workspace access with Member/Contributor roles', icon: Users, color: '#10b981' },
  { scenario: 'Department (50-500 users)', recommendation: 'Power BI App with audience groups + RLS', icon: Building2, color: '#3b82f6' },
  { scenario: 'External partners / B2B', recommendation: 'Azure AD B2B + RLS + sensitivity labels', icon: KeyRound, color: '#f59e0b' },
  { scenario: 'Public / open data', recommendation: 'Publish to web (only for non-sensitive data!)', icon: Globe, color: '#ef4444' },
  { scenario: 'Custom application / ISV', recommendation: 'Power BI Embedded (app-owns-data)', icon: Code2, color: '#8b5cf6' },
]

const COMMON_MISTAKES: CommonMistake[] = [
  {
    title: 'Sharing with "Allow recipients to share" by default',
    description: 'When you share a report and leave the "Allow recipients to share" checkbox on, anyone you share with can reshare to anyone else. This quickly spirals out of control.',
    fix: 'Uncheck "Allow recipients to share" unless explicitly needed. Use Apps with defined audiences instead.',
  },
  {
    title: 'Using Publish to Web for confidential data',
    description: 'Publish to web creates a completely public URL with zero authentication. Search engines can index it. Anyone with the link sees everything.',
    fix: 'Never use Publish to web for anything internal or sensitive. Use Apps, direct sharing, or Embedded instead.',
  },
  {
    title: 'Not setting up RLS before sharing',
    description: 'If you share a dataset without RLS, every user sees all data. Adding RLS later means users already have full access cached.',
    fix: 'Always configure and test RLS before publishing to the Service. Use "View as role" to verify.',
  },
  {
    title: 'Giving everyone the Admin role',
    description: 'Admin role lets users delete the workspace, remove other admins, and change all settings. One mistake can destroy months of work.',
    fix: 'Follow least-privilege: Viewer for consumers, Contributor for builders, Member for team leads, Admin for workspace owners only.',
  },
  {
    title: 'Managing access with individual accounts instead of groups',
    description: 'Adding users one by one creates a maintenance nightmare. When someone leaves, you have to find and remove them from every workspace.',
    fix: 'Use Azure AD security groups or M365 groups. Manage membership in Azure AD, and permissions cascade automatically.',
  },
  {
    title: 'Ignoring CALCULATE + ALL bypasses in RLS',
    description: 'A measure using CALCULATE with ALL or REMOVEFILTERS can bypass RLS filters, exposing data the user should not see.',
    fix: 'Audit all measures for ALL/REMOVEFILTERS usage. Use ALLSELECTED instead where possible, and test thoroughly with "View as role".',
  },
  {
    title: 'Not using deployment pipelines for promotion',
    description: 'Directly editing production content risks breaking reports for all users. No rollback, no testing, no approval.',
    fix: 'Use deployment pipelines (Dev -> Test -> Prod) with proper rules. See CI/CD Pipelines page for details.',
  },
]

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
}

/* ------------------------------------------------------------------ */
/*  Small reusable components                                          */
/* ------------------------------------------------------------------ */

function SectionHeading({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-pbi-text">{title}</h2>
      </div>
      {subtitle && <p className="text-pbi-muted ml-13">{subtitle}</p>}
    </div>
  )
}

function RoleBadge({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
  ) : (
    <XCircle className="w-5 h-5 text-danger/40 mx-auto" />
  )
}

function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-pbi-border">
      {title && (
        <div className="px-4 py-2 bg-pbi-darker text-xs font-mono text-pbi-muted border-b border-pbi-border">
          {title}
        </div>
      )}
      <pre className="p-4 bg-pbi-darker/50 text-sm font-mono text-pbi-text overflow-x-auto whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  )
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-danger/10 border border-danger/30">
      <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
      <div className="text-sm text-danger">{children}</div>
    </div>
  )
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-info/10 border border-info/30">
      <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
      <div className="text-sm text-info">{children}</div>
    </div>
  )
}

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30">
      <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div className="text-sm text-primary">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Collapsible section wrapper                                        */
/* ------------------------------------------------------------------ */

function CollapsibleSection({
  id,
  icon: Icon,
  title,
  subtitle,
  children,
  defaultOpen = false,
}: {
  id: string
  icon: LucideIcon
  title: string
  subtitle?: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeInUp}
      custom={0}
      className="bg-pbi-card rounded-xl border border-pbi-border overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-pbi-card-hover transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-pbi-text">{title}</h2>
            {subtitle && <p className="text-sm text-pbi-muted mt-1">{subtitle}</p>}
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-pbi-muted" /> : <ChevronDown className="w-5 h-5 text-pbi-muted" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 1: Workspace Roles                                         */
/* ------------------------------------------------------------------ */

function WorkspaceRolesSection() {
  return (
    <CollapsibleSection
      id="workspace-roles"
      icon={Users}
      title="Workspace Roles & Permissions"
      subtitle="Who can do what in a Power BI workspace"
      defaultOpen={true}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pbi-border">
              <th className="text-left py-3 px-4 text-pbi-muted font-medium">Action</th>
              {WORKSPACE_ROLES.map((role) => (
                <th key={role} className="py-3 px-4 text-center text-pbi-muted font-medium">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody variants={stagger} initial="hidden" animate="visible">
            {ROLE_ACTIONS.map((row, i) => (
              <motion.tr
                key={row.action}
                variants={fadeInUp}
                custom={i}
                className="border-b border-pbi-border/50 hover:bg-pbi-card-hover/50 transition-colors"
              >
                <td className="py-3 px-4 text-pbi-text">{row.action}</td>
                <td className="py-3 px-4"><RoleBadge allowed={row.admin} /></td>
                <td className="py-3 px-4"><RoleBadge allowed={row.member} /></td>
                <td className="py-3 px-4"><RoleBadge allowed={row.contributor} /></td>
                <td className="py-3 px-4"><RoleBadge allowed={row.viewer} /></td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
      <TipBox>
        Follow the principle of least privilege. Start with <strong>Viewer</strong> and only escalate when the user genuinely needs more capabilities.
        Use <strong>Azure AD security groups</strong> instead of individual accounts.
      </TipBox>
    </CollapsibleSection>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 2: Sharing Methods                                         */
/* ------------------------------------------------------------------ */

function SharingMethodsSection() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <CollapsibleSection
      id="sharing-methods"
      icon={Share2}
      title="Sharing Methods"
      subtitle="Choose the right sharing approach for your scenario"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {SHARING_METHODS.map((method, i) => {
          const Icon = method.icon
          const isExpanded = expanded === method.title
          return (
            <motion.div
              key={method.title}
              variants={fadeInUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`rounded-lg border transition-colors cursor-pointer ${
                isExpanded
                  ? 'border-primary/50 bg-pbi-card-hover'
                  : 'border-pbi-border bg-pbi-darker/30 hover:bg-pbi-card-hover/50'
              }`}
              onClick={() => setExpanded(isExpanded ? null : method.title)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-2">
                  <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-pbi-text">{method.title}</h3>
                    <p className="text-sm text-pbi-muted mt-1">{method.description}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-pbi-muted shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-pbi-muted shrink-0" />
                  )}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-3 text-sm">
                        <div>
                          <span className="text-success font-medium">Pros:</span>
                          <ul className="mt-1 space-y-1">
                            {method.pros.map((p) => (
                              <li key={p} className="flex items-start gap-2 text-pbi-muted">
                                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-danger font-medium">Cons:</span>
                          <ul className="mt-1 space-y-1">
                            {method.cons.map((c) => (
                              <li key={c} className="flex items-start gap-2 text-pbi-muted">
                                <XCircle className="w-3.5 h-3.5 text-danger shrink-0 mt-0.5" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-info font-medium">When to use:</span>
                          <p className="text-pbi-muted mt-1">{method.whenToUse}</p>
                        </div>
                        {method.warning && (
                          <WarningBox>{method.warning}</WarningBox>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>
    </CollapsibleSection>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 3: Row-Level Security                                      */
/* ------------------------------------------------------------------ */

function RLSSection() {
  const [activePattern, setActivePattern] = useState(0)

  return (
    <CollapsibleSection
      id="rls"
      icon={Lock}
      title="Row-Level Security (RLS)"
      subtitle="Restrict data access at the row level based on user identity"
    >
      {/* Static RLS */}
      <div>
        <h3 className="text-lg font-semibold text-pbi-text mb-3">Static RLS</h3>
        <p className="text-sm text-pbi-muted mb-3">{STATIC_RLS_EXAMPLE.description}</p>
        <CodeBlock code={STATIC_RLS_EXAMPLE.dax} title="Static RLS - Fixed Role Filters" />
      </div>

      {/* Dynamic RLS Patterns */}
      <div>
        <h3 className="text-lg font-semibold text-pbi-text mb-3">Dynamic RLS Patterns</h3>
        <p className="text-sm text-pbi-muted mb-4">
          Dynamic RLS uses the identity of the current user to filter data at query time. One role definition handles all users.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {DYNAMIC_RLS_PATTERNS.map((pattern, i) => (
            <button
              key={pattern.name}
              onClick={() => setActivePattern(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activePattern === i
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-pbi-darker text-pbi-muted border border-pbi-border hover:border-pbi-muted'
              }`}
            >
              {pattern.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePattern}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-pbi-muted mb-3">{DYNAMIC_RLS_PATTERNS[activePattern].description}</p>
            <CodeBlock
              code={DYNAMIC_RLS_PATTERNS[activePattern].dax}
              title={`Dynamic RLS - ${DYNAMIC_RLS_PATTERNS[activePattern].name}`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Testing */}
      <div>
        <h3 className="text-lg font-semibold text-pbi-text mb-3">Testing RLS</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border">
            <h4 className="font-medium text-pbi-text mb-2">In Power BI Desktop</h4>
            <ol className="text-sm text-pbi-muted space-y-1 list-decimal list-inside">
              <li>Modeling tab &rarr; "View as"</li>
              <li>Select the role to test</li>
              <li>Optionally check "Other user" and enter an email</li>
              <li>Verify the data is filtered correctly</li>
              <li>Check all pages and visuals</li>
            </ol>
          </div>
          <div className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border">
            <h4 className="font-medium text-pbi-text mb-2">In Power BI Service</h4>
            <ol className="text-sm text-pbi-muted space-y-1 list-decimal list-inside">
              <li>Open the dataset settings</li>
              <li>Security &rarr; select a role</li>
              <li>"Test as role" with a specific user</li>
              <li>Verify data restrictions apply</li>
              <li>Test with multiple roles if user has several</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Performance & Pitfalls */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-pbi-text mb-3">Performance Tips</h3>
          <ul className="text-sm text-pbi-muted space-y-2">
            <li className="flex gap-2"><Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />Keep filter expressions simple -- avoid complex DAX in RLS</li>
            <li className="flex gap-2"><Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />Use the lookup table pattern for large user bases</li>
            <li className="flex gap-2"><Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />Avoid bi-directional relationships if possible</li>
            <li className="flex gap-2"><Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />Pre-aggregate security mappings in Power Query</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-danger mb-3">Common Pitfalls</h3>
          <ul className="text-sm text-pbi-muted space-y-2">
            <li className="flex gap-2"><AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />Blank results when RLS is not configured for a user's role</li>
            <li className="flex gap-2"><AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" /><code className="text-danger/80">CALCULATE + ALL()</code> can bypass RLS filters</li>
            <li className="flex gap-2"><AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />RLS does not apply to workspace Admins/Members</li>
            <li className="flex gap-2"><AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />DirectQuery RLS needs careful testing with source credentials</li>
          </ul>
        </div>
      </div>

      <WarningBox>
        <strong>Critical:</strong> Workspace Admins and Members bypass RLS entirely. They always see all data.
        Only Viewer role and App consumers are subject to RLS. Design your workspace roles accordingly.
      </WarningBox>
    </CollapsibleSection>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 4: Object-Level Security                                   */
/* ------------------------------------------------------------------ */

function OLSSection() {
  return (
    <CollapsibleSection
      id="ols"
      icon={EyeOff}
      title="Object-Level Security (OLS)"
      subtitle="Hide entire tables or columns from specific roles"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-pbi-text">What is OLS?</h3>
          <p className="text-sm text-pbi-muted">
            Object-Level Security lets you restrict access to entire tables or individual columns.
            Users in a restricted role cannot see the table/column in field lists or use it in visuals.
          </p>
          <h4 className="font-medium text-pbi-text">Setup (Tabular Editor)</h4>
          <ol className="text-sm text-pbi-muted space-y-1 list-decimal list-inside">
            <li>Open your model in Tabular Editor</li>
            <li>Create or select a role</li>
            <li>Navigate to the table or column</li>
            <li>Set the <code className="text-primary">Object Level Security</code> property to <code className="text-primary">None</code> or <code className="text-primary">Read</code></li>
            <li>Save and deploy</li>
          </ol>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-pbi-text">Use Cases</h3>
          <ul className="text-sm text-pbi-muted space-y-2">
            <li className="flex gap-2"><Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" /><strong>Salary data:</strong> HR sees salary columns, others don't</li>
            <li className="flex gap-2"><Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" /><strong>PII fields:</strong> Hide SSN, personal addresses from non-authorized roles</li>
            <li className="flex gap-2"><Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" /><strong>Competitive data:</strong> Hide margin columns from partner roles</li>
            <li className="flex gap-2"><Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" /><strong>Internal metrics:</strong> Separate internal KPIs from external-facing ones</li>
          </ul>

          <WarningBox>
            <strong>Limitation:</strong> Measures that reference OLS-restricted columns still work and can return values.
            If a measure uses a hidden column, users can still see aggregated results. Audit your measures carefully.
          </WarningBox>
        </div>
      </div>
    </CollapsibleSection>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 5: Sensitivity Labels                                      */
/* ------------------------------------------------------------------ */

function SensitivityLabelsSection() {
  return (
    <CollapsibleSection
      id="sensitivity-labels"
      icon={Tag}
      title="Sensitivity Labels & Data Protection"
      subtitle="Microsoft Purview integration for information protection"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SENSITIVITY_LABELS.map((item, i) => (
          <motion.div
            key={item.label}
            variants={fadeInUp}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <h4 className="font-semibold text-pbi-text">{item.label}</h4>
            </div>
            <p className="text-xs text-pbi-muted mb-3">{item.description}</p>
            <div className="text-xs">
              <span className="text-pbi-muted font-medium">Controls: </span>
              <span className="text-pbi-text">{item.controls}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-pbi-text">Key Concepts</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border">
            <h4 className="font-medium text-pbi-text mb-2">Downstream Inheritance</h4>
            <p className="text-sm text-pbi-muted">
              When a dataset has a sensitivity label, all reports and dashboards built on it automatically inherit that label.
              Exports (Excel, PDF, PowerPoint) also carry the label and its protections.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border">
            <h4 className="font-medium text-pbi-text mb-2">Auto-Labeling Policies</h4>
            <p className="text-sm text-pbi-muted">
              Admins can configure policies in Purview to automatically apply labels based on content inspection.
              For example, any dataset containing credit card patterns gets "Confidential" automatically.
            </p>
          </div>
        </div>
      </div>

      <InfoBox>
        Sensitivity labels require Microsoft 365 E5, E5 Compliance, or a standalone Microsoft Purview Information Protection license.
        Labels are configured in the Microsoft Purview compliance portal.
      </InfoBox>
    </CollapsibleSection>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 6: Fabric Domains                                          */
/* ------------------------------------------------------------------ */

function FabricDomainsSection() {
  return (
    <CollapsibleSection
      id="fabric-domains"
      icon={FolderTree}
      title="Fabric Domains"
      subtitle="Business-area grouping above workspaces for governance at scale"
    >
      <div className="space-y-4">
        <p className="text-sm text-pbi-muted">
          Fabric Domains are logical containers that group workspaces by business area (e.g., Finance, Sales, HR).
          They sit above workspaces in the hierarchy: <strong>Tenant &rarr; Domain &rarr; Workspace &rarr; Items</strong>.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border">
            <h4 className="font-medium text-primary mb-2">Domain Admin</h4>
            <ul className="text-sm text-pbi-muted space-y-1">
              <li>Manage domain settings</li>
              <li>Add/remove workspaces</li>
              <li>Set default sensitivity labels</li>
              <li>Configure endorsement policies</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border">
            <h4 className="font-medium text-fabric mb-2">Domain Contributor</h4>
            <ul className="text-sm text-pbi-muted space-y-1">
              <li>Assign workspaces to the domain</li>
              <li>Cannot change domain settings</li>
              <li>Typically workspace admins</li>
              <li>Self-service governance</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border">
            <h4 className="font-medium text-success mb-2">Benefits</h4>
            <ul className="text-sm text-pbi-muted space-y-1">
              <li>Governance at scale</li>
              <li>Default labels per domain</li>
              <li>Endorsement policies</li>
              <li>Clear ownership boundaries</li>
              <li>Data mesh enablement</li>
            </ul>
          </div>
        </div>

        <TipBox>
          Domains are ideal for organizations with 50+ workspaces. They help enforce governance policies without bottlenecking on a central team.
          Combine with OneLake data sharing for a true data mesh architecture.
        </TipBox>
      </div>
    </CollapsibleSection>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 7: Access Patterns                                         */
/* ------------------------------------------------------------------ */

function AccessPatternsSection() {
  return (
    <CollapsibleSection
      id="access-patterns"
      icon={GitBranch}
      title="Access Patterns & Best Practices"
      subtitle="Decision guide: match the right sharing method to your scenario"
    >
      <div className="space-y-4">
        {/* Decision flow */}
        <div className="p-6 rounded-lg bg-pbi-darker/30 border border-pbi-border">
          <h3 className="text-lg font-semibold text-pbi-text mb-4 text-center">Decision Flow</h3>
          <div className="flex flex-col items-center gap-3 text-sm">
            <div className="px-4 py-2 rounded-lg bg-primary/20 text-primary font-medium border border-primary/30">
              Who needs access?
            </div>
            <ArrowRight className="w-4 h-4 text-pbi-muted rotate-90" />
            <div className="px-4 py-2 rounded-lg bg-fabric/20 text-fabric font-medium border border-fabric/30">
              How many users?
            </div>
            <ArrowRight className="w-4 h-4 text-pbi-muted rotate-90" />
            <div className="px-4 py-2 rounded-lg bg-success/20 text-success font-medium border border-success/30">
              What level of access?
            </div>
            <ArrowRight className="w-4 h-4 text-pbi-muted rotate-90" />
            <div className="px-4 py-2 rounded-lg bg-warning/20 text-warning font-medium border border-warning/30">
              Choose pattern below
            </div>
          </div>
        </div>

        {/* Pattern cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ACCESS_PATTERNS.map((pattern, i) => {
            const Icon = pattern.icon
            return (
              <motion.div
                key={pattern.scenario}
                variants={fadeInUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: `${pattern.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: pattern.color }} />
                  </div>
                  <h4 className="font-medium text-pbi-text text-sm">{pattern.scenario}</h4>
                </div>
                <p className="text-sm text-pbi-muted">{pattern.recommendation}</p>
              </motion.div>
            )
          })}
        </div>

        <InfoBox>
          These patterns are not mutually exclusive. A large organization often uses several patterns simultaneously --
          workspace access for dev teams, Apps for department consumers, and Embedded for customer-facing portals.
        </InfoBox>
      </div>
    </CollapsibleSection>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 8: Audit & Monitoring                                      */
/* ------------------------------------------------------------------ */

function AuditSection() {
  return (
    <CollapsibleSection
      id="audit"
      icon={Activity}
      title="Audit & Monitoring"
      subtitle="Track access, usage, and governance compliance"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-pbi-text">Activity Log</h4>
          </div>
          <p className="text-sm text-pbi-muted mb-2">
            Track every action: who viewed a report, who exported data, who changed permissions.
            Available via Admin Portal or REST API.
          </p>
          <CodeBlock
            code={`GET https://api.powerbi.com/v1.0/myorg/admin/activityevents
  ?startDateTime='2024-01-01T00:00:00'
  &endDateTime='2024-01-02T00:00:00'`}
            title="Activity Events API"
          />
        </div>

        <div className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-pbi-text">Usage Metrics</h4>
          </div>
          <p className="text-sm text-pbi-muted mb-2">
            Built-in usage metrics reports show views, viewers, and performance per report.
            Create custom usage reports from the usage metrics dataset.
          </p>
          <ul className="text-sm text-pbi-muted space-y-1">
            <li>Report views per day/week/month</li>
            <li>Unique viewers count</li>
            <li>Distribution method (app, direct, embedded)</li>
            <li>Performance data (load times)</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-pbi-text">Scanner API (GetInfo)</h4>
          </div>
          <p className="text-sm text-pbi-muted mb-2">
            Scan entire tenant metadata at scale: datasets, reports, dataflows, users, sensitivity labels.
            Essential for governance dashboards.
          </p>
          <ul className="text-sm text-pbi-muted space-y-1">
            <li>Catalog all workspace items</li>
            <li>Detect datasets without RLS</li>
            <li>Find unlabeled content</li>
            <li>Map lineage across workspaces</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg bg-pbi-darker/50 border border-pbi-border">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-pbi-text">Admin Portal Settings</h4>
          </div>
          <p className="text-sm text-pbi-muted mb-2">
            Key tenant settings for governance:
          </p>
          <ul className="text-sm text-pbi-muted space-y-1">
            <li>Export data controls (disable Excel export if needed)</li>
            <li>External sharing restrictions</li>
            <li>Publish to web toggle</li>
            <li>Azure AD conditional access policies</li>
            <li>Cross-geo data movement restrictions</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-2 text-sm">
        <span className="text-pbi-muted">See also:</span>
        <Link to="/api" className="text-primary hover:underline">
          API Reference
        </Link>
        <span className="text-pbi-muted">for detailed REST API documentation.</span>
      </div>
    </CollapsibleSection>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 9: Common Mistakes                                         */
/* ------------------------------------------------------------------ */

function CommonMistakesSection() {
  return (
    <CollapsibleSection
      id="common-mistakes"
      icon={AlertTriangle}
      title="Common Mistakes to Avoid"
      subtitle="Security anti-patterns that can lead to data breaches or governance failures"
    >
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
        {COMMON_MISTAKES.map((mistake, i) => (
          <motion.div
            key={mistake.title}
            variants={fadeInUp}
            custom={i}
            className="rounded-lg border border-danger/30 bg-danger/5 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-danger/20 shrink-0">
                  <XCircle className="w-4 h-4 text-danger" />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-danger">{mistake.title}</h4>
                  <p className="text-sm text-pbi-muted">{mistake.description}</p>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <p className="text-sm text-success">{mistake.fix}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex gap-2 text-sm">
        <span className="text-pbi-muted">Related:</span>
        <Link to="/ci-cd" className="text-primary hover:underline">
          CI/CD Pipelines
        </Link>
        <span className="text-pbi-muted">|</span>
        <Link to="/performance" className="text-primary hover:underline">
          Performance Checklist
        </Link>
      </div>
    </CollapsibleSection>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function SharingAccess() {
  return (
    <div className="min-h-screen bg-pbi-dark">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-fabric/5" />
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Security & Governance</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-pbi-text mb-4">
              Sharing, Access & Governance
            </h1>
            <p className="text-lg text-pbi-muted max-w-2xl mx-auto">
              Master Power BI and Fabric security: workspace roles, sharing methods, RLS/OLS,
              sensitivity labels, domains, and audit capabilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick nav */}
      <nav className="max-w-6xl mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {[
            { href: '#workspace-roles', label: 'Roles', icon: Users },
            { href: '#sharing-methods', label: 'Sharing', icon: Share2 },
            { href: '#rls', label: 'RLS', icon: Lock },
            { href: '#ols', label: 'OLS', icon: EyeOff },
            { href: '#sensitivity-labels', label: 'Labels', icon: Tag },
            { href: '#fabric-domains', label: 'Domains', icon: FolderTree },
            { href: '#access-patterns', label: 'Patterns', icon: GitBranch },
            { href: '#audit', label: 'Audit', icon: Activity },
            { href: '#common-mistakes', label: 'Mistakes', icon: AlertTriangle },
          ].map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-pbi-muted hover:text-primary bg-pbi-card border border-pbi-border hover:border-primary/30 transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </a>
          ))}
        </motion.div>
      </nav>

      {/* Sections */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-6">
        <WorkspaceRolesSection />
        <SharingMethodsSection />
        <RLSSection />
        <OLSSection />
        <SensitivityLabelsSection />
        <FabricDomainsSection />
        <AccessPatternsSection />
        <AuditSection />
        <CommonMistakesSection />
      </div>
    </div>
  )
}
