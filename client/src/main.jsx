import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import VoxaideDashboard from './pages/Dashboards/Dashboard.jsx'

import NotesDashboard from './pages/Dashboards/NotesDashboard.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux'
import Home from './pages/Home.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element = {< Home/>}> 
      {/* <Route index element = {<VoxaideDashboard />} /> */}
      {/* <Route path = "login" element = {<Login />} />
      <Route path = "signup" element = {<Register />} /> */}
      <Route path = "notes" element = {<VoxaideDashboard />} />
      {/* <Route path  = "notes/:id" element = {<NotesDashboard />} /> */}

    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store} className = "bg-bg-app">
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
