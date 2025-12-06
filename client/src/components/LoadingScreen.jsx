import { useEffect, useState } from 'react'
import { LoaderOne } from "@/components/ui/loader";
import { motion } from 'framer-motion'

const LoadingScreen = ({ onFinished }) => {
  const [phase, setPhase] = useState('enter') // enter -> converge -> exit

  useEffect(() => {
    const timers = []

    // After initial idle, start gradient convergence
    timers.push(setTimeout(() => setPhase('converge'), 800))
    // Start exit (fade + move text up)
    timers.push(setTimeout(() => setPhase('exit'), 2000))
    // Fully finished, notify parent (App will unmount this)
    timers.push(setTimeout(() => onFinished?.(), 2600))

    return () => timers.forEach(clearTimeout)
  }, [onFinished])

  const bgEnter =
    'bg-[radial-gradient(circle_at_bottom_right,_#6366f1,_#0f172a_55%,_#020617)]'
  const bgConverge =
    'bg-[radial-gradient(circle_at_top_left,_#6366f1,_#0f172a_35%,_#020617)]'

  const containerBg =
    phase === 'enter' ? bgEnter : phase === 'converge' ? bgConverge : bgConverge

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-colors duration-700 ${containerBg}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative px-10 py-4 rounded-full border border-slate-400/40 bg-slate-900/30 shadow-2xl shadow-slate-900/80 backdrop-blur-2xl"
        initial={{ y: 0, scale: 1 }}
        animate={
          phase === 'exit'
            ? { y: -180, scale: 0.9 }
            : { y: 0, scale: 1 }
        }
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="font-semibold tracking-[0.25em] uppercase text-slate-100 text-3xl md:text-4xl drop-shadow-[0_8px_24px_rgba(15,23,42,0.9)]">
          Voxaide
        </span>
      </motion.div>
    </motion.div>
  )
}

export default LoadingScreen

