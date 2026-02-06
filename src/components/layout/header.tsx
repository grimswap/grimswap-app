import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { GrimConnectButton } from '../web3/connect-button'
import { ArrowLeftRight, Layers, BookOpen, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { icon: ArrowLeftRight, label: 'Swap', href: '/swap' },
  { icon: Layers, label: 'Pools', href: '/pools' },
  { icon: BookOpen, label: 'Grimoire', href: '/wallet' },
]

export function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121214]/80 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-16 py-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/assets/img/logo-grimswap.png"
            alt="GrimSwap"
            className="h-8 sm:h-10 w-auto"
          />
        </Link>

        {/* Center Navigation - Pill Style */}
        <nav
          className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all duration-200',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Connect Wallet Button */}
          <GrimConnectButton />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          className="md:hidden px-6 py-4"
          style={{ borderTop: '1px solid rgba(164, 35, 139, 0.2)' }}
        >
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-[#00EDDA]/20 text-[#00EDDA]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
