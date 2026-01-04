import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './src/routes/authRoutes.js'
import { connectDB } from './config/db/connectDB.js'
import notesRoutes from './src/routes/notesRoutes.js'
import transcriptionRoutes from './src/routes/transcriptionRoutes.js'
import userRoutes from './src/routes/userRoutes.js'
import path from 'path'
import {createClient} from 'redis'
import requireAdmin from './src/middlewares/admin.middleware.js'
import adminRoutes from './src/routes/adminRoutes.js'
import verifyJwt from './src/middlewares/auth.middleware.js'
import notesMiddleware from './src/middlewares/notes.middleware.js'
import embeddingRoutes from './src/routes/embeddingRoutes.js'
import constants from 'constants'


dotenv.config()
const app = express()
const PORT = constants.port || 5000;

const redisUrl = constants.redis_url;

if(!redisUrl){
    console.error("missing redis url")
    process.exit(1)
}

export const redisClient = createClient({url: redisUrl})

redisClient.connect().then(() => console.log("Connected to Redis")).catch(console.error);

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser(constants.cookie_secret))

// serve uploaded files statically
app.use('/uploads', express.static(path.resolve('uploads')))

app.use((err, req, res, next) => {
    if(err instanceof SyntaxError && err.status === 400 && 'body' in err){
        return res.status(400).json({message: "Bad JSON"})
    }
    next(err);
})



app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/audio', userRoutes)
app.use('/api/v1/notes',verifyJwt, notesMiddleware, notesRoutes)
app.use('/api/v1/transcriptions',verifyJwt, transcriptionRoutes)
app.use('/api/v1/admin', verifyJwt, requireAdmin, adminRoutes);
app.use('/api/v1/embedding', embeddingRoutes);

app.listen(PORT, async ()=> {
    await connectDB();
    console.log(`Server started on PORT: ${PORT}`)
})