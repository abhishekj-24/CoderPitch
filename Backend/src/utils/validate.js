const validator = require('validator')
const User = require('../models/user')
const express = require('express')


const validat = async (data)=>{
    const mendatory = ['firstname','emailid', 'password']
     
    const Isallowed = mendatory.every((k)=> Object.keys(data).includes(k))

    if(!Isallowed)
        throw new Error('cradentitials missing')

    if(!validator.isEmail(data.emailid))
        throw new Error("invalid credentials")

    if(!validator.isStrongPassword(data.password))
        throw new Error('invalid cradentials')

}

module.exports = validat