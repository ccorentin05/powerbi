export interface License {
  name: string
  pricePerUserMonth: number | null // null for capacity
  pricePerCapacityMonth: number | null
  features: Record<string, boolean | string>
  color: string
  description: string
  bestFor: string
}

export const licenses: License[] = [
  {
    name: 'Power BI Free',
    pricePerUserMonth: 0,
    pricePerCapacityMonth: null,
    features: {
      'Create reports': true,
      'Personal workspace': true,
      'Share dashboards': false,
      'App workspaces': false,
      'Paginated reports': false,
      'Dataflows Gen2': false,
      'AI features': false,
      'Deployment pipelines': false,
      'XMLA endpoint': false,
      'Auto page refresh': false,
      'Dataset size limit': '1 GB',
      'Refresh frequency': '8x/day',
    },
    color: '#94a3b8',
    description: 'Individual analytics with no sharing',
    bestFor: 'Individual users exploring data',
  },
  {
    name: 'Power BI Pro',
    pricePerUserMonth: 10,
    pricePerCapacityMonth: null,
    features: {
      'Create reports': true,
      'Personal workspace': true,
      'Share dashboards': true,
      'App workspaces': true,
      'Paginated reports': false,
      'Dataflows Gen2': true,
      'AI features': false,
      'Deployment pipelines': false,
      'XMLA endpoint': false,
      'Auto page refresh': false,
      'Dataset size limit': '1 GB',
      'Refresh frequency': '8x/day',
    },
    color: '#3b82f6',
    description: 'Collaboration & sharing for teams',
    bestFor: 'Teams up to ~500 users',
  },
  {
    name: 'Power BI PPU',
    pricePerUserMonth: 20,
    pricePerCapacityMonth: null,
    features: {
      'Create reports': true,
      'Personal workspace': true,
      'Share dashboards': true,
      'App workspaces': true,
      'Paginated reports': true,
      'Dataflows Gen2': true,
      'AI features': true,
      'Deployment pipelines': true,
      'XMLA endpoint': true,
      'Auto page refresh': true,
      'Dataset size limit': '100 GB',
      'Refresh frequency': '48x/day',
    },
    color: '#f2c811',
    description: 'Premium features per user',
    bestFor: 'Power users & advanced analytics',
  },
  {
    name: 'Fabric Capacity',
    pricePerUserMonth: null,
    pricePerCapacityMonth: 1048,
    features: {
      'Create reports': true,
      'Personal workspace': true,
      'Share dashboards': true,
      'App workspaces': true,
      'Paginated reports': true,
      'Dataflows Gen2': true,
      'AI features': true,
      'Deployment pipelines': true,
      'XMLA endpoint': true,
      'Auto page refresh': true,
      'Dataset size limit': '400 GB+',
      'Refresh frequency': 'Unlimited',
    },
    color: '#10b981',
    description: 'Unified analytics platform at scale',
    bestFor: 'Organizations with 300+ users or heavy workloads',
  },
]
