import { generateVerificationToken } from "../../utils/generateVerificationToken.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../../models/user.model.js'
import { generateTokenAndSetCookie } from "../../utils/generateTokenAndSetCookie.js";

const register = async (req,res) => {
    const {username, password, email, phone_number} = req.body

    try {

        if (!username || !email || !password || !phone_number){
                return res.status(400).json({success: false, message: "All fields are required"})
            }



        const userAlreadyExists = await User.findOne({email})
        console.log("userAlreadyExists", userAlreadyExists);

        if(userAlreadyExists){
            return res.status(400).json({success: true, message: "User already exists"})
        }

        const hashedpassword =  bcrypt.hashSync(password,10)
        const verificationToken = generateVerificationToken();

        const user = new User({
            email,
            password: hashedpassword,
            username,
            phone_number,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 1 hour
        })

        await user.save()

        //jwt 
        generateTokenAndSetCookie(res,user._id)

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

        const user = await User.findOne({query})

        if(!user){return res.status(404).send({message: "User not Found"})}
        

        const passwordIsInvalid = bcrypt.compareSync(password, user.password)

        if(!passwordIsInvalid){return res.status(404).send({message: 'Password is Invalid'})}
        else{
            const accessToken = jwt.sign({ _id: user.id.toString(), username: user.username,  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ _id: user.id.toString(), username: user.username,  }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            if (!accessToken || !refreshToken) throw new ExpressError(500, 'No tokens generated');
            
            res.cookie('accesstoken', accessToken, {
                    signed: true,
                    httpOnly: true,
                    // secure: true, 
                    maxAge: 15 * 60 * 1000,
                    // sameSite: 'Strict'
                    path: "http://localhost:5173",

            });
            res.cookie('refreshToken', refreshToken, {
                signed: true,
                httpOnly: true,
                // secure: true, 
                maxAge: 7 * 24 * 60 * 60 * 1000,
                // sameSite: 'Strict'
                path: "http://localhost:5173",
            });


            res.json({
                success: true,
                user,
                access_token: accessToken,
                
                message: "Login Successful"
            })  
        }
    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
    }
}

const logout = (req, res) => {}

export default{register, login, logout};