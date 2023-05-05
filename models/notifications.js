const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    title:{
        type:String,
        reguired:true
    },
    video:{
        type:String,
        reguired:true
    },
    name:{
        type:String,
        reguired:true
    },
    email:{
        type:String,
        reguired:true
    },
    message:{
        type:String,
        reguired:true
    }
},{timestamps:true})

module.exports = new mongoose.model("notification",notificationSchema)