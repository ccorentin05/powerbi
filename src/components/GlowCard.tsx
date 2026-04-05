import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  color?: 'yellow' | 'blue' | 'green' | 'red' | 'none'
  className?: string
  onClick?: () => void
  delay?: number
}

const glowStyles = {
  yellow: {
    shadow: '0 0 20px rgba(242, 200, 17, 0.12), 0 0 60px rgba(242, 200, 17, 0.04)',
    hoverShadow: '0 0 30px rgba(242, 200, 17, 0.25), 0 0 80px rgba(242, 200, 17, 0.08)',
    border: 'rgba(242, 200, 17, 0.15)',
    hoverBorder: 'rgba(242, 200, 17, 0.3)',
  },
  blue: {
    shadow: '0 0 20px rgba(0, 120, 212, 0.12), 0 0 60px rgba(0, 120, 212, 0.04)',
    hoverShadow: '0 0 30px rgba(0, 120, 212, 0.25), 0 0 80px rgba(0, 120, 212, 0.08)',
    border: 'rgba(0, 120, 212, 0.15)',
    hoverBorder: 'rgba(0, 120, 212, 0.3)',
  },
  green: {
    shadow: '0 0 20px rgba(16, 185, 129, 0.12), 0 0 60px rgba(16, 185, 129, 0.04)',
    hoverShadow: '0 0 30px rgba(16, 185, 129, 0.25), 0 0 80px rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.15)',
    hoverBorder: 'rgba(16, 185, 129, 0.3)',
  },
  red: {
    shadow: '0 0 20px rgba(239, 68, 68, 0.12), 0 0 60px rgba(239, 68, 68, 0.04)',
    hoverShadow: '0 0 30px rgba(239, 68, 68, 0.25), 0 0 80px rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.15)',
    hoverBorder: 'rgba(239, 68, 68, 0.3)',
  },
  none: {
    shadow: 'none',
    hoverShadow: '0 0 20px rgba(42, 58, 92, 0.3)',
    border: 'rgba(42, 58, 92, 0.5)',
    hoverBorder: 'rgba(42, 58, 92, 0.7)',
  },
}

export default function GlowCard({
  children,
  color = 'yellow',
  className = '',
  onClick,
  delay = 0,
}: GlowCardProps) {
  const glow = glowStyles[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: 'rgba(22, 33, 62, 0.7)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${glow.border}`,
        boxShadow: glow.shadow,
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = glow.hoverShadow
        el.style.borderColor = glow.hoverBorder
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = glow.shadow
        el.style.borderColor = glow.border
      }}
    >
      {children}
    </motion.div>
  )
}
