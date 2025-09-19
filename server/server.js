import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './src/routes/authRoutes.js'
import { connectDB } from './db/connectDB.js'
import notesController from './src/controller/notes.controller.js'


dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser(process.env.COOKIE_SECRET))




app.use('/api/auth', authRoutes)
app.use('/api/v1/users', authRoutes)
app.use('/api/v1/notes', notesController, notesRoutes)   

app.listen(PORT, ()=> {
    connectDB();
    console.log(`Server started on PORT: ${PORT}`)
})