import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './src/routes/auth.routes.js'
import { connectDB } from './config/db/connectDB.js'
import notesRoutes from './src/routes/voiceNotes.routes.js'
import transcriptionRoutes from './src/routes/transcription.routes.js'
import userRoutes from './src/routes/user.routes.js'
import path from 'path'
import {createClient} from 'redis'
import adminRoutes from './src/routes/admin.routes.js'
import voiceNotesRoutes from './src/routes/voiceNotes.routes.js'
import queryRoutes from './src/routes/query.routes.js'

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
app.use('/api/v1/voice-notes', voiceNotesRoutes)
app.use('/api/v1/notes', notesRoutes)
app.use('/api/v1/transcriptions', transcriptionRoutes)
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/query', queryRoutes);


app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server started on PORT: ${PORT}`)
})