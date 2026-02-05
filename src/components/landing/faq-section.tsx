import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
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
      'To start using GrimSwap: 1) Connect your wallet (MetaMask, Rainbow, etc.), 2) Ensure you\'re on Unichain Sepolia testnet, 3) Deposit ETH into the Privacy Pool, 4) Generate a proof and execute your private swap. Visit the Swap page to begin!',
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
      className={cn(
        'faq-item border-b border-arcane-purple/10',
        'last:border-b-0'
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between gap-4 py-5 px-1',
          'text-left transition-colors duration-200',
          'hover:text-ghost-white focus-visible:outline-none',
          isOpen ? 'text-ghost-white' : 'text-mist-gray'
        )}
      >
        <span className="font-display text-lg">{question}</span>
        <div
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full',
            'bg-arcane-purple/20 border border-arcane-purple/30',
            'flex items-center justify-center',
            'transition-all duration-200',
            isOpen && 'bg-arcane-purple/30 border-arcane-purple/50'
          )}
        >
          {isOpen ? (
            <Minus className="w-4 h-4 text-arcane-purple" />
          ) : (
            <Plus className="w-4 h-4 text-arcane-purple" />
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
            <p className="pb-5 px-1 text-mist-gray leading-relaxed">{answer}</p>
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
      gsap.from('.faq-item', {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
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
          <h2 className="font-display text-3xl sm:text-4xl text-ghost-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-mist-gray">
            Everything you need to know about GrimSwap
          </p>
        </div>

        {/* FAQ list */}
        <div
          className={cn(
            'rounded-2xl p-6 sm:p-8',
            'bg-charcoal/30 backdrop-blur-xl',
            'border border-arcane-purple/10'
          )}
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
