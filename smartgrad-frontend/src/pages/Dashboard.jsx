import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StudentForm  from '../components/StudentForm'
import ResultCard   from '../components/ResultCard'
import SkeletonCard from '../components/ui/SkeletonCard'
import { predictFull } from '../services/api'
import { AlertCircle, RotateCcw, Sparkles } from 'lucide-react'

export default function Dashboard() {
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const handleSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const res = await predictFull(data)
      setResult(res)
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    } catch (e) {
      setError(e.response?.data?.detail || 'Could not reach the prediction server. Make sure the backend is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setResult(null); setError(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-indigo-500/20 text-xs font-medium text-indigo-300 mb-2">
            <Sparkles size={11} />
            AI Prediction Engine
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analyze Your Profile</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Fill in your academic details across 3 steps and get instant AI-powered predictions.
          </p>
        </motion.div>

        {/* Form card */}
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <StudentForm onSubmit={handleSubmit} loading={loading} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20"
            >
              <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skeleton while loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonCard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              id="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Results header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">Your Prediction Results</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Based on your academic profile</p>
                </div>
                <motion.button
                  onClick={reset}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/8 hover:border-white/20 text-xs text-slate-400 hover:text-white transition-all duration-200"
                >
                  <RotateCcw size={12} /> New Prediction
                </motion.button>
              </div>

              <ResultCard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
