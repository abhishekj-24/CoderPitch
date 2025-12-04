const express = require('express')
const Problem = require('../models/problem')
const adminmiddleware = require('../middleware/adminmiddleware')
const problemrouter = express.Router()
const { creatPorblem, updateproblem, deleteproblem, getproblembyid, getallproblem, allsolvedproblem,submissionofprob} = require('../controller/userproblem')
const usermiddleware = require('../middleware/usermiddleware')


problemrouter.post('/create',adminmiddleware, creatPorblem)
problemrouter.put('/update/:id',adminmiddleware,updateproblem)
problemrouter.delete('/delete/:id',adminmiddleware,deleteproblem)

problemrouter.get('/getproblem/:id',usermiddleware,getproblembyid)
problemrouter.get('/allproblems',usermiddleware,getallproblem)
problemrouter.get('/solved',usermiddleware,allsolvedproblem)
problemrouter.get('/submitedproblem/:pid',usermiddleware,submissionofprob)

module.exports = problemrouter