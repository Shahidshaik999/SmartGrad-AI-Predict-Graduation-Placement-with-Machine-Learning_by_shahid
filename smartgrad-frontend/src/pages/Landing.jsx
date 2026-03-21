import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, TrendingUp, Users, Zap, GraduationCap, BarChart3, Shield } from 'lucide-react'

function StatCard({ value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-2xl px-6 py-4 text-center"
    >
      <p className="text-2xl font-bold gradient-text-subtle">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </motion.div>
  )
}

function FeatureCard({ icon: Icon, title, desc, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass glass-hover rounded-2xl p-6 space-y-3"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '20', border: `1px solid ${color}30` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </motion.div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* ── Hero ── */}
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/20 text-xs font-medium text-indigo-300"
        >
          <Sparkles size={12} className="text-indigo-400" />
          AI-Powered Academic Intelligence
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]"
        >
          <span className="text-white">Predict Your Future.</span>
          <br />
          <span className="gradient-text">Improve It.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          SmartGrad AI analyzes your academic profile and predicts your placement probability,
          graduation timeline, and gives you a personalized roadmap to success.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/predict">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 overflow-hidden"
            >
              {/* Shimmer */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                animate={{ translateX: ['−100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <Zap size={15} />
              Predict My Profile
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </motion.button>
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium text-sm transition-all duration-200"
            >
              Create Free Account
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-4"
        >
          <StatCard value="93.2%" label="Placement accuracy"  delay={0.5} />
          <StatCard value="84.3%" label="Graduation accuracy" delay={0.55} />
          <StatCard value="10K+"  label="Predictions made"    delay={0.6} />
        </motion.div>
      </div>

      {/* ── Features ── */}
      <div className="max-w-5xl mx-auto px-6 mt-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">What SmartGrad does</p>
          <h2 className="text-3xl font-bold text-white">Everything you need to succeed</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard icon={TrendingUp}    color="#6366f1" delay={0}    title="Placement Prediction"    desc="ML model trained on real student data predicts your placement probability with 93% accuracy." />
          <FeatureCard icon={GraduationCap} color="#22d3ee" delay={0.05} title="Graduation Timeline"     desc="Know if you're on track to graduate on time or identify risks before they become problems." />
          <FeatureCard icon={BarChart3}     color="#a855f7" delay={0.1}  title="Skill Gap Analysis"      desc="Radar chart visualization shows exactly where you stand vs. industry expectations." />
          <FeatureCard icon={Sparkles}      color="#f59e0b" delay={0.15} title="AI Recommendations"      desc="Personalized course suggestions and improvement tips based on your specific weak areas." />
          <FeatureCard icon={Shield}        color="#22c55e" delay={0.2}  title="Risk Assessment"         desc="Composite risk score helps you understand your overall academic and career risk profile." />
          <FeatureCard icon={Users}         color="#ec4899" delay={0.25} title="Multi-step Analysis"     desc="Comprehensive 3-step form captures academic, technical, and soft skill dimensions." />
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto px-6 mt-24"
      >
        <div className="relative glass rounded-3xl p-10 text-center overflow-hidden border-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10 pointer-events-none" />
          <h2 className="text-2xl font-bold text-white mb-3">Ready to know your future?</h2>
          <p className="text-slate-400 text-sm mb-6">Takes less than 2 minutes. No signup required to try.</p>
          <Link to="/predict">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all duration-200"
            >
              <Zap size={15} /> Start Prediction
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
