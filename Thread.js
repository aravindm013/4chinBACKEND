const mongoose = require('mongoose')

const Model = new mongoose.Schema({
    name : {
        type:String,
        trim:true
    },
    thread_id:{
        required:[true,'no id'],
        type:String
    },
    comment:{
        required:[true,'enter comment'],
        type:String,
        trim:true
    },
    img : {
        
        contenttype:String,
        data:Buffer
    },
    createdAt : {
        type: Date,
        default:Date.now
    },
    updatedAt : {
        type: Date,
        default: Date.now
    }
})

module.exports = new mongoose.model('Thread',Model)