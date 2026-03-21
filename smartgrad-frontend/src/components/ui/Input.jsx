import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function Input({ label, icon: Icon, error, className, type = 'text', ...props }) {
  const [focused, setFocused] = useState(false)
  const hasValue = props.value !== '' && props.value !== undefined

  return (
    <div className="relative">
      <div className={cn(
        'relative flex items-center rounded-xl border transition-all duration-200',
        focused
          ? 'border-indigo-500/60 bg-indigo-500/5 shadow-[0_0_0_3px_rgba(99,102,241,0.1)]'
          : error
            ? 'border-red-500/40 bg-red-500/5'
            : 'border-white/8 bg-white/3 hover:border-white/15',
      )}>
        {Icon && (
          <div className={cn('pl-3.5 transition-colors duration-200', focused ? 'text-indigo-400' : 'text-slate-500')}>
            <Icon size={15} />
          </div>
        )}

        <div className="relative flex-1">
          {/* Floating label */}
          <motion.label
            animate={{
              top: focused || hasValue ? '6px' : '50%',
              fontSize: focused || hasValue ? '10px' : '13px',
              color: focused ? 'rgb(129,140,248)' : 'rgb(100,116,139)',
              y: focused || hasValue ? 0 : '-50%',
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-3 pointer-events-none font-medium leading-none z-10"
            style={{ transformOrigin: 'left center' }}
          >
            {label}
          </motion.label>

          <input
            type={type}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn(
              'w-full bg-transparent pt-5 pb-2 px-3 text-sm text-slate-100 outline-none placeholder-transparent',
              className
            )}
            {...props}
          />
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 text-xs text-red-400 pl-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
