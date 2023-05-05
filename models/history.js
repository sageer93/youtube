const mongoose = require("mongoose")

const historySchema = new mongoose.Schema({
    video:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    videoId:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = new mongoose.model("history",historySchema)