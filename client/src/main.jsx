import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import VoxaideDashboard from './pages/Dashboards/Dashboard.jsx'
import Login from './pages/LoginPage.jsx'
import Register from './pages/RegisterPage.jsx'
import NotesDashboard from './pages/Dashboards/NotesDashboard.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element = {< VoxaideDashboard/>}> 
      {/* <Route index element = {<VoxaideDashboard />} /> */}
      <Route path = "login" element = {<Login />} />
      <Route path = "signup" element = {<Register />} />
      <Route path = "notes" element = {<NotesDashboard />} />
      {/* <Route path  = "notes/:id" element = {<NotesDashboard />} /> */}

    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
