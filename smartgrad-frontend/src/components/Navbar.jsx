import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GraduationCap, LogOut, User, Sparkles } from 'lucide-react'

export default function Navbar({ user, onLogout }) {
  const navigate  = useNavigate()
  const location  = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('sg_token')
    onLogout()
    navigate('/login')
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-[#03050a]/80 backdrop-blur-xl border-b border-white/5" />

      <div className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow duration-300">
              <GraduationCap size={16} className="text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#03050a]" />
          </div>
          <span className="font-semibold text-white tracking-tight">
            SmartGrad <span className="text-indigo-400">AI</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8">
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                  <User size={11} className="text-white" />
                </div>
                <span className="text-xs text-slate-300 font-medium">{user.name}</span>
              </div>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  className="inline-block px-4 py-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Sign in
                </motion.span>
              </Link>
              <Link to="/register">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm text-white font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-200 cursor-pointer"
                >
                  <Sparkles size={13} />
                  Get Started
                </motion.span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
