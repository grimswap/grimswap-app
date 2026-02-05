import { Link } from 'react-router-dom'
import { Github, Twitter } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Swap', href: '/swap' },
  { name: 'Pool', href: '/pool' },
  { name: 'Wallet', href: '/wallet' },
]

const socials = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/grimswap',
    icon: Twitter,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/grimswap',
    icon: Github,
  },
]

export function Footer() {
  return (
    <footer className="relative border-t border-arcane-purple/10">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-void-black via-obsidian/50 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="font-display text-2xl text-gradient-arcane">GrimSwap</span>
            </Link>
            <p className="text-mist-gray text-sm leading-relaxed max-w-xs">
              The Dark Arts of DeFi. Privacy-preserving token swaps powered by ZK-SNARK proofs
              and Uniswap v4 hooks.
            </p>

            {/* Built on badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal/50 border border-arcane-purple/10">
              <span className="text-xs text-mist-gray">Built on</span>
              <span className="text-xs font-medium text-ghost-white">Uniswap v4</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm text-ghost-white mb-4">Navigate</h4>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      'text-mist-gray text-sm',
                      'hover:text-ghost-white',
                      'transition-colors duration-200'
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Links */}
          <div>
            <h4 className="font-display text-sm text-ghost-white mb-4">Community</h4>
            <div className="flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'w-10 h-10 rounded-xl',
                      'bg-charcoal/50 border border-arcane-purple/10',
                      'flex items-center justify-center',
                      'hover:border-arcane-purple/30 hover:bg-charcoal/70',
                      'transition-all duration-200'
                    )}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-mist-gray" />
                  </a>
                )
              })}
            </div>

            {/* Network badge */}
            <div className="mt-6">
              <div
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
                  'bg-spectral-green/10 border border-spectral-green/20'
                )}
              >
                <div className="w-2 h-2 rounded-full bg-spectral-green animate-pulse" />
                <span className="text-xs text-spectral-green">Unichain Sepolia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-arcane-purple/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-mist-gray/60">
              &copy; {new Date().getFullYear()} GrimSwap. All rights reserved.
            </p>
            <p className="text-xs text-mist-gray/60">
              Made with dark magic for the privacy-conscious.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
