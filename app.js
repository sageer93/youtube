const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const path = require("path")
const express = require("express")
const app = express();
const cors = require("cors");
const router = require("./Routes/userRoute");

app.use(cors({
    origin:"https://youtube-royy.onrender.com",
    credentials:true,
    methods:["POST","GET","DELETE","PUT"]
}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use("/public",express.static(path.join(__dirname,"public")))
app.use("/api",router)
app.get("*",function(req,res){
    res.sendFile(path.join(__dirname,"public","client","build","index.html"))
})

module.exports = app
