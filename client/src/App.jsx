import { BrowserRouter , Routes, Route } from 'react-router-dom'
import './App.css'
import Register from './pages/RegisterPage'
import Login from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/navbar'

function App() {
  return(
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path = "/" index element={<Home/>}/>
        <Route path = "/register" element={<Register/>}/>
        <Route path = "/login" element={<Login/>}/>
        <Route element={<ProtectedRoute />}>
          <Route path = "/dashboard" element={<Dashboard/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
