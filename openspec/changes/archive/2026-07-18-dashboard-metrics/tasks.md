## 0. Prereading — Context and rules

- [x] 0.1 Read `README.md` to understand the application purpose, stack, and architecture
- [x] 0.2 Read `AGENTS.md` for the mandatory workflow, DO NOT rules, commands, and skill tables
- [x] 0.3 Read `frontend/AGENTS.md` for frontend folder structure, architecture pattern, conventions, and relevant skills
- [x] 0.4 Read `backend/AGENTS.md` for backend layer responsibilities, dependency flow, conventions, and relevant skills
- [x] 0.5 Load backend skills: `nodejs-express-server`, `nodejs-backend-patterns`, `prisma-client-api`, `openapi-spec-generation`
- [x] 0.6 Load frontend skills: `vercel-react-best-practices`, `tailwind-css-patterns`, `frontend-design`, `i18n-localization`
- [x] 0.7 **STOP** — Notify the user that prereading is complete and wait for instructions to proceed

## 1. Backend — Dashboard feature structure (controller + service + routes)

- [x] 1.1 Create `controllers/dashboard/dashboard.controller.js` and its barrel `index.js`
- [x] 1.2 Create `services/dashboard/dashboard.service.js` and its barrel `index.js`
- [x] 1.3 Create `routes/dashboard/dashboard.routes.js` and its barrel `index.js`
- [x] 1.4 Register dashboard routes in `routes/index.js` at `/api/v1/dashboard`
- [x] 1.5 Export dashboard modules from `controllers/index.js`, `services/index.js`
- [x] 1.6 **STOP** — Notify the user that the backend structure is ready and wait for review before continuing

## 2. Backend — Add aggregation methods to ApplicationRepository

- [x] 2.1 Add `getStatusCounts(userId, month?)` to ApplicationRepository using Prisma `groupBy` on `status` with `_count`
- [x] 2.2 Add `getMonthlyCounts(userId)` to ApplicationRepository using Prisma `findMany` selecting `applicationDate`
- [x] 2.3 Add `getSourceCounts(userId, month?)` to ApplicationRepository using Prisma `groupBy` on `source` with `_count`
- [x] 2.4 Add `getCategoryCounts(userId, month?)` to ApplicationRepository using Prisma `groupBy` on `category` with `_count`
- [x] 2.5 Add `getRecentApplications(userId, month?, limit?)` to ApplicationRepository ordered by `createdAt` desc, including company name
- [x] 2.6 **STOP** — Notify the user that the repository methods are complete and wait for review before continuing

## 3. Backend — Dashboard service

- [x] 3.1 Implement `getMetrics(userId, month?)` that calls `ApplicationRepository` methods, computes responseRate and percentages, assembles the full DashboardMetricsDTO
- [x] 3.2 Implement month filtering helper that builds the Prisma `where` clause for `applicationDate` between first and last day of the given month
- [x] 3.3 **STOP** — Notify the user that the service is complete and wait for review before continuing

## 4. Backend — Dashboard controller + routes + validation

- [x] 4.1 Implement `DashboardController.getMetrics(req, res)` that extracts `month` from query, calls service, returns JSON
- [x] 4.2 Implement `DashboardValidator` with Zod schema for optional `month` param (YYYY-MM pattern), export validator middleware
- [x] 4.3 Define route: `router.get('/metrics', requireAuth, validateGetMetrics, DashboardController.getMetrics)`
- [x] 4.4 Update `backend/docs/openapi.yaml` with the new `GET /api/v1/dashboard/metrics` endpoint, response schema (`DashboardMetricsResponse`), and query parameter — use the `openapi-spec-generation` skill loaded in step 0.5
- [x] 4.5 **STOP** — Notify the user that the complete backend is ready and wait for review before moving to frontend

## 5. Frontend — Install Recharts

- [x] 5.1 Run `npm install recharts` in frontend directory
- [x] 5.2 **STOP** — Notify the user that the dependency is installed and wait for instructions

## 6. Frontend — Dashboard metrics interface

- [x] 6.1 Create `interfaces/dashboard/DashboardMetrics.ts` with `DashboardMetrics` interface (totalApplications, byStatus[], byMonth[], bySource[], byCategory[], conversionFunnel[], recentApplications[])
- [x] 6.2 Export from `interfaces/index.ts`
- [x] 6.3 **STOP** — Notify the user that interfaces are ready and wait for review

## 7. Frontend — Metrics repository + service

- [x] 7.1 Create `repositories/MetricsRepository/MetricsRepository.ts` with static `getDashboard(month?)` calling `GET /api/v1/dashboard/metrics`
- [x] 7.2 Create `services/MetricsService/MetricsService.ts` with static `getDashboard(month?)` delegating to repository
- [x] 7.3 Export both from `repositories/index.ts` and `services/index.ts`
- [x] 7.4 **STOP** — Notify the user that repository + service are ready and wait for review

## 8. Frontend — MonthFilter component

- [x] 8.1 Create `components/MonthFilter/MonthFilter.tsx` — dropdown styled like kanban month filter, accepts `months: string[]` (dynamically generated from data), `value: string | null`, `onChange: (month: string | null) => void`
- [x] 8.2 Export from `components/index.ts`
- [x] 8.3 **STOP** — Notify the user that MonthFilter is ready and wait for review

## 9. Frontend — DashboardChart component

- [x] 9.1 Create `components/DashboardChart/DashboardChart.tsx` — generic card wrapper with `title`, chart type selector (bar/pie), and Recharts integration. Props: `title`, `type`, `data`, `dataKey`, `xAxisKey`, `colors?`
- [x] 9.2 Export from `components/index.ts`
- [x] 9.3 **STOP** — Notify the user that DashboardChart is ready and wait for review

## 10. Frontend — Rewrite DashboardPage

- [x] 10.1 Replace hardcoded static data with `useState` + `useEffect` fetching from `MetricsService.getDashboard(month)`
- [x] 10.2 Render 5 StatCards (total, active, interviews, offers, response rate) with real values
- [x] 10.3 Render MonthFilter at top with options generated from `byMonth` data
- [x] 10.4 Render 4 DashboardChart instances: monthly evolution (BarChart), status distribution (PieChart donut), conversion funnel (BarChart), by source (BarChart)
- [x] 10.5 Render recent activity list with job title, company, status badge, relative timestamp
- [x] 10.6 Handle loading state (LoadingSkeleton) and empty state ("No data available")
- [x] 10.7 Handle error state with localized error message
- [x] 10.8 **STOP** — Notify the user that the page is ready and wait for review

## 11. Frontend — i18n translations

- [x] 11.1 Add Spanish keys to `locales/es/es.ts` for: chart titles (monthlyEvolution, statusDistribution, conversionFunnel, bySource), tooltips, noData, noActivity, error messages, monthFilter allMonths
- [x] 11.2 Add English keys to `locales/en/en.ts` with same structure
- [x] 11.3 Update `locales/types/types.ts` `dashboard` section from `Record<string, string>` to explicit typed interface matching the new keys
- [x] 11.4 **STOP** — Notify the user that translations are ready and wait for review

## 12. Verify

- [x] 12.1 Run `npm run build` (tsc + vite) in frontend to check type errors
- [x] 12.2 Run `npm run lint` in frontend to check lint
- [x] 12.3 Start backend and frontend dev servers, navigate to `/dashboard` and verify end-to-end
- [x] 12.4 **STOP** — Notify the user that verification is complete and present a final summary
