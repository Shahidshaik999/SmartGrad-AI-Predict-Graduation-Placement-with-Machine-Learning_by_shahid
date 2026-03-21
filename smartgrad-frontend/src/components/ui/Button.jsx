import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40',
  ghost:   'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-white/10 hover:border-white/20',
  danger:  'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20',
  glow:    'bg-indigo-600 hover:bg-indigo-500 text-white relative overflow-hidden',
}

export default function Button({ children, variant = 'primary', className, disabled, onClick, type = 'button', ...props }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {variant === 'glow' && (
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
      )}
      {children}
    </motion.button>
  )
}
