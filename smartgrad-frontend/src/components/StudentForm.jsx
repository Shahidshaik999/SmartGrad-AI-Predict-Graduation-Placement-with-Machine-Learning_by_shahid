import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Code2, Briefcase, ChevronRight, ChevronLeft, Check, GraduationCap, Award, Users, Zap, Target, BarChart3 } from 'lucide-react'
import { cn } from '../lib/utils'
import Button from './ui/Button'

const SKILLS = ['Python','Java','JavaScript','React','Node.js','SQL','Machine Learning','Deep Learning','Data Analysis','Cloud (AWS/GCP)','Docker','Git','C++','DSA','Flutter','Kotlin']

const STEPS = [
  { id: 1, label: 'Academic',  icon: BookOpen,   desc: 'Your academic performance' },
  { id: 2, label: 'Skills',    icon: Code2,      desc: 'Technical expertise' },
  { id: 3, label: 'Career',    icon: Briefcase,  desc: 'Experience & soft skills' },
]

const defaultForm = {
  cgpa: '', backlogs: '', attendance: '',
  projects: '', internships: '', certifications: '',
  speaking_skills: 3, ml_knowledge: 3, aptitude_score: '',
  technical_skills: [],
}

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const done    = current > step.id
        const active  = current === step.id
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  background: done ? 'rgb(99,102,241)' : active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                  borderColor: done || active ? 'rgb(99,102,241)' : 'rgba(255,255,255,0.1)',
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-xl border flex items-center justify-center"
              >
                {done
                  ? <Check size={16} className="text-white" />
                  : <Icon size={16} className={active ? 'text-indigo-400' : 'text-slate-600'} />
                }
              </motion.div>
              <span className={cn('text-xs font-medium transition-colors duration-300', active ? 'text-indigo-400' : done ? 'text-slate-400' : 'text-slate-600')}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-16 sm:w-24 h-px mx-3 mb-5 relative overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-indigo-500"
                  animate={{ width: current > step.id ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function NumberField({ label, icon: Icon, name, value, onChange, error, min = 0, max, step = 1, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-indigo-400" />}
        {label}
      </label>
      <div className={cn(
        'relative flex items-center rounded-xl border transition-all duration-200',
        focused ? 'border-indigo-500/60 bg-indigo-500/5 shadow-[0_0_0_3px_rgba(99,102,241,0.1)]'
                : error ? 'border-red-500/40 bg-red-500/5'
                : 'border-white/8 bg-white/3 hover:border-white/15'
      )}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          min={min} max={max} step={step}
          placeholder={placeholder}
          className="w-full bg-transparent px-4 py-3 text-sm text-slate-100 outline-none placeholder-slate-600"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

function RatingSlider({ label, icon: Icon, name, value, onChange, desc }) {
  const labels = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#6366f1']
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
          {Icon && <Icon size={12} className="text-indigo-400" />}
          {label}
        </label>
        <motion.span
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-xs font-semibold px-2 py-0.5 rounded-lg"
          style={{ color: colors[value], background: colors[value] + '20' }}
        >
          {labels[value]}
        </motion.span>
      </div>
      <div className="relative">
        <input
          type="range" min="1" max="5" step="1"
          value={value}
          onChange={(e) => onChange(name, parseInt(e.target.value))}
          className="w-full"
          style={{ accentColor: colors[value] }}
        />
        <div className="flex justify-between mt-1">
          {[1,2,3,4,5].map(n => (
            <div key={n} className={cn('w-1 h-1 rounded-full transition-colors duration-200', n <= value ? 'bg-indigo-400' : 'bg-white/15')} />
          ))}
        </div>
      </div>
      {desc && <p className="text-xs text-slate-600">{desc}</p>}
    </div>
  )
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

export default function StudentForm({ onSubmit, loading }) {
  const [step,   setStep]   = useState(1)
  const [dir,    setDir]    = useState(1)
  const [form,   setForm]   = useState(defaultForm)
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleSkill = (skill) =>
    set('technical_skills',
      form.technical_skills.includes(skill)
        ? form.technical_skills.filter(s => s !== skill)
        : [...form.technical_skills, skill]
    )

  const validateStep = (s) => {
    const e = {}
    if (s === 1) {
      if (!form.cgpa || form.cgpa < 0 || form.cgpa > 10) e.cgpa = 'Enter a valid CGPA (0–10)'
      if (form.backlogs === '' || form.backlogs < 0)      e.backlogs = 'Enter backlogs count'
      if (!form.attendance || form.attendance < 0 || form.attendance > 100) e.attendance = 'Enter attendance (0–100)'
    }
    if (s === 2) {
      if (form.projects === '' || form.projects < 0)      e.projects = 'Enter project count'
      if (form.certifications === '' || form.certifications < 0) e.certifications = 'Enter certification count'
    }
    if (s === 3) {
      if (form.internships === '' || form.internships < 0) e.internships = 'Enter internship count'
      if (!form.aptitude_score || form.aptitude_score < 0 || form.aptitude_score > 100) e.aptitude_score = 'Enter score (0–100)'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validateStep(step)) return
    setDir(1)
    setStep(s => s + 1)
  }

  const prev = () => {
    setDir(-1)
    setStep(s => s - 1)
    setErrors({})
  }

  const handleSubmit = () => {
    if (!validateStep(3)) return
    onSubmit({
      cgpa:            parseFloat(form.cgpa),
      backlogs:        parseInt(form.backlogs),
      attendance:      parseFloat(form.attendance),
      projects:        parseInt(form.projects),
      internships:     parseInt(form.internships),
      certifications:  parseInt(form.certifications),
      speaking_skills: form.speaking_skills,
      ml_knowledge:    form.ml_knowledge,
      aptitude_score:  parseFloat(form.aptitude_score),
      technical_skills: form.technical_skills,
    })
  }

  return (
    <div>
      <StepIndicator current={step} />

      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* ── Step 1: Academic ── */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white">Academic Performance</h3>
                  <p className="text-sm text-slate-500 mt-1">Your grades and attendance form the foundation of your profile.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberField label="CGPA" icon={GraduationCap} name="cgpa" value={form.cgpa} onChange={set} error={errors.cgpa} min={0} max={10} step={0.1} placeholder="e.g. 7.8" />
                  <NumberField label="Active Backlogs" icon={BookOpen} name="backlogs" value={form.backlogs} onChange={set} error={errors.backlogs} min={0} placeholder="e.g. 0" />
                </div>
                <NumberField label="Attendance %" icon={BarChart3} name="attendance" value={form.attendance} onChange={set} error={errors.attendance} min={0} max={100} step={0.1} placeholder="e.g. 82" />

                {/* Visual hint */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: 'CGPA < 6', color: 'text-red-400', bg: 'bg-red-500/8 border-red-500/15', note: 'High risk' },
                    { label: 'CGPA 6–8', color: 'text-yellow-400', bg: 'bg-yellow-500/8 border-yellow-500/15', note: 'Moderate' },
                    { label: 'CGPA > 8', color: 'text-green-400', bg: 'bg-green-500/8 border-green-500/15', note: 'Strong' },
                  ].map(h => (
                    <div key={h.label} className={cn('rounded-xl border p-3 text-center', h.bg)}>
                      <p className={cn('text-xs font-semibold', h.color)}>{h.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{h.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2: Skills ── */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white">Skills & Projects</h3>
                  <p className="text-sm text-slate-500 mt-1">Practical experience is a key placement differentiator.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberField label="Projects Completed" icon={Code2} name="projects" value={form.projects} onChange={set} error={errors.projects} min={0} placeholder="e.g. 3" />
                  <NumberField label="Certifications" icon={Award} name="certifications" value={form.certifications} onChange={set} error={errors.certifications} min={0} placeholder="e.g. 2" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-3 flex items-center gap-1.5">
                    <Zap size={12} className="text-indigo-400" />
                    Technical Skills
                    <span className="ml-auto text-indigo-400 font-semibold">{form.technical_skills.length} selected</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map(skill => (
                      <motion.button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200',
                          form.technical_skills.includes(skill)
                            ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                            : 'bg-white/3 border-white/8 text-slate-500 hover:border-white/20 hover:text-slate-300'
                        )}
                      >
                        {skill}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Career ── */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white">Career & Soft Skills</h3>
                  <p className="text-sm text-slate-500 mt-1">Experience and communication are what close the deal.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberField label="Internships" icon={Briefcase} name="internships" value={form.internships} onChange={set} error={errors.internships} min={0} placeholder="e.g. 1" />
                  <NumberField label="Aptitude Score (0–100)" icon={Target} name="aptitude_score" value={form.aptitude_score} onChange={set} error={errors.aptitude_score} min={0} max={100} step={0.1} placeholder="e.g. 70" />
                </div>
                <div className="space-y-5 pt-2">
                  <RatingSlider label="Communication Skills" icon={Users} name="speaking_skills" value={form.speaking_skills} onChange={set} desc="How well do you present and communicate ideas?" />
                  <RatingSlider label="ML / Technical Knowledge" icon={Zap} name="ml_knowledge" value={form.ml_knowledge} onChange={set} desc="Your depth in machine learning and technical domains." />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/6">
        <Button variant="ghost" onClick={prev} disabled={step === 1} className="gap-1.5">
          <ChevronLeft size={15} /> Back
        </Button>

        <div className="flex items-center gap-1.5">
          {STEPS.map(s => (
            <div key={s.id} className={cn('h-1.5 rounded-full transition-all duration-300', step === s.id ? 'w-6 bg-indigo-500' : step > s.id ? 'w-3 bg-indigo-500/50' : 'w-3 bg-white/10')} />
          ))}
        </div>

        {step < 3 ? (
          <Button onClick={next} className="gap-1.5">
            Next <ChevronRight size={15} />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading} className="gap-1.5 min-w-[140px]">
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
                Analyzing...
              </span>
            ) : (
              <><Zap size={14} /> Predict Now</>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
