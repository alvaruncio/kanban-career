export interface StatusCount {
  status: string
  count: number
  percentage: number
}

export interface MonthlyCount {
  month: string
  count: number
}

export interface SourceCount {
  source: string
  count: number
  percentage: number
}

export interface CategoryCount {
  category: string
  count: number
  percentage: number
}

export interface ConversionFunnelEntry {
  stage: string
  count: number
  rate: number
}

export interface RecentApplication {
  id: string
  jobTitle: string
  companyName: string
  status: string
  createdAt: string
}

export interface DashboardMetrics {
  totalApplications: number
  activeApplications: number
  pendingInterviews: number
  offersReceived: number
  hiredCount: number
  rejectedCount: number
  responseRate: number
  byStatus: StatusCount[]
  byMonth: MonthlyCount[]
  bySource: SourceCount[]
  byCategory: CategoryCount[]
  conversionFunnel: ConversionFunnelEntry[]
  recentApplications: RecentApplication[]
}
