import {  X } from 'lucide-react'
import React from 'react'

function PopUp({
    className = "",
    title = "",
    content = "",
    recordDate = "",
    removePopUp

}) {

    


  return (
    <div className={`rounded-2xl bg-zinc-100 dark:bg-neutral-800/70 border border-neutral-700/50 dark:border-neutral-700 shadow-lg p-6 max-x-lg w-full ${className}`}>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-col font-headings tracking-wider gap-1 mb-4'>
            <h1 className="font-headings text-lg font-semibold text-text-primary">
            {title}
            </h1>
            <p className="text-xs text-text-primary/40 italic">
                {recordDate}
            </p>
        </div>
        <X size = {25} onClick={removePopUp}/>
        
      </div>
      <p className="text-md text-text-secondary leading-relaxed font-body self-baseline">
        {content}
      </p>
      
    </div>
  )
}

export default PopUp





