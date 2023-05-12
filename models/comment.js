const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
})

module.exports = new mongoose.model("comment", commentSchema)