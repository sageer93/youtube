const jwt = require("jsonwebtoken")

const isUserAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.status(403).json({ success: false, message: "unAuthorized" })
        jwt.verify(token, process.env.SECRETKEY, (err, user) => {
            if (err) return res.status(403).json({ success: false, message: "unaAthorized" })
            req.user = user
            next()
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports = isUserAuth