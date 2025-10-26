import jwt from 'jsonwebtoken'
import { redisClient } from '../../server'
import User from '../models/user.model.js'


export default async function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Please login - no token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if(!decoded){
        return res.status(400).json({ message: 'token expired' })
    }

    const cacheUser = await redisClient.get(`user:${decoded.userId}`)
    if(cacheUser){
      req.user = JSON.parse(cacheUser)
      return next()
    }

    const user = await UserActivation.findById(decoded.userId).select('-password')
    if(!user){
        return res.status(401).json({ message: 'No user with this id' })
    }

    await redisClient.set(`user:${user._id}`, JSON.stringify(user), { EX: 3600})

    req.user = user;

    next()
  } catch (err) {
    return res.status(500).json({ message: 'Invalid token' })
  }
}