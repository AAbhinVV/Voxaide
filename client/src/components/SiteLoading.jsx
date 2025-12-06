import {motion} from 'motion/react';
import React from 'react'

const SiteLoading = () => {
  return (
    <div className='absolute inset-0flex justify-center items-center h-screen w-screen bg-[linear-gradient(to_bottom_right,
        theme(colors.slate.200 / 0.75) 0%,
        theme(colors.slate.400 / 0.75) 25%,
        theme(colors.slate.300 / 0.75) 50%,
        theme(colors.slate.400 / 0.75) 75%,
        theme(colors.slate.200 / 0.75) 100%
      )] backdrop-blur-md'>
        <div className='text-slate-800'> Loading...</div>
    </div>
  )
}

export default SiteLoading
