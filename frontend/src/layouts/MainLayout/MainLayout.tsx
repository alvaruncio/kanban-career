import { Header, Footer } from '../../components'
import type { MainLayoutProps } from '../../interfaces'

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md antialiased overflow-x-hidden flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        Saltar al contenido principal
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-16 pb-lg">
        {children}
      </main>
      <Footer />
    </div>
  )
}