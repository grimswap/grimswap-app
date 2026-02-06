import { Link } from 'react-router-dom'
import { Github } from 'lucide-react'

// X (Twitter) icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const navLinks = [
  { label: 'Swap', href: '/swap' },
  { label: 'Pool', href: '/pools' },
  { label: 'Wallet', href: '/wallet' },
]

const socialLinks = [
  { icon: XIcon, href: 'https://twitter.com/grimswap', label: 'X' },
  { icon: Github, href: 'https://github.com/grimswap', label: 'GitHub' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="relative"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, #1C0E1B 20%, #2A1428 60%, #121214 100%)',
      }}
    >
      {/* Gradient Divider */}
      <div
        className="w-full h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(164, 35, 139, 0.5) 30%, rgba(0, 237, 218, 0.5) 70%, transparent 100%)',
        }}
      />

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-16 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          {/* Left Column - Logo & Description */}
          <div className="md:col-span-6 lg:col-span-5">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img
                src="/assets/img/logo-grimswap.png"
                alt="GrimSwap"
                className="h-10 w-auto"
              />
            </Link>

            {/* Tagline */}
            <p
              className="text-gray-400 leading-relaxed mb-8 max-w-md"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              The Dark Arts of DeFi. Privacy-preserving token swaps powered by ZK-SNARK proofs and Uniswap v4 hooks.
            </p>

            {/* Uniswap Badge */}
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <span
                className="text-sm text-gray-400"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Build on
              </span>
              <span
                className="text-sm text-white font-medium"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Uniswap v4
              </span>
            </div>
          </div>

          {/* Middle Column - Navigate */}
          <div className="md:col-span-3 lg:col-span-4">
            <h3
              className="text-xl text-[#00EDDA] mb-6"
              style={{ fontFamily: "'Crimson Text', serif" }}
            >
              Navigate
            </h3>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Column - Community */}
          <div className="md:col-span-3 lg:col-span-3">
            <h3
              className="text-xl text-[#00EDDA] mb-6"
              style={{ fontFamily: "'Crimson Text', serif" }}
            >
              Community
            </h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 237, 218, 0.5)'
                      e.currentTarget.style.background = 'rgba(0, 237, 218, 0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                    }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                )
              })}
            </div>

            {/* Network badge */}
            <div className="mt-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(0, 237, 218, 0.1)',
                  border: '1px solid rgba(0, 237, 218, 0.2)',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: '#00EDDA' }}
                />
                <span className="text-xs" style={{ color: '#00EDDA' }}>
                  Unichain Sepolia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-16 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              © {currentYear} GrimSwap. All rights reserved.
            </p>
            <p
              className="text-gray-600 text-sm"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Made with dark magic for the privacy-conscious.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
