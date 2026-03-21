import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar      from './components/Navbar'
import Background  from './components/ui/Background'
import Landing     from './pages/Landing'
import Dashboard   from './pages/Dashboard'
import Login       from './pages/Login'
import Register    from './pages/Register'
import { getMe }   from './services/api'

// Page transition wrapper
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes({ user, setUser }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/predict"  element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/login"    element={user ? <Navigate to="/" /> : <PageTransition><Login    onLogin={setUser} /></PageTransition>} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <PageTransition><Register onLogin={setUser} /></PageTransition>} />
        <Route path="*"         element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const [user,    setUser]    = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('sg_token')
    if (token) {
      getMe()
        .then(setUser)
        .catch(() => localStorage.removeItem('sg_token'))
        .finally(() => setChecked(true))
    } else {
      setChecked(true)
    }
  }, [])

  if (!checked) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-sm text-slate-500"
      >
        Loading...
      </motion.div>
    </div>
  )

  return (
    <BrowserRouter>
      <Background />
      <Navbar user={user} onLogout={() => setUser(null)} />
      <AnimatedRoutes user={user} setUser={setUser} />
    </BrowserRouter>
  )
}
