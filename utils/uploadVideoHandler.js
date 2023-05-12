const multer = require("multer")

module.exports = multer({ dest: "public/videos" }).single("video")