const Comment = require("../models/comment")
const  jwt = require("jsonwebtoken")
const path = require("path")
const {writeFile} = require("fs")
const User = require('../models/user')
const Video = require("../models/post")
const sockets = (io) => {
    const nameSpace = io.of("/dashboad")
    nameSpace.on("connection", (socket) => {
                /////////////////////////////////////////add post///////////////////////////////////////
                socket.on("addpost",({poster,title,buffer})=>{
                    console.log(poster,title,buffer)
                        // const date = new Date()
                        // // save the content to the disk, for example
                        // writeFile(path.join(__dirname,`../uploads/image-${date.toLocaleDateString()}-${date.getTime()}.png`), poster, (err) => {
                        //   if(err){console.log(err)}
                        // });
                        // writeFile(path.join(__dirname,`../uploads/video-${date.toLocaleDateString()}-${date.getTime()}.mp4`), addvideo, (err) => {
                        //     if(err){console.log(err)}
                        //   });
                          console.log("done")
                })
            
                /////////////////////////////////////////add post///////////////////////////////////////
        socket.on("addcomment", async ({ comment ,videoId}) => {
            try {
                if(socket.handshake.auth.token){
                    const decode = jwt.decode(socket.handshake.auth.token)
                    const loginUser = await User.findById(decode._id)
                    const video = await Video.findById(videoId)
                    const comments = await Comment({
                        comment,
                        user: loginUser.name,
                        userEmail: loginUser.email,
                        profile:loginUser.image
                    })
                    await video.comments.push(comments._id)
                    await video.save()
                    await comments.save()
                    socket.broadcast.emit("comments",{comm:comments})
                    socket.emit("comment",{comments})
                }
            } catch (error) {
                console.log(error)
            }
        })
        socket.on("typing",({name,profile,videoId,typing})=>{
            socket.broadcast.emit("showtyping",{name,profile,videoId,typing})
        })



        socket.on("disconnect", () => {
            console.log("user disconnected")
        })
    })
}

module.exports = sockets