import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts'
import { MainLayout, DashboardLayout } from './layouts'
import { ProtectedRoute, LoadingSkeleton } from './components'
import { LandingPage, LoginPage, RegisterPage, NotFoundPage } from './pages'

const DashboardPage = lazy(() => import('./pages/DashboardPage/DashboardPage'))
const KanbanPage = lazy(() => import('./pages/KanbanPage/KanbanPage'))

function App() {

  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/kanban" element={<ProtectedRoute><DashboardLayout><KanbanPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default App