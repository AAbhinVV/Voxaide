import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Register from './pages/RegisterPage'
import Login from './pages/LoginPage'
import Dashboard from './pages/Dashboards/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import {SidebarDemo} from './components/Sidebar'
import Loader from './components/Loader'
import Recorder from './components/Buttons/Recorder'


function App() {
    const [showLoader, setShowLoader] = useState(true);

  if (showLoader) {
    return <Loader onComplete={() => setShowLoader(false)} />;
  }
  return (
    <SidebarDemo />
  )
}

export default App
