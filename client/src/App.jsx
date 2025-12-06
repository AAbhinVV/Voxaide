import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Register from './pages/RegisterPage'
import Login from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/navbar'
import LoadingScreen from './components/LoadingScreen'
import LoadScreen from './components/LoadScreen'
import { LoaderOne } from './components/ui/loader'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true) // start fade out animation
    }, 4000)// show loading screen for 4 seconds
  
    return () => clearTimeout(timer);
  }, []); // duration of fade-out animation



  //wait for fadeout duration to complete before removing the ocmponenet
  const handleAnimationEnd = () => {
    if (isFadingOut) {
      setIsLoading(false)
    }
  };

  if(isLoading){
    return <LoaderOne className={`${isFadingOut ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`} 
    onAnimationEnd={handleAnimationEnd} />
  }

  return (
    <>
      

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>

        
      </BrowserRouter>
    </>
  )
}

export default App
