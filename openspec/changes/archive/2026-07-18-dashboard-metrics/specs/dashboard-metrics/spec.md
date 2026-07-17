## ADDED Requirements

### Requirement: Dashboard metrics endpoint

The system SHALL expose `GET /api/v1/dashboard/metrics` returning aggregated application statistics for the authenticated user. The endpoint SHALL accept an optional `month` query parameter in `YYYY-MM` format to filter applications by that month. When no month is provided, SHALL return all-time data. The response SHALL contain `totalApplications`, `activeApplications`, `pendingInterviews`, `offersReceived`, `hiredCount`, `rejectedCount`, `responseRate`, plus arrays for `byStatus`, `byMonth`, `bySource`, `byCategory`, `conversionFunnel`, and `recentApplications`.

#### Scenario: Successful metrics retrieval

- **WHEN** authenticated user requests `GET /api/v1/dashboard/metrics`
- **THEN** system returns 200 with full metrics DTO computed from user's applications

#### Scenario: Metrics filtered by month

- **WHEN** authenticated user requests `GET /api/v1/dashboard/metrics?month=2026-07`
- **THEN** system returns 200 with metrics computed only from applications whose `applicationDate` falls within July 2026

#### Scenario: Unauthenticated request

- **WHEN** unauthenticated request is made to `GET /api/v1/dashboard/metrics`
- **THEN** system returns 401

#### Scenario: Empty dataset

- **WHEN** authenticated user with no applications requests `GET /api/v1/dashboard/metrics`
- **THEN** system returns 200 with `totalApplications: 0`, zero-valued stats, empty arrays for distributions

### Requirement: Dashboard page shows stat cards

The dashboard page SHALL display key metrics in individual StatCard components at the top of the page: total applications, active applications (APPLIED + INTERVIEW + OFFER), pending interviews, offers received, and response rate.

#### Scenario: Stat cards render with real data

- **WHEN** dashboard page loads and metrics are fetched successfully
- **THEN** five StatCard components render with the values from the API response

#### Scenario: Stat cards show loading skeleton

- **WHEN** dashboard page is loading metrics
- **THEN** LoadingSkeleton components display in place of stat cards

#### Scenario: Stat cards show zero values

- **WHEN** user has no applications and metrics return empty data
- **THEN** stat cards render with `0` values and response rate shows `0%`

### Requirement: Dashboard page shows charts

The dashboard page SHALL render four chart sections: monthly evolution (bar chart), status distribution (donut/pie chart), conversion funnel (bar chart), and distribution by source (bar chart). Each chart SHALL be contained in a card matching the design system (rounded-xl, border, shadow-sm, surface-container-lowest background).

#### Scenario: Charts render with data

- **WHEN** metrics are fetched successfully and byMonth/byStatus/bySource/conversionFunnel arrays have data
- **THEN** all four charts render with the corresponding data

#### Scenario: Empty chart state

- **WHEN** metrics return empty arrays for all distribution fields
- **THEN** charts display a centered message "No data available" in the configured locale

### Requirement: Month filter dropdown

The dashboard page SHALL include a dropdown filter to select a specific month. Options SHALL be dynamically generated from the application date range, plus "All months". The dropdown SHALL match the visual style of the existing kanban month filter.

#### Scenario: Month filter changes data

- **WHEN** user selects a month from the dropdown
- **THEN** metrics are re-fetched with `?month=YYYY-MM` and all charts update

#### Scenario: Month filter set to all

- **WHEN** user selects "All months" in the dropdown
- **THEN** metrics are re-fetched without the month parameter and return all-time data

### Requirement: Recent activity list

The dashboard page SHALL display a list of recent applications (last 10), each showing job title, company name, status, and relative time (e.g., "Hoy", "Ayer", "Hace 3 días").

#### Scenario: Recent activity renders

- **WHEN** metrics are fetched and recentApplications is non-empty
- **THEN** a list of application entries renders with job title, company, status badge, and relative timestamp

#### Scenario: No recent activity

- **WHEN** recentApplications is empty
- **THEN** a localized message "No recent activity" displays

### Requirement: Dashboard i18n translations

The system SHALL provide Spanish (primary) and English (secondary) translations for all dashboard UI text, including chart labels, tooltips, empty states, and month filter.

#### Scenario: Spanish locale

- **WHEN** user's locale is set to Spanish
- **THEN** all dashboard text displays in Spanish

#### Scenario: English locale

- **WHEN** user's locale is set to English
- **THEN** all dashboard text displays in English
