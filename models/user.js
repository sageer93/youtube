const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    image: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    confirmPassword: {
        type: String,
    },
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ],
    subcriber: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    watchLater: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ],
    likesVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ],
    history: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "history"
        }
    ],
    notivication: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "notification"
        }
    ],
})


userSchema.methods.ganerateToken = async function (id) {
    try {
        return await jwt.sign({ _id: id }, process.env.SECRETKEY, { expiresIn: "24h" })
    } catch (error) {
        console.log(error)
    }
}

userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10)
            this.confirmPassword = undefined
        }
        next()
    } catch (error) {
        console.log(error)
    }
})

userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        console.log(error)
    }
}
module.exports = new mongoose.model("User", userSchema)