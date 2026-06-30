import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

interface PageShellProps {
  children: React.ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className={`flex-1 ${className ?? ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
