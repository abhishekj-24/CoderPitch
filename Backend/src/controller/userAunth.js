const { GEO_REPLY_WITH } = require('redis')
const redisclient = require('../config/redis')
const User = require('../models/user')
const validat = require('../utils/validate')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Submission = require('../models/submission')
const { email } = require('zod')


const register = async (req,res)=>{
   try{
    //user ko validat karo (feilds prensets hai ya nahi)
    validat(req.body)

    const {firstname , emailid, password} = req.body

    //encode password before save in db
    req.body.password = await bcrypt.hash(password, 10)

    req.body.role = 'user'

    //create user
    const user = await User.create(req.body)

        const reply = {
            firstname: user.firstname,
            emailid: user.emailid,
            _id: user._id,
            role: user.role
        }    

    //direct login after register no need to login again
    const token = await jwt.sign({_id:user._id,emailid:emailid,},process.env.jwt_key,{expiresIn:60*60})
    res.cookie('token', token, {maxAge:60*60*1000})

    res.status(201).json({
            user: reply,
            messege: 'user register successfully'
        })
   }
   catch(err){
    res.status(400).send(err)
   }
}

const login = async (req,res)=>{
    try{
        const {emailid, password} = req.body
        
        if(!emailid)
            throw new Error('invalid cradentls')
        
        if(!password)
            throw new Error('invalid cradentials')
        
        const user = await User.findOne({emailid})
        const match = await bcrypt.compare(password, user.password)
        
        if(!match)
            throw new Error('wornd passowrd')

        const reply = {
            firstname: user.firstname,
            emailid: user.emailid,
            _id: user._id,
            role: user.role
        }
        
        const token = jwt.sign({_id:user._id,emailid:emailid, role:user.role},process.env.jwt_key,{expiresIn:60*60})
        res.cookie('token', token, {maxAge:60*60*1000})
        
        res.status(200).json({
            user: reply,
            messege: 'Logged in succesfully'
        })
    }
    catch(err){
        res.send('Error'+ err)
    }
}

const logout = async (req,res)=>{
    try{
        const {token} = req.cookies
        const payload = jwt.decode(token)

        await redisclient.set(`token: ${token}`, 'blocked')
        await redisclient.expireAt(`token: ${token}`,payload.exp)

        res.cookie(`token`,null, new Date(Date.now))
        res.send('logged out')
    }
    catch(err){
        throw new Error('error'+err)
    }
}

// const userdelete = async (req,res)=>{
//     try{

//         const {token} = req.cookies
//         const payload = jwt.verify(token, process.env.jwt_key)
//         const id = payload._id
    
//         await User.findByIdAndDelete(id)
//         res.status(200).send('deleted')
//     }
//     catch(err){
//         res.send('error'+err)
//     }
// }

const adminregiter = async (req,res)=>{
    try{
        validat(req.body)
        const {firstname,emailid,password}= req.body

        req.body.password = await bcrypt.hash(password,10)
        req.body.role = 'admin'
        const admin = await User.create(req.body)

        const token = jwt.sign({emailid:emailid, id:admin._id,role:admin.role},process.env.jwt_key,{expiresIn:60*60})
        res.cookie(`token:${token}`)
        res.send('admin register successfully')
    }
    catch(error){
        res.send('error'+error)
    }
}


const userdelete = async(req,res)=>{
    try{
        const userId = req.result._id
        
        await User.findByIdAndDelete(userId)

        //we also need to delete the submissions of user 
        // await Submission.deleteMany({userId})

        res.status(200).send('user deleted')
    }
    catch(error){
        res.status(500).send("server error"+err)
    }
}


module.exports={register, login, logout, adminregiter, userdelete}