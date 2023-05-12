const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    OwenerProfile: {
        type: String,
        required: true
    },
    OwnerId: {
        type: String,
        required: true
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ],
    veiws: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    unlike: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
}, { timestamps: true })

module.exports = new mongoose.model("post", postSchema)