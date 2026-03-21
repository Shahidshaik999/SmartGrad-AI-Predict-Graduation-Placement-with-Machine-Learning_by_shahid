import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { register } from '../services/api'
import { GraduationCap, User, Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import Input from '../components/ui/Input'

export default function Register({ onLogin }) {
  const [form,    setForm]    = useState({ name: '', email: '', password: '' })
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await register(form.name, form.email, form.password)
      localStorage.setItem('sg_token', data.access_token)
      onLogin({ name: data.name, email: data.email })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
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
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 border-2 border-[#03050a] flex items-center justify-center">
              <Sparkles size={10} className="text-[#03050a]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-sm text-slate-500 mt-1">Start predicting your academic future</p>
        </div>

        <div className="glass rounded-2xl p-7 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full name"      icon={User} type="text"     value={form.name}     onChange={set('name')}     required />
            <Input label="Email address"  icon={Mail} type="email"    value={form.email}    onChange={set('email')}    required />
            <Input label="Password"       icon={Lock} type="password" value={form.password} onChange={set('password')} required />

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
                ? <><Loader2 size={15} className="animate-spin" /> Creating account...</>
                : <><span>Create Account</span><ArrowRight size={15} /></>
              }
            </motion.button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
