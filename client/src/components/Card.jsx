import React from "react"
import { MoveDown } from "lucide-react"

function Card({
  title = "",
  content = "",
  className = "",
  onExpand, // optional click handler
}) {
  return (
    <div className={`${className} relative flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-800`}>

      <h3 className="font-headings text-lg font-semibold text-text-primary">
        {title}
      </h3>

      <div className="relative max-h-24 overflow-hidden">
        <p className="text-sm text-text-secondary leading-relaxed">
          {content}
        </p>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-white/90 backdrop-blur-[2px] dark:to-neutral-800/90" />
      </div>

      <button onClick={onExpand} className=" self-end mt-1 text-brand-primary hover:translate-y-0.5 transition " aria-label="Open full note" >
        <MoveDown size={18} />
      </button>
    </div>
  )
}

export default Card
