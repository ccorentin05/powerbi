export interface FabricCapacity {
  sku: string
  cuPerSecond: number
  monthlyPrice: number // EUR
  maxMemoryGB: number
  maxConcurrentJobs: number
  sparkVCores: number
  oneLakeStorageTB: number
  bestFor: string
}

export const fabricCapacities: FabricCapacity[] = [
  { sku: 'F2', cuPerSecond: 2, monthlyPrice: 262, maxMemoryGB: 4, maxConcurrentJobs: 1, sparkVCores: 0, oneLakeStorageTB: 1, bestFor: 'Dev/Test & POC' },
  { sku: 'F4', cuPerSecond: 4, monthlyPrice: 524, maxMemoryGB: 8, maxConcurrentJobs: 1, sparkVCores: 0, oneLakeStorageTB: 1, bestFor: 'Small team dev' },
  { sku: 'F8', cuPerSecond: 8, monthlyPrice: 1048, maxMemoryGB: 16, maxConcurrentJobs: 2, sparkVCores: 8, oneLakeStorageTB: 1, bestFor: 'Small production workloads' },
  { sku: 'F16', cuPerSecond: 16, monthlyPrice: 2096, maxMemoryGB: 32, maxConcurrentJobs: 4, sparkVCores: 16, oneLakeStorageTB: 1, bestFor: 'Medium workloads' },
  { sku: 'F32', cuPerSecond: 32, monthlyPrice: 4192, maxMemoryGB: 64, maxConcurrentJobs: 8, sparkVCores: 32, oneLakeStorageTB: 1, bestFor: 'Large workloads' },
  { sku: 'F64', cuPerSecond: 64, monthlyPrice: 8384, maxMemoryGB: 128, maxConcurrentJobs: 16, sparkVCores: 64, oneLakeStorageTB: 1, bestFor: 'Enterprise workloads' },
  { sku: 'F128', cuPerSecond: 128, monthlyPrice: 16768, maxMemoryGB: 256, maxConcurrentJobs: 32, sparkVCores: 128, oneLakeStorageTB: 1, bestFor: 'Large enterprise' },
  { sku: 'F256', cuPerSecond: 256, monthlyPrice: 33536, maxMemoryGB: 512, maxConcurrentJobs: 64, sparkVCores: 256, oneLakeStorageTB: 1, bestFor: 'Very large enterprise' },
  { sku: 'F512', cuPerSecond: 512, monthlyPrice: 67072, maxMemoryGB: 1024, maxConcurrentJobs: 128, sparkVCores: 512, oneLakeStorageTB: 1, bestFor: 'Massive workloads' },
  { sku: 'F1024', cuPerSecond: 1024, monthlyPrice: 134144, maxMemoryGB: 2048, maxConcurrentJobs: 256, sparkVCores: 1024, oneLakeStorageTB: 1, bestFor: 'Extreme scale' },
  { sku: 'F2048', cuPerSecond: 2048, monthlyPrice: 268288, maxMemoryGB: 4096, maxConcurrentJobs: 512, sparkVCores: 2048, oneLakeStorageTB: 1, bestFor: 'Maximum scale' },
]
