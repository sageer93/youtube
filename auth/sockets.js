const Comment = require("../models/comment")
const jwt = require("jsonwebtoken")
const User = require('../models/user')
const Video = require("../models/post")
const sockets = (io) => {
    io.on("connection", (socket) => {
        socket.on("addcomment", async ({ comment, videoId }) => {
            try {
                if (socket.handshake.auth.token) {
                    const decode = jwt.decode(socket.handshake.auth.token)
                    const loginUser = await User.findById(decode._id)
                    const video = await Video.findById(videoId)
                    console.log(comment, videoId)
                    const comments = await Comment({
                        comment,
                        user: loginUser.name,
                        userEmail: loginUser.email,
                        profile: loginUser.image
                    })
                    await video.comments.push(comments._id)
                    await video.save()
                    await comments.save()
                    socket.broadcast.emit("comments", { comm: comments })
                    socket.emit("comment", { comments })
                }
            } catch (error) {
                console.log(error)
            }
        })
        socket.on("typing", ({ name, profile, videoId, typing }) => {
            socket.broadcast.emit("showtyping", { name, profile, videoId, typing })
        })



        socket.on("disconnect", () => {
            console.log("user disconnected")
        })
    })
}

module.exports = sockets