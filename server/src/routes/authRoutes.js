import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import authController from '../controller/auth.controller.js'




dotenv.config()

const router = express.Router()

router.post('/register', authController.register)

router.post('/login', authController.login)

router.post('/logout', authController.logout)


router.post("/generate-token", (req, res) => {
    try{
        const refreshToken = req.signedCookies.refreshToken
        if(!refreshToken) {res.status(403).json({message: "Forbidden"})}
        
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err) {return res.status(403).json({message: "Forbidden: Unauthorized refresh token"})}

            const accessToken = jwt.sign({ userId: user.userId, username: user.username, }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})

            res.cookie('accessToken', accessToken, {
                signed: true, 
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000,
                sameSite: "strict",
                path: "/"
            })

            return res.status(200).json({message: "token generated succesfully"})
        })
    }catch(error){
        res.status(503).send(error.message)
        }
     
})

export default router;