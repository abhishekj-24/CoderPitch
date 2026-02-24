const mongoose = require('mongoose');
const { Schema } = mongoose;

const viedeoSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    coudinarypubId: {
        type: String,
        required: true,
        unique: true
    },

    secureUrl: {
        type: String,
        required: true
    },

    thumbnailUrl: {
        type: String
    },
    duration: {
        type: Number,
        required: true
    },
},{
    timestamps: true
})

const solvideo = mongoose.model('solvideo', viedeoSchema);
module.exports = solvideo