import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { GrimConnectButton } from '../web3/connect-button'
import { ArrowLeftRight, Droplets, Wallet, Menu, X } from 'lucide-react'
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-void-black/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn(
          'flex items-center justify-between h-20',
          'border-b border-grim-pink/10'
        )}>
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <img
              src="/grimoire.svg"
              alt="GrimSwap"
              className="w-10 h-10 group-hover:scale-105 transition-transform"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(0, 237, 218, 0.4))',
              }}
            />
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
                      ? 'bg-ethereal-cyan/20 text-ethereal-cyan'
                      : 'text-mist-gray hover:text-ghost-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            {/* Connect Button */}
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
          <div className="md:hidden py-4 border-b border-grim-pink/10">
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
                        ? 'bg-ethereal-cyan/20 text-ethereal-cyan'
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
