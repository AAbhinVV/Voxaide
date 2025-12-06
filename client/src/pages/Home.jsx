import React from 'react'
import Navbar from '../components/navbar'
import Recorder from '../components/Buttons/Recorder'
import SiteLoading from '../components/SiteLoading'
import LoadingScreen from '../components/LoadingScreen'
import LoadScreen from '../components/LoadScreen'
const Home = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* centered image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
          alt="Test background"
          className="w-xl h-xl object-contain"
        />
      </div>

      {/* overlay loading (in front of image) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none"> 
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">Welcome to Voxaide</h1>
      </div>
    </div>
  )
}

export default Home