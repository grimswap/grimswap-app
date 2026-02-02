import { Header } from './header'
import { NoiseOverlay } from '../effects/noise-overlay'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen bg-void-black">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-arcane-purple/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-ethereal-cyan/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-spectral-green/3 via-transparent to-transparent" />
      </div>

      {/* Noise texture */}
      <NoiseOverlay />

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main className="pt-20">
          {children}
        </main>
      </div>
    </div>
  )
}
