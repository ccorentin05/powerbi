// Microsoft Fabric officiels icon set
// Source: https://github.com/astrzala/FabricToolset

import copilot from './copilot.svg'
import dataEngineering from './data-engineering.svg'
import dataFactory from './data-factory.svg'
import dataScience from './data-science.svg'
import dataWarehouse from './data-warehouse.svg'
import databases from './databases.svg'
import fabricIq from './fabric-iq.svg'
import fabric from './fabric.svg'
import folder from './folder.svg'
import graphIntelligence from './graph-intelligence.svg'
import industrySolutions from './industry-solutions.svg'
import oneLake from './one-lake.svg'
import powerBi from './power-bi.svg'
import purview from './purview.svg'
import realTimeIntelligence from './real-time-intelligence.svg'
import sampleWorkload from './sample-workload.svg'
import user from './user.svg'
import users from './users.svg'

export const fabricIcons = {
  copilot,
  dataEngineering,
  dataFactory,
  dataScience,
  dataWarehouse,
  databases,
  fabricIq,
  fabric,
  folder,
  graphIntelligence,
  industrySolutions,
  oneLake,
  powerBi,
  purview,
  realTimeIntelligence,
  sampleWorkload,
  user,
  users,
} as const

export type FabricIconName = keyof typeof fabricIcons
