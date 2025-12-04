const express = require('express')
const submitrouter = express.Router()
const usermiddleware = require('../middleware/usermiddleware')
const {submitedcode, runcode} = require('../controller/userSubmission')


submitrouter.post('/submit/:id',usermiddleware,submitedcode)
submitrouter.post('/run/:id',usermiddleware,runcode)

module.exports = submitrouter