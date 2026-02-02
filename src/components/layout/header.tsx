import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { GrimConnectButton } from '../web3/connect-button'
import { BookOpen, ArrowLeftRight, Droplets, Wallet, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { href: '/swap', label: 'Swap', icon: ArrowLeftRight },
  { href: '/pools', label: 'Pools', icon: Droplets },
  { href: '/wallet', label: 'Grimoire', icon: Wallet },
]

export function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-void-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn(
          'flex items-center justify-between h-20',
          'border-b border-arcane-purple/10'
        )}>
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className={cn(
              'w-10 h-10 rounded-xl',
              'bg-gradient-to-br from-arcane-purple to-purple-deep',
              'flex items-center justify-center',
              'shadow-glow-purple',
              'group-hover:scale-105 transition-transform'
            )}>
              <BookOpen className="w-5 h-5 text-ghost-white" />
            </div>
            <span className="font-display text-xl text-ghost-white hidden sm:block">
              GrimSwap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.href

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl',
                    'text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-arcane-purple/20 text-arcane-purple'
                      : 'text-mist-gray hover:text-ghost-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Connect Button */}
          <div className="flex items-center gap-4">
            <GrimConnectButton />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-ghost-white" />
              ) : (
                <Menu className="w-6 h-6 text-ghost-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-b border-arcane-purple/10">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.href

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl',
                      'text-sm font-medium transition-all',
                      isActive
                        ? 'bg-arcane-purple/20 text-arcane-purple'
                        : 'text-mist-gray hover:text-ghost-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
