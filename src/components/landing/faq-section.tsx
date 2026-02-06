import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: 'What is GrimSwap?',
    answer:
      'GrimSwap is a privacy-preserving decentralized exchange (DEX) built on Uniswap v4 hooks. It uses zero-knowledge proofs to break the on-chain link between your deposit and swap transactions, providing true financial privacy on Ethereum.',
  },
  {
    question: 'How do ZK proofs protect my privacy?',
    answer:
      'When you deposit to GrimPool, your funds become part of a privacy set with other depositors. To swap, you generate a ZK-SNARK proof that proves you made a valid deposit without revealing which deposit is yours. This cryptographic proof is verified on-chain, ensuring privacy while maintaining trustlessness.',
  },
  {
    question: 'What tokens are supported?',
    answer:
      'Currently, GrimSwap supports ETH and USDC on Unichain Sepolia testnet. More tokens will be added as we expand to mainnet. The protocol is designed to support any ERC-20 token that has liquidity on Uniswap v4.',
  },
  {
    question: 'Is GrimSwap audited?',
    answer:
      'GrimSwap is currently in testnet phase on Unichain Sepolia. The codebase is open-source and available for review on GitHub. We plan to conduct formal security audits before mainnet deployment. Always exercise caution and only use testnet funds during this phase.',
  },
  {
    question: 'How do I get started?',
    answer:
      "To start using GrimSwap: 1) Connect your wallet (MetaMask, Rainbow, etc.), 2) Ensure you're on Unichain Sepolia testnet, 3) Deposit ETH into the Privacy Pool, 4) Generate a proof and execute your private swap. Visit the Swap page to begin!",
  },
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}

function FAQItem({ question, answer, isOpen, onToggle, isFirst, isLast }: FAQItemProps) {
  return (
    <div
      className="faq-item relative"
      style={{
        borderBottom: isLast ? 'none' : '1px solid rgba(164, 35, 139, 0.15)',
      }}
    >
      {/* Gradient border highlight when open */}
      {isOpen && (
        <div
          className="absolute -left-[1px] top-0 bottom-0 w-[3px]"
          style={{
            background: 'linear-gradient(180deg, #A4238B 0%, #00EDDA 100%)',
            borderRadius: isFirst ? '4px 0 0 0' : isLast ? '0 0 0 4px' : '0',
          }}
        />
      )}

      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-6 px-2 text-left transition-colors duration-200"
      >
        <span
          className="text-lg"
          style={{
            fontFamily: "'Crimson Text', serif",
            color: isOpen ? '#ffffff' : '#9ca3af',
          }}
        >
          {question}
        </span>
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isOpen ? 'rgba(0, 237, 218, 0.15)' : 'rgba(164, 35, 139, 0.15)',
            border: `1px solid ${isOpen ? 'rgba(0, 237, 218, 0.4)' : 'rgba(164, 35, 139, 0.3)'}`,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          {isOpen ? (
            <Minus className="w-5 h-5" style={{ color: '#00EDDA' }} />
          ) : (
            <Plus className="w-5 h-5" style={{ color: '#A4238B' }} />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p
              className="pb-6 px-2 text-gray-400 leading-relaxed"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0) // First item open by default
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-container',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 px-6 lg:px-16"
      style={{ background: '#121214' }}
    >
      <div className="max-w-[900px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2
            className="text-4xl lg:text-5xl tracking-tight mb-4"
            style={{ fontFamily: "'Crimson Text', serif" }}
          >
            <span className="text-white">Frequently Asked </span>
            <span className="text-[#00EDDA]">Questions</span>
          </h2>
          <p
            className="text-gray-400 text-base"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Everything you need to know about GrimSwap
          </p>
        </div>

        {/* FAQ Container with gradient border */}
        <div
          className="faq-container rounded-2xl p-[1px]"
          style={{
            background: 'linear-gradient(135deg, #A4238B 0%, #6B21A8 50%, #00EDDA 100%)',
          }}
        >
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: '#121214' }}
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                isFirst={index === 0}
                isLast={index === faqs.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
