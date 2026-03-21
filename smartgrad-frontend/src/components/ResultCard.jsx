import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts'
import { BookOpen, ExternalLink, AlertTriangle, CheckCircle, TrendingUp, Clock, Shield, ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'
import Card from './ui/Card'

// ── Animated counter ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(ease * target * 10) / 10)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

// ── Circular progress ring ────────────────────────────────────────────────────
function CircularRing({ value, size = 140, stroke = 10, color, label, sublabel }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const count = useCountUp(value)
  const offset = circ - (count / 100) * circ

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          {/* Progress */}
          <motion.circle
            cx={size/2} cy={size/2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white tabular-nums">{count.toFixed(1)}<span className="text-base text-slate-400">%</span></span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-200">{label}</p>
        {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  )
}

// ── Radar chart for skill gap ─────────────────────────────────────────────────
function SkillRadar({ weakAreas }) {
  const allFeatures = [
    { key: 'CGPA',             label: 'CGPA' },
    { key: 'Attendance',       label: 'Attendance' },
    { key: 'Projects',         label: 'Projects' },
    { key: 'Internships',      label: 'Internships' },
    { key: 'Certifications',   label: 'Certs' },
    { key: 'Speaking Skills',  label: 'Comm.' },
    { key: 'Ml Knowledge',     label: 'Tech' },
    { key: 'Aptitude Score',   label: 'Aptitude' },
  ]
  const data = allFeatures.map(f => ({
    subject: f.label,
    score: weakAreas.includes(f.key) ? Math.floor(Math.random() * 30) + 20 : Math.floor(Math.random() * 25) + 70,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="rgba(255,255,255,0.06)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
        <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

// ── Graduation bar chart ──────────────────────────────────────────────────────
function GradChart({ probs }) {
  const data = [
    { name: 'On-time',    value: probs.on_time,       fill: '#22c55e' },
    { name: '1 Semester', value: probs.delayed_1_sem, fill: '#f59e0b' },
    { name: '2+ Semesters',value: probs.delayed_2_sem, fill: '#ef4444' },
  ]
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip
          contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12 }}
          formatter={v => [`${v.toFixed(1)}%`]}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Recommendation card ───────────────────────────────────────────────────────
const PRIORITY_MAP = {
  0: { label: 'High',   color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
  1: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  2: { label: 'Low',    color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
}

function CourseCard({ course, index }) {
  const priority = PRIORITY_MAP[index % 3]
  return (
    <motion.a
      href={course.url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group flex items-start justify-between gap-3 p-4 rounded-xl bg-white/3 border border-white/6 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-lg border', priority.color, priority.bg)}>
            {priority.label}
          </span>
          <span className="text-xs text-slate-600">{course.platform}</span>
        </div>
        <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors truncate">{course.title}</p>
      </div>
      <ExternalLink size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors mt-0.5 shrink-0" />
    </motion.a>
  )
}

// ── Risk badge ────────────────────────────────────────────────────────────────
const RISK_CONFIG = {
  Low:    { color: '#22c55e', bg: 'bg-green-500/10 border-green-500/20',  text: 'text-green-400',  icon: CheckCircle },
  Medium: { color: '#f59e0b', bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', icon: AlertTriangle },
  High:   { color: '#ef4444', bg: 'bg-red-500/10 border-red-500/20',      text: 'text-red-400',    icon: AlertTriangle },
}

const GRAD_CONFIG = {
  'On-time':                  { color: '#22c55e', emoji: '🎓', delay: 0 },
  'Delayed by ~1 Semester':   { color: '#f59e0b', emoji: '⏳', delay: 6 },
  'Delayed by 2+ Semesters':  { color: '#ef4444', emoji: '⚠️', delay: 12 },
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ResultCard({ result }) {
  const { placement, graduation, recommendations } = result
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const risk    = RISK_CONFIG[recommendations.risk_level] || RISK_CONFIG.Medium
  const RiskIcon = risk.icon
  const grad    = GRAD_CONFIG[graduation.graduation_status] || GRAD_CONFIG['On-time']
  const placedColor = placement.placement_label === 'Placed' ? '#22c55e' : '#ef4444'

  return (
    <motion.div ref={ref} className="space-y-4">
      {/* ── Row 1: Three summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Placement */}
        <Card delay={0} className="p-6 flex flex-col items-center gap-4 border-glow">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Placement</p>
          {inView && <CircularRing value={placement.placement_probability} color={placedColor} label={placement.placement_label} sublabel={`${placement.confidence.toFixed(1)}% confidence`} />}
        </Card>

        {/* Graduation */}
        <Card delay={0.08} className="p-6 flex flex-col items-center justify-center gap-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Graduation</p>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-5xl"
          >
            {grad.emoji}
          </motion.div>
          <p className="text-base font-bold text-center" style={{ color: grad.color }}>
            {graduation.graduation_status}
          </p>
          {graduation.delay_months > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock size={12} />
              ~{graduation.delay_months} months delay
            </div>
          )}
        </Card>

        {/* Risk */}
        <Card delay={0.16} className="p-6 flex flex-col items-center gap-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Risk Level</p>
          {inView && <CircularRing value={recommendations.risk_score} color={risk.color} label={`${recommendations.risk_level} Risk`} sublabel={`${recommendations.weak_areas.length} areas need work`} />}
          <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold', risk.text, risk.bg)}>
            <RiskIcon size={12} />
            {recommendations.risk_level} Risk
          </div>
        </Card>
      </div>

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card delay={0.2} className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-300">Graduation Probability</h3>
          </div>
          <GradChart probs={graduation.probabilities} />
        </Card>

        <Card delay={0.26} className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-300">Skill Gap Radar</h3>
          </div>
          <SkillRadar weakAreas={recommendations.weak_areas} />
        </Card>
      </div>

      {/* ── Row 3: Weak areas ── */}
      {recommendations.weak_areas.length > 0 && (
        <Card delay={0.3} className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} className="text-yellow-400" />
            <h3 className="text-sm font-semibold text-slate-300">Areas to Improve</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendations.weak_areas.map((area, i) => (
              <motion.span
                key={area}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="px-3 py-1.5 rounded-xl bg-yellow-500/8 border border-yellow-500/20 text-xs font-medium text-yellow-400"
              >
                {area}
              </motion.span>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {recommendations.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                className="flex items-start gap-2.5 text-sm text-slate-400"
              >
                <span className="text-indigo-400 mt-0.5 shrink-0">→</span>
                {tip}
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Row 4: Courses ── */}
      {recommendations.courses.length > 0 && (
        <Card delay={0.36} className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={14} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-300">Recommended Courses</h3>
            <span className="ml-auto text-xs text-slate-600">{recommendations.courses.length} resources</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recommendations.courses.map((course, i) => (
              <CourseCard key={i} course={course} index={i} />
            ))}
          </div>
        </Card>
      )}

      {/* All good */}
      {recommendations.weak_areas.length === 0 && (
        <Card delay={0.3} className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
              <CheckCircle size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-300">Excellent Profile</p>
              <p className="text-xs text-slate-500 mt-0.5">Your profile looks strong across all areas. Keep it up!</p>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  )
}
