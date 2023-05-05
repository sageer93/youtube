const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
})