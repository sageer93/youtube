const mongoose = require("mongoose")

const DB_Con = ()=>{
    mongoose.connect(process.env.DB_URI)
    .then(()=>{
        console.log("database connect")
    })
    .catch((err)=>{
        console.log(err)
    })
}

module.exports = DB_Con