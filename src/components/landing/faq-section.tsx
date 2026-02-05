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
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div
      className="faq-item"
      style={{ borderBottom: '1px solid rgba(164, 35, 139, 0.15)' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 px-1 text-left transition-colors duration-200"
        style={{ color: isOpen ? '#ffffff' : '#9ca3af' }}
      >
        <span className="font-display text-lg">{question}</span>
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: isOpen ? 'rgba(0, 237, 218, 0.2)' : 'rgba(164, 35, 139, 0.2)',
            border: `1px solid ${isOpen ? 'rgba(0, 237, 218, 0.4)' : 'rgba(164, 35, 139, 0.3)'}`,
          }}
        >
          {isOpen ? (
            <Minus className="w-4 h-4" style={{ color: '#00EDDA' }} />
          ) : (
            <Plus className="w-4 h-4 text-white" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 px-1 text-gray-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-item',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
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
    <section ref={sectionRef} className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
            Frequently Asked <span className="text-gradient-cyan">Questions</span>
          </h2>
          <p className="text-gray-400">Everything you need to know about GrimSwap</p>
        </div>

        {/* FAQ list */}
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: 'rgba(42, 20, 40, 0.6)',
            border: '1px solid rgba(164, 35, 139, 0.2)',
          }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
