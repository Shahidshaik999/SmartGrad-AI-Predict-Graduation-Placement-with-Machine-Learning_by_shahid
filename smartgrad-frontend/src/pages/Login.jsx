import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login } from '../services/api'
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Input from '../components/ui/Input'

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await login(email, password)
      localStorage.setItem('sg_token', data.access_token)
      onLogin({ name: data.name, email: data.email })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/30">
            <GraduationCap size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your SmartGrad account</p>
        </div>

        <div className="glass rounded-2xl p-7 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 bg-red-500/8 border border-red-500/20 rounded-xl px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-200"
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Signing in...</>
                : <><span>Sign In</span><ArrowRight size={15} /></>
              }
            </motion.button>
          </form>

          <p className="text-center text-xs text-slate-500">
            No account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
