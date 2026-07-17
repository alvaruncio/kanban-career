## Why

The current dashboard at `/dashboard` shows hardcoded placeholder data — static numbers, empty sections, no charts. This makes it a dead page instead of the central hub for understanding job search progress. Users need real-time visibility into their application pipeline: how many applications are active, interview conversion rates, monthly trends, and source effectiveness — all derived from their actual application data.

## What Changes

- **Backend**: New `GET /api/v1/dashboard/metrics` endpoint that aggregates application data by status, month, source, category, and computes conversion funnel stats. Accepts optional `month` query param for filtering.
- **Frontend**: Replace placeholder DashboardPage with a fully functional page that fetches real metrics, renders charts (Recharts), and provides a month filter dropdown.
- **Dependencies**: Add `recharts` to the frontend.
- **i18n**: Expand dashboard translations with new keys for chart labels and metric descriptions.

## Capabilities

### New Capabilities
- `dashboard-metrics`: Aggregated metrics endpoint and frontend dashboard visualization. Covers fetching application statistics (counts by status, monthly evolution, source/category distribution, conversion funnel), rendering interactive charts, and filtering by month.

### Modified Capabilities

None.

## Impact

| Area | Impact |
|---|---|
| Backend: Controllers | New `controllers/dashboard/dashboard.controller.js` |
| Backend: Services | New `services/dashboard/dashboard.service.js` |
| Backend: Repositories | New aggregation methods added to existing `ApplicationRepository` (no new repository — dashboard has no persistent entity) |
| Backend: Routes | New `routes/dashboard/dashboard.routes.js` + update `routes/index.js` to mount `/api/v1/dashboard` |
| Backend: Barrels | Update `controllers/index.js`, `services/index.js` |
| Frontend: Dependencies | Add `recharts` |
| Frontend: Interfaces | New `interfaces/dashboard/DashboardMetrics.ts` |
| Frontend: Repositories | New `repositories/MetricsRepository/MetricsRepository.ts` |
| Frontend: Services | New `services/MetricsService/MetricsService.ts` |
| Frontend: Components | New `DashboardChart`, `MonthFilter` |
| Frontend: Pages | Rewrite `DashboardPage` to fetch and display real metrics |
| Frontend: i18n | New keys in `es.ts` / `en.ts` for chart labels, tooltips, empty states |
