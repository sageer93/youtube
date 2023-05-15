const app = require("./app")
const DB_Con = require("./database/DB_con")
require("dotenv").config()
DB_Con()



const {createServer} = require("http")
const {Server} = require("socket.io")
const server = createServer(app)
const io = new Server(server,{cors:{
    origin:"https://youtube-royy.onrender.com",
    credentials:true,
    methods:["GET","PUT","DELETE","POST"]
}})
require("./auth/sockets")(io)
server.listen(process.env.PORT||8080,()=>{
    console.log(`server running in port no ${process.env.PORT||8080}`)
})