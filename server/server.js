import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './src/routes/authRoutes.js'
import { connectDB } from './db/connectDB.js'
import notesRoutes from './src/routes/notesRoutes.js'


dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser(process.env.COOKIE_SECRET))


app.use((err, req, res, next) => {
    if(err instanceof SyntaxError && err.status === 400 && 'body' in err){
        return res.status(400).json({message: "Bad JSON"})
    }
    next(err);
})



app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', authRoutes)
app.use('/api/v1/notes', notesRoutes)   

app.listen(PORT, async ()=> {
    await connectDB();
    console.log(`Server started on PORT: ${PORT}`)
})