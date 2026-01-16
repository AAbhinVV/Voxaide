import React from 'react'
import { LandingNavbar } from '../components/LandingNavbar.jsx'
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button.jsx'
import { ShimmerButton } from '../components/ui/shimmer-button.jsx'
import {HoverBorderGradient} from '../components/ui/hover-border-gradient.jsx'
import { FlipWords } from '../components/ui/flip-words.jsx'
import { motion } from 'framer-motion'
import TestImage from '../assets/testimage.jpg'
import { LayoutTextFlip } from '../components/ui/layout-text-flip.jsx'

export default function Home() {

  const words = ['clean notes', 'summaries', 'action items']

  return (
    <div className='flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-b from-indigo-50 via-transparent to-transparent '>
        <div className=' flex w-full h-[100px] items-center justify-center border-2'>
            <LandingNavbar />
        </div>
        <div className='w-full h-full block border-2'>
          <section className='flex flex-col justify-center bg-brand-400 mt-14'>
            <div className='text-center mt-16'>
              <div className='inline-block bg-gradient-to-r from-black  via-brand-600 to-brand-400 bg-clip-text text-transparent'>
                <div>
                    <h1 className='text-7xl text-center font-headings font-medium '>Never Miss A Thought </h1>
                </div>
                <div>
                    <h1 className='text-6xl text-center font-headings mt-2 font-medium '>Never Loose An Idea</h1>
                </div>
                <div>
                  <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
                    <LayoutTextFlip
                      text="Turn your voice into structured knowledge "
                      words={["Record", "Transcribe", "Summarize", "Remember"]}
                    />
                  </motion.div>
                </div>
              </div>
                
                <div>
                  <HoverBorderGradient>Start Recording </HoverBorderGradient>
                  <InteractiveHoverButton> See How It Works</InteractiveHoverButton>
                </div>
                <div>
                  <h4>Voxaide transforms your spoken ideas into<FlipWords words={words} /><br /> so you can focus on thinking, not typing.</h4>
                  <img src = {TestImage} alt = 'test'  />
                </div>
            </div>
          </section>
        </div>
      
      
      
    </div>
  )
}
