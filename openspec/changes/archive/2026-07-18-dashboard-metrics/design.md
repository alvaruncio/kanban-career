## Context

The current DashboardPage renders hardcoded values in four StatCard components and two empty placeholder sections. No data is fetched from the backend. The layout follows DashboardLayout (sidebar + content area) but the page itself is non-functional.

Existing backend infrastructure: applications are stored with status, category, source, applicationDate, and company relation via Prisma + PostgreSQL. The frontend has `useApplicationsStore` that fetches all applications, but computing aggregated metrics from the full list client-side is inefficient as the dataset grows.

## Goals / Non-Goals

**Goals:**
- Single backend endpoint returning all dashboard aggregated data (status counts, monthly evolution, source/category distribution, conversion funnel, recent applications)
- Frontend consumes endpoint and renders 5 stat cards + 4 chart sections + recent activity list
- Month filter dropdown affects all charts
- All UI text goes through i18n
- Visual design follows existing DESIGN.md (surface colors, typography, rounded-xl cards, 4px grid)

**Non-Goals:**
- Real-time updates (data refreshes on page load or manual navigation)
- Drill-down interactivity on charts (clicking a bar to filter — future enhancement)
- Export or shareable dashboard links
- Server-side pagination for recent activity (list is small — top 10 entries)

## Decisions

### 1. Single aggregated endpoint vs multiple specialized endpoints

**Decision:** Single `GET /api/v1/dashboard/metrics?month=YYYY-MM`.

**Rationale:** The dashboard needs ~6 different aggregations from the same dataset. N+1 roundtrips (one per chart) would multiply latency and complexity. A single endpoint returns everything needed for one page render, filtered by the same month param.

**Alternative considered:** Multiple endpoints (`/metrics/by-status`, `/metrics/by-month`, etc.) — rejected because it requires orchestrating N parallel requests on the frontend with no benefit.

### 2. Prisma aggregation approach

**Decision:** Add new aggregation methods to the existing `ApplicationRepository`. No new `DashboardRepository` is created.

**Rationale:** Dashboard has no persistent entity — there is no `Dashboard` table. All queries operate on the `Application` model. Adding methods to `ApplicationRepository` keeps the data access layer clean: one repository per entity. A `DashboardRepository` would be an artificial wrapper with no corresponding table.

```
ApplicationRepository     → new static methods: getStatusCounts(),
                            getSourceCounts(), getCategoryCounts(),
                            getMonthlyCounts(), getRecentApplications()

DashboardService          → calls ApplicationRepository methods,
                            computes percentages, assembles the DTO

DashboardController       → extracts query params, calls service
```

**Example queries added to ApplicationRepository:**
```
// By status — single groupBy covers status, source, category
static getStatusCounts(userId, month?) {
  return prisma.application.groupBy({ by: ['status'], _count: true, where: { userId, ...monthFilter } })
}

// By month
static getMonthlyCounts(userId) {
  return prisma.application.findMany({ where: { userId }, select: { applicationDate: true } })
}
// Post-processing: group by YYYY-MM in DashboardService

// By source, by category — same groupBy pattern as by status

// Recent applications (last 10)
static getRecentApplications(userId, month?, limit = 10) {
  return prisma.application.findMany({
    where: { userId, ...monthFilter },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { company: { select: { name: true } } },
  })
}
```

The conversion funnel is computed in the service from the `byStatus` counts:

```
maxCount = byStatus.find(s => s.status === 'APPLIED').count
funnel = byStatus.map(s => ({
  stage: s.status,
  count: s.count,
  rate: (s.count / maxCount) * 100,
}))
```

This uses a single `groupBy` query — no extra database work.

### 3. Frontend data flow — local state vs Zustand store

**Decision:** Local state in DashboardPage with `useState` + `useEffect`.

**Rationale:** Metrics are page-specific — no other component or page needs dashboard metrics. Adding a Zustand store would create global state pollution for no benefit. The fetch + render lifecycle is contained within the page component.

