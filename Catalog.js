const mongoose = require('mongoose')

const Model = new mongoose.Schema({
    name : {
        type:String,
        trim:true
    },
    title: {
        required: [true, 'Enter title'],
        type:String,
        trim:true
    },
    opComment:{
        required:[true,'Enter comment'],
        type:String,
        trim:true
    },
    board : {
        required:[true,'Enter name of board'],
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
    },
    replies: {
        type:Number,
        default:0
    },
    imageReplies: {
        type:Number,
        default:0
    }
})

module.exports = new mongoose.model('Catalog',Model)