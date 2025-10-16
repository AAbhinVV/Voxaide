import { generateVerificationToken } from "../../utils/generateVerificationToken.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../../models/user.model.js'
import { generateTokenAndSetCookie } from "../../utils/generateTokenAndSetCookie.js";
import sanitize from "mongo-sanitize";
import { registerSchema } from "../../config/zod.js";
import { redisClient } from "../../server.js";

const register = async (req,res) => {
    const sanitizedBody = sanitize(req.body);

    const validation = registerSchema.safeParse(sanitizedBody);

    if(!validation.success){
        const zodErrors = validation.error;

        let firstErrorMessage = "Validaition failed";
        let allError = [];

        if(zodErrors?.issues && Array.isArray(zodErrors.issues)){
            allError = zodErrors.issues.map((issue) => ({
                field: issue.path ? issue.path.join(".") : "unknown",
                message: issue.message || "validation Error",
                code: issue.code,

            }));

            firstErrorMessage = allError[0]?.message || "Validation Error";

        }
        return res.status(400).json({success: false, message: "validation error"})
    }

    const {username, password, email, phone_number} = validation.data;

    const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

    if(await redisClient.get(rateLimitKey)){
        return res.status(429).json({success: false, message: "Too many registration attempts. Please try again later."})   
    }


    try {

        if (!username || !email || !password || !phone_number){
                return res.status(400).json({success: false, message: "All fields are required"})
        }
        
          
        const normalizedEmail = email.toLowerCase().trim(); 
        
        console.log("Normalized Email:", normalizedEmail); // Debugging line

        const userAlreadyExists = await User.findOne({email:normalizedEmail});
        
        

        if(userAlreadyExists){
            return res.status(400).json({success: false, message: "User already exists", found: userAlreadyExists})
        }

        const hashedpassword =  bcrypt.hashSync(password,10);
        const verificationToken = generateVerificationToken();

        const user = new User({
            email: normalizedEmail,
            password: hashedpassword,
            username,
            phone_number,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 1 hour
        })

        await user.save()

        //jwt 
        const { accessToken, refreshToken} = generateTokenAndSetCookie(res,user._id)

        res.status(201).json({
        success: true,
        user: {
            ...user._doc,
            password: undefined, 
        },
        access_token: accessToken,
        refresh_token: refreshToken,
        message: "Registration Successful"
    })
    } catch (error) {
        res.status(503).json({success: false, message: error.message})
    }
}

const login = async (req,res) => {
    const{username, password, email} = req.body

    if(!username && !email){
        return res.status(400).json({message: "Username or email is required"})
    }
    if(!password){
        return res.status(400).json({message: "Password is required"})
    }

    try {

        let query = {};
        if(email) query.email = email;
        if(username) query.username = username;

        const user = await User.findOne(query)

        if(!user){return res.status(404).send({message: "User not Found"})}
        

        const isPasswordValid = bcrypt.compareSync(password, user.password)

        if(!isPasswordValid){return res.status(401).send({message: 'Password is Invalid'})}
        const { accessToken, refreshToken } = generateTokenAndSetCookie(res, user._id);

        if (!accessToken || !refreshToken) throw new ExpressError(500, 'No tokens generated');
        
        


        res.status(201).json({
            success: true,
            user: {
                ...user._doc,
                password: undefined,
            },
            access_token: accessToken,
            refreshToken: refreshToken,
            message: "Login Successful"
        })
    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
    }
}

const logout = (req, res) => {
    try{
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        return res.status(200).json({message: 'Logged out'})
    }catch(error){
        return res.status(503).json({message: error.message})
    }
}

export default{register, login, logout};