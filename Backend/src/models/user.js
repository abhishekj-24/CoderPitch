const mongoose = require('mongoose')
const { stringify } = require('querystring')
const {Schema} = mongoose

const userSchema = new Schema({
    firstname :{
        type:String,
        minLength:3,
        maxLength:20,
        required:true
    },

    lastname:{
        type:String,
        minLength:3,
        maxLength:20,
    },

    emailid:{
        type:String,
        required:true,
        unique: true,
        lowercase:true,
        immutable:true,
        trim:true
    },

    role:{
        type:String,
        enum:['user','admin'] ,
        default:'user'
    },

    problemsolved:{
        type:[{
            type: Schema.Types.ObjectId,
            ref: 'problem'
        }],
        // unique:true
    },

    password:{
        type: String,
        required:true,
    }

},{
    timestamps:true
})

userSchema.post('findOneAndDelete', async function (userInfo){
    if(userInfo){
        await mongoose.model('submission').deleteMany({userId: userInfo._id})
    }
})

const User = mongoose.model('user', userSchema)
module.exports = User