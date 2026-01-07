const express = require('express')
const app = express();
require('dotenv').config()
const main = require('./config/db')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/userAuth')
const redisclient = require('./config/redis')
const problemrouter = require('./routes/creat_problem')
const submitrouter = require('./routes/submit')
const cors = require('cors')
const aiRouter = require('./routes/aichat');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())

app.use('/user',authRouter)
app.use('/admin',problemrouter)
app.use('/submission',submitrouter)
app.use('/chat',aiRouter)

const Initialize = async ()=>{
    try{
        await Promise.all([main(), redisclient.connect()])
        console.log('connected to database')

        app.listen(process.env.PORT,()=>{
            console.log('i am prot number'+ process.env.PORT)
        })
    }
    catch(err){
        console.log('Error msg '+err)
    }
}

Initialize()

// main()
// .then(async ()=>{
//     console.log('connected to db')
// })
// .catch(err=>console.log('error occured'+err))