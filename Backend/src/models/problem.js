const mongoose = require('mongoose')
const {Schema}= mongoose

const problemschema = new Schema({
    title:{
        type:String,
        required:true
    },

    description:{
        type: String,
        required: true
    },

    diffuclty:{
        type:String,
        enum:['easy', 'medium', 'hard'],
        required: true
    },

    tags:{
        type: String,
        enum:['array', 'linkedlist','tree', 'graph','dp'],
        required: true
    },

    visibiletastcase:[
    {
        input:{
            type:String,
            required: true
        },
        output:{
            type:String,
            required:true
        },
        explanation:{
            type:String,
            required:true
        }
    }],

    hiddentastcase:[
        {
            input:{
                type:String,
                required: true
            },
            output:{
                type:String,
                required:true
            }
        }
    ],


    startcode:[
        {
            language:{
                type:String,
                required:true
            },
            initialcode:{
                type:String,
                required:true
            }
        }
    ],

    referencesol:[
        {
            language:{
                type:String,
                required:true,
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],

    probcreater:{
        type: Schema.Types.ObjectId,
        ref:'user',
        required:true,
    }
},{
    timestamps:true
})


const Problem = mongoose.model('problem',problemschema)
module.exports = Problem