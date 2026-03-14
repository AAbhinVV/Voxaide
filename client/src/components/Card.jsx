import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowUpRight } from "lucide-react"

function Card({
  title = "",
  content = "",
  date = "",
  className = "",
  delay = 0,
  onExpand,
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`group relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover glow aura — same pattern as Auth pages */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-primary/20 via-brand-secondary/15 to-voiceAccent/15 blur-2xl -z-10"
          />
        )}
      </AnimatePresence>

      {/* Card body */}
      <div className="relative bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer overflow-hidden">
        {/* Decorative gradient accent — top edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary via-brand-secondary to-voiceAccent opacity-40 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative space-y-3">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <h3 className="font-headings text-lg font-semibold text-text-primary">
              {title}
            </h3>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-primary to-accentGlow shrink-0 mt-2" />
          </div>

          {/* Content with fade-out */}
          <div className="relative max-h-20 overflow-hidden">
            <p className="text-sm text-text-secondary leading-relaxed font-body">
              {content}
            </p>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-white/80 backdrop-blur-[1px]" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            {date && (
              <span className="text-xs font-mono text-text-muted tracking-wide">
                {date}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onExpand?.()
              }}
              className="flex items-center gap-1 text-xs font-mono text-text-accent hover:brightness-125 tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
            >
              Expand
              <ArrowUpRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Card
