const express = require('express')
const usermiddleware = require('../middleware/usermiddleware')
const solve = require('../controller/solveDoubt')
const aiRouter = express.Router()


aiRouter.post('/ai', usermiddleware,solve)

module.exports = aiRouter