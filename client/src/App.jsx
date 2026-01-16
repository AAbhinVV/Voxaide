import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Dashboard from './pages/Dashboards/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import {SidebarDemo} from './components/Sidebar'
import Loader from './components/Loader.jsx'
import Recorder from './components/Buttons/Recorder'


function App() {
  const [showLoader, setShowLoader] = useState(true);

  if (showLoader) {
    return <Loader onComplete={() => setShowLoader(false)} />;
  }
  return (
    <h1>INDEX PAGE</h1>
  )
}

export default App
