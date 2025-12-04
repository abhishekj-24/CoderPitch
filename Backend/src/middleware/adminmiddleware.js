const jwt = require('jsonwebtoken')
const User = require('../models/user')
const redisclient = require('../config/redis')

const adminmiddleware = async (req,res,next)=>{

    try{

        const {token} = req.cookies
        if(!token)
            throw new Error('token not available')
    
        const payload = await jwt.verify(token,process.env.jwt_key)
    
        if(payload.role != 'admin')
            throw new Error('access denied')
    
        const {_id} = payload
        if(!_id)
            throw new Error('invalid token')
    
        const result = await User.findOne({_id})
    
        if(!result)
            throw new Error('user not exist')
    
        const isblocked = await redisclient.exists(`token:${token}`)
    
        if(isblocked){
            throw new Error('invalid token hai bhai')
        }
    
        req.result= result
        next()
    }
    catch(error){
        res.status(404).send("eerror:"+error)
    }

}

module.exports = adminmiddleware