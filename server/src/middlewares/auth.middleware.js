import jwt from 'jsonwebtoken'
import { redisClient } from '../../server.js'
import User from '../../models/user.model.js'
import constants from '../config/constant.js'


export default function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, constants.access_token)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export const isAuth = async (req, res, next) => {

    try {
      const token = req.cookies?.accessToken || req.signedCookies?.accessToken || req.headers.authorization?.split(' ')[1];

      const decoded = jwt.verify(token, constants.access_token)
      if(!decoded){
          return res.status(400).json({ message: 'token expired' })
      }

      const cacheUser = await redisClient.get(`user:${decoded.userId}`)
      if(cacheUser){
        req.user = JSON.parse(cacheUser)
        return next()
      }

      const user = await User.findById(decoded.userId).select('-password')
      if(!user){
          return res.status(400).json({ message: 'No user with this id' })
      }

      await redisClient.set(`user:${user._id}`, JSON.stringify(user), { EX: 3600})

      req.user = user;

      next()
    } catch (err) {
      return res.status(500).json({ message: 'Invalid token' })
  }
}