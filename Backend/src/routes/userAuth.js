const express = require('express')
const { register , login , logout , adminregiter, userdelete} = require('../controller/userAunth')
const authRouter = express.Router()
const adminmiddleware = require('../middleware/adminmiddleware')
const usermiddleware = require('../middleware/usermiddleware')

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',usermiddleware,logout)
authRouter.delete('/delete',usermiddleware,userdelete)
authRouter.post('/admin/register', adminmiddleware,adminregiter)
authRouter.get('/check',usermiddleware,(req,res)=>{
    
    //to direct login the user if he login in past 
    const reply ={
        firstname: req.result.firstname,
        emailid: req.result.emailid,
        _id: req.result._id
    }

    res.status(200).json({
        user:reply,
        messege: 'valid user'
    })
})
// authRouter.get('/userprofile',userprofile)

module.exports = authRouter