```
DashboardPage mount → fetchMetrics(month) → render stat cards + charts
                  ↓ month changes → re-fetch → re-render
```

### 4. Chart component architecture

**Decision:** Generic `DashboardChart` wrapper + specific chart configurations composed in DashboardPage.

**Rationale:** Each chart (bar, pie, funnel) shares the same card container (bg-surface-container-lowest, rounded-xl, border, shadow-sm). A wrapper handles the card chrome; the chart type and data are passed as props from the parent. This avoids creating separate `<MonthlyChart>`, `<StatusChart>`, etc. components.

### 5. Recharts integration

**Decision:** Install `recharts` npm package. Use `<BarChart>`, `<PieChart>`, `<Cell>`, `<Tooltip>`, `<ResponsiveContainer>`.

**Rationale:** Recharts is React-native, declarative, well-typed, and the most popular chart library in the React ecosystem. Its component model aligns with the existing React + TypeScript stack. No need for D3 wrappers or imperative chart APIs.

### 6. Month filter design

**Decision:** Dropdown component identical in style to the kanban month filter. Options generated dynamically from the applications' date range (min/max applicationDate), plus "All months". When no month is selected, endpoint returns all-time data.

**Rationale:** Matches the existing UX pattern in the kanban page, providing consistency. Dynamic options avoid hardcoding years.

## Response DTO

```json
{
  "totalApplications": 24,
  "activeApplications": 18,
  "pendingInterviews": 5,
  "offersReceived": 2,
  "hiredCount": 1,
  "rejectedCount": 6,
  "responseRate": 33.3,
  "byStatus": [
    { "status": "APPLIED", "count": 10, "percentage": 41.7 },
    { "status": "INTERVIEW", "count": 5, "percentage": 20.8 },
    { "status": "OFFER", "count": 2, "percentage": 8.3 },
    { "status": "HIRED", "count": 1, "percentage": 4.2 },
    { "status": "REJECTED", "count": 6, "percentage": 25.0 }
  ],
  "byMonth": [
    { "month": "2026-01", "count": 3 },
    { "month": "2026-02", "count": 5 },
    { "month": "2026-03", "count": 8 }
  ],
  "bySource": [
    { "source": "LINKEDIN", "count": 12, "percentage": 50.0 },
    { "source": "INFOJOBS", "count": 6, "percentage": 25.0 }
  ],
  "byCategory": [
    { "category": "FRONTEND", "count": 14, "percentage": 58.3 },
    { "category": "BACKEND", "count": 10, "percentage": 41.7 }
  ],
  "conversionFunnel": [
    { "stage": "APPLIED", "count": 24, "rate": 100.0 },
    { "stage": "INTERVIEW", "count": 8, "rate": 33.3 },
    { "stage": "OFFER", "count": 3, "rate": 37.5 },
    { "stage": "HIRED", "count": 1, "rate": 33.3 }
  ],
  "recentApplications": [
    { "id": "...", "jobTitle": "Frontend Dev", "companyName": "Google", "status": "APPLIED", "createdAt": "2026-07-17T10:00:00Z" }
  ]
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Multiple Prisma queries could be slow with 1000+ applications | Add composite index `@@index([userId, applicationDate])` on Application model. The existing `@@index([userId])` already covers userId-only queries; the composite index optimizes queries with both userId + date range filters for the month filter. If still slow, add Redis caching with 5min TTL. |
| Funnel calculation uses current status distribution, not historical transitions | This is an approximation — a snapshot of where things stand today. True funnel tracking requires event sourcing (future feature). The simplified approach (rate = count / maxCount) uses a single groupBy query and is correct for this purpose. |
| Monthly grouping with multiple years could produce many bars | Group by YYYY-MM in the service layer. The frontend BarChart handles any number of bars gracefully. |
| i18n typing — `dashboard` is `Record<string, string>` so adding keys doesn't require type changes | Safe to add new keys without touching types. |
