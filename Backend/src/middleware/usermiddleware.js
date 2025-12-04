const jwt = require('jsonwebtoken')
const User = require('../models/user')
const redisclient = require('../config/redis')

const usermiddleware = async (req,res,next)=>{
    try{
        const {token}= req.cookies

        if(!token)
            throw new Error('token not available')

        const payload = await jwt.verify(token, process.env.jwt_key)

        const {_id} = payload;

        if(!_id)
            throw new Error('invalid token')

        const result = await User.findById({_id})

        if(!result)
            throw new Error('user not exist')

        const isblocked = await redisclient.exists(`token:${token}`)

        if(isblocked)
            throw new Error("token invalid")

        req.result =result
        next()

    }
    catch(err){
        res.send("error ouured"+err)
    }
}

module.exports = usermiddleware