import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Register from './pages/RegisterPage'
import Login from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import {SidebarDemo} from './components/Navbar'
import Loader from './components/SiteLoad'
import Recorder from './components/Buttons/Recorder'


function App() {
    const [showLoader, setShowLoader] = useState(true);

  if (showLoader) {
    return <Loader onComplete={() => setShowLoader(false)} />;
  }
  return (
    <>
      

      <BrowserRouter>
        {/* <SidebarDemo /> */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recorder" element={<Recorder />} />
          {/* </Route> */}
        </Routes>

        
      </BrowserRouter>
    </>
  )
}

export default App
