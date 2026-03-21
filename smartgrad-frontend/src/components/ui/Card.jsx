import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function Card({ children, className, hover = false, glow = false, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'glass rounded-2xl',
        hover && 'glass-hover cursor-pointer transition-all duration-300',
        glow && 'glow-indigo',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
