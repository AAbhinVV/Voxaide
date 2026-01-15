import React from 'react'
import { LandingNavbar } from '../components/LandingNavbar.jsx'

export default function Home() {
  return (
    <div className='flex flex-col h-screen w-screen overflow-hidden'>
        <div className='flex w-full h-[100px] items-center justify-center m-2 p-2 border-2'>
            <LandingNavbar />
        </div>
      <section>
        <div className='flex flex-col item-center justify-center h-auto w-fit block border-2'>
            <div>
                <h1 className='text-center'>Never Miss A Thought </h1>
            </div>
            <div>
                <h1 className='text-center'>Never Loose An Idea</h1>
            </div>

            <div>
            <   h2> Turn your voice into structured knowledge.Record. Transcribe. Summarize. Remember.</h2>
            </div>
        </div>
      </section>
      
      
    </div>
  )
}
