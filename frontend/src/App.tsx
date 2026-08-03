import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts'
import { MainLayout, DashboardLayout } from './layouts'
import { ProtectedRoute, LoadingSkeleton } from './components'
import { LandingPage, LoginPage, RegisterPage, NotFoundPage, PrivacyPage, TermsPage, SupportPage } from './pages'

const DashboardPage = lazy(() => import('./pages/DashboardPage/DashboardPage'))
const KanbanPage = lazy(() => import('./pages/KanbanPage/KanbanPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'))
const ApplicationDetailPage = lazy(() => import('./pages/ApplicationDetailPage/ApplicationDetailPage'))
const CompaniesPage = lazy(() => import('./pages/CompaniesPage/CompaniesPage'))
const CompanyDetailPage = lazy(() => import('./pages/CompanyDetailPage/CompanyDetailPage'))

function App() {

  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy" element={<MainLayout><PrivacyPage /></MainLayout>} />
          <Route path="/terms" element={<MainLayout><TermsPage /></MainLayout>} />
          <Route path="/support" element={<MainLayout><SupportPage /></MainLayout>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/kanban" element={<ProtectedRoute><DashboardLayout><KanbanPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/application/:id" element={<ProtectedRoute><DashboardLayout><ApplicationDetailPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/companies" element={<ProtectedRoute><DashboardLayout><CompaniesPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/companies/:id" element={<ProtectedRoute><DashboardLayout><CompanyDetailPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default App