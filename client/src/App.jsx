import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import './App.css'
import Register from './pages/RegisterPage'
import Login from './pages/LoginPage'


function App() {
  return(
    <Router>
      <Routes>
        <Route path = "/" index element={<Home/>}/>
        <Route path = "/register" element={<Register/>}/>
        <Route path = "/login" element={<Login/>}/>
        <Route path = "/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
  )
  
}

export default App